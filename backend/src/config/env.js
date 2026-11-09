import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Always load backend/.env, regardless of the directory the process starts in.
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

function integer(value, fallback, name) {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative integer. Received "${value}".`);
  }
  return parsed;
}

function required(key) {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `Missing required environment variable ${key}. Copy backend/.env.example to backend/.env and fill it in.`
    );
  }
  return value.trim();
}

const port = integer(process.env.PORT, 4000, 'PORT');
if (port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');

const sessionDays = integer(process.env.SESSION_DAYS, 7, 'SESSION_DAYS');
if (sessionDays < 1) throw new Error('SESSION_DAYS must be at least 1.');

const dbPassword = process.env.DB_PASSWORD ?? '';

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  port,
  db: Object.freeze({
    host: process.env.DB_HOST?.trim() || '127.0.0.1',
    port: integer(process.env.DB_PORT, 3306, 'DB_PORT'),
    user: required('DB_USER'),
    password: dbPassword,
    database: required('DB_NAME'),
  }),
  sessionCookieName: process.env.SESSION_COOKIE_NAME?.trim() || 'draft_sid',
  sessionDays,
  trustProxy: process.env.TRUST_PROXY === '1',
  admin: Object.freeze({
    name: process.env.ADMIN_NAME?.trim() || 'Draft Editor',
    email: process.env.ADMIN_EMAIL?.trim() || '',
    password: process.env.ADMIN_PASSWORD || '',
  }),
});
