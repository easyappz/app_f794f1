import { instance } from './axios';

/**
 * Posts API helpers
 *
 * Endpoints (from server/src/api_schema.yaml):
 * - GET  /api/posts
 * - POST /api/posts
 */

/**
 * @typedef {Object} UserPublic
 * @property {string} id
 * @property {string} email
 * @property {string} displayName
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {UserPublic} author
 * @property {string} text
 * @property {string|null} [imageBase64]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} CreatePostRequest
 * @property {string} text 1..500 chars
 * @property {string} [imageBase64] Base64 image (<= 1MB)
 */

/**
 * @typedef {Object} PostsListResponse
 * @property {boolean} success
 * @property {Post[]} posts
 * @property {string|null} [nextCursor]
 */

/**
 * @typedef {Object} CreatePostResponse
 * @property {boolean} success
 * @property {Post} post
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} message
 * @property {any} [details]
 */

/**
 * List public feed (cursor pagination)
 * GET /api/posts
 *
 * Query params:
 * - cursor?: string (ISO date-time)
 * - limit?: number (1..50, default 10)
 *
 * Response 200: PostsListResponse
 * Response 400|500: ErrorResponse
 *
 * @param {{ cursor?: string; limit?: number }} [params]
 * @returns {Promise<PostsListResponse | ErrorResponse | undefined>}
 */
export async function listFeed(params) {
  try {
    const res = await instance.get('/api/posts', { params });
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

/**
 * Create a new post
 * POST /api/posts
 * Security: Bearer
 *
 * Body: CreatePostRequest
 * Response 201: CreatePostResponse
 * Response 400|401|500: ErrorResponse
 *
 * @param {CreatePostRequest} payload
 * @returns {Promise<CreatePostResponse | ErrorResponse | undefined>}
 */
export async function createPost(payload) {
  try {
    const res = await instance.post('/api/posts', payload);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

export default {
  listFeed,
  createPost,
};
