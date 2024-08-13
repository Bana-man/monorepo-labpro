import { Module } from '@nestjs/common';
import { FilmService } from './films.service';
import { FilmController } from './films.controller';

@Module({
  providers: [FilmService],
  controllers: [FilmController]
})
export class FilmModule {}
