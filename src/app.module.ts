import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilmModule } from './films/films.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/roles.guard';
import { AuthGuard } from './auth/guard';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    FilmModule, 
    PrismaModule, 
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
