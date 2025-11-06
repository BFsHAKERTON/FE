import { client, SERVER_BASE } from './client';
const RAW_API_PREFIX = import.meta?.env?.VITE_API_PREFIX || '';
const API_PREFIX = RAW_API_PREFIX ? (RAW_API_PREFIX.startsWith('/') ? RAW_API_PREFIX : `/${RAW_API_PREFIX}`) : '';

async function request(method, path, { query, headers, body } = {}) {
	const config = {
		method,
		url: path,
		params: query,
		headers: { ...(headers || {}) },
	};
	if (body !== undefined && body !== null) {
		if (body instanceof FormData || body instanceof Blob) {
			config.data = body;
		} else {
			config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
			config.data = body;
		}
	}
	const res = await client.request(config);
	return res.data;
}

export const http = {
	get: (path, options) => request('GET', path, options),
	post: (path, options) => request('POST', path, options),
	put: (path, options) => request('PUT', path, options),
	patch: (path, options) => request('PATCH', path, options),
	delete: (path, options) => request('DELETE', path, options),
};

export { SERVER_BASE, API_PREFIX };


