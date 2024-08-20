import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'Password should be at least 8 characters long'})
    password: string;
}