import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2'

const prisma = new PrismaClient();

async function main() {
  // Seed data untuk ADMIN
  await prisma.user.create({
    data:
      {
        role: 'ADMIN',
        email: 'admin@example.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        password: await argon.hash('passadmin'),
      },
  });

  // Seed data untuk USER
  const loopUser = 7;
  for (let i = 1; i <= loopUser; i++) {
    await prisma.user.create({
      data:
        {
          role: 'USER',
          email: `user${i}@example.com`,
          username: `user${i}`,
          firstName: 'User',
          lastName: 'User',
          password: await argon.hash('passuser'),
        }
    })
  }

  // Seed data untuk FILM
  const loopFilm = 7;
  for (let i = 1; i <= loopFilm; i++) {
    await prisma.film.createMany({
      data: [
        {
          title: `Judul ${i}`,
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
