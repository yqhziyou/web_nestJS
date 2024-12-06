import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/Session';
import { Message } from '../entities/Message';
import { SessionDTO, CreateSessionDTO } from '../dto/session.dto';
import { plainToInstance } from 'class-transformer';
import { OpenAIChatAssistant } from "./message.service";
import {MessageDTO} from "../dto/message.dto";

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        private readonly openAIChatAssistant: OpenAIChatAssistant,
    ) {}

  
    async createSession(createSessionDTO: CreateSessionDTO): Promise<SessionDTO> {
        const session = this.sessionRepository.create({
            userId: createSessionDTO.userId,
            model: createSessionDTO.model ?? 'gpt-4o',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedSession = await this.sessionRepository.save(session);
        return plainToInstance(SessionDTO, savedSession, { excludeExtraneousValues: true });
    }

  
    async getSessionByToken(sessionToken: string): Promise<SessionDTO> {
        console.log(sessionToken);
        const session = await this.sessionRepository.findOne({ where: { sessionToken } });
        if (!session) {
            throw new NotFoundException('Session not found');
        }
        return plainToInstance(SessionDTO, session, { excludeExtraneousValues: true });
    }


    async getChatResponse(sessionToken: string, content: string): Promise<MessageDTO> {
       
        const session = await this.sessionRepository.findOne({
            where: { sessionToken },
            relations: ['messages'], 
        });
        if (!session) {
            throw new NotFoundException('Session not found');
        }

        const model = session.model;

     
        const historyMessages = await this.messageRepository.find({
            where: { session: { sessionToken } },
            order: { createdAt: 'ASC' },
        });

       
        const chatMessages = historyMessages.map((msg) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
        }));

       
        const userMessageEntity = this.messageRepository.create({
            session,
            role: 'user',
            content: content,
            createdAt: new Date(),
        });
        await this.messageRepository.save(userMessageEntity);

    
        chatMessages.push({
            role: 'user',
            content: content,
        });

  
        const messageDTO = await this.openAIChatAssistant.getChatCompletion(
            session.id, 
            model,
            chatMessages,
        );

        
        const updatedTokenUsage = session.totalTokenUsage + messageDTO.tokenUsage;
        await this.sessionRepository.update(
            { sessionToken },
            { totalTokenUsage: updatedTokenUsage },
        );

        return messageDTO;
    }

    async getMessages(sessionToken: string): Promise<MessageDTO[]> {
        const messages = await this.messageRepository.find({
            where: { session: { sessionToken } },
            order: { createdAt: 'ASC' },
        });

        if (!messages.length) {
            throw new NotFoundException('No messages found for the given sessionToken');
        }

        return plainToInstance(MessageDTO, messages, { excludeExtraneousValues: true });
    }
    
}
