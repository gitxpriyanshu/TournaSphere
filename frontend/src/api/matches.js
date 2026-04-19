import api from '../api';
export const getMatches = async (tournamentId) => api.get(`/matches?tournament_id=${tournamentId}`);
export const generateBracket = async (tournamentId) => api.post(`/brackets/generate/${tournamentId}`);
export const updateSchedule = async (id, data) => api.patch(`/matches/${id}/schedule`, data);
export const updateMatchStatus = async (id, status) => api.patch(`/matches/${id}/status`, { status });
