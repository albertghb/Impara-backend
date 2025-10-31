import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetArticleFlags() {
  try {
    console.log('\n=== RESETTING ARTICLE FLAGS ===\n');
    
    // Option 1: Remove breaking/featured flags from ALL articles
    const result = await prisma.article.updateMany({
      data: {
        isBreaking: false,
        isFeatured: false
      }
    });

    console.log(`✅ Reset ${result.count} articles`);
    console.log('All articles now have isBreaking=false and isFeatured=false');
    console.log('\nNext steps:');
    console.log('1. Go to your admin panel');
    console.log('2. Create or edit your official news articles');
    console.log('3. Mark them as "Breaking News" or "Featured" as needed');
    console.log('4. Set their status to "Published"\n');
    
  } catch (error) {
    console.error('Error resetting flags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetArticleFlags();
