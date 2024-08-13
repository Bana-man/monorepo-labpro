import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from "class-validator";

export class FilmDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    director: string;

    @IsNotEmpty()
    @IsNumber()
    release_year: number;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    genre: string[];

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    duration: number;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    video_url: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    cover_image_url: string;
}