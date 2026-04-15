import { useState, useEffect } from 'react';
import api from '../api';
import { BarChart3, Trophy, Search, Loader2, Award, Zap, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTourney, setSelectedTourney] = useState('');
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { api.get('/tournaments').then(res => setTournaments(res.data)); }, []);
    
    useEffect(() => {
        if (selectedTourney) {
            setLoading(true);
            api.get(`/leaderboard/${selectedTourney}`)
               .then(res => setBoard(res.data.entries))
               .catch(() => setBoard([]))
               .finally(() => setLoading(false));
        }
    }, [selectedTourney]);

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="glass p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-inner">
                            <BarChart3 className="text-yellow-400" size={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">Global Leaderboards</h1>
                            <p className="text-slate-400 font-medium">Real-time computation of competitive rankings across the sphere.</p>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-96 group">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <select 
                                className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer" 
                                onChange={e => setSelectedTourney(e.target.value)}
                                value={selectedTourney}
                            >
                                <option value="">Locate Tournament Database...</option>
                                {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20 text-yellow-500"><Loader2 className="animate-spin" size={48} /></div>
            ) : selectedTourney && board ? (
                <div className="glass rounded-[2rem] overflow-hidden border border-white/10">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.03] border-b border-white/10 font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="p-8">Domain Rank</th>
                                <th className="p-8">Team Aliases</th>
                                <th className="p-8 text-center">Victory Rate</th>
                                <th className="p-8 text-center text-rose-400">Defeats</th>
                                <th className="p-8 text-right font-black text-white">Network Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {board.length === 0 ? (
                                <tr><td colSpan="5" className="p-24 text-center">
                                    <div className="flex flex-col items-center gap-4 text-slate-500">
                                        <Zap size={32} className="opacity-20" />
                                        <p className="font-medium">The competitive engine has not recorded sufficient data for this domain.</p>
                                    </div>
                                </td></tr>
                            ) : board.map((e, idx) => (
                                <tr key={e.team_id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-8">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-transform group-hover:scale-110 ${
                                            idx === 0 ? 'bg-gradient-to-tr from-yellow-600 to-yellow-300 text-slate-900' : 
                                            idx === 1 ? 'bg-slate-400 text-slate-900' : 
                                            idx === 2 ? 'bg-orange-800/80 text-orange-200' : 
                                            'bg-white/5 text-slate-500'
                                        }`}>
                                            {idx < 3 ? <Award size={20} /> : e.rank || idx + 1}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-bold text-xl text-white group-hover:text-yellow-400 transition-colors">{e.team_name}</div>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-500 tracking-widest font-black uppercase">
                                            <TrendingUp size={12} className="text-green-500" /> Stats Verified
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className="font-bold text-green-400 text-lg">{e.wins} <span className="opacity-40 text-xs">WINS</span></span>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className="font-bold text-rose-500 text-lg">{e.losses} <span className="opacity-40 text-xs">LOSS</span></span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">{e.points}</span>
                                            <span className="text-[10px] font-mono text-slate-600 uppercase font-bold tracking-tighter">Domain Confidence</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="glass-card rounded-[2.5rem] p-32 text-center border-dashed border-2 border-slate-800 flex flex-col items-center justify-center">
                    <Trophy className="text-slate-800 mb-6" size={64} />
                    <h3 className="text-3xl font-black text-slate-500 mb-2 uppercase tracking-tighter">Awaiting Network Sync</h3>
                    <p className="text-slate-600 max-w-sm">Select an active tournament domain from the matrix to visualize the current ranking distribution.</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
