import api from '../api';
export const getPlayers = async (teamId) => api.get(`/players?team_id=${teamId}`);
export const addPlayer = async (data) => api.post('/players', data);
export const removePlayer = async (id) => api.delete(`/players/${id}`);
