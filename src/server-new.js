// Load environment variables FIRST - before anything else
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

console.log('='.repeat(50));
console.log('LOADING ENVIRONMENT');
console.log('='.repeat(50));
console.log('Looking for .env at:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Failed to load .env:', result.error.message);
  process.exit(1);
}

console.log('✅ .env loaded successfully');
console.log('DB_HOST:', process.env.DB_HOST || '(not set)');
console.log('DB_USER:', process.env.DB_USER || '(not set)');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '(set)' : '(empty)');
console.log('DB_NAME:', process.env.DB_NAME || '(not set)');
console.log('='.repeat(50));

// Now import everything else
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { initDb } from './utils/initDb.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', routes);

console.log('Initializing database...');
initDb().then(() => {
  console.log('✅ Database initialized successfully');
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`✅ API running on http://localhost:${PORT}`);
    console.log('='.repeat(50));
  });
}).catch((err) => {
  console.error('❌ Failed to init DB:', err.message);
  console.error('Error code:', err.code);
  console.error('Full error:', err);
  process.exit(1);
});
