
import React, { useState, useCallback } from 'react';
import { ImageData } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (imageData: ImageData) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please upload an image.');
        return;
    }
    
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
        setError('File is too large. Maximum size is 5MB.');
        return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImagePreview(reader.result as string);
      onImageUpload({ base64: base64String, mimeType: file.type });
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };


  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-center text-gray-300 mb-4">{title}</h2>
      <div className="flex-grow flex items-center justify-center">
        <label 
            htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`} 
            className="relative w-full h-64 sm:h-80 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-purple-500 hover:bg-gray-700 transition-all duration-300"
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
          ) : (
            <div className="text-center text-gray-500">
              <UploadIcon />
              <p className="mt-2">Drag & drop or click to upload</p>
              <p className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
          <input 
            id={`file-upload-${title.replace(/\s+/g, '-')}`} 
            name={`file-upload-${title.replace(/\s+/g, '-')}`} 
            type="file" 
            className="sr-only" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          />
        </label>
      </div>
       {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
};
