import { pool } from '../db/pool.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash AS passwordHash
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email.toLowerCase()]
  );
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
}

export async function countUsers() {
  const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM users');
  return Number(rows[0].total);
}
