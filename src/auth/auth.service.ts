import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterAuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

            return this.signToken(user.id, user.email);

        } catch (error) {
            // If email or username not unique
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'The ' + error.meta.target[0] + ' has already been used.',
                    );
                }
            }

            throw error;
        }
    }

    async login(dto: LoginAuthDto) {
        // Finding user with the given email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        // User not found
        if (!user) {
            throw new ForbiddenException(
                'Email not registered yet.',
            );
        }

        // Comparing password
        const pwMatches = await argon.verify(
            user.password,
            dto.password,
        )

        // Incorrect Password
        if (!pwMatches) {
            throw new ForbiddenException(
                'Incorrect Password.',
            );
        }

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email,
        }

        const token = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
        })

        return {
            access_token: token,
        }
    }
}
