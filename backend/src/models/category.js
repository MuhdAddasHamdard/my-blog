import { pool } from '../db/pool.js';

export async function listCategories() {
  const [rows] = await pool.query(
    `SELECT c.id, c.name, c.slug, COUNT(p.id) AS postCount
     FROM categories c
     LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
     GROUP BY c.id, c.name, c.slug
     ORDER BY c.name ASC`
  );

  return rows.map((row) => ({ ...row, postCount: Number(row.postCount) }));
}

export async function findCategoryById(id) {
  const [rows] = await pool.execute('SELECT id, name, slug FROM categories WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
}
