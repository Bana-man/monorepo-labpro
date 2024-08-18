import { Body, Controller, Get, Put, Param, Post, Query, UseGuards, Delete } from '@nestjs/common';
import { FilmService } from './films.service';
import { FilmDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Role, User } from '@prisma/client';
import { AuthGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RedisService } from 'src/redis/redis.service';

@Controller('films')
export class FilmController {
    constructor( private filmService: FilmService, private redis: RedisService ) {}

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
    async getFilm(@Param('id') filmId:string) {
        const result = await this.redis.get('film:${filmId}');
        if (result) {
            return result;
        }
        
        const data = this.filmService.getFilm(filmId);
        this.redis.set('film:${filmId}', data);
        return data;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    updateFilm(@Param('id') filmId:string, @Body() dto: FilmDto) {
        const data = this.filmService.updateFilm(filmId, dto)
        this.redis.set('film:${filmId}', data);
        return data;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteFilm(@Param('id') filmId:string) {
        this.redis.del('film:${filmId}')
        return this.filmService.deleteFilm(filmId);
    }
}
