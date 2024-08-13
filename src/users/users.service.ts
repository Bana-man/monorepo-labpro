import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private config: ConfigService) {}

    async getSelf(username: string, token: string) {
        console.log({
            username,
        })
        return {
            username: username,
            token: token,
        }
    }

    async searchUser(
        username: string
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: username,
            },
            select: {
                id: true,
                username: true,
                email: true,
                balance: true,
            }
        })

        // User not found
        if (!user) {
            throw new ForbiddenException(
                'User not found.',
            );
        }
        
        return user;
    }

    async getUser(
        userId: number
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                balance: true,
            }
        })

        // User not found
        if (!user) {
            throw new ForbiddenException(
                'User not found.',
            );
        }
        
        return user;
    }

    async editBalance(
        userId: number,
        increment: number,
    ) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    balance: {
                        increment: increment
                    }
                },
            })
            return user;
        } catch {
            throw new ForbiddenException(
                'User not found.',
            );
        }
    }

    async deleteUser(
        userId: number
    ) {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id: userId,
                },
            })
            return user;
        } catch {
            throw new ForbiddenException(
                'User not found.',
            );
        }
    }
}
