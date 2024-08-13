import { Body, Controller, Get, Put, Param, ParseIntPipe, Post, Query, UseGuards, Delete } from '@nestjs/common';
import { FilmService } from './films.service';
import { FilmDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Role, User } from '@prisma/client';
import { AuthGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('films')
export class FilmController {
    constructor( private filmService: FilmService ) {}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createFilm( @Body() dto: FilmDto, @GetUser() user: User ) {
        return this.filmService.createFilm(dto, user);
    }

    @Get()
    searchFilm(@Query('title') title: string, @Query('director') director: string) {
        return this.filmService.searchFilm(title, director);
    }

    @Get(':id')
    getFilm(@Param('id', ParseIntPipe) id:number) {
        return this.filmService.getFilm(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    updateFilm(@Param('id', ParseIntPipe) id:number, @Body() dto: FilmDto) {
        return this.filmService.updateFilm(id, dto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteFilm(@Param('id', ParseIntPipe) id:number) {
        return this.filmService.deleteFilm(id);
    }
}
