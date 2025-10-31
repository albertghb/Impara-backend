import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CONFIGURATION: Add IDs of articles you want to DELETE
const ARTICLE_IDS_TO_DELETE = []; // e.g., [1, 4, 5, 6, 9, 11, 13, 14, 15, 16, 18, 19, 20, 21]

async function deleteTestArticles() {
  try {
    console.log('\n=== DELETE TEST ARTICLES ===\n');
    
    if (ARTICLE_IDS_TO_DELETE.length === 0) {
      console.log('⚠️  No articles configured for deletion');
      console.log('\nTo delete articles:');
      console.log('1. Edit this file: delete-test-articles.js');
      console.log('2. Add article IDs to ARTICLE_IDS_TO_DELETE array');
      console.log('3. Run: node delete-test-articles.js\n');
      return;
    }

    // Show articles that will be deleted
    const articlesToDelete = await prisma.article.findMany({
      where: { id: { in: ARTICLE_IDS_TO_DELETE } },
      select: {
        id: true,
        title: true,
        status: true,
        isBreaking: true,
        isFeatured: true
      }
    });

    console.log(`Found ${articlesToDelete.length} articles to delete:\n`);
    articlesToDelete.forEach(a => {
      console.log(`  - ID: ${a.id} | ${a.title.substring(0, 50)}...`);
      console.log(`    Status: ${a.status} | Breaking: ${a.isBreaking} | Featured: ${a.isFeatured}`);
    });

    console.log('\n⚠️  WARNING: This will permanently delete these articles!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');

    // Wait 5 seconds before deleting
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete the articles
    const result = await prisma.article.deleteMany({
      where: { id: { in: ARTICLE_IDS_TO_DELETE } }
    });

    console.log(`✅ Deleted ${result.count} articles\n`);
    console.log('=== DONE ===\n');
    
  } catch (error) {
    console.error('Error deleting articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestArticles();
