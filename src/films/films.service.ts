import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilmDto } from './dto';
import { User } from '@prisma/client';
import { responseTemp } from 'src/response/response';

@Injectable()
export class FilmService {
    constructor( private prisma: PrismaService ) {}

    async createFilm(dto: FilmDto, video: string, cover_image?: string) {
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
                    video_url: video,
                    cover_image_url: cover_image,
                },
                include: {
                    owners: true,
                }
            });

            return new responseTemp('success', 'Film found', film);
        } catch (error) {
            return new responseTemp('error', 'Film not found', null);
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
            include: {
                owners: true,
            }
        })

        // Film not found
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
        
        return new responseTemp('success', 'Film found', film);
    }

    async updateFilm(id: string, dto: FilmDto, cover_image?: string, video?: string) {
        const existingFilm = await this.prisma.film.findUnique({ where: { id } });
        if (!existingFilm) {
            return new responseTemp('error', 'Film not found', null);
        }

        // Handle video file upload
        if (!video) {
            video = existingFilm.video_url;
        }

        // Handle cover image upload
        if (!cover_image) {
            cover_image = existingFilm.cover_image_url;
        }

        const film = await this.prisma.film.update({
            where: { id },
            data: {
                ...dto,
                updated_at: {
                    set: new Date(),
                }
            },
            include: {
                owners: true,
            }
        });

        console.log(film);

        return new responseTemp('success', 'Film found', film);
    }

    async deleteFilm(id: string) {
        try {
            const film = await this.prisma.film.delete({
                where: {
                    id: id,
                }
            })

            return new responseTemp('success', 'Film found', film);
        } catch {
            return new responseTemp('error', 'Film not found', null);
        }
    }
}
