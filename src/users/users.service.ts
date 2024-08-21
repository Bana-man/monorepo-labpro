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

    async addOwnerToFilm(userId: string, filmId: string, userBalance: number) {
        const film = await this.prisma.film.findUnique({
            where: {
                id: filmId,
            },
        });

        if (userBalance < film.price) {
            return new responseTemp('error', 'Your balance is not enough.', null);
        }

        const updatedFilm = await this.prisma.film.update({
            where: { id: filmId },
            data: {
                owners: {
                    connect: { id: userId }
                }
            },
            select: {
                owners: true,
            }
        });

        return new responseTemp('success', 'Successfully purchased this film.', updatedFilm);
    }    

    async searchUser(
        q: string
    ) {
        const user = await this.prisma.user.findMany({
            where: {
                username: {
                    contains: q,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                username: true,
                email: true,
                balance: true,
            }
        })

        // User not found
        if (user.length === 0) {
            return new responseTemp('error', 'User not found', null);
        }
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
                    },
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
