import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const migrationsDir = fileURLToPath(new URL('./migrations/', import.meta.url));

async function main() {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
    timezone: 'Z',
  });

  try {
    await connection.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) NOT NULL,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (name)
      ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4`
    );

    const [appliedRows] = await connection.query('SELECT name FROM schema_migrations');
    const applied = new Set(appliedRows.map((row) => row.name));

    const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();
    if (files.length === 0) {
      console.log('No migration files found.');
      return;
    }

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`skip   ${file}`);
        continue;
      }
      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      console.log(`apply  ${file}`);
      await connection.query(sql);
      await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
      count += 1;
    }

    console.log(count === 0 ? 'Database is already up to date.' : `Applied ${count} migration(s).`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
});
