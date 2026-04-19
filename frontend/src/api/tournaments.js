import api from '../api';
export const getTournaments = async () => api.get('/tournaments');
export const getTournamentById = async (id) => api.get(`/tournaments/${id}`);
export const createTournament = async (data) => api.post('/tournaments', data);
export const updateTournamentStatus = async (id, status) => api.patch(`/tournaments/${id}/status`, { status });
export const deleteTournament = async (id) => api.delete(`/tournaments/${id}`);
