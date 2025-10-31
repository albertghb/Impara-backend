import { query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';

export async function listArticles(req, res) {
  const rows = await query('SELECT * FROM articles ORDER BY created_at DESC LIMIT 200');
  res.json(rows);
}

export async function getArticle(req, res) {
  const { id } = req.params;
  const rows = await query('SELECT * FROM articles WHERE id=?', [id]);
  if (!rows.length) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
}

export async function createArticle(req, res) {
  const { title, excerpt, content, image_url, category, is_breaking, published_at } = req.body;
  if (!title) return res.status(400).json({ message: 'title required' });
  const slug = slugify(title);
  const result = await query(
    'INSERT INTO articles (title, slug, excerpt, content, image_url, category, is_breaking, published_at) VALUES (?,?,?,?,?,?,?,?)',
    [title, slug, excerpt || null, content || null, image_url || null, category || null, is_breaking ? 1 : 0, published_at || null]
  );
  res.status(201).json({ id: result.insertId, slug });
}

export async function updateArticle(req, res) {
  const { id } = req.params;
  const { title, excerpt, content, image_url, category, is_breaking, published_at } = req.body;
  const existing = await query('SELECT id FROM articles WHERE id=?', [id]);
  if (!existing.length) return res.status(404).json({ message: 'Not found' });
  const slug = title ? slugify(title) : undefined;
  await query(
    `UPDATE articles SET 
      title = COALESCE(?, title),
      slug = COALESCE(?, slug),
      excerpt = COALESCE(?, excerpt),
      content = COALESCE(?, content),
      image_url = COALESCE(?, image_url),
      category = COALESCE(?, category),
      is_breaking = COALESCE(?, is_breaking),
      published_at = COALESCE(?, published_at)
    WHERE id=?`,
    [title || null, slug || null, excerpt || null, content || null, image_url || null, category || null, typeof is_breaking === 'boolean' ? (is_breaking ? 1 : 0) : null, published_at || null, id]
  );
  res.json({ message: 'updated' });
}

export async function deleteArticle(req, res) {
  const { id } = req.params;
  await query('DELETE FROM articles WHERE id=?', [id]);
  res.json({ message: 'deleted' });
}

export async function toggleBreaking(req, res) {
  const { id } = req.params;
  const { is_breaking } = req.body;
  await query('UPDATE articles SET is_breaking=? WHERE id=?', [is_breaking ? 1 : 0, id]);
  res.json({ message: 'breaking updated' });
}
