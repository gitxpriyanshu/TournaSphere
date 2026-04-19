import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { Trophy, ArrowRight, ShieldCheck, Gamepad2, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, { email, role: res.data.role });
      
      const role = res.data.role;
      if (role === 'admin') navigate('/admin/tournaments');
      else if (role === 'organizer') navigate('/organizer/teams');
      else navigate('/tournaments');
      
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Visual Left Hemisphere */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900 border-r border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-600/30 via-[#0f172a] to-[#0f172a]"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[50%] left-[50%] w-48 h-48 bg-rose-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-20 text-center">
            <Trophy size={100} className="text-orange-500 mb-8 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]" />
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-white to-slate-400 mb-6">
                Welcome to the Sphere.
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-lg mb-12">
                The supreme orchestration engine for global competitive circuits, bracket generation, and real-time team analytics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center">
                    <Gamepad2 className="text-orange-400 mb-3" size={28}/>
                    <h3 className="text-white font-bold mb-1">Scale Matchups</h3>
                    <p className="text-slate-500 text-sm">Automated bracket generation strategies.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center">
                    <Users className="text-blue-400 mb-3" size={28}/>
                    <h3 className="text-white font-bold mb-1">Roster Sync</h3>
                    <p className="text-slate-500 text-sm">Global approval matrix for captains.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Login Right Hemisphere */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-32 relative animate-fade-in-up">
        {/* Subtle grid background for the form side */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="mx-auto w-full max-w-md relative z-10">
          <div className="text-center mb-10 lg:hidden">
             <Trophy size={60} className="text-orange-500 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
             <h2 className="text-3xl font-black text-white">TournaSphere</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-white tracking-tight mb-3">Initialize Session</h2>
              <p className="text-slate-400 font-medium">Authenticate your identity to access the network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest pl-1">Network Identity (Email)</label>
              <input 
                 value={email} onChange={(e) => setEmail(e.target.value)}
                 type="email" required 
                 className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none shadow-inner" 
                 placeholder="admin@tourna.com" 
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest">Access Protocol (Password)</label>
                  <a href="#" className="text-xs text-orange-500 font-medium hover:text-orange-400 transition-colors">Forgot?</a>
              </div>
              <input 
                 value={password} onChange={(e) => setPassword(e.target.value)}
                 type="password" required 
                 className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none shadow-inner" 
                 placeholder="••••••••" 
              />
            </div>

            <button type="submit" className="group w-full flex justify-center items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all">
              Establish Connection <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20}/>
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500 font-medium">
            Not registered on the matrix?{' '}
            <Link to="/register" className="font-bold text-white hover:text-orange-400 transition-colors">Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
