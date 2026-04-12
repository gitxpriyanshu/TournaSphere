import { useState, useEffect, useRef } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Swords, Calendar, MapPin, Loader2, PlayCircle, CheckCircle, 
    Zap, Filter, X, Save, Trophy, Activity, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';

// --- Custom Sporty Calendar Component ---
const SportyCalendar = ({ value, onChange, onClose }) => {
    const initDate = value ? new Date(value) : new Date();
    const [viewDate, setViewDate] = useState(new Date(initDate));
    const [selectedDate, setSelectedDate] = useState(new Date(initDate));
    
    // 12-hour system states
    const initHours = initDate.getHours();
    const [hours, setHours] = useState(initHours === 0 ? 12 : initHours > 12 ? initHours - 12 : initHours);
    const [minutes, setMinutes] = useState(initDate.getMinutes());
    const [amPm, setAmPm] = useState(initHours >= 12 ? 'PM' : 'AM');

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const handleConfirm = () => {
        let h24 = parseInt(hours);
        if (amPm === 'PM' && h24 < 12) h24 += 12;
        if (amPm === 'AM' && h24 === 12) h24 = 0;

        const finalDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), h24, minutes);
        const pad = (n) => n.toString().padStart(2, '0');
        const isoStr = `${finalDate.getFullYear()}-${pad(finalDate.getMonth() + 1)}-${pad(finalDate.getDate())}T${pad(h24)}:${pad(minutes)}:00`;
        onChange(isoStr);
        onClose();
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const days = [];
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-10"></div>);

        for (let d = 1; d <= totalDays; d++) {
            const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
            const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
            
            days.push(
                <button 
                    key={d} 
                    onClick={() => handleDateSelect(d)}
                    type="button"
                    className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                        isSelected ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110' : 
                        isToday ? 'border border-rose-500/50 text-rose-400' : 'text-slate-300 hover:bg-white/10'
                    }`}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in w-72">
            <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevMonth} type="button" className="p-2 hover:bg-white/5 rounded-lg text-slate-400"><ChevronLeft size={16}/></button>
                <div className="text-sm font-black text-white uppercase tracking-widest">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</div>
                <button onClick={handleNextMonth} type="button" className="p-2 hover:bg-white/5 rounded-lg text-slate-400"><ChevronRight size={16}/></button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
                {['S','M','T','W','T','F','S'].map(day => (
                    <div key={day} className="text-[10px] font-black text-slate-600 text-center uppercase tracking-tighter">{day}</div>
                ))}
                {renderDays()}
            </div>

            <div className="border-t border-white/5 pt-6 mt-2">
                <div className="flex items-center gap-3 text-slate-400 mb-4">
                    <Clock size={14} className="text-rose-500"/>
                    <span className="text-[10px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Temporal Phase</span>
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 items-center">
                        <input 
                            type="number" value={hours} onChange={e => setHours(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                            className="w-12 bg-transparent text-center text-white font-black outline-none"
                        />
                        <span className="text-slate-700 font-bold mx-0.5">:</span>
                        <input 
                            type="number" value={minutes} onChange={e => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            className="w-12 bg-transparent text-center text-white font-black title-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        {['AM', 'PM'].map(val => (
                            <button 
                                key={val}
                                onClick={() => setAmPm(val)}
                                type="button"
                                className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${amPm === val ? 'bg-rose-500 text-white' : 'bg-slate-950 text-slate-600 hover:text-slate-400'}`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={handleConfirm}
                type="button"
                className="w-full mt-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:from-rose-400 hover:to-orange-400 transition-all shadow-lg shadow-rose-500/20"
            >
                Confirm Phase
            </button>
        </div>
    );
};


// --- Main ManageMatches Component ---
const ManageMatches = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTourney, setSelectedTourney] = useState('');
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState({});
    const [loading, setLoading] = useState(false);
    
    const [scheduleModal, setScheduleModal] = useState(null);
    const [resultModal, setResultModal] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    
    const [formDate, setFormDate] = useState('');
    const [formVenue, setFormVenue] = useState('');
    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);

    const calendarRef = useRef(null);

    useEffect(() => { 
        api.get('/tournaments').then(res => setTournaments(res.data)); 

        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!selectedTourney) return setMatches([]);
        const fetchData = async () => {
            setLoading(true);
            try {
                const [mRes, tRes] = await Promise.all([
                    api.get(`/matches?tournament_id=${selectedTourney}`),
                    api.get(`/teams?tournament_id=${selectedTourney}`)
                ]);
                setMatches(mRes.data);
                const tm = {}; tRes.data.forEach(t => tm[t.id] = t.name);
                setTeams(tm);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedTourney]);

    const generateBracket = async () => {
        try {
            await api.post(`/brackets/generate/${selectedTourney}`);
            toast.success('Bracket Architecture Synchronized!');
            const mRes = await api.get(`/matches?tournament_id=${selectedTourney}`);
            setMatches(mRes.data);
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed generation.'); }
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if (!formDate || !formVenue) return toast.error("All parameters required.");
        try {
            await api.patch(`/matches/${scheduleModal.id}/schedule`, { scheduled_at: formDate, venue: formVenue });
            toast.success("Chronology updated.");
            setMatches(matches.map(m => m.id === scheduleModal.id ? {...m, scheduled_at: formDate, venue: formVenue} : m));
            setScheduleModal(null);
        } catch (err) { toast.error(err.response?.data?.detail || 'Scheduling Error'); }
    };

    const handleStatus = async (id, status) => {
        try {
            await api.patch(`/matches/${id}/status`, { status });
            toast.success(`Operational phase: ${status}`);
            setMatches(matches.map(m => m.id === id ? {...m, status} : m));
        } catch (err) { toast.error(err.response?.data?.detail || 'Transition Rejected.'); }
    };

    const handleResultSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/results', { match_id: resultModal.id, score_team_a: scoreA, score_team_b: scoreB });
            toast.success("Result captured! Ranking logic engaged.");
            handleStatus(resultModal.id, 'completed');
            setResultModal(null);
        } catch (err) { toast.error(err.response?.data?.detail || 'Submission Failed'); }
    };

    return (
        <div className="space-y-10 animate-fade-in-up relative">
            <div className="glass p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-inner">
                            <Swords className="text-rose-400" size={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">Bracket Matrix</h1>
                            <p className="text-slate-400 font-medium">Orchestrate match chronology and result commitments.</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <select 
                                className="w-full sm:w-64 pl-12 pr-6 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-rose-500/50 transition-all appearance-none cursor-pointer" 
                                value={selectedTourney} 
                                onChange={e => setSelectedTourney(e.target.value)}
                            >
                                <option value="">Target Domain...</option>
                                {tournaments.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                            </select>
                        </div>
                        {selectedTourney && (
                            <button onClick={generateBracket} className="flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-rose-500/20 transition-all">
                                <Zap size={20}/> Synthesize
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6 pb-20">
                {loading ? (
                    <div className="flex justify-center p-20 text-rose-500 animate-pulse"><Loader2 size={48} className="animate-spin" /></div>
                ) : matches.length === 0 ? (
                    <div className="glass-card rounded-[2.5rem] p-24 text-center border-dashed border-2 border-slate-800 flex flex-col items-center justify-center">
                        <Zap className="text-slate-700 mb-6" size={48} />
                        <h3 className="text-2xl font-bold text-slate-300 mb-2">No Geometry Found</h3>
                        <p className="text-slate-500 max-w-sm">Initialize bracket synthesis to generate match nodes for this domain.</p>
                    </div>
                ) : matches.map(m => (
                    <div key={m.id} className="group glass-card rounded-[2rem] p-8 border border-white/5 hover:border-rose-500/30 transition-all duration-500">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                            <div className="flex-1 text-center lg:text-left">
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] mb-2 block">Team Alpha</span>
                                <h4 className="text-3xl font-black text-white group-hover:text-rose-400 transition-colors tracking-tight">{teams[m.team_a_id] || `NODE_${m.team_a_id}`}</h4>
                            </div>
                            
                            <div className="flex flex-col items-center px-10 border-x border-white/5 py-2">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border ${
                                    m.status === 'live' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' :
                                    m.status === 'completed' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {m.status}
                                </div>
                                <div className="text-5xl font-black text-white flex items-center gap-6">
                                    0 <span className="text-slate-800 text-xl font-bold italic">VS</span> 0
                                </div>
                                <div className="mt-4 flex flex-col items-center text-slate-600 font-mono text-[10px] uppercase font-bold tracking-widest leading-loose">
                                    <div className="flex items-center gap-2 font-black text-slate-400"><Calendar size={12} className="text-rose-500"/> {m.scheduled_at ? new Date(m.scheduled_at).toLocaleString() : 'CHRONOLOGY_PENDING'}</div>
                                    <div className="flex items-center gap-2"><MapPin size={12} className="text-rose-500"/> {m.venue || 'COORD_TBA'}</div>
                                </div>
                            </div>

                            <div className="flex-1 text-center lg:text-right">
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] mb-2 block">Team Beta</span>
                                <h4 className="text-3xl font-black text-white group-hover:text-rose-400 transition-colors tracking-tight">{teams[m.team_b_id] || `NODE_${m.team_b_id}`}</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 pt-10 border-t border-white/5">
                            <button onClick={() => { setScheduleModal(m); setFormDate(m.scheduled_at ? m.scheduled_at.slice(0, 19) : ''); setFormVenue(m.venue || ''); }} className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5">
                                <Calendar size={18}/> Set Chronology
                            </button>
                            <div className="relative">
                                <select className="w-full h-full px-10 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5 appearance-none cursor-pointer text-center outline-none" value={m.status} onChange={e => handleStatus(m.id, e.target.value)}>
                                    <option value="scheduled">Phase: Scheduled</option>
                                    <option value="live">Phase: Live Action</option>
                                    <option value="completed">Phase: Completed</option>
                                </select>
                                <PlayCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                            </div>
                            <button onClick={() => { setResultModal(m); setScoreA(0); setScoreB(0); }} className="flex items-center justify-center gap-3 px-6 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-2xl font-black transition-all border border-rose-500/20 shadow-lg shadow-rose-500/10">
                                <CheckCircle size={18}/> Commit Result
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Schedule Modal */}
            {scheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setScheduleModal(null)}></div>
                    <div className="relative w-full max-w-xl glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl animate-scale-in">
                        <button onClick={() => setScheduleModal(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
                        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Calendar className="text-rose-500"/> Chronology Map</h2>
                        <p className="text-slate-400 mb-8 font-medium">Define the spatial and temporal nodes for this encounter.</p>
                        
                        <form onSubmit={handleScheduleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-mono font-black text-slate-500 tracking-widest pl-2">Temporal Node (Date/Time)</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        placeholder="2026-04-25T10:00:00"
                                        className="w-full p-4 pr-16 bg-slate-900 border border-white/10 rounded-2xl text-white font-mono font-bold outline-none focus:border-rose-500/50"
                                        value={formDate}
                                        onChange={e => setFormDate(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-rose-500 text-slate-400 hover:text-white rounded-xl transition-all"
                                    >
                                        <Calendar size={20} />
                                    </button>

                                    {showCalendar && (
                                        <div ref={calendarRef} className="absolute right-0 top-full mt-4 z-[60]">
                                            <SportyCalendar 
                                                value={formDate} 
                                                onChange={setFormDate} 
                                                onClose={() => setShowCalendar(false)} 
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono mt-1 pl-2 tracking-tighter uppercase font-black">Manual entry or use the custom matrix calendar</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-mono font-black text-slate-500 tracking-widest pl-2">Spatial Coordinate (Venue)</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter physical location..."
                                    className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-rose-500/50"
                                    value={formVenue}
                                    onChange={e => setFormVenue(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3">
                                <Save size={20}/> Synchronize Schedule
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Result Modal */}
            {resultModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setResultModal(null)}></div>
                    <div className="relative w-full max-w-2xl glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl animate-scale-in">
                        <button onClick={() => setResultModal(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
                        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Trophy className="text-rose-500"/> Final Commitment</h2>
                        <p className="text-slate-400 mb-10 font-medium">Verify and lock internal scores to recalculate the circuit rankings.</p>
                        
                        <form onSubmit={handleResultSubmit} className="space-y-10">
                            <div className="flex items-center gap-8 text-center">
                                <div className="flex-1 space-y-4">
                                    <div className="text-sm font-mono text-slate-500 uppercase tracking-widest">{teams[resultModal.team_a_id]}</div>
                                    <input 
                                        type="number" 
                                        className="w-full p-6 bg-slate-900 border border-white/10 rounded-3xl text-white text-5xl font-black text-center outline-none focus:border-rose-500"
                                        value={scoreA}
                                        onChange={e => setScoreA(parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="text-3xl font-black text-slate-700 mt-8 italic">VS</div>
                                <div className="flex-1 space-y-4">
                                    <div className="text-sm font-mono text-slate-500 uppercase tracking-widest">{teams[resultModal.team_b_id]}</div>
                                    <input 
                                        type="number" 
                                        className="w-full p-6 bg-slate-900 border border-white/10 rounded-3xl text-white text-5xl font-black text-center outline-none focus:border-rose-500"
                                        value={scoreB}
                                        onChange={e => setScoreB(parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full py-6 bg-rose-500 text-white font-black rounded-[2rem] hover:bg-rose-400 transition-all shadow-2xl shadow-rose-500/20 flex items-center justify-center gap-4 text-xl">
                                <Activity size={24}/> Commit Final Scores
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMatches;
