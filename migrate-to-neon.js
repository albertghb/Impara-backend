/**
 * Database Migration Helper Script
 * 
 * This script helps you migrate data from your local PostgreSQL database to Neon.
 * It exports data from your current database and provides instructions for importing.
 * 
 * Usage:
 * 1. Make sure your local DATABASE_URL is set in .env
 * 2. Run: node migrate-to-neon.js export
 * 3. Update DATABASE_URL to your Neon connection string
 * 4. Run: npm run prisma:push (to create tables)
 * 5. Run: node migrate-to-neon.js import
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const BACKUP_DIR = path.join(__dirname, 'database-backup');
const BACKUP_FILE = path.join(BACKUP_DIR, 'data-export.json');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Export all data from the current database
 */
async function exportData() {
  console.log('🔄 Starting database export...\n');
  
  try {
    // Fetch all data
    console.log('📦 Fetching users...');
    const users = await prisma.user.findMany();
    
    console.log('📦 Fetching categories...');
    const categories = await prisma.category.findMany();
    
    console.log('📦 Fetching articles...');
    const articles = await prisma.article.findMany();
    
    console.log('📦 Fetching ads...');
    const ads = await prisma.ad.findMany();
    
    console.log('📦 Fetching comments...');
    const comments = await prisma.comment.findMany();
    
    console.log('📦 Fetching newsletter subscribers...');
    const newsletterSubscribers = await prisma.newsletterSubscriber.findMany();
    
    console.log('📦 Fetching advertisements...');
    const advertisements = await prisma.advertisement.findMany();
    
    console.log('📦 Fetching auctions...');
    const auctions = await prisma.auction.findMany();
    
    console.log('📦 Fetching bids...');
    const bids = await prisma.bid.findMany();
    
    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      counts: {
        users: users.length,
        categories: categories.length,
        articles: articles.length,
        ads: ads.length,
        comments: comments.length,
        newsletterSubscribers: newsletterSubscribers.length,
        advertisements: advertisements.length,
        auctions: auctions.length,
        bids: bids.length,
      },
      data: {
        users,
        categories,
        articles,
        ads,
        comments,
        newsletterSubscribers,
        advertisements,
        auctions,
        bids,
      }
    };
    
    // Save to file
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(exportData, null, 2));
    
    console.log('\n✅ Export completed successfully!');
    console.log(`📁 Data saved to: ${BACKUP_FILE}`);
    console.log('\n📊 Export Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Articles: ${articles.length}`);
    console.log(`   - Ads: ${ads.length}`);
    console.log(`   - Comments: ${comments.length}`);
    console.log(`   - Newsletter Subscribers: ${newsletterSubscribers.length}`);
    console.log(`   - Advertisements: ${advertisements.length}`);
    console.log(`   - Auctions: ${auctions.length}`);
    console.log(`   - Bids: ${bids.length}`);
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Update DATABASE_URL in .env with your Neon connection string');
    console.log('   2. Run: npm run prisma:push');
    console.log('   3. Run: node migrate-to-neon.js import');
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Import data to the current database (should be Neon)
 */
async function importData() {
  console.log('🔄 Starting database import...\n');
  
  // Check if backup file exists
  if (!fs.existsSync(BACKUP_FILE)) {
    console.error('❌ No backup file found!');
    console.error(`   Expected file: ${BACKUP_FILE}`);
    console.error('   Please run "node migrate-to-neon.js export" first.');
    process.exit(1);
  }
  
  try {
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
    const { data } = backupData;
    
    console.log('📊 Import Summary:');
    console.log(`   - Export date: ${backupData.exportDate}`);
    console.log(`   - Users: ${data.users.length}`);
    console.log(`   - Categories: ${data.categories.length}`);
    console.log(`   - Articles: ${data.articles.length}`);
    console.log(`   - Ads: ${data.ads.length}`);
    console.log(`   - Comments: ${data.comments.length}`);
    console.log(`   - Newsletter Subscribers: ${data.newsletterSubscribers.length}`);
    console.log(`   - Advertisements: ${data.advertisements.length}`);
    console.log(`   - Auctions: ${data.auctions.length}`);
    console.log(`   - Bids: ${data.bids.length}`);
    console.log('');
    
    // Import in correct order (respecting foreign key constraints)
    
    // 1. Users (no dependencies)
    console.log('📥 Importing users...');
    for (const user of data.users) {
      await prisma.user.create({ data: user });
    }
    
    // 2. Categories (no dependencies)
    console.log('📥 Importing categories...');
    for (const category of data.categories) {
      await prisma.category.create({ data: category });
    }
    
    // 3. Articles (depends on users and categories)
    console.log('📥 Importing articles...');
    for (const article of data.articles) {
      await prisma.article.create({ data: article });
    }
    
    // 4. Ads (depends on users)
    console.log('📥 Importing ads...');
    for (const ad of data.ads) {
      await prisma.ad.create({ data: ad });
    }
    
    // 5. Comments (depends on articles)
    console.log('📥 Importing comments...');
    for (const comment of data.comments) {
      await prisma.comment.create({ data: comment });
    }
    
    // 6. Newsletter Subscribers (no dependencies)
    console.log('📥 Importing newsletter subscribers...');
    for (const subscriber of data.newsletterSubscribers) {
      await prisma.newsletterSubscriber.create({ data: subscriber });
    }
    
    // 7. Advertisements (no dependencies)
    console.log('📥 Importing advertisements...');
    for (const advertisement of data.advertisements) {
      await prisma.advertisement.create({ data: advertisement });
    }
    
    // 8. Auctions (depends on users)
    console.log('📥 Importing auctions...');
    for (const auction of data.auctions) {
      await prisma.auction.create({ data: auction });
    }
    
    // 9. Bids (depends on auctions and users)
    console.log('📥 Importing bids...');
    for (const bid of data.bids) {
      await prisma.bid.create({ data: bid });
    }
    
    console.log('\n✅ Import completed successfully!');
    console.log('🎉 Your data has been migrated to Neon!');
    
    // Verify counts
    console.log('\n🔍 Verifying data...');
    const counts = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      articles: await prisma.article.count(),
      ads: await prisma.ad.count(),
      comments: await prisma.comment.count(),
      newsletterSubscribers: await prisma.newsletterSubscriber.count(),
      advertisements: await prisma.advertisement.count(),
      auctions: await prisma.auction.count(),
      bids: await prisma.bid.count(),
    };
    
    console.log('📊 Current Database Counts:');
    console.log(`   - Users: ${counts.users}`);
    console.log(`   - Categories: ${counts.categories}`);
    console.log(`   - Articles: ${counts.articles}`);
    console.log(`   - Ads: ${counts.ads}`);
    console.log(`   - Comments: ${counts.comments}`);
    console.log(`   - Newsletter Subscribers: ${counts.newsletterSubscribers}`);
    console.log(`   - Advertisements: ${counts.advertisements}`);
    console.log(`   - Auctions: ${counts.auctions}`);
    console.log(`   - Bids: ${counts.bids}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('\nIf you see foreign key errors, make sure:');
    console.error('   1. You ran "npm run prisma:push" before importing');
    console.error('   2. Your DATABASE_URL is pointing to Neon');
    console.error('   3. The Neon database is empty (no conflicting data)');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Show usage instructions
 */
function showHelp() {
  console.log('📚 Database Migration Helper\n');
  console.log('Usage:');
  console.log('  node migrate-to-neon.js export   - Export data from current database');
  console.log('  node migrate-to-neon.js import   - Import data to current database');
  console.log('  node migrate-to-neon.js help     - Show this help message\n');
  console.log('Migration Steps:');
  console.log('  1. Ensure your local DATABASE_URL is set in .env');
  console.log('  2. Run: node migrate-to-neon.js export');
  console.log('  3. Update DATABASE_URL to your Neon connection string');
  console.log('  4. Run: npm run prisma:push');
  console.log('  5. Run: node migrate-to-neon.js import\n');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'export':
    exportData();
    break;
  case 'import':
    importData();
    break;
  case 'help':
  default:
    showHelp();
    break;
}
