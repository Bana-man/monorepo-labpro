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
    constructor( 
        private filmService: FilmService, 
        private redis: RedisService 
    ) {}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async createFilm( @Body() dto: FilmDto ) {
        const data = await this.filmService.createFilm(dto);
        if (data.status === 'success') {
            this.redis.del('films');
            this.redis.set(`film:${data.data.id}`, data);
        }
    }

    @Get()
    async searchFilm(@Query('q') q: string) {
        if (!q) {
            const cache = await this.redis.get('films');
            if (cache) return cache;
        }

        const data = this.filmService.searchFilm(q);
        if (!q) {
            await this.redis.set('films', data);
        }
        return data;
    }

    @Get(':id')
    async getFilm(@Param('id') filmId:string) {
        const result = await this.redis.get(`film:${filmId}`);
        if (result) {
            return result;
        }
        
        const data = this.filmService.getFilm(filmId);
        this.redis.set(`film:${filmId}`, data);
        return data;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    async updateFilm(@Param('id') filmId:string, @Body() dto: FilmDto) {
        const data = await this.filmService.updateFilm(filmId, dto)
        
        if (data.status === 'success') {
            this.redis.set(`film:${filmId}`, data);
            this.redis.del('films');
        }
        return data;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteFilm(@Param('id') filmId:string) {
        const data = await this.filmService.deleteFilm(filmId);

        if (data.status === 'success') {
            this.redis.del(`film:${filmId}`);
            this.redis.del('films');
        }
        return data;
        
    }
}
