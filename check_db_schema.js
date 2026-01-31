const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Try to create a dummy user with a role to see if it throws
    // Actually, simpler: just count users, if the schema is mismatched, it might throw even on findMany if it tries to select 'role'
    // But findMany selects all fields by default.
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Successfully queried users. Schema is compatible.');
    console.log('Sample user keys:', users.length > 0 ? Object.keys(users[0]) : 'No users found');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
