import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('\n=== CHECKING USERS IN DATABASE ===\n');
    
    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Total users in database: ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log('❌ No users found in database!');
      console.log('\nTo create an admin user, you need to:');
      console.log('1. Make sure backend server is running');
      console.log('2. Use the registration endpoint or create user manually');
      console.log('\nAllowed emails from .env:');
      console.log('  - admin@impara.com');
      console.log('  - user@impara.com');
    } else {
      console.log('📋 USERS LIST:');
      allUsers.forEach(user => {
        console.log(`\n  ID: ${user.id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.name || 'N/A'}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Created: ${user.createdAt.toISOString()}`);
      });
    }

    console.log('\n=== END OF REPORT ===\n');
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
