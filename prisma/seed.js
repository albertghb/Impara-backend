import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create categories
  console.log('Creating categories...');
  
  const categoriesData = [
    { name: 'Politics', nameRw: 'Politiki', slug: 'politics', description: 'Political news and analysis from Rwanda and around the world' },
    { name: 'Economics', nameRw: 'Ubukungu', slug: 'economics', description: 'Economic news, business updates, and market analysis' },
    { name: 'Sports', nameRw: 'Siporo', slug: 'sports', description: 'Sports news, match results, and athlete profiles' },
    { name: 'Health', nameRw: 'Ubuzima', slug: 'health', description: 'Health news, medical breakthroughs, and wellness tips' },
    { name: 'Entertainment', nameRw: 'Imyidagaduro', slug: 'entertainment', description: 'Entertainment news, celebrity updates, and cultural events' },
    { name: 'Technology', nameRw: 'Ikoranabuhanga', slug: 'technology', description: 'Technology news, innovations, and digital trends' },
    { name: 'Education', nameRw: 'Uburezi', slug: 'education', description: 'Education news, academic achievements, and learning resources' },
    { name: 'Culture', nameRw: 'Umuco', slug: 'culture', description: 'Cultural news and traditional events' }
  ];

  let createdCount = 0;
  for (const cat of categoriesData) {
    try {
      await prisma.category.create({ data: cat });
      createdCount++;
    } catch (e) {
      // Category already exists, skip
    }
  }

  console.log(`✅ Seeded ${createdCount} categories\n`);

  console.log('✅ Database seed complete!');
  console.log('\nNext steps:');
  console.log('1. Start server: npm run dev');
  console.log('2. Create admin account via API or test-backend.html');
  console.log('3. Login at http://localhost:5173/admin/login');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
