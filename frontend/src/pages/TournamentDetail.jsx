import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { 
    Loader2, Trophy, Users, Swords, BarChart3, Calendar, MapPin, 
    ChevronLeft, Share2, Info, Activity, AlertCircle 
} from 'lucide-react';

const TournamentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('teams');

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // Fetch basic tournament info first to ensure it exists
                const tRes = await api.get(`/tournaments/${id}`);
                setTournament(tRes.data);

                // Fetch other details in parallel, catch individual errors
                const [teamsRes, matchRes, lbRes] = await Promise.all([
                    api.get(`/teams?tournament_id=${id}`).catch(err => {
                        console.error('Teams fetch failed', err);
                        return { data: [] };
                    }),
                    api.get(`/matches?tournament_id=${id}`).catch(err => {
                        console.error('Matches fetch failed', err);
                        return { data: [] };
                    }),
                    api.get(`/leaderboard/${id}`).catch(err => {
                        console.error('Leaderboard fetch failed', err);
                        return { data: { entries: [] } };
                    })
                ]);

                setTeams(teamsRes.data);
                setMatches(matchRes.data);
                setLeaderboard(lbRes.data);
            } catch (err) {
                console.error('Tournament fetch failed', err);
                toast.error('Identity of target domain could not be verified.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <Loader2 className="animate-spin text-orange-500 w-16 h-16" />
            <p className="text-slate-400 font-mono text-sm animate-pulse">SYNCHRONIZING DOMAIN DATA...</p>
        </div>
    );

    if (!tournament) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <AlertCircle className="text-rose-500" size={40} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-2">Tournament Domain Lost</h2>
                <p className="text-slate-400 max-w-md mx-auto">The requested tournament instance does not exist on the network or has been decommissioned.</p>
            </div>
            <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all border border-white/5">
                <ChevronLeft size={20}/> Return to Circuit
            </button>
        </div>
    );

    const TabButton = ({ name, icon: Icon, label }) => (
        <button 
            onClick={() => setActiveTab(name)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === name 
                ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-105' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <Icon size={20} />
            {label}
        </button>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header Section */}
            <div className="relative glass rounded-[2.5rem] p-10 overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-orange-500/20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                <div className="relative z-10">
                    <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Circuit
                    </button>
                    
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                                    tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    tournament.status === 'ongoing' ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                                    'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                    {tournament.status}
                                </span>
                                <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] border border-white/5">
                                    {tournament.sport_type}
                                </span>
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{tournament.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-orange-500" />
                                    {new Date(tournament.start_date).toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity size={18} className="text-blue-500" />
                                    Phase 1: Operational
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                                <Share2 size={20} />
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl">
                                Register Roster
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
                <TabButton name="teams" icon={Users} label="Registered Teams" />
                <TabButton name="matches" icon={Swords} label="Global Matches" />
                <TabButton name="leaderboard" icon={BarChart3} label="Rankings" />
                <TabButton name="info" icon={Info} label="Information" />
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'teams' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.length === 0 ? (
                            <div className="col-span-full glass-card rounded-[2rem] p-20 text-center flex flex-col items-center">
                                <Users className="text-slate-600 mb-6" size={48} />
                                <h3 className="text-2xl font-bold text-white mb-2">Roster Empty</h3>
                                <p className="text-slate-500 max-w-sm">No teams have synchronized their credentials for this tournament yet.</p>
                            </div>
                        ) : teams.map(t => (
                            <div key={t.id} className="glass-card rounded-3xl p-8 group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-500">
                                        <Trophy size={28} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        t.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                                    }`}>
                                        {t.status}
                                    </span>
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{t.name}</h4>
                                <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Captain: Identity Encrypted</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'matches' && (
                    <div className="space-y-6">
                        {matches.length === 0 ? (
                            <div className="glass-card rounded-[2rem] p-20 text-center flex flex-col items-center">
                                <Swords className="text-slate-600 mb-6" size={48} />
                                <h3 className="text-2xl font-bold text-white mb-2">No Matches Scheduled</h3>
                                <p className="text-slate-500 max-w-sm">Bracket generation has not yet been initialized for this domain phase.</p>
                            </div>
                        ) : matches.map(m => (
                            <div key={m.id} className="glass-card rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8 group">
                                <div className="flex-1 text-center lg:text-right">
                                    <h5 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">Team {m.team_a_id}</h5>
                                </div>
                                <div className="flex flex-col items-center gap-4 px-10 border-x border-white/5">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${
                                        m.status === 'live' ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 text-slate-400'
                                    }`}>{m.status}</span>
                                    <div className="text-4xl font-black text-white flex items-center gap-4">
                                        0 <span className="text-slate-700 text-sm italic font-medium">VS</span> 0
                                    </div>
                                    <div className="flex flex-col items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-1 mb-1"><Calendar size={12}/> {m.scheduled_at ? new Date(m.scheduled_at).toLocaleDateString() : 'TBA'}</div>
                                        <div className="flex items-center gap-1"><MapPin size={12}/> {m.venue || 'TBA'}</div>
                                    </div>
                                </div>
                                <div className="flex-1 text-center lg:text-left">
                                    <h5 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">Team {m.team_b_id}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className="glass rounded-[2rem] overflow-hidden border border-white/10">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.03] border-b border-white/10 font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="p-8">Global Rank</th>
                                    <th className="p-8">Team Identity</th>
                                    <th className="p-8 text-center">Wins</th>
                                    <th className="p-8 text-center">Losses</th>
                                    <th className="p-8 text-right font-black text-white">Network Pts</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboard?.entries?.length > 0 ? leaderboard.entries.map((e, idx) => (
                                    <tr key={e.team_id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-8">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                                                idx === 0 ? 'bg-orange-500 text-white' : idx === 1 ? 'bg-slate-400 text-slate-900' : idx === 2 ? 'bg-orange-900/50 text-orange-400' : 'bg-white/5 text-slate-500'
                                            }`}>
                                                {e.rank || idx + 1}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">{e.team_name}</div>
                                            <div className="text-xs text-slate-500 font-mono">NODE_UID: {e.team_id}</div>
                                        </td>
                                        <td className="p-8 text-center font-bold text-green-400">{e.wins}</td>
                                        <td className="p-8 text-center font-bold text-rose-400">{e.losses}</td>
                                        <td className="p-8 text-right">
                                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{e.points}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center text-slate-500 font-medium italic">Leaderboard computation in progress...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 glass-card rounded-3xl p-10 space-y-8">
                            <h3 className="text-3xl font-black text-white">Domain Overview</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                This tournament instance is running on the master competitive network. Participating rosters are required to maintain active synchronization with their team headquarters. 
                                Match bracket strategies are automatically computed based on registration volume and seeding protocols.
                            </p>
                            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8 text-sm font-mono uppercase tracking-widest text-slate-500">
                                <div>
                                    <div className="mb-1 text-orange-500">Node Location</div>
                                    <div>Global Distributed</div>
                                </div>
                                <div>
                                    <div className="mb-1 text-blue-500">Security Layer</div>
                                    <div>Encrypted Mesh</div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card rounded-3xl p-8 space-y-6 flex flex-col items-center text-center">
                            <div className="p-6 bg-orange-500/10 rounded-3xl border border-orange-500/20">
                                <Trophy className="text-orange-500" size={48} />
                            </div>
                            <h4 className="text-xl font-bold text-white">Grand Prize Pool</h4>
                            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">CREDIT LIMIT_EXCEEDED</p>
                            <p className="text-slate-500 text-xs uppercase tracking-tighter">Registration required to view specific bounty allocations.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentDetail;
