const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.sfglqrsfzqpyeniprahc:*%405293Print%3D%3F%25.@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
    }
  }
});

async function main() {
  console.log('Testing database connection...');
  try {
    await prisma.$connect();
    console.log('Successfully connected to database!');
    const users = await prisma.user.count();
    console.log(`Connection working. Found ${users} users.`);
  } catch (e) {
    console.error('Connection failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();