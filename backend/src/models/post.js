import { pool } from '../db/pool.js';
import slugify from '../utils/slug.js';

const PUBLIC_COLUMNS = `
  p.id, p.title, p.slug, p.excerpt,
  p.cover_image_url AS coverImageUrl,
  p.published_at AS publishedAt,
  p.updated_at AS updatedAt,
  c.id AS categoryId,
  c.name AS categoryName,
  c.slug AS categorySlug,
  COALESCE(u.name, 'The Draft') AS authorName
`;

const ADMIN_COLUMNS = `
  ${PUBLIC_COLUMNS},
  p.body,
  p.status,
  p.created_at AS createdAt
`;

function escapeLike(value) {
  return value.replace(/[\\%_]/g, '\\$&');
}

/** pageSize is validated as an integer before it reaches this module. */
function limitClause(pageSize, page) {
  const size = Math.min(Math.max(Number(pageSize) || 9, 1), 50);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * size;
  return `LIMIT ${size} OFFSET ${offset}`;
}

export async function listPublished({ page = 1, pageSize = 9, q = '', categorySlug = '' } = {}) {
  const where = ["p.status = 'published'"];
  const params = [];

  if (q) {
    const like = `%${escapeLike(q)}%`;
    where.push('(p.title LIKE ? OR p.excerpt LIKE ?)');
    params.push(like, like);
  }
  if (categorySlug) {
    where.push('c.slug = ?');
    params.push(categorySlug);
  }

  const whereSql = where.join(' AND ');

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM posts p
     JOIN categories c ON c.id = p.category_id
     WHERE ${whereSql}`,
    params
  );

  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS}
     FROM posts p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN users u ON u.id = p.author_id
     WHERE ${whereSql}
     ORDER BY p.published_at DESC, p.id DESC
     ${limitClause(pageSize, page)}`,
    params
  );

  return { rows, total: Number(countRows[0].total) };
}

export async function findLatestPublished() {
  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS}
     FROM posts p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN users u ON u.id = p.author_id
     WHERE p.status = 'published'
     ORDER BY p.published_at DESC, p.id DESC
     LIMIT 1`
  );
  return rows[0] ?? null;
}

export async function findPublishedBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS}, p.body
     FROM posts p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN users u ON u.id = p.author_id
     WHERE p.slug = ? AND p.status = 'published'
     LIMIT 1`,
    [slug]
  );
  return rows[0] ?? null;
}

export async function listAll({ page = 1, pageSize = 10, status = 'all', q = '' } = {}) {
  const where = [];
  const params = [];

  if (status === 'draft' || status === 'published') {
    where.push('p.status = ?');
    params.push(status);
  }
  if (q) {
    const like = `%${escapeLike(q)}%`;
    where.push('(p.title LIKE ? OR p.excerpt LIKE ?)');
    params.push(like, like);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM posts p ${whereSql}`,
    params
  );

  const [rows] = await pool.execute(
    `SELECT ${ADMIN_COLUMNS}
     FROM posts p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN users u ON u.id = p.author_id
     ${whereSql}
     ORDER BY p.updated_at DESC, p.id DESC
     ${limitClause(pageSize, page)}`,
    params
  );

  return { rows, total: Number(countRows[0].total) };
}

export async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT ${ADMIN_COLUMNS}
     FROM posts p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN users u ON u.id = p.author_id
     WHERE p.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}

async function uniqueSlug(base) {
  let candidate = base;
  let counter = 2;
  // A handful of reads is plenty for a single-editor publication.
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const [rows] = await pool.execute('SELECT id FROM posts WHERE slug = ? LIMIT 1', [candidate]);
    if (rows.length === 0) return candidate;
    const suffix = `-${counter}`;
    candidate = `${base.slice(0, 80 - suffix.length).replace(/-+$/g, '')}${suffix}`;
    counter += 1;
  }
  return `${base.slice(0, 60)}-${Date.now().toString(36)}`;
}

export async function createPost({
  title,
  excerpt,
  body,
  coverImageUrl,
  categoryId,
  authorId,
  status = 'draft',
}) {
  const base = slugify(title);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const slug = attempt === 0 ? await uniqueSlug(base) : `${base.slice(0, 70)}-${Date.now().toString(36)}`;
    try {
      const [result] = await pool.execute(
        `INSERT INTO posts
          (title, slug, excerpt, body, cover_image_url, status, category_id, author_id, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, IF(? = 'published', UTC_TIMESTAMP(), NULL))`,
        [title, slug, excerpt, body, coverImageUrl, status, categoryId, authorId, status]
      );
      return findById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' && String(error.message).includes('uq_posts_slug')) {
        continue;
      }
      throw error;
    }
  }

  throw new Error('Could not generate a unique slug for this post.');
}

export async function updatePost(id, { title, excerpt, body, coverImageUrl, categoryId }) {
  const [result] = await pool.execute(
    `UPDATE posts
     SET title = ?, excerpt = ?, body = ?, cover_image_url = ?, category_id = ?, updated_at = UTC_TIMESTAMP()
     WHERE id = ?`,
    [title, excerpt, body, coverImageUrl, categoryId, id]
  );
  if (result.affectedRows === 0) return null;
  return findById(id);
}

export async function setPostStatus(id, status) {
  const sql =
    status === 'published'
      ? `UPDATE posts
         SET status = 'published',
             published_at = COALESCE(published_at, UTC_TIMESTAMP()),
             updated_at = UTC_TIMESTAMP()
         WHERE id = ?`
      : `UPDATE posts
         SET status = 'draft', updated_at = UTC_TIMESTAMP()
         WHERE id = ?`;

  const [result] = await pool.execute(sql, [id]);
  if (result.affectedRows === 0) return null;
  return findById(id);
}

export async function deletePost(id) {
  const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
