import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guard';
import { UserService } from './users.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { FilmService } from 'src/films/films.service';
// import { RedisService } from 'src/redis/redis.service';

@Controller('self')
@UseGuards(AuthGuard)
export class SelfController {
    constructor( private userService: UserService ) {}
    
    @Get()
    getSelf(
        @GetUser('username') username: string,
        @Headers('Authorization') token: string,
    ) {
        return this.userService.getSelf(username, token);
    }

    @Get('buy/:id')
    async buyFilm(
        @GetUser('sub') userId: string,
        @Param('id') filmId: string
    ){
        const film = (await this.userService.addOwnerToFilm(userId, filmId)).data;
        console.log(film);
        // Mengubah nilai balance user
        const data = this.userService.editBalance(userId, -film.price);
        // this.redis.set('user:${userId}', data);
        console.log(data);
        return data;
    }
}

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
    constructor( 
        private userService: UserService, 
        // private redis: RedisService 
    ) {}
    @Get()
    async searchUsername(
        @Query('q') username: string
    ) {
        return this.userService.searchUser(username);
    }

    @Get(':id')
    async searchId(
        @Param('id') userId: string
    ) {
        // const result = await this.redis.get('user:${userId}');
        // if (result) {
        //     return result;
        // }
        
        const data = this.userService.getUser(userId);
        // this.redis.set('user:${userId}', data);
        return data;
    }

    @Post(':id/balance')
    editBalance(
        @Param('id') userId: string,
        @Body('increment', ParseIntPipe) increment: number
    ) {
        const data = this.userService.editBalance(userId, increment);
        // this.redis.set('user:${userId}', data);
        return data;
    }

    @Delete(':id')
    deleteId(
        @Param('id') userId: string
    ) {
        // this.redis.del('user:${userId}')
        return this.userService.deleteUser(userId);
    }
}
