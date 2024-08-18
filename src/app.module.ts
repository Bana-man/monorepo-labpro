import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilmModule } from './films/films.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/roles.guard';
import { AuthGuard } from './auth/guard';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    FilmModule, 
    PrismaModule, 
    ConfigModule.forRoot({ isGlobal: true }), 
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
