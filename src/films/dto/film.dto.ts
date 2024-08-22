import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, isString, IsString, IsUrl } from "class-validator";

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
}