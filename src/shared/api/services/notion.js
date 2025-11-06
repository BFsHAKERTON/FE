// @ts-check
/**
 * @typedef {object} NotionDatabaseRequest
 * @property {string} parentPageId
 * @property {string} title
 */
/**
 * @typedef {object} NotionDatabaseResponse
 * @property {string} databaseId
 * @property {string} databaseUrl
 */
/**
 * @typedef {object} NotionPageRequest
 * @property {object} properties
 * @property {object[]} [content]
 */
/**
 * @typedef {object} NotionPageResponse
 * @property {string} pageId
 * @property {string} pageUrl
 */
import { http, SERVER_BASE, API_PREFIX } from '../index';

/**
 * @param {string} [redirect]
 * @returns {string}
 */
export function getNotionAuthUrl(redirect) {
	const base = `${SERVER_BASE}/auth/notion/login`;
	if (!redirect) return base;
	return `${base}?redirect=${encodeURIComponent(redirect)}`;
}

/** @returns {Promise<any>} */
export function getMe() {
	return http.get('/notion/me');
}

/** @returns {Promise<any>} */
export function ensureDatabase(payload) {
	return http.post('/notion/databases/ensure', { body: payload });
}

/** @returns {Promise<any>} */
export function createRow(payload) {
	return http.post('/notion/rows', { body: payload });
}

// Spec-compliant endpoints
/**
 * @param {NotionDatabaseRequest} payload
 * @returns {Promise<NotionDatabaseResponse>}
 */
export function createDatabase(payload) {
	return http.post(`${API_PREFIX}/notion/databases`, { body: payload });
}

/**
 * @param {string} databaseId
 * @param {NotionPageRequest} payload
 * @returns {Promise<NotionPageResponse>}
 */
export function createDatabasePage(databaseId, payload) {
	return http.post(`${API_PREFIX}/notion/databases/${databaseId}/pages`, { body: payload });
}


