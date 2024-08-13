import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'Password should be at least 8 characters long.'})
    password: string;
}