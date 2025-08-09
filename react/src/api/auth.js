import { instance } from './axios';

/**
 * Auth API helpers
 *
 * Endpoints (from server/src/api_schema.yaml):
 * - POST /api/auth/register
 * - POST /api/auth/login
 */

/**
 * @typedef {Object} UserPublic
 * @property {string} id
 * @property {string} email
 * @property {string} displayName
 * @property {string} createdAt ISO date-time string
 * @property {string} updatedAt ISO date-time string
 */

/**
 * @typedef {Object} AuthSuccess
 * @property {string} token JWT Bearer token
 * @property {UserPublic} user Public user info
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} message Error message
 * @property {any} [details] Optional additional details
 */

/**
 * Register a new user
 * POST /api/auth/register
 *
 * Request body:
 * - email: string (email)
 * - password: string (min 6)
 * - displayName: string
 *
 * Response 201: AuthSuccess
 * Response 400|409|500: ErrorResponse
 *
 * @param {{ email: string; password: string; displayName: string }} payload
 * @returns {Promise<AuthSuccess | ErrorResponse | undefined>}
 */
export async function register(payload) {
  try {
    const res = await instance.post('/api/auth/register', payload);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

/**
 * Login with email and password
 * POST /api/auth/login
 *
 * Request body:
 * - email: string (email)
 * - password: string (min 6)
 *
 * Response 200: AuthSuccess
 * Response 400|401|500: ErrorResponse
 *
 * @param {{ email: string; password: string }} payload
 * @returns {Promise<AuthSuccess | ErrorResponse | undefined>}
 */
export async function login(payload) {
  try {
    const res = await instance.post('/api/auth/login', payload);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

export default {
  register,
  login,
};
