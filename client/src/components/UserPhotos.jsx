import React, { useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const UserPhotos = () => {
  console.log("UserPhotos component mounted");
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleChange = e => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(selected);
  };

  const handleNext = async () => {
    if (files.length < 3) {
      setError('Please upload at least 3 photos');
      return;
    }
    const form = new FormData();
    files.forEach(f => form.append('photos', f));
    try {
      await axios.post('/api/profile/photos', form);
      navigate('/basic-info');
    } catch {
      setError('Upload failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-r from-blue-50 to-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload 3-6 Photos</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="mb-4"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex flex-wrap gap-2 mb-4">
        {files.map((f, i) => (
          <img
            key={i}
            src={URL.createObjectURL(f)}
            alt="preview"
            className="h-20 w-20 object-cover rounded"
          />
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={files.length < 3}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default UserPhotos;
