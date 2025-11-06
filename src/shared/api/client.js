import axios from 'axios';

const SERVER_BASE = import.meta?.env?.VITE_SERVER_BASE || 'http://localhost:8080';

const client = axios.create({
	baseURL: SERVER_BASE,
	withCredentials: true,
});

client.interceptors.request.use((config) => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

client.interceptors.response.use(
	(response) => response,
	(error) => {
		const { response } = error || {};
		if (response) {
			const data = response.data;
			const message = (data && data.message) || (typeof data === 'string' ? data : error.message || 'Request failed');
			const err = new Error(message);
			err.status = response.status;
			err.data = data;
			if (response.status === 401 && typeof window !== 'undefined') {
				try { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); } catch {}
				if (window.location.pathname !== '/login') {
					window.location.href = '/login';
				}
			}
			return Promise.reject(err);
		}
		return Promise.reject(error);
	}
);

export { client, SERVER_BASE };


