import { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trophy, LogOut, LayoutDashboard, Flag, Swords, ShieldAlert, BarChart3, Settings } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="sticky top-0 z-50 glass border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-3 font-black text-3xl neon-text drop-shadow-lg tracking-tighter cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/')}>
                <Trophy className="text-orange-500" fill="currentColor" size={32} />
                TournaSphere
              </span>
              <div className="hidden md:block border-l border-white/10 pl-8">
                <div className="flex items-center space-x-2">
                  <NavLink to="/tournaments" className={({isActive}) => isActive ? "bg-orange-500/20 text-orange-400 font-bold px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-2" : "text-slate-400 hover:bg-white/5 hover:text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2"}>
                    <LayoutDashboard size={18}/> Tournaments
                  </NavLink>
                  {(user?.role === 'team_captain' || user?.role === 'player') && (
                    <NavLink to="/team" className={({isActive}) => isActive ? "bg-blue-500/20 text-blue-400 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2" : "text-slate-400 hover:bg-white/5 hover:text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"}>
                      <Flag size={18}/> Team HQ
                    </NavLink>
                  )}
                  {['organizer', 'admin'].includes(user?.role) && (
                    <>
                      <NavLink to="/organizer/teams" className={({isActive}) => isActive ? "bg-green-500/20 text-green-400 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2" : "text-slate-400 hover:bg-white/5 hover:text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"}>
                         <ShieldAlert size={18}/> Approvals
                      </NavLink>
                      <NavLink to="/organizer/matches" className={({isActive}) => isActive ? "bg-rose-500/20 text-rose-400 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2" : "text-slate-400 hover:bg-white/5 hover:text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"}>
                         <Swords size={18}/> Matches
                      </NavLink>
                    </>
                  )}
                  {(user?.role === 'admin') && (
                      <NavLink to="/admin/tournaments" className={({isActive}) => isActive ? "bg-white/10 text-white font-bold px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-2" : "text-slate-400 hover:bg-white/5 hover:text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"}>
                         <Settings size={18}/> Admin
                      </NavLink>
                  )}
                  <NavLink to="/leaderboard" className={({isActive}) => isActive ? "bg-yellow-500/20 text-yellow-400 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2" : "text-slate-400 hover:bg-white/5 hover:text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"}>
                    <BarChart3 size={18}/> Rankings
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span className="px-4 py-1.5 bg-slate-900/80 text-xs text-orange-400 rounded-full font-mono shadow-inner border border-white/5 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {user?.role.replace('_', ' ')}
              </span>
              <button onClick={handleLogout} className="bg-white/5 hover:bg-rose-600/90 text-white border border-white/10 shadow-lg hover:shadow-rose-500/20 transition-all duration-300 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <LogOut size={16}/> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fade-in-up">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
