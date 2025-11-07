// @ts-check
/**
 * @typedef {object} ChannelTalkRequest
 * @property {string} apiKey
 * @property {string} apiSecret
 */
/**
 * @typedef {object} ChannelTalkResponse
 * @property {boolean} success
 * @property {string} message
 */
/**
 * @typedef {object} NotionStatusResponse
 * @property {boolean} connected
 * @property {string} [workspaceName]
 * @property {string} [workspaceUrl]
 */
import { http, SERVER_BASE, API_PREFIX } from '../index';

/**
 * @param {ChannelTalkRequest} payload
 * @returns {Promise<ChannelTalkResponse>}
 */
export function registerChannelTalkKey(payload) {
	return http.post(`${API_PREFIX}/integrations/channel-talk`, { body: payload });
}

/** @returns {void} */
export function startNotionConnect() {
	if (typeof window !== 'undefined') {
		window.location.href = `${SERVER_BASE}${API_PREFIX}/integrations/notion/connect`;
	}
}

/**
 * @param {string} code
 * @returns {Promise<string>} HTML string returned by server
 */
export function notionCallbackExchange(code) {
	return http.get(`${API_PREFIX}/integrations/notion/callback`, { query: { code } });
}

/** @returns {Promise<NotionStatusResponse>} */
export function getNotionStatus() {
	return http.get(`${API_PREFIX}/integrations/notion/status`);
}

/** @returns {Promise<void>} */
export function disconnectNotion() {
	return http.delete(`${API_PREFIX}/integrations/notion`);
}


