// @ts-check
/** @typedef {string[]} TagsArray */
import { http, API_PREFIX } from '../index';

/** @returns {Promise<TagsArray>} */
export function getTagsConfig() {
	return http.get(`${API_PREFIX}/tags/config`);
}

/**
 * @param {string[]} tags
 * @returns {Promise<TagsArray>}
 */
export function updateTagsConfig(tags) {
	return http.put(`${API_PREFIX}/tags/config`, { body: { tags } });
}


