// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    axios.get('/api/profile/me', {
      headers: { Authorization: token }
    })
      .then(res => setUser(res.data.user))
      .catch(err => {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const calcAge = dob => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) return <div className="p-4 text-center">Loading profile…</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <h1 className="degular text-2xl font-bold text-pink-600">
            Point of View
            <span className="text-gray-600 text-base ml-1">· The new dating</span>
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Hero Photo */}
        <div className="relative bg-white bg-opacity-80 backdrop-blur rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {user.photos.map((url, i) => (
              <div key={i} className="w-full aspect-square overflow-hidden rounded-lg shadow">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Profile Header Card */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {user.firstname} {user.lastname}, <span className="text-xl">{calcAge(user.birthday)}</span>
              </h2>
              <p className="text-gray-600">{user.pronouns}</p>
            </div>
            <Badge color="blue" className="mt-4 sm:mt-0">
              Score: {user.profileScore}
            </Badge>
          </div>
        </Card>

        {/* About Me */}
        <Section title="About Me">
          <InfoRow label="Location" value={user.location.city} />
          <InfoRow label="Gender" value={user.gender} />
          <InfoRow label="Birthday" value={new Date(user.birthday).toLocaleDateString()} />
        </Section>

        {/* Lifestyle */}
        <Section title="Lifestyle">
          <InfoRow label="Job" value={user.job || 'N/A'} />
          <InfoRow label="Education" value={user.education || 'N/A'} />
          <InfoRow label="Smoking" value={capitalize(user.smoking)} />
          <InfoRow label="Drinking" value={capitalize(user.drinking)} />
          <InfoRow label="Kids" value={capitalize(user.kids)} />
          <InfoRow label="Religion" value={user.religion} />
        </Section>

        {/* Personality & Interests */}
        <Section title="Personality & Interests">
          <p className="mb-4">{user.shortBio}</p>
          <div className="flex flex-wrap gap-2">
            {user.interestTags.map((tag, i) => (
              <Badge key={i} color="green">{tag}</Badge>
            ))}
          </div>
        </Section>

        {/* Favorites */}
        <Section title="Favorites">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Book" value={user.favoriteMedia.book} />
            <InfoRow label="Movie" value={user.favoriteMedia.movie} />
            <InfoRow label="Sitcom" value={user.favoriteMedia.sitcom} />
            <InfoRow label="Series" value={user.favoriteMedia.series} />
            <InfoRow label="Song" value={user.favoriteMedia.song} />
          </div>
        </Section>

        {/* Intentions */}
        <Section title="Looking For">
          <div className="flex flex-wrap gap-2">
            {user.lookingFor.map((opt, i) => (
              <Badge key={i} color="red">
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Badge>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}

// Reusable components

function Card({ children }) {
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur rounded-2xl shadow-lg p-6">
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur rounded-2xl shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 rounded-t-2xl">
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <p className="mb-2 text-gray-700">
      <strong className="text-gray-800">{label}:</strong> {value}
    </p>
  );
}

function Badge({ color, children, className = '' }) {
  const colors = {
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800'
  };
  return (
    <span
      className={`${colors[color] || colors.blue} px-4 py-1 rounded-full text-sm font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
