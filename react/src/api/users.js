import { instance } from './axios';

/**
 * Users API helpers
 *
 * Endpoints (from server/src/api_schema.yaml):
 * - GET    /api/users/me
 * - PATCH  /api/users/me
 * - GET    /api/users/{id}
 * - GET    /api/users/{id}/posts
 */

/**
 * @typedef {Object} UserPublic
 * @property {string} id
 * @property {string} email
 * @property {string} displayName
 * @property {string} createdAt ISO date-time
 * @property {string} updatedAt ISO date-time
 */

/**
 * @typedef {Object} ProfileMe
 * @property {string} id
 * @property {string} email
 * @property {string} displayName
 * @property {string} [bio]
 * @property {string} [avatarBase64]
 * @property {string} createdAt ISO date-time
 * @property {string} updatedAt ISO date-time
 */

/**
 * @typedef {Object} ProfilePublic
 * @property {string} id
 * @property {string} displayName
 * @property {string} [bio]
 * @property {string} [avatarBase64]
 * @property {string} createdAt ISO date-time
 * @property {string} updatedAt ISO date-time
 */

/**
 * @typedef {Object} UpdateMeRequest
 * @property {string} [displayName]
 * @property {string} [bio]
 * @property {string} [avatarBase64] Base64 image (<= 1MB)
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} message
 * @property {any} [details]
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {UserPublic} author
 * @property {string} text
 * @property {string|null} [imageBase64]
 * @property {string} createdAt ISO date-time
 * @property {string} updatedAt ISO date-time
 */

/**
 * @typedef {Object} PostsListResponse
 * @property {boolean} success
 * @property {Post[]} posts
 * @property {string|null} [nextCursor]
 */

/**
 * Get current user profile
 * GET /api/users/me
 * Security: Bearer
 *
 * Response 200: { success: true, user: ProfileMe }
 * Response 401|500: ErrorResponse
 *
 * @returns {Promise<{ success: boolean; user: ProfileMe } | ErrorResponse | undefined>}
 */
export async function getMe() {
  try {
    const res = await instance.get('/api/users/me');
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

/**
 * Update current user profile
 * PATCH /api/users/me
 * Security: Bearer
 *
 * Body: UpdateMeRequest
 * Response 200: { success: true, user: ProfileMe }
 * Response 400|401|500: ErrorResponse
 *
 * @param {UpdateMeRequest} payload
 * @returns {Promise<{ success: boolean; user: ProfileMe } | ErrorResponse | undefined>}
 */
export async function updateMe(payload) {
  try {
    const res = await instance.patch('/api/users/me', payload);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

/**
 * Get public profile by id
 * GET /api/users/{id}
 *
 * Response 200: { success: true, user: ProfilePublic }
 * Response 404|500: ErrorResponse
 *
 * @param {string} id User id
 * @returns {Promise<{ success: boolean; user: ProfilePublic } | ErrorResponse | undefined>}
 */
export async function getById(id) {
  try {
    const res = await instance.get(`/api/users/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

/**
 * List posts by user id (public)
 * GET /api/users/{id}/posts
 *
 * Query params:
 * - cursor?: string (ISO date-time)
 * - limit?: number (1..50, default 10)
 *
 * Response 200: PostsListResponse
 * Response 400|500: ErrorResponse
 *
 * @param {string} id User id
 * @param {{ cursor?: string; limit?: number }} [params]
 * @returns {Promise<PostsListResponse | ErrorResponse | undefined>}
 */
export async function listUserPosts(id, params) {
  try {
    const res = await instance.get(`/api/users/${id}/posts`, { params });
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

export default {
  getMe,
  updateMe,
  getById,
  listUserPosts,
};
