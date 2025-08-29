
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { describeOutfit, tryOnOutfit } from './services/geminiService';
import { ImageData } from './types';

function App() {
  const [personImage, setPersonImage] = useState<ImageData | null>(null);
  const [outfitImage, setOutfitImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleTryOn = async () => {
    if (!personImage || !outfitImage) {
      setError('Please upload both images before proceeding.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      setLoadingMessage('Step 1/2: Analyzing the outfit...');
      const outfitDescription = await describeOutfit(outfitImage.base64, outfitImage.mimeType);

      if(!outfitDescription) {
        throw new Error('Could not get a description for the outfit.');
      }
      
      setLoadingMessage('Step 2/2: Virtually trying it on for you...');
      const result = await tryOnOutfit(personImage.base64, personImage.mimeType, outfitDescription);

      if (result.image) {
        setGeneratedImage(result.image);
        setGeneratedText(result.text || 'Here is your virtual try-on!');
      } else {
        throw new Error('Failed to generate the try-on image. The model may not have returned an image.');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to perform virtual try-on. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <p className="text-center text-gray-400 mb-8 max-w-2xl">
          Welcome! Upload a clear, full-body photo of yourself and a picture of an outfit. Our AI will work its magic to show you how you'd look.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ImageUploader title="Upload Your Photo" onImageUpload={setPersonImage} />
          <ImageUploader title="Upload Outfit Image" onImageUpload={setOutfitImage} />
        </div>

        <button
          onClick={handleTryOn}
          disabled={!personImage || !outfitImage || isLoading}
          className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isLoading ? 'Generating...' : 'Virtually Try On'}
        </button>

        <div className="w-full max-w-3xl mt-10">
          {isLoading && <Spinner message={loadingMessage} />}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {generatedImage && (
            <ResultDisplay image={generatedImage} text={generatedText || ''} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
