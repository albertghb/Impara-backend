import { query } from '../config/db.js';

export async function initDb() {
  console.log('Creating database tables...');
  
  // Users table - for admin authentication
  await query(`CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'author') DEFAULT 'admin',
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
  )`);
  console.log('✓ Users table ready');

  // Articles table - for news content
  await query(`CREATE TABLE IF NOT EXISTS articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content MEDIUMTEXT,
    image_url VARCHAR(512),
    category VARCHAR(100),
    tags VARCHAR(500),
    author_id INT,
    is_breaking TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    view_count INT DEFAULT 0,
    published_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_breaking (is_breaking),
    INDEX idx_featured (is_featured),
    INDEX idx_published (published_at),
    INDEX idx_slug (slug),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
  )`);
  console.log('✓ Articles table ready');

  // Ads table - for advertisements
  await query(`CREATE TABLE IF NOT EXISTS ads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(512),
    link_url VARCHAR(512),
    position ENUM('homepage_top','sidebar','inline','header','footer') DEFAULT 'sidebar',
    active TINYINT(1) DEFAULT 1,
    click_count INT DEFAULT 0,
    impression_count INT DEFAULT 0,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position),
    INDEX idx_active (active),
    INDEX idx_dates (start_date, end_date)
  )`);
  console.log('✓ Ads table ready');

  // Categories table - for organizing content
  await query(`CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (active)
  )`);
  console.log('✓ Categories table ready');

  // Comments table - for article comments (future feature)
  await query(`CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    approved TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_article (article_id),
    INDEX idx_approved (approved),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
  )`);
  console.log('✓ Comments table ready');

  // Newsletter subscribers table
  await query(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    active TINYINT(1) DEFAULT 1,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_active (active)
  )`);
  console.log('✓ Newsletter subscribers table ready');

  // Insert default categories if none exist
  const existingCategories = await query('SELECT id FROM categories LIMIT 1');
  if (existingCategories.length === 0) {
    const defaultCategories = [
      ['Politics', 'politics', 'Political news and analysis', '🏛️', 1],
      ['Economics', 'economics', 'Business and economic news', '💼', 2],
      ['Sports', 'sports', 'Sports news and updates', '⚽', 3],
      ['Health', 'health', 'Health and wellness news', '🏥', 4],
      ['Entertainment', 'entertainment', 'Entertainment and culture', '🎬', 5],
      ['Technology', 'technology', 'Tech news and innovations', '💻', 6],
      ['Education', 'education', 'Education news', '📚', 7],
      ['International', 'international', 'World news', '🌍', 8]
    ];
    
    for (const [name, slug, description, icon, order] of defaultCategories) {
      await query(
        'INSERT INTO categories (name, slug, description, icon, display_order) VALUES (?, ?, ?, ?, ?)',
        [name, slug, description, icon, order]
      );
    }
    console.log('✓ Default categories created');
  }

  // Check for admin users
  const admins = await query('SELECT id FROM users LIMIT 1');
  if (admins.length === 0) {
    console.log('⚠️  No admin users found. Create one via POST /api/auth/register');
    console.log('   Example: { "email": "admin@example.com", "password": "admin123" }');
  }

  console.log('✅ Database initialization complete!');
}
