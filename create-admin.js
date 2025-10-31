import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('\n=== CREATING ADMIN USER ===\n');
    
    const email = 'admin@impara.com';
    const password = 'admin123';
    const name = 'Admin User';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      console.log('User details:');
      console.log('  ID:', existingUser.id);
      console.log('  Email:', existingUser.email);
      console.log('  Name:', existingUser.name);
      console.log('  Role:', existingUser.role);
      console.log('\nYou can now login with:');
      console.log('  Email:', email);
      console.log('  Password: admin123');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'admin'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('\nUser details:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Role:', user.role);
    console.log('\nLogin credentials:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    console.log('\nYou can now login at: http://localhost:5173/admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
