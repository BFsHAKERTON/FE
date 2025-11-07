// @ts-check
/**
 * @typedef {object} DateRange
 * @property {string} start ISO date-time
 * @property {string} end ISO date-time
 */
/**
 * @typedef {object} TagStatItem
 * @property {string} tagId
 * @property {string} tagName
 * @property {number} count
 */
/**
 * @typedef {object} TagStatListResponse
 * @property {DateRange} range
 * @property {TagStatItem[]} items
 */
/**
 * @typedef {object} RegionDistributionItem
 * @property {string} city
 * @property {number} count
 * @property {number} [ratio]
 */
/**
 * @typedef {object} RegionDistributionResponse
 * @property {DateRange} range
 * @property {number} total
 * @property {RegionDistributionItem[]} items
 */
/**
 * @typedef {object} InquiryRawItem
 * @property {string} inquiryId
 * @property {string} createdAt
 * @property {string} tagId
 * @property {string} tagName
 * @property {string} [customerCity]
 * @property {string} [customerGrade]
 * @property {string} [channelTalkUserId]
 */
/**
 * @typedef {object} InquiryRawResponse
 * @property {DateRange} range
 * @property {InquiryRawItem[]} items
 */
/**
 * @typedef {object} InquirySummaryResponse
 * @property {DateRange} range
 * @property {number} totalInquiries
 */
import { http, API_PREFIX } from '../index';

/**
 * 이번 주 인기 태그 조회
 * @param {{ limit?: number }} [params]
 * @returns {Promise<TagStatListResponse>}
 */
export function getTopWeeklyTags({ limit } = {}) {
    return http.get(`${API_PREFIX}/stats/tags/top-weekly`, { query: { limit } });
}


/**
 * 기간별 태그별 문의 수
 * @param {{ start?: string, end?: string }} [params]
 * @returns {Promise<TagStatListResponse>}
 */
export function getTagsMonthly({ start, end } = {}) {
    return http.get(`${API_PREFIX}/stats/tags/monthly`, { query: { start, end } });
}

/**
 * 기간별 고객 지역 분포
 * @param {{ start?: string, end?: string }} [params]
 * @returns {Promise<RegionDistributionResponse>}
 */
export function getCustomerRegionDistribution({ start, end } = {}) {
    return http.get(`${API_PREFIX}/stats/customers/regions`, { query: { start, end } });
}

/**
 * 다차원 분석용 원자료
 * @param {{ start?: string, end?: string, limit?: number }} [params]
 * @returns {Promise<InquiryRawResponse>}
 */
export function getInquiriesRaw({ start, end, limit } = {}) {
    return http.get(`${API_PREFIX}/stats/inquiries/raw`, { query: { start, end, limit } });
}

/**
 * 문의 요약 지표
 * @param {{ start?: string, end?: string }} [params]
 * @returns {Promise<InquirySummaryResponse>}
 */
export function getInquiriesSummary({ start, end } = {}) {
    return http.get(`${API_PREFIX}/stats/inquiries/summary`, { query: { start, end } });
}


