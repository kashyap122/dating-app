// src/components/AuthHandler.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import axios from '../axios';
import axios from '../axios';  // use the configured instance


export default function AuthHandler() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = params.get('token');
    if (!token) return navigate('/');

    localStorage.setItem('authToken', token);
    // set axios default
    axios.defaults.headers.common['Authorization'] = `${token}`;

    // Now check profile status
    axios.get('/api/profile/status', { headers: { Authorization: `${token}` } })
      .then(res => {
        const { steps } = res.data;
        if (!steps.photosCompleted)      navigate('/upload-photos');
        else if (!steps.basicInfoCompleted)   navigate('/basic-info');
        else if (!steps.lifestyleCompleted)   navigate('/lifestyle');
        else if (!steps.personalityCompleted) navigate('/personality');
        else if (!steps.intentionsCompleted)  navigate('/intentions');
        else                                 navigate('/dashboard');
      })
      .catch(() => navigate('/'));
  }, [params, navigate]);
  return null;
}
