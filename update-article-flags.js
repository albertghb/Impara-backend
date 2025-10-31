import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CONFIGURATION: Edit these arrays with your article IDs
const BREAKING_NEWS_IDS = []; // e.g., [33, 30] - Add IDs of articles you want as breaking news
const FEATURED_NEWS_IDS = []; // e.g., [29, 28, 27] - Add IDs of articles you want as featured
const PUBLISH_IDS = []; // e.g., [33, 30, 29] - Add IDs of articles you want to publish

async function updateArticleFlags() {
  try {
    console.log('\n=== UPDATING ARTICLE FLAGS ===\n');
    
    // First, reset all flags
    await prisma.article.updateMany({
      data: {
        isBreaking: false,
        isFeatured: false
      }
    });
    console.log('✅ Reset all article flags\n');

    // Set breaking news
    if (BREAKING_NEWS_IDS.length > 0) {
      const breakingResult = await prisma.article.updateMany({
        where: { id: { in: BREAKING_NEWS_IDS } },
        data: { isBreaking: true }
      });
      console.log(`✅ Set ${breakingResult.count} articles as Breaking News`);
      console.log(`   IDs: ${BREAKING_NEWS_IDS.join(', ')}\n`);
    } else {
      console.log('⚠️  No Breaking News articles configured\n');
    }

    // Set featured news
    if (FEATURED_NEWS_IDS.length > 0) {
      const featuredResult = await prisma.article.updateMany({
        where: { id: { in: FEATURED_NEWS_IDS } },
        data: { isFeatured: true }
      });
      console.log(`✅ Set ${featuredResult.count} articles as Featured`);
      console.log(`   IDs: ${FEATURED_NEWS_IDS.join(', ')}\n`);
    } else {
      console.log('⚠️  No Featured articles configured\n');
    }

    // Publish articles
    if (PUBLISH_IDS.length > 0) {
      const publishResult = await prisma.article.updateMany({
        where: { id: { in: PUBLISH_IDS } },
        data: { 
          status: 'published',
          publishedAt: new Date()
        }
      });
      console.log(`✅ Published ${publishResult.count} articles`);
      console.log(`   IDs: ${PUBLISH_IDS.join(', ')}\n`);
    } else {
      console.log('⚠️  No articles to publish configured\n');
    }

    console.log('=== DONE ===');
    console.log('\nTo configure which articles to update:');
    console.log('1. Edit this file: update-article-flags.js');
    console.log('2. Add article IDs to the arrays at the top');
    console.log('3. Run: node update-article-flags.js\n');
    
  } catch (error) {
    console.error('Error updating flags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateArticleFlags();
