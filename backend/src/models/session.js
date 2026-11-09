import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';

const SESSION_MS = env.sessionDays * 24 * 60 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');

  // Opportunistic cleanup keeps the table small without a background job.
  await pool.execute('DELETE FROM sessions WHERE expires_at < UTC_TIMESTAMP()');
  await pool.execute(
    `INSERT INTO sessions (token_hash, user_id, expires_at)
     VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ${env.sessionDays} DAY))`,
    [hashToken(token), userId]
  );

  return { token, maxAge: SESSION_MS };
}

/** Returns { user } for a valid, unexpired token, otherwise null. */
export async function findSession(token) {
  if (!token || typeof token !== 'string') return null;

  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, s.expires_at AS expiresAt
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?
     LIMIT 1`,
    [hashToken(token)]
  );

  const row = rows[0];
  if (!row) return null;

  if (new Date(row.expiresAt).getTime() <= Date.now()) {
    await deleteSession(token);
    return null;
  }

  return { user: { id: row.id, name: row.name, email: row.email } };
}

export async function deleteSession(token) {
  if (!token) return;
  await pool.execute('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
}
