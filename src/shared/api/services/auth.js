// @ts-check
/**
 * @typedef {object} User
 * @property {string} userId
 * @property {string} email
 * @property {string} name
 */
/**
 * @typedef {object} AuthTokens
 * @property {string} accessToken
 * @property {string} refreshToken
 */
import { http, SERVER_BASE, API_PREFIX } from '../index';

/** @returns {Promise<User>} */
export function fetchMe() {
	return http.get(`${API_PREFIX}/auth/me`);
}

/** @returns {string} */
export function getKakaoLoginUrl() {
    return `${SERVER_BASE}${API_PREFIX}/auth/kakao`;
}

/**
 * @param {string} [redirectUri]
 * @returns {void}
 */
export function startKakaoLogin(redirectUri) {
	if (typeof window !== 'undefined') {
		let url = getKakaoLoginUrl();
		if (redirectUri) {
			const u = new URL(url);
			u.searchParams.set('redirectUri', redirectUri);
			url = u.toString();
		}
		window.location.href = url;
	}
}

/**
 * @param {{ email?: string, password?: string }} [credentials]
 * @returns {Promise<AuthTokens>}
 */
export function mockLogin(credentials) {
	if (!credentials || Object.keys(credentials).length === 0) {
		return http.post(`${API_PREFIX}/auth/mock/login`);
	}
	return http.post(`${API_PREFIX}/auth/mock/login`, { body: credentials });
}

// NOTE: /auth/kakao/callback은 서버가 HTML을 반환하여 토큰 저장/리디렉션을 수행합니다.


