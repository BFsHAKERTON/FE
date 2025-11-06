import { http, SERVER_BASE } from './api/index';

export { SERVER_BASE };

export async function apiGet(path) {
	return http.get(path);
}

export async function apiPost(path, body) {
	return http.post(path, { body });
}

