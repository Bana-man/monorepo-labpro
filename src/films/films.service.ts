import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilmDto } from './dto';
import { User } from '@prisma/client';

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
            return film;
        } catch (error) {
            throw error;
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
            throw new NotFoundException(
                'Film not found.',
            );
        }
        
        return film;
    }

    async getFilm(id: number) {
        const film = await this.prisma.film.findMany({
            where: {
                id: id,
            },
        })

        // User not found
        if (!film) {
            throw new NotFoundException(
                'Film not found.',
            );
        }
        
        return film;
    }

    async updateFilm(id: number, dto: FilmDto) {
        const existingFilm = await this.prisma.film.findUnique({ where: { id } });
        if (!existingFilm) {
            throw new NotFoundException('Film not found');
        }

        // Handle video file upload
        if (!dto.video_url) {
            dto.video_url = existingFilm.video_url;
        }

        // Handle cover image upload
        if (!dto.cover_image_url) {
            dto.cover_image_url = existingFilm.cover_image_url;
        }

        return this.prisma.film.update({
            where: { id },
            data: {
                ...dto
            },
        });
    }

    async deleteFilm(id: number) {
        try {
            const film = await this.prisma.film.delete({
                where: {
                    id: id,
                }
            })

            return film;
        } catch {
            throw new NotFoundException(
                'Film not found.',
            );
        }
    }
}
