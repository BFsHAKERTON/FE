// @ts-check
/**
 * @typedef {object} PaginationInfo
 * @property {number} currentPage
 * @property {number} totalCount
 * @property {number} totalPages
 */
/**
 * @typedef {object} InquirySummary
 * @property {string} inquiryId
 * @property {string} [userName]
 * @property {string[]} [tags]
 * @property {string} createdAt
 */
/**
 * @typedef {object} PaginatedInquiriesResponse
 * @property {PaginationInfo} pagination
 * @property {InquirySummary[]} data
 */
/**
 * @typedef {"NEW"|"IN_PROGRESS"|"DONE"} InquiryStatus
 */
/**
 * @typedef {object} InquiryCreateRequest
 * @property {string} title
 * @property {string[]} [tagIds]
 * @property {InquiryStatus} [status]
 * @property {string} requesterId
 * @property {string[]} [assigneeIds]
 * @property {string} [summary]
 * @property {string} [keyFeedback]
 * @property {string} [channelTalkUrl]
 * @property {string} [notionPageUrl]
 * @property {string[]} [departmentIds]
 * @property {ChatMessage[]} [chatMessages]
 */
/**
 * @typedef {object} InquiryResponse
 * @property {string} inquiryId
 * @property {string} title
 * @property {string[]} [tagIds]
 * @property {InquiryStatus} [status]
 * @property {string} requesterId
 * @property {string[]} [assigneeIds]
 * @property {string} [summary]
 * @property {string} [keyFeedback]
 * @property {string} [channelTalkUrl]
 * @property {string} [notionPageUrl]
 * @property {string[]} [departmentIds]
 * @property {string} [createdAt]
 */
/**
 * @typedef {object} ChatMessage
 * @property {"user"|"agent"|"system"} sender
 * @property {string} message
 * @property {string} timestamp
 */
/**
 * @typedef {object} InquiryDetail
 * @property {string} inquiryId
 * @property {string} [userName]
 * @property {string[]} [tags]
 * @property {string} createdAt
 * @property {string} [notionPageUrl]
 * @property {ChatMessage[]} [chatHistory]
 */
import { http, API_PREFIX } from '../index';

/**
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<PaginatedInquiriesResponse>}
 */
export function listInquiries({ page, limit } = {}) {
	return http.get(`${API_PREFIX}/inquiries`, { query: { page, limit } });
}

/**
 * @param {InquiryCreateRequest} payload
 * @returns {Promise<InquiryResponse>}
 */
export function createInquiry(payload) {
	return http.post(`${API_PREFIX}/inquiries`, { body: payload });
}

/**
 * @param {string} inquiryId
 * @returns {Promise<InquiryDetail>}
 */
export function getInquiry(inquiryId) {
	return http.get(`${API_PREFIX}/inquiries/${inquiryId}`);
}

/**
 * @typedef {object} ChatAnalysisRequest
 * @property {ChatMessage[]} chatMessages
 */
/**
 * @typedef {object} ChatAnalysisResponse
 * @property {string[]} department
 * @property {string} [generalSummary]
 * @property {string} summary
 * @property {string} [keyFeedback]
 */
/**
 * @param {ChatAnalysisRequest} payload
 * @returns {Promise<ChatAnalysisResponse>}
 */
export function analyzeChat(payload) {
    return http.post(`${API_PREFIX}/inquiries/analyze`, { body: payload });
}


