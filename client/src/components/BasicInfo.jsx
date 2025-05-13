import { useState } from 'react';
// import axios from '../axios';
import axios from '../axios';  // use the configured instance
import { useNavigate } from 'react-router-dom';
import NextButton from './NextButton';

const BasicInfo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: '', lastname: '', pronouns: '', birthday: '', city: '', gender: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = async () => {
    const { firstname, lastname, pronouns, birthday, city, gender } = form;
    if (!firstname || !lastname || !birthday || !gender) {
      setError('Please fill all required fields');
      return;
    }
    try {
      await axios.post('/api/profile/basic', form, { withCredentials: true });
      navigate('/lifestyle');
    } catch {
      setError('Save failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-r from-green-50 to-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Basic Info</h2>
      <div className="space-y-4 mb-4">
        <input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" required />
        <input name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" required />
        <select name="pronouns" value={form.pronouns} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none">
          <option value="">Pronouns</option>
          <option>he/him</option><option>she/her</option><option>they/them</option>
        </select>
        <input name="birthday" type="date" value={form.birthday} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" />
        <select name="gender" value={form.gender} onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none" required>
          <option value="">Gender</option>
          <option>male</option><option>female</option><option>non-binary</option><option>other</option>
        </select>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <NextButton onClick={handleNext} disabled={false} />
    </div>
  );
}

export default BasicInfo