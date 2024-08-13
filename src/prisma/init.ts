import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2'

const prisma = new PrismaClient();

async function main() {
  // Seed data untuk tabel User
  const user = await prisma.user.create({
    data: {
      role: 'ADMIN',
      email: 'admin@example.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      password: await argon.hash('securepassword'),
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
