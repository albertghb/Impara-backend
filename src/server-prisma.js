import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import prisma from './config/prisma.js';

// Routes
import authRoutes from './routes/auth.prisma.js';
import articlesRoutes from './routes/articles.prisma.js';
import categoriesRoutes from './routes/categories.prisma.js';
import adsRoutes from './routes/ads.prisma.js';
import advertisementsRoutes from './routes/advertisements.prisma.js';
import auctionsRoutes from './routes/auctions.prisma.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware - CORS Configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variable or use defaults
    const corsOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const allowedOrigins = corsOrigins.split(',').map(o => o.trim());
    
    // Always allow localhost variants in development
    const devOrigins = [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:5173'
    ];
    
    const allAllowedOrigins = [...new Set([...allowedOrigins, ...devOrigins])];
    
    if (allAllowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Prisma API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/advertisements', advertisementsRoutes);
app.use('/api/auctions', auctionsRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Prisma connected to database');
    console.log(`✅ API running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
