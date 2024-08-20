import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { SelfController, UserController } from './users.controller';
import { AuthGuard, RolesGuard } from 'src/auth/guard';
import { FilmService } from 'src/films/films.service';

@Module({
  providers: [UserService, AuthGuard, RolesGuard],
  controllers: [UserController, SelfController]
})
export class UserModule {}
