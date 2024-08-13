import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { FilmService } from './films.service';
import { FilmDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/guard';

@Controller('films')
export class FilmController {
    constructor( private filmService: FilmService ) {}

    @UseGuards(AuthGuard)
    @Post()
    createFilm( @Body() dto: FilmDto, @GetUser() user: User ) {
        return this.filmService.createFilm(dto, user);
    }

    @Get()
    searchFilm(@Query('title') title: string, @Query('director') director: string) {
        return this.filmService.searchFilm(title, director);
    }

    @Get(':id')
    getFilm(@Param('id', ParseIntPipe) id:number ) {
        return this.filmService.getFilm(id);
    }
}
