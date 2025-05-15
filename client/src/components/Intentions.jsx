// src/components/Intentions.jsx
import React, { useState } from 'react';
import axios from '../axios';
import NextButton from './NextButton';

const Intentions = () => {
  const [choices, setChoices] = useState([]);
  const [error, setError] = useState('');
  const options = ['long-term', 'short-term', 'friends', 'networking'];

  const toggle = (opt) => {
    setChoices((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleNext = async () => {
    if (!choices.length) {
      setError('Please select at least one option.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        '/api/profile/intentions',
        { lookingFor: choices },
        { headers: { Authorization: token } }
      );
      console.log('Intentions saved');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Intentions error:', err.response || err.message);
      setError('Save failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-200 to-rose-100 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-8">
        <h2 className="degular text-3xl font-bold text-center text-gray-800 mb-2">
          What Are You Looking For?
        </h2>
        <p className="text-center text-gray-600 italic mb-6">
          Be honest – let others know what you want from a connection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`w-full py-3 px-4 border rounded-lg transition font-medium ${
                choices.includes(opt)
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-red-100'
              }`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <NextButton onClick={handleNext} disabled={false} />
      </div>
    </div>
  );
};

export default Intentions;
