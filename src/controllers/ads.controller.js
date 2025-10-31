import { query } from '../config/db.js';

export async function listAds(req, res) {
  const rows = await query('SELECT * FROM ads ORDER BY created_at DESC LIMIT 200');
  res.json(rows);
}

export async function getAd(req, res) {
  const { id } = req.params;
  const rows = await query('SELECT * FROM ads WHERE id=?', [id]);
  if (!rows.length) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
}

export async function createAd(req, res) {
  const { title, description, image_url, link_url, position, active } = req.body;
  if (!title) return res.status(400).json({ message: 'title required' });
  const result = await query(
    'INSERT INTO ads (title, description, image_url, link_url, position, active) VALUES (?,?,?,?,?,?)',
    [title, description || null, image_url || null, link_url || null, position || 'sidebar', active ? 1 : 1]
  );
  res.status(201).json({ id: result.insertId });
}

export async function updateAd(req, res) {
  const { id } = req.params;
  const { title, description, image_url, link_url, position, active } = req.body;
  await query(
    `UPDATE ads SET 
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      position = COALESCE(?, position),
      active = COALESCE(?, active)
    WHERE id=?`,
    [title || null, description || null, image_url || null, link_url || null, position || null, typeof active === 'boolean' ? (active ? 1 : 0) : null, id]
  );
  res.json({ message: 'updated' });
}

export async function deleteAd(req, res) {
  const { id } = req.params;
  await query('DELETE FROM ads WHERE id=?', [id]);
  res.json({ message: 'deleted' });
}
