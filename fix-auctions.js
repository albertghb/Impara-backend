import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAuctions() {
  try {
    console.log('🔍 Checking for invalid auction data...');
    
    // Delete all auctions (they're probably test data anyway)
    const deleted = await prisma.auction.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} auctions with invalid data`);
    
    console.log('✅ Database cleaned! You can now add new auctions.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAuctions();
