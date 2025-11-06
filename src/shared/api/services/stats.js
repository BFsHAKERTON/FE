// @ts-check
/**
 * @typedef {object} KeywordStat
 * @property {string} keyword
 * @property {number} count
 */
/**
 * @typedef {object} HourlyStat
 * @property {number} hour
 * @property {number} count
 */
/**
 * @typedef {object} TotalStatsResponse
 * @property {number} totalCount
 */
import { http, API_PREFIX } from '../index';

/**
 * @param {{ limit?: number }} [params]
 * @returns {Promise<KeywordStat[]>}
 */
export function getWeeklyKeywords({ limit } = {}) {
	return http.get(`${API_PREFIX}/stats/keywords/weekly`, { query: { limit } });
}

/** @returns {Promise<HourlyStat[]>} */
export function getHourlyInquiriesToday() {
	return http.get(`${API_PREFIX}/stats/inquiries/hourly-today`);
}

/** @returns {Promise<TotalStatsResponse>} */
export function getTotalInquiriesWeekly() {
	return http.get(`${API_PREFIX}/stats/inquiries/total-weekly`);
}


