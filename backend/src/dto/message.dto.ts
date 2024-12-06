import {IsString, IsNotEmpty} from 'class-validator';
import {Exclude, Expose, Type} from 'class-transformer';

@Exclude()
export class MessageDTO {
    @Expose()
    id: number;

    @Expose()
    sessionId: number;

    @Expose()
    @IsString()
    content: string;
    
    @Expose()
    role: string;

    @Expose()
    tokenUsage: number;
    
    @Expose()
    @Type(() => Date)
    createdAt: Date;
}

export class CreateMessageDTO {
    @IsNotEmpty()
    sessionId: number;
    
    model: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}