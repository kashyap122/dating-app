// src/components/UserPhotos.jsx
import React, { useState } from 'react';
import axios from '../axios';
import NextButton from './NextButton';

export default function UserPhotos() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleChange = e => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(selected);
    setError('');
  };

  const handleNext = async () => {
    if (files.length < 3) {
      setError('Please upload at least 3 photos');
      return;
    }
    const form = new FormData();
    files.forEach(f => form.append('photos', f));

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/profile/photos', form, {
        headers: { Authorization: token },
      });
      window.location.href = '/basic-info';
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8">
        {/* Title */}
        <h2 className="degular text-3xl font-bold text-center text-gray-800 mb-2">
          Add Your Photos
        </h2>
        <p className="text-center text-gray-600 italic mb-6">
          Show the world how you see yourself—pick 3–6 of your favorite shots.
        </p>

        {/* File Input */}
        <label className="block mb-4 cursor-pointer">
          <span className="sr-only">Choose photos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 transition">
            <svg
              className="h-6 w-6 text-pink-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 8v-4m0 0l-4 4m4-4l4 4M3 20h18" />
            </svg>
            <span className="text-pink-600 font-medium">
              Click to select photos
            </span>
          </div>
        </label>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Previews */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {files.map((f, i) => (
              <img
                key={i}
                src={URL.createObjectURL(f)}
                alt={`Preview ${i+1}`}
                className="h-24 w-full object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Next Button */}
        <NextButton onClick={handleNext} disabled={files.length < 3} />
      </div>
    </div>
  );
}
