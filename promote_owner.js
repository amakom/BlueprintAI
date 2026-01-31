
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteUser() {
  const email = 'kilimanjarohub@gmail.com';
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'OWNER' },
    });
    console.log(`Successfully promoted ${user.email} to ${user.role}`);
  } catch (error) {
    console.error('Error promoting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

promoteUser();
