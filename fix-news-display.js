import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function fixNewsDisplay() {
  try {
    console.log('\n🔧 FIX NEWS DISPLAY - Interactive Setup\n');
    console.log('This will help you configure which articles appear in:');
    console.log('  - Breaking News (Amakuru Yihutirwa)');
    console.log('  - Featured News (Amakuru Akomeye)');
    console.log('  - Latest News (Amakuru Mashya)\n');

    // Get all articles
    const articles = await prisma.article.findMany({
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (articles.length === 0) {
      console.log('❌ No articles found in database!');
      console.log('Please create articles in the admin panel first.\n');
      rl.close();
      return;
    }

    console.log(`Found ${articles.length} articles:\n`);
    articles.forEach((article, index) => {
      console.log(`${index + 1}. [ID: ${article.id}] ${article.title.substring(0, 60)}...`);
      console.log(`   Category: ${article.category.name} | Status: ${article.status}`);
      console.log(`   Breaking: ${article.isBreaking} | Featured: ${article.isFeatured}\n`);
    });

    const choice = await question('What would you like to do?\n1. Reset all flags (start fresh)\n2. Set specific articles as breaking/featured\n3. Delete test articles\n4. Exit\n\nEnter choice (1-4): ');

    switch (choice.trim()) {
      case '1':
        await resetAllFlags();
        break;
      case '2':
        await setSpecificArticles(articles);
        break;
      case '3':
        await deleteTestArticles(articles);
        break;
      case '4':
        console.log('\n👋 Exiting...\n');
        break;
      default:
        console.log('\n❌ Invalid choice\n');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

async function resetAllFlags() {
  console.log('\n🔄 Resetting all flags...');
  
  const result = await prisma.article.updateMany({
    data: {
      isBreaking: false,
      isFeatured: false
    }
  });

  console.log(`✅ Reset ${result.count} articles`);
  console.log('\nNext steps:');
  console.log('1. Go to admin panel: http://localhost:5173/admin');
  console.log('2. Edit your official articles');
  console.log('3. Check "Breaking News" or "Featured" as needed');
  console.log('4. Set status to "Published"');
  console.log('5. Save\n');
}

async function setSpecificArticles(articles) {
  console.log('\n📝 Set Specific Articles\n');
  
  const breakingIds = await question('Enter IDs for BREAKING NEWS (comma-separated, e.g., 33,30,29): ');
  const featuredIds = await question('Enter IDs for FEATURED NEWS (comma-separated, e.g., 27,25,24): ');
  const publishIds = await question('Enter IDs to PUBLISH (comma-separated, or press Enter to skip): ');

  // Reset all first
  await prisma.article.updateMany({
    data: { isBreaking: false, isFeatured: false }
  });

  // Set breaking news
  if (breakingIds.trim()) {
    const ids = breakingIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (ids.length > 0) {
      const result = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { isBreaking: true }
      });
      console.log(`✅ Set ${result.count} articles as Breaking News`);
    }
  }

  // Set featured news
  if (featuredIds.trim()) {
    const ids = featuredIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (ids.length > 0) {
      const result = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { isFeatured: true }
      });
      console.log(`✅ Set ${result.count} articles as Featured`);
    }
  }

  // Publish articles
  if (publishIds.trim()) {
    const ids = publishIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (ids.length > 0) {
      const result = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { 
          status: 'published',
          publishedAt: new Date()
        }
      });
      console.log(`✅ Published ${result.count} articles`);
    }
  }

  console.log('\n✅ Done! Refresh your website to see changes.\n');
}

async function deleteTestArticles(articles) {
  console.log('\n🗑️  Delete Test Articles\n');
  console.log('⚠️  WARNING: This will permanently delete articles!\n');
  
  const idsToDelete = await question('Enter IDs to DELETE (comma-separated, e.g., 1,4,5,6): ');
  
  if (!idsToDelete.trim()) {
    console.log('No IDs entered. Cancelled.\n');
    return;
  }

  const ids = idsToDelete.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  
  if (ids.length === 0) {
    console.log('No valid IDs entered. Cancelled.\n');
    return;
  }

  // Show what will be deleted
  const toDelete = articles.filter(a => ids.includes(a.id));
  console.log(`\nWill delete ${toDelete.length} articles:`);
  toDelete.forEach(a => {
    console.log(`  - [ID: ${a.id}] ${a.title.substring(0, 50)}...`);
  });

  const confirm = await question('\nType "DELETE" to confirm: ');
  
  if (confirm.trim() === 'DELETE') {
    const result = await prisma.article.deleteMany({
      where: { id: { in: ids } }
    });
    console.log(`\n✅ Deleted ${result.count} articles\n`);
  } else {
    console.log('\n❌ Cancelled. No articles deleted.\n');
  }
}

fixNewsDisplay();
