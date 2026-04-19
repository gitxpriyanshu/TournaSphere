import api from '../api';
export const recordResult = async (data) => api.post('/results', data);
export const getResult = async (matchId) => api.get(`/results/${matchId}`);
