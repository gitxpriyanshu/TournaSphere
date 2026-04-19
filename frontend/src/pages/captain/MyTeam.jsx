import { useState, useEffect, useContext } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const MyTeam = () => {
    const { user } = useContext(AuthContext);
    const [tournaments, setTournaments] = useState([]);
    const [selectedTourney, setSelectedTourney] = useState('');
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [newPlayerId, setNewPlayerId] = useState('');
    const [jersey, setJersey] = useState('');

    useEffect(() => {
        api.get('/tournaments').then(res => { setTournaments(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedTourney) { setTeam(null); setPlayers([]); return; }
        const fetchTeamData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/teams?tournament_id=${selectedTourney}`);
                const myTeam = res.data.find(t => String(t.captain_id) === String(user.id));
                setTeam(myTeam || null);
                if (myTeam) {
                    const plRes = await api.get(`/players?team_id=${myTeam.id}`);
                    setPlayers(plRes.data);
                } else {
                    setPlayers([]);
                }
            } catch (err) { toast.error('Error fetching team'); }
            finally { setLoading(false); }
        };
        fetchTeamData();
    }, [selectedTourney, user.id]);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            await api.post('/teams', { name, tournament_id: parseInt(selectedTourney) });
            toast.success('Team registration submitted!');
            window.location.reload();
        } catch (err) { toast.error(err.response?.data?.detail || 'Registration failed'); }
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/players', { user_id: parseInt(newPlayerId), team_id: team.id, jersey_number: jersey });
            toast.success('Player added to roster');
            const plRes = await api.get(`/players?team_id=${team.id}`);
            setPlayers(plRes.data);
            setNewPlayerId(''); setJersey('');
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed to add player'); }
    };

    const handleRemovePlayer = async (pid) => {
        try {
            await api.delete(`/players/${pid}`);
            toast.success('Player removed');
            setPlayers(players.filter(p => p.id !== pid));
        } catch (err) { toast.error('Failed to remove'); }
    };

    if (loading && !tournaments.length) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500 w-12 h-12" /></div>;

    return (
        <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-extrabold text-orange-500 tracking-tight">My Team Directive</h1>
            
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                <label className="block text-sm font-bold text-slate-400 mb-2">Select Active Tournament</label>
                <select className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl text-slate-100 focus:ring-2 focus:ring-orange-500 font-medium" value={selectedTourney} onChange={e => setSelectedTourney(e.target.value)}>
                    <option value="">-- Choose a Tournament --</option>
                    {tournaments.map(t => (<option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>))}
                </select>
            </div>

            {loading && selectedTourney && <div className="flex justify-center py-6"><Loader2 className="animate-spin text-white w-8 h-8" /></div>}

            {!loading && selectedTourney && !team && (
                <form onSubmit={handleCreateTeam} className="bg-slate-800 p-8 rounded-2xl space-y-6 border border-slate-700 shadow-xl">
                    <h2 className="text-2xl font-bold text-slate-100">Register a New Team</h2>
                    <p className="text-slate-400 text-sm">You are the designated Captain for this roster. Wait for Org approval.</p>
                    <input type="text" placeholder="Enter Official Team Name" required value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-900 rounded-xl text-white border border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none" />
                    <button type="submit" className="w-full bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-500 font-bold transition-all shadow-lg shadow-orange-500/20">Submit Application</button>
                </form>
            )}

            {!loading && team && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                            <span className={`px-4 py-2 font-black uppercase text-xs rounded-lg tracking-widest border ${team.status === 'approved' ? 'bg-green-900/50 text-green-400 border-green-800' : 'bg-orange-900/50 text-orange-400 border-orange-800'}`}>{team.status}</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-100">{team.name}</h2>
                        <p className="text-slate-400 font-medium mt-2">Team ID: <span className="text-slate-300 font-mono">{team.id}</span></p>
                    </div>

                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-4">Active Roster <span className="text-slate-500 text-sm font-medium ml-2">({players.length}/15)</span></h3>
                        
                        <div className="space-y-3 mb-8">
                            {players.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-slate-200 font-bold">User #{p.user_id}</span>
                                        <span className="text-slate-500 text-sm font-mono mt-1">Jersey: {p.jersey_number || 'N/A'}</span>
                                    </div>
                                    <button onClick={() => handleRemovePlayer(p.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Remove Player"><Trash2 size={20} /></button>
                                </div>
                            ))}
                            {players.length === 0 && <div className="text-center p-8 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 font-medium">No players on the roster yet. Add members below!</div>}
                        </div>
                        
                        <form onSubmit={handleAddPlayer} className="flex space-x-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                            <input type="number" placeholder="User ID" required value={newPlayerId} onChange={e => setNewPlayerId(e.target.value)} className="flex-1 p-3 bg-slate-800 rounded-lg text-white border border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none" />
                            <input type="text" placeholder="Jersey #" value={jersey} onChange={e => setJersey(e.target.value)} className="w-28 p-3 bg-slate-800 rounded-lg text-white border border-slate-600 text-center focus:ring-2 focus:ring-orange-500 outline-none" />
                            <button type="submit" className="bg-orange-600 text-white px-6 rounded-lg font-bold hover:bg-orange-500 transition-all flex items-center shadow-lg"><Plus size={20} className="mr-1" /> Add</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MyTeam;
