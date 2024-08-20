import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilmModule } from './films/films.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { FilmController } from './films/films.controller';
import { UserController } from './users/users.controller';
import { UserService } from './users/users.service';
import { FilmService } from './films/films.service';
// import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    FilmModule, 
    PrismaModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    // RedisModule,
  ],
  controllers: [
    UserController, FilmController, AppController,
  ],
  providers: [
    UserService, FilmService,
  ],
  
})
export class AppModule {}
