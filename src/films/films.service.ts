import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilmDto } from './dto';
import { User } from '@prisma/client';
import { responseTemp } from 'src/response/response';

@Injectable()
export class FilmService {
    constructor( private prisma: PrismaService ) {}

    async createFilm(dto: FilmDto, user: User) {
        try {
            // Create film in database
            const film = await this.prisma.film.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    director: dto.director,
                    releaseYear: dto.release_year,
                    genre: dto.genre,
                    price: dto.price,
                    duration: dto.duration,
                    video_url: dto.video_url,
                    cover_image_url: dto.cover_image_url,
                    owner: {
                        connect: {
                            id: user.id,
                            email: user.email,
                            username: user.username
                        }
                    },
                },
            });

            delete film.ownerId;
            return new responseTemp('success', 'Film created', film);
        } catch (error) {
            return new responseTemp('error', 'Create film failed', null);
        }
    }

    async searchFilm(title: string, director: string) {
        const film = await this.prisma.film.findMany({
            where: {
                title: title,
                director: director,
            },
        })

        // User not found
        if (!film) {
            return new responseTemp('error', 'Film not found', null);
        }
        
        return new responseTemp('success', 'Film found', film);
    }

    async getFilm(id: number) {
        const film = await this.prisma.film.findUnique({
            where: {
                id: id,
            },
        })

        // Film not found
        if (!film) {
            return new responseTemp('error', 'Film not found', null);
        }
        
        delete film.ownerId;
        return new responseTemp('success', 'Film found', film);
    }

    async updateFilm(id: number, dto: FilmDto) {
        const existingFilm = await this.prisma.film.findUnique({ where: { id } });
        if (!existingFilm) {
            return new responseTemp('error', 'Film not found', null);
        }

        // Handle video file upload
        if (!dto.video_url) {
            dto.video_url = existingFilm.video_url;
        }

        // Handle cover image upload
        if (!dto.cover_image_url) {
            dto.cover_image_url = existingFilm.cover_image_url;
        }

        const film = await this.prisma.film.update({
            where: { id },
            data: {
                ...dto
            },
        });

        return new responseTemp('success', 'Film updated', film);
    }

    async deleteFilm(id: number) {
        try {
            const film = await this.prisma.film.delete({
                where: {
                    id: id,
                }
            })

            return new responseTemp('success', 'Film deleted', film);
        } catch {
            return new responseTemp('error', 'Film not found', null);
        }
    }
}
