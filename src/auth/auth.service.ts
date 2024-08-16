import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterAuthDto } from './dto';
import * as argon from 'argon2'
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { responseTemp } from 'src/response/response';

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService, private jwt: JwtService, private config: ConfigService ) {}

    async register(dto: RegisterAuthDto) {
        // Hashing Password
        const hashed = await argon.hash(dto.password);

        try {
            // Create user in database
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    password: hashed,
                },
            });

            const data = {
                username: user.username,
                token: await this.signToken(user.id, user.username, user.role),
            }
            return new responseTemp('success', 'Successfully registered', data);

        } catch (error) {
            // If email or username not unique
            return new responseTemp('error', 'The ' + error.meta.target[0] + ' has already been used', null);
        }
    }

    async login(dto: LoginAuthDto) {
        // Finding user with the given email
        const user = await this.prisma.user.findUnique({
            where: {
                username: dto.username,
            }
        })

        // User not found
        if (!user) {
            return new responseTemp('error', 'Username not registered yet', null);
        }

        // Comparing password
        const pwMatches = await argon.verify(
            user.password,
            dto.password,
        )

        // Incorrect Password
        if (!pwMatches) {
            return new responseTemp('error', 'Incorrect password', null);
        }

        const data = {
            username: user.username,
            token: await this.signToken(user.id, user.username, user.role),
        }
        return new responseTemp('success', 'Login success', data);
    }

    async signToken(userId: number, username: string, role: Role) {
        const payload = {
            sub: userId,
            username,
            role,
        }

        const token = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
        });

        return token;
    }
}
