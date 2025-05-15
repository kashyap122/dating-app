// src/components/Lifestyle.jsx
import React, { useState } from 'react';
import axios from '../axios';
import NextButton from './NextButton';

export default function Lifestyle() {
  const [form, setForm]   = useState({
    job: '', education: '',
    smoking: 'no', drinking: 'no',
    kids: 'none', religion: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleNext = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/profile/lifestyle', form, {
        headers: { Authorization: token }
      });
      window.location.href = '/personality';
    } catch (err) {
      console.error('Lifestyle error:', err);
      setError('Save failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <h2 className="degular text-3xl font-bold text-center text-gray-800 mb-2">
          Lifestyle & Habits
        </h2>
        <p className="text-center text-gray-600 italic mb-6">
          Your everyday choices say a lot—let’s capture the essentials.
        </p>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <input
            name="job"
            placeholder="What do you do for work?"
            value={form.job}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            name="education"
            placeholder="Education"
            value={form.education}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <select
            name="smoking"
            value={form.smoking}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="no">I don't smoke</option>
            <option value="occasionally">Occasionally</option>
            <option value="yes">Yes, regularly</option>
          </select>
          <select
            name="drinking"
            value={form.drinking}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="no">I don't drink</option>
            <option value="occasionally">Occasionally</option>
            <option value="yes">Yes, regularly</option>
          </select>
          <select
            name="kids"
            value={form.kids}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="none">No kids</option>
            <option value="has">I have kids</option>
            <option value="wants">I want kids</option>
            <option value="unsure">Not sure yet</option>
          </select>
          <input
            name="religion"
            placeholder="Religion or belief (optional)"
            value={form.religion}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Next Button */}
        <NextButton onClick={handleNext} disabled={false} />
      </div>
    </div>
  );
}
