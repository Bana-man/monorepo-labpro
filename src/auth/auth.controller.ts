import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto } from './dto';
import { RedisService } from 'src/redis/redis.service';

@Controller()
export class AuthController {
    constructor ( private authService: AuthService, private redis: RedisService ) {}

    @Post('register')
    async register(@Body() dto: RegisterAuthDto) {
        const data = await this.authService.register(dto);
        if (data.status == 'success') {
            this.redis.del('users');
            this.redis.set(`user:${data.data.id}`, data);
        }
        return data;
    }

    @Post('login')
    login(@Body() dto: LoginAuthDto) {
        return this.authService.login(dto);
    }
}
