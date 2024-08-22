import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guard';
import { UserService } from './users.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';

@Controller('self')
@UseGuards(AuthGuard)
export class SelfController {
    constructor( 
        private userService: UserService,
        private redis: RedisService
    ) {}
    
    @Get()
    getSelf(
        @GetUser('username') username: string,
        @Headers('Authorization') token: string,
    ) {
        return this.userService.getSelf(username, token);
    }

    @Get('balance')
    getBalance(
        @GetUser('sub') userId: string,
    ) {
        return this.userService.getBalance(userId);
    }

    @Put('buy/:id')
    async buyFilm(
        @GetUser('sub') userId: string,
        @Param('id') filmId: string
    ){
        const film = await this.userService.addOwnerToFilm(userId, filmId);
        this.redis.set(`film:${filmId}`, film.data);
        
        // Mengubah nilai balance user
        const user = await this.userService.editBalance(userId, -film.data.price);
        this.redis.set(`user:${userId}`, user.data);
        this.redis.del(`my-film`);

        console.log(user)
        return user;
    }

    @Get('my-film')
    async boughtFilm(
        @GetUser('sub') userId: string,
        @Query('q') q: string
    ) {
        if (!q) {
            const cache = await this.redis.get('my-film');
            if (cache) return cache;
        }

        const cache = await this.redis.get('my-film');
        if (cache) return cache;

        const data = await this.userService.getBoughtFilm(userId, q);

        if (!q) {
            await this.redis.set('my-film', data);
        }
        return data;
    }
}

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
    constructor( 
        private userService: UserService, 
        private redis: RedisService 
    ) {}
    @Get()
    async searchUsername(
        @Query('q') username: string
    ) {
        if (!username) {
            const cache = await this.redis.get('users');
            if (cache) return cache;
        }

        const data = await this.userService.searchUser(username);
        if (!username) {
            await this.redis.set('users', data);
        }
        return data;
    }

    @Get(':id')
    async searchId(
        @Param('id') userId: string
    ) {
        const result = await this.redis.get(`user:${userId}`);
        if (result) {
            return result;
        }
        
        const user = await this.userService.getUser(userId);
        this.redis.set(`user:${userId}`, user);
        return user;
    }

    @Post(':id/balance')
    async editBalance(
        @Param('id') userId: string,
        @Body('increment', ParseIntPipe) increment: number
    ) {
        const data = await this.userService.editBalance(userId, increment);

        if (data.status === 'success') {
            this.redis.set(`user:${userId}`, data);
            this.redis.del('users');
        }
        return data;
    }

    @Delete(':id')
    async deleteId(
        @Param('id') userId: string
    ) {
        const data = await this.userService.deleteUser(userId);

        if (data.status === 'success') {
            this.redis.del(`user:${userId}`);
            this.redis.del('users');
        }
        return data;
    }
}
