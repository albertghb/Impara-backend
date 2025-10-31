import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedBasic() {
  try {
    console.log('🌱 Seeding basic data...');
    
    // Check if admin user exists
    let admin = await prisma.user.findFirst({ where: { email: 'admin@impara.rw' } });
    
    if (!admin) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await prisma.user.create({
        data: {
          email: 'admin@impara.rw',
          passwordHash: hashedPassword,
          name: 'Admin User',
          role: 'admin'
        }
      });
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('✅ Admin user already exists:', admin.email);
    }
    
    // Check if categories exist
    const categoryCount = await prisma.category.count();
    
    if (categoryCount === 0) {
      console.log('Creating categories...');
      const categories = await prisma.category.createMany({
        data: [
          { name: 'Politics', nameRw: 'Politiki', slug: 'politics', description: 'Political news' },
          { name: 'Economics', nameRw: 'Ubukungu', slug: 'economics', description: 'Economic news' },
          { name: 'Sports', nameRw: 'Imikino', slug: 'sports', description: 'Sports news' },
          { name: 'Health', nameRw: 'Ubuzima', slug: 'health', description: 'Health news' },
          { name: 'Entertainment', nameRw: 'Imyidagaduro', slug: 'entertainment', description: 'Entertainment news' },
          { name: 'Technology', nameRw: 'Ikoranabuhanga', slug: 'technology', description: 'Technology news' }
        ]
      });
      console.log('✅ Created', categories.count, 'categories');
    } else {
      console.log('✅ Categories already exist:', categoryCount);
    }
    
    console.log('\n✅ Basic seeding complete!');
    console.log('\n📝 You can now:');
    console.log('   - Login with: admin@impara.rw / admin123');
    console.log('   - Create articles with categories');
    console.log('   - Author ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBasic();
