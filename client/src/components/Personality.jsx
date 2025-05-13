import { useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import NextButton from './NextButton';

const Personality = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ shortBio:'', interestTags:[], promptAnswers:[], favoriteMedia: {} });
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput && form.interestTags.length<5) {
      setForm({ ...form, interestTags: [...form.interestTags, tagInput] });
      setTagInput('');
    }
  };

  const handleNext = async () => {
    try {
      await axios.post('/api/profile/personality', form, { withCredentials:true });
      navigate('/intentions');
    } catch {
      setError('Save failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-r from-purple-50 to-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Personality & Interests</h2>
      <textarea name="shortBio" placeholder="Short Bio" rows={4} value={form.shortBio}
        onChange={e => setForm({ ...form, shortBio: e.target.value })}
        className="w-full p-3 border rounded focus:outline-none mb-4" />
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            placeholder="Add interest tag" className="flex-1 p-3 border rounded focus:outline-none" />
          <button onClick={addTag} className="px-4 py-3 bg-gray-200 rounded">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.interestTags.map((t,i)=>(<span key={i} className="bg-blue-200 px-3 py-1 rounded-full">{t}</span>))}
        </div>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <NextButton onClick={handleNext} disabled={false} />
    </div>
  );
}

export default Personality