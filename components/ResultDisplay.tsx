import React from 'react';

interface ResultDisplayProps {
  image: string;
  text: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, text }) => {
  const imageUrl = `data:image/png;base64,${image}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'virtual-try-on-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl animate-fade-in w-full">
      <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Your Virtual Try-On Result</h2>
      <div className="w-full aspect-square bg-gray-900 rounded-lg overflow-hidden mb-4 border-2 border-gray-700">
        <img src={imageUrl} alt="Generated try-on" className="w-full h-full object-contain" />
      </div>
      {text && <p className="text-gray-400 text-center mb-6">{text}</p>}
      <div className="text-center">
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold text-md rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          aria-label="Download generated image"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download Image
        </button>
      </div>
    </div>
  );
};

// Add fade-in animation to tailwind config if not present
// For this single-file setup, we can define it in a style tag in index.html,
// but for component-level, it's illustrative. A real setup would use tailwind.config.js
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }