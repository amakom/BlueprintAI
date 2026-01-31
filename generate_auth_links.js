const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const EMAIL = 'kilimanjarohub@gmail.com';
const BASE_URL = 'http://localhost:3000'; // Assuming default local port, user can adjust if deployed

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: EMAIL },
    });

    if (!user) {
      console.log(`User ${EMAIL} not found! Cannot generate links.`);
      return;
    }

    console.log(`Found user: ${user.name} (${user.email})`);

    // 1. Generate Reset Password Link
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: EMAIL,
        token: resetToken,
        expires: resetExpires,
      },
    });

    const resetLink = `${BASE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(EMAIL)}`;
    console.log('\n---------------------------------------------------');
    console.log('PASSWORD RESET LINK (Valid for 1 hour):');
    console.log(resetLink);
    console.log('---------------------------------------------------\n');

    // 2. Generate Email Verification Link
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 86400000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: EMAIL,
        token: verifyToken,
        expires: verifyExpires,
      },
    });

    const verifyLink = `${BASE_URL}/verify?token=${verifyToken}&email=${encodeURIComponent(EMAIL)}`;
    console.log('EMAIL VERIFICATION LINK (Valid for 24 hours):');
    console.log(verifyLink);
    console.log('---------------------------------------------------');

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
