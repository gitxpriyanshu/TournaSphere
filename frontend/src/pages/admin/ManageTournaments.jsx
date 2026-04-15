import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, Save, X, Server, Activity, ArrowRight } from 'lucide-react';

const ManageTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', sport_type: '', start_date: '', end_date: '' });
    const [editingStatus, setEditingStatus] = useState(null);

    useEffect(() => { fetchTournaments() }, []);

    const fetchTournaments = async () => {
        try {
            const res = await api.get('/tournaments');
            setTournaments(res.data);
        } catch (error) { toast.error('Failed to load tournaments'); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tournaments', formData);
            toast.success('Tournament created automatically on network');
            setShowModal(false);
            setFormData({ name: '', sport_type: '', start_date: '', end_date: '' });
            fetchTournaments();
        } catch (error) { toast.error('Creation rejected by network protocols'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this active instance?')) return;
        try {
            await api.delete(`/tournaments/${id}`);
            toast.success('Instance wiped from network');
            fetchTournaments();
        } catch (error) { toast.error('Failed to wipe instance'); }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/tournaments/${id}/status`, { status });
            toast.success('Status successfully broadcast');
            setEditingStatus(null);
            fetchTournaments();
        } catch (error) { toast.error('Status transition rejected'); }
    };

    const StatusBadge = ({ status }) => (
        <span className={`px-3 py-1 font-mono text-[11px] uppercase tracking-widest rounded border ${
            status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            status === 'ongoing' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
            'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
            {status}
        </span>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="glass p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-inner">
                        <Server className="text-orange-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1">Network Administration</h1>
                        <p className="text-slate-400 font-medium">Manage master tournament instances</p>
                    </div>
                </div>
                <button onClick={() => setShowModal(true)} className="relative z-10 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                    <Plus size={20}/> Instantiate Target
                </button>
            </div>

            <div className="glass p-1 rounded-3xl overflow-hidden border border-white/5">
                <div className="bg-slate-900/50 rounded-[22px] overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-mono text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-6">Target Identity</th>
                                <th className="p-6">Classification</th>
                                <th className="p-6">Timeframe</th>
                                <th className="p-6">Current State</th>
                                <th className="p-6 text-right">Overrides</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tournaments.map(t => (
                                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <div className="font-bold text-white text-lg tracking-tight group-hover:text-orange-400 transition-colors">{t.name}</div>
                                        <div className="text-slate-500 font-mono text-xs mt-1">ID: {t.id}</div>
                                    </td>
                                    <td className="p-6"><span className="text-slate-300 font-medium">{t.sport_type}</span></td>
                                    <td className="p-6 text-slate-400 font-mono text-sm">
                                        <div className="flex items-center gap-2">
                                           {new Date(t.start_date).toLocaleDateString()} <ArrowRight size={12} className="text-slate-600"/> {new Date(t.end_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        {editingStatus === t.id ? (
                                            <div className="flex gap-2 isolate">
                                                <select defaultValue={t.status} id="status_select" className="bg-slate-800 text-sm border border-slate-700 text-white rounded-lg px-3 py-1 outline-none focus:border-orange-500">
                                                    <option value="upcoming">Upcoming</option>
                                                    <option value="ongoing">Ongoing</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <button onClick={() => handleStatusChange(t.id, document.getElementById('status_select').value)} className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30">
                                                    <Save size={16}/>
                                                </button>
                                                <button onClick={() => setEditingStatus(null)} className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30">
                                                    <X size={16}/>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={t.status} />
                                                <button onClick={() => setEditingStatus(t.id)} className="text-slate-500 hover:text-orange-400 transition-colors">
                                                    <Edit size={14}/>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => handleDelete(t.id)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tournaments.length === 0 && (
                                <tr><td colSpan="5" className="p-12 text-center text-slate-500 font-medium">No master instances active on the network.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-lg rounded-3xl p-8 animate-fade-in-up border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3"><Activity className="text-orange-500"/> Initialize Target</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 font-mono uppercase tracking-widest">Instance Designation</label>
                                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none" placeholder="e.g. Operation Alpha" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 font-mono uppercase tracking-widest">Classification</label>
                                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none" placeholder="e.g. Esports, Field" value={formData.sport_type} onChange={e => setFormData({...formData, sport_type: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2 font-mono uppercase tracking-widest">Start Frame</label>
                                    <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-orange-500 outline-none" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2 font-mono uppercase tracking-widest">End Frame</label>
                                    <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-orange-500 outline-none" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all">
                                Execute Creation Sequence
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageTournaments;
