import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guard';
import { UserService } from './users.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('self')
export class SelfController {
    constructor( private userService: UserService ) {}
    @UseGuards(AuthGuard)
    @Get()
    getSelf(
        @GetUser('username') username: string,
        @Headers('Authorization') token: string,
    ) {
        return this.userService.getSelf(username, token);
    }
}

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
    constructor( private userService: UserService ) {}
    @Get()
    searchUsername(
        @Query('username') username: string
    ) {
        return this.userService.searchUser(username);
    }

    @Get(':id')
    searchId(
        @Param('id', ParseIntPipe) userId: number
    ) {
        return this.userService.getUser(userId);
    }

    @Post(':id/balance')
    editBalance(
        @Param('id', ParseIntPipe) userId: number,
        @Body('increment', ParseIntPipe) increment: number
    ) {
        return this.userService.editBalance(userId, increment);
    }

    @Delete(':id')
    deleteId(
        @Param('id', ParseIntPipe) userId: number
    ) {
        return this.userService.deleteUser(userId);
    }
}
