import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { pool } from './pool.js';

export async function createAdmin({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);
  await pool.execute(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)`,
    [name, email.toLowerCase(), passwordHash]
  );

  const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE email = ? LIMIT 1', [
    email.toLowerCase(),
  ]);
  return rows[0];
}

async function main() {
  const name = env.admin.name;
  const email = env.admin.email;
  const password = env.admin.password;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Set ADMIN_EMAIL to a valid email address in backend/.env.');
  }
  if (!password || password.length < 10) {
    throw new Error('Set ADMIN_PASSWORD to at least 10 characters in backend/.env.');
  }

  const user = await createAdmin({ name, email, password });
  console.log(`Admin ready: ${user.name} <${user.email}> (id ${user.id}).`);
  console.log('Password was hashed with bcrypt and is never stored in plain text.');
  await pool.end();
}

main().catch(async (error) => {
  console.error('Could not create admin:', error.message);
  process.exitCode = 1;
  try {
    await pool.end();
  } catch {
    /* ignore */
  }
});
