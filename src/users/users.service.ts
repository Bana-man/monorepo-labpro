import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { responseTemp } from 'src/response/response';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private config: ConfigService) {}

    async getSelf(username: string, token: string) {

        const data = {
            username: username,
            token: token,
        }
        return new responseTemp('success', '', data);
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
            return new responseTemp('error', 'User not found', null);
        }
        
        return new responseTemp('success', 'User found', user);
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
            return new responseTemp('error', 'User not found', null);
        }
        
        return new responseTemp('success', 'User found', user);
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
            return new responseTemp('success', 'User found', user);
        } catch {
            return new responseTemp('error', 'User not found', null);
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
            return new responseTemp('success', 'User found', user);
        } catch {
            return new responseTemp('error', 'User not found', null);
        }
    }
}
