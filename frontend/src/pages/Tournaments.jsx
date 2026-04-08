import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Loader2, Calendar, Trophy, ArrowRight, Activity } from 'lucide-react';

const Tournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await api.get('/tournaments');
                setTournaments(res.data);
            } catch (error) {
                toast.error('Failed to load tournaments');
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-orange-500 w-16 h-16" /></div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">Active Circuit</h1>
                    <p className="text-slate-400 font-medium text-lg max-w-2xl">Browse the official competitive domains, register your rosters, and track live brackets globally across the network.</p>
                </div>
            </div>

            {tournaments.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center border-dashed border-2 border-slate-700/50 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 shadow-inner">
                        <Activity className="text-slate-500 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Active Tournaments</h3>
                    <p className="text-slate-400 max-w-md">The administrative circuit is currently dark. Waiting for organizers to initialize new competitive domains.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.map(t => (
                        <div key={t.id} onClick={() => navigate(`/tournaments/${t.id}`)} className="group glass-card rounded-3xl p-8 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                            {/* Decorative Blobs */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-orange-500/20 transition-all duration-500"></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                                        <Trophy className="text-orange-400" size={24} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg backdrop-blur-md border ${
                                        t.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                        t.status === 'ongoing' ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                                        'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    }`}>{t.status}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors tracking-tight">{t.name}</h2>
                                <p className="text-slate-400 font-medium">{t.sport_type}</p>
                            </div>

                            <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center text-slate-500 text-sm font-mono tracking-tight gap-2">
                                    <Calendar size={16} className="text-slate-400"/>
                                    {new Date(t.start_date).toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {new Date(t.end_date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all text-slate-400">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Tournaments;
