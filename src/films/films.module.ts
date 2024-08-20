import { Module } from '@nestjs/common';
import { FilmService } from './films.service';
import { FilmController } from './films.controller';
import { AuthGuard, RolesGuard } from 'src/auth/guard';

@Module({
  providers: [FilmService, AuthGuard, RolesGuard],
  controllers: [FilmController]
})
export class FilmModule {}
