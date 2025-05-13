import React, { useState } from 'react';
// import axios from '../axios';
import axios from '../axios';  // use the configured instance
import { useNavigate } from 'react-router-dom';
import NextButton from './NextButton';

const Lifestyle = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ job:'', education:'', smoking:'no', drinking:'no', kids:'none', religion:'' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleNext = async () => {
    try {
      await axios.post('/api/profile/lifestyle', form, { withCredentials:true });
      navigate('/personality');
    } catch {
      setError('Save failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-r from-yellow-50 to-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Lifestyle</h2>
      <div className="space-y-4 mb-4">
        <input name="job" placeholder="Job" value={form.job} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" />
        <input name="education" placeholder="Education" value={form.education} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" />
        <select name="smoking" value={form.smoking} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none">
          <option value="no">No Smoking</option>
          <option value="occasionally">Occasionally</option>
          <option value="yes">Yes</option>
        </select>
        <select name="drinking" value={form.drinking} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none">
          <option value="no">No Drinking</option>
          <option value="occasionally">Occasionally</option>
          <option value="yes">Yes</option>
        </select>
        <select name="kids" value={form.kids} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none">
          <option value="none">No Kids</option>
          <option value="has">Has Kids</option>
          <option value="wants">Wants Kids</option>
          <option value="unsure">Unsure</option>
        </select>
        <input name="religion" placeholder="Religion" value={form.religion} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" />
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <NextButton onClick={handleNext} disabled={false} />
    </div>
  );
}

export default Lifestyle