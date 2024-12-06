import {Exclude, Expose, Type} from 'class-transformer';
import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';


@Exclude()
export class UserDTO {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    @Type(() => Date) 
    createdAt: Date;

    @Expose()
    @Type(() => Date)
    updatedAt: Date;
    
    @Expose()
    userTokenUsage: number;
    
}

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}