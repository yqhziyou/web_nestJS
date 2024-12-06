import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';

@Exclude()
export class SessionDTO {
    @Expose()
    id: number;

    @Expose()
    userId: number;

    @Expose()
    @IsUUID()
    sessionToken: string;

    @Expose()
    @IsString()
    @MaxLength(50)
    model: string;

    @Expose()
    @Type(() => Date)
    createdAt: Date;

    @Expose()
    @Type(() => Date)
    updatedAt: Date;
    
    @Expose()
    totalTokenUsage: number;
}

export class CreateSessionDTO {
    @IsNotEmpty()
    userId: number;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    model: string;
}
