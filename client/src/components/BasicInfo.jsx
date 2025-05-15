// src/components/BasicInfo.jsx
import React, { useState } from 'react';
import axios from '../axios';
import NextButton from './NextButton';

export default function BasicInfo() {
  const [form, setForm]   = useState({
    firstname: '', lastname: '',
    pronouns: '', birthday: '',
    city: '', gender: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleNext = async () => {
    const { firstname, lastname, birthday, gender } = form;
    if (!firstname || !lastname || !birthday || !gender) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/profile/basic', form, {
        headers: { Authorization: token }
      });
      window.location.href = '/lifestyle';
    } catch (err) {
      console.error('BasicInfo error:', err);
      setError('Save failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <h2 className="degular text-3xl font-bold text-center text-gray-800 mb-2">
          Tell Us About You
        </h2>
        <p className="text-center text-gray-600 italic mb-6">
          A little detail goes a long way—let’s get to know you better.
        </p>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <input
            name="firstname"
            placeholder="First Name *"
            value={form.firstname}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            name="lastname"
            placeholder="Last Name *"
            value={form.lastname}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <select
            name="pronouns"
            value={form.pronouns}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Pronouns</option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
            <option value="other">Other</option>
          </select>

          <input
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Gender *</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-Binary</option>
            <option value="other">Other</option>
          </select>
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
