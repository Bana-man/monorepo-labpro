import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { responseTemp } from 'src/response/response';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

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
        if (!username) {
            const data = await this.prisma.user.findFirst({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    balance: true,
                },
            });
            console.log(data);
            return new responseTemp('success', 'All User returned', data);
        }

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
        console.log(user);
        return new responseTemp('success', 'User found', user);
    }

    async getUser(
        userId: string
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
        userId: string,
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
        userId: string
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
