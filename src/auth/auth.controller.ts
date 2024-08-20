import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto } from './dto';

@Controller()
export class AuthController {
    constructor ( private authService: AuthService ) {}

    @Post('register')
    register(@Body() dto: RegisterAuthDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginAuthDto) {
        return this.authService.login(dto);
    }
}
