import api from '../api';
export const getTeams = async (tournamentId) => api.get(`/teams?tournament_id=${tournamentId}`);
export const createTeam = async (data) => api.post('/teams', data);
export const updateTeamStatus = async (id, status) => api.patch(`/teams/${id}/status`, { status });
