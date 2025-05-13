import { useState } from 'react';
// import axios from '../axios';
import axios from '../axios';  // use the configured instance
import { useNavigate } from 'react-router-dom';
import NextButton from './NextButton';

const Intentions = () => {
    const navigate = useNavigate();
  const [choices, setChoices] = useState([]);
  const options = ['long-term','short-term','friends','networking'];
  const [error, setError] = useState('');

  const toggle = opt => {
    setChoices(prev => prev.includes(opt) ? prev.filter(o=>o!==opt) : [...prev, opt]);
  };

  const handleNext = async () => {
    if (!choices.length) {
      setError('Select at least one');
      return;
    }
    try {
      await axios.post('/api/profile/intentions', { lookingFor: choices }, { withCredentials:true });
      navigate('/dashboard');
    } catch {
      setError('Save failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-r from-red-50 to-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">What Are You Looking For?</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        {options.map(opt => (
          <button key={opt} onClick={()=>toggle(opt)}
            className={`w-full p-3 border rounded ${choices.includes(opt)? 'bg-red-600 text-white':''}`}> {opt}</button>
        ))}
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <NextButton onClick={handleNext} disabled={false} />
    </div>
  );
}

export default Intentions