import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'jaiminb251203@gmail.com';
  const plainPassword = 'Jaimin@2512'; // Default password for seeding

  console.log(`Checking if admin user exists with email: ${adminEmail}`);

  const existingAdmin = await prisma.user.findUnique({
    where: { emailId: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping creation.');
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.create({
    data: {
      fullName: 'Jaimin',
      emailId: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Successfully created admin user: ${admin.emailId}`);
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${plainPassword}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
