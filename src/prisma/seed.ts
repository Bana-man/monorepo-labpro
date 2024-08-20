import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2'

const prisma = new PrismaClient();

async function main() {
  // Seed data untuk USER
  await prisma.user.createMany({
    data: [
      {
        role: 'ADMIN',
        email: 'admin@example.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        password: await argon.hash('passadmin'),
      },
      {
        role: 'USER',
        email: 'user1@example.com',
        username: 'user1',
        firstName: 'User',
        lastName: 'User',
        password: await argon.hash('passuser'),
      },
      {
        role: 'USER',
        email: 'user2@example.com',
        username: 'user2',
        firstName: 'User',
        lastName: 'User',
        password: await argon.hash('passuser'),
      },
      {
        role: 'USER',
        email: 'user3@example.com',
        username: 'user3',
        firstName: 'User',
        lastName: 'User',
        password: await argon.hash('passuser'),
      },
    ]
  });

  const admin = await prisma.user.findUnique({
    where: {
      username: 'admin',
    }
  });

  const loop = 7;
  // Seed data untuk FILM
  for (let i = 1; i <= loop; i++) {
    await prisma.film.createMany({
      data: [
        {
          title: 'ABCDEF',
          description: 'desc',
          director: 'X',
          releaseYear: 2024,
          genre: ['Gen1', 'Gen2'],
          price: 100,
          duration: 100,
          video_url: '/uploads/videos/video1.mp4',
          cover_image_url: '/uploads/cover_images/image1.jpg',
        },
        {
          title: 'EFGHIJ',
          description: 'desc lgi',
          director: 'XMan',
          releaseYear: 2024,
          genre: ['Rawr'],
          price: 120,
          duration: 200,
          video_url: '/uploads/videos/video1.mp4',
          cover_image_url: '/uploads/cover_images/image1.jpg',
        },
      ]
    })
  }

  
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
