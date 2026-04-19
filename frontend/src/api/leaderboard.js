import api from '../api';
export const getLeaderboard = async (tournamentId) => api.get(`/leaderboard/${tournamentId}`);
