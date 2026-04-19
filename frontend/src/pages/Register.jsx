import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'player' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)] border border-slate-700">
        <div>
          <h2 className="mt-2 text-center text-4xl font-extrabold text-orange-500 tracking-tight">
            Join the Arena
          </h2>
          <p className="mt-3 text-center text-sm text-slate-400 font-medium">
            Create your account on TournaSphere
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-400 text-sm font-semibold text-center bg-red-900/30 border border-red-800 py-3 rounded-lg">{error}</div>}
          <div className="rounded-md space-y-5">
            <input
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm shadow-inner transition-all"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm shadow-inner transition-all"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm shadow-inner transition-all"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <select
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm shadow-inner transition-all"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="player">Player</option>
              <option value="team_captain">Team Captain</option>
              <option value="organizer">Organizer (Dev only)</option>
              <option value="admin">Admin (Dev only)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-slate-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-slate-900 focus:ring-orange-500 shadow-lg shadow-orange-500/25 transition-all"
            >
              Register Account
            </button>
          </div>
          <div className="text-center text-sm text-slate-400 mt-6 font-medium">
            Already have an account? <Link to="/login" className="text-orange-400 hover:text-orange-300 ml-1 hover:underline">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
