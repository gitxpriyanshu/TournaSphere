import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { Users, CheckCircle, XCircle, Filter, Loader2, Trophy, ArrowRight } from 'lucide-react';

const ManageTeams = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTourney, setSelectedTourney] = useState('');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/tournaments').then(res => setTournaments(res.data));
    }, []);

    useEffect(() => {
        if (!selectedTourney) return setTeams([]);
        setLoading(true);
        api.get(`/teams?tournament_id=${selectedTourney}`)
           .then(res => setTeams(res.data))
           .finally(() => setLoading(false));
    }, [selectedTourney]);

    const handleStatus = async (id, status) => {
        try {
            await api.patch(`/teams/${id}/status`, { status });
            toast.success(`Protocol ${status}: Signal Broadcasted.`);
            setTeams(teams.map(t => t.id === id ? { ...t, status } : t));
        } catch (err) { toast.error('Signal interception failed.'); }
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="glass p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-inner">
                            <Users className="text-green-400" size={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">Team Approvals Matrix</h1>
                            <p className="text-slate-400 font-medium">Verify and authorize roster submissions across the matrix.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-80 group">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <select 
                                className="w-full pl-12 pr-6 py-4 bg-slate-900/80 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all appearance-none cursor-pointer" 
                                value={selectedTourney} 
                                onChange={e => setSelectedTourney(e.target.value)}
                            >
                                <option value="">Select Target Tournament...</option>
                                {tournaments.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex justify-center p-20"><Loader2 className="animate-spin text-green-500 w-12 h-12" /></div>
                ) : teams.length === 0 ? (
                    <div className="glass-card rounded-[2.5rem] p-24 text-center border-dashed border-2 border-slate-800 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                            <Trophy className="text-slate-700" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-300 mb-2">{selectedTourney ? 'No Applicants Detected' : 'Domain Unselected'}</h3>
                        <p className="text-slate-500 max-w-sm mb-8">Select a tournament domain to begin authorizing roster access protocols.</p>
                    </div>
                ) : teams.map(t => (
                    <div key={t.id} className="group glass-card rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center transition-all duration-500">
                        <div className="flex items-center gap-8 w-full">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border font-black text-2xl shadow-inner ${
                                t.status === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                t.status === 'rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            }`}>
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white group-hover:text-green-400 transition-colors uppercase tracking-tight">{t.name}</h3>
                                <div className="flex items-center gap-4 mt-1 font-mono text-xs uppercase tracking-widest text-slate-500 font-bold">
                                    <span>CAPTAIN_ID: {t.captain_id}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className={t.status === 'approved' ? 'text-green-500' : t.status === 'rejected' ? 'text-rose-500' : 'text-yellow-500'}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                            <button 
                                onClick={() => handleStatus(t.id, 'rejected')} 
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl font-bold border border-rose-500/20 transition-all duration-300"
                            >
                                <XCircle size={18}/> Reject
                            </button>
                            <button 
                                onClick={() => handleStatus(t.id, 'approved')} 
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-xl font-black border border-green-500/20 transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.1)]"
                            >
                                <CheckCircle size={18}/> Authorize
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageTeams;
