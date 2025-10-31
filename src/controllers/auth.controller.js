import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

// Helper function to check if email is allowed
function isEmailAllowed(email) {
  const allowedUsers = process.env.ALLOWED_USERS || '';
  const allowedEmails = allowedUsers.split(',').map(e => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase());
}

export async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  if (!isEmailAllowed(email)) return res.status(403).json({ message: 'Access denied. Registration is restricted to authorized users only.' });
  const exists = await query('SELECT id FROM users WHERE email=?', [email]);
  if (exists.length) return res.status(409).json({ message: 'User already exists' });
  const hash = await bcrypt.hash(password, 10);
  await query('INSERT INTO users (email, password_hash) VALUES (?,?)', [email, hash]);
  return res.status(201).json({ message: 'Admin created' });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  if (!isEmailAllowed(email)) return res.status(403).json({ message: 'Access denied. Login is restricted to authorized users only.' });
  const rows = await query('SELECT id, password_hash FROM users WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  return res.json({ token, user: { id: user.id, email } });
}
