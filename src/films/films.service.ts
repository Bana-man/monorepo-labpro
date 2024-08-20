import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilmDto } from './dto';
import { User } from '@prisma/client';
import { responseTemp } from 'src/response/response';

@Injectable()
export class FilmService {
    constructor( private prisma: PrismaService ) {}

    async createFilm(dto: FilmDto) {
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
                },
            });

            return new responseTemp('success', 'Film created', film);
        } catch (error) {
            return new responseTemp('error', 'Create film failed', null);
        }
    }

    async searchFilm(q: string) {
        const film = await this.prisma.film.findMany({
            where: {
                OR: [
                    { title: { contains: q, mode: 'insensitive' }},
                    { director: { contains: q, mode: 'insensitive' }},
                ]
            },
        })

        // User not found
        if (!film) {
            return new responseTemp('error', 'Film not found', null);
        }
        
        return new responseTemp('success', 'Film found', film);
    }

    async getFilm(id: string) {
        const film = await this.prisma.film.findUnique({
            where: {
                id: id,
            },
            include: {
                owners: true,
            }
        })

        // Film not found
        if (!film) {
            return new responseTemp('error', 'Film not found', null);
        }
        
        console.log(film);
        return new responseTemp('success', 'Film found', film);
    }

    async updateFilm(id: string, dto: FilmDto) {
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
                ...dto,
                updated_at: {
                    set: new Date(),
                }
            },
        });

        console.log(film);

        return new responseTemp('success', 'Film updated', film);
    }

    async deleteFilm(id: string) {
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
