// src/components/Personality.jsx
import React, { useState } from 'react';
import axios from '../axios';
import NextButton from './NextButton';

export default function Personality() {
  const [form, setForm] = useState({
    shortBio: '',
    interestTags: [],
    promptAnswers: [],
    favoriteMedia: {
      book: '',
      movie: '',
      sitcom: '',
      series: '',
      song: ''
    }
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const addTag = () => {
    if (tagInput && form.interestTags.length < 5) {
      setForm(prev => ({
        ...prev,
        interestTags: [...prev.interestTags, tagInput]
      }));
      setTagInput('');
    }
  };

  const handleMediaChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      favoriteMedia: {
        ...prev.favoriteMedia,
        [name]: value
      }
    }));
  };

  const handleNext = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/profile/personality', form, {
        headers: { Authorization: token }
      });
      console.log('Personality & interests saved');
      window.location.href = '/intentions';
    } catch (err) {
      console.error('Personality error:', err.response || err.message);
      setError('Save failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-pink-300 to-rose-300 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8">
        <h2 className="degular text-3xl font-bold text-center text-gray-800 mb-2">
          Share a Bit About You
        </h2>
        <p className="text-center text-gray-600 italic mb-6">
          Your vibe attracts your tribe — express your personality and favorites.
        </p>

        {/* Short Bio */}
        <textarea
          name="shortBio"
          placeholder="Write a short bio (who are you, what do you love, etc.)"
          rows={4}
          value={form.shortBio}
          onChange={e => setForm(prev => ({ ...prev, shortBio: e.target.value }))}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 mb-6"
        />

        {/* Interest Tags */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Interest Tags (max 5)</label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Add interest tag"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.interestTags.map((t, i) => (
              <span key={i} className="bg-purple-200 px-3 py-1 rounded-full text-sm text-purple-800">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Favorite Media */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Favorite Media</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="book"
              placeholder="Favorite Book"
              value={form.favoriteMedia.book}
              onChange={handleMediaChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="movie"
              placeholder="Favorite Movie"
              value={form.favoriteMedia.movie}
              onChange={handleMediaChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="sitcom"
              placeholder="Favorite Sitcom"
              value={form.favoriteMedia.sitcom}
              onChange={handleMediaChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="series"
              placeholder="Favorite Series"
              value={form.favoriteMedia.series}
              onChange={handleMediaChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="song"
              placeholder="Favorite Song"
              value={form.favoriteMedia.song}
              onChange={handleMediaChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <NextButton onClick={handleNext} disabled={false} />
      </div>
    </div>
  );
}
