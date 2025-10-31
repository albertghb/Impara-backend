import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkArticles() {
  try {
    console.log('\n=== CHECKING ALL ARTICLES IN DATABASE ===\n');
    
    // Get all articles
    const allArticles = await prisma.article.findMany({
      include: {
        author: { select: { name: true, email: true } },
        category: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Total articles in database: ${allArticles.length}\n`);

    // Breaking news
    const breakingNews = allArticles.filter(a => a.isBreaking && a.status === 'published');
    console.log(`\n📰 BREAKING NEWS (${breakingNews.length}):`);
    breakingNews.forEach(a => {
      console.log(`  - ID: ${a.id} | ${a.title.substring(0, 50)}...`);
      console.log(`    Author: ${a.author.name} | Category: ${a.category.name}`);
      console.log(`    Status: ${a.status} | Views: ${a.views}`);
    });

    // Featured news
    const featuredNews = allArticles.filter(a => a.isFeatured && a.status === 'published');
    console.log(`\n⭐ FEATURED NEWS (${featuredNews.length}):`);
    featuredNews.forEach(a => {
      console.log(`  - ID: ${a.id} | ${a.title.substring(0, 50)}...`);
      console.log(`    Author: ${a.author.name} | Category: ${a.category.name}`);
      console.log(`    Status: ${a.status} | Views: ${a.views}`);
    });

    // Latest published news
    const latestNews = allArticles.filter(a => a.status === 'published').slice(0, 10);
    console.log(`\n📅 LATEST PUBLISHED NEWS (showing first 10):`);
    latestNews.forEach(a => {
      console.log(`  - ID: ${a.id} | ${a.title.substring(0, 50)}...`);
      console.log(`    Author: ${a.author.name} | Category: ${a.category.name}`);
      console.log(`    Breaking: ${a.isBreaking} | Featured: ${a.isFeatured}`);
    });

    // Draft articles
    const draftArticles = allArticles.filter(a => a.status === 'draft');
    console.log(`\n📝 DRAFT ARTICLES (${draftArticles.length}):`);
    draftArticles.forEach(a => {
      console.log(`  - ID: ${a.id} | ${a.title.substring(0, 50)}...`);
      console.log(`    Author: ${a.author.name} | Category: ${a.category.name}`);
    });

    console.log('\n=== END OF REPORT ===\n');
    
  } catch (error) {
    console.error('Error checking articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticles();
