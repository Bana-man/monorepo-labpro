import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilmModule } from './films/films.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    FilmModule, 
    PrismaModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    PagesModule,
  ],  
})
export class AppModule {}
