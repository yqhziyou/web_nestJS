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

    // 创建新的会话
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

    // 根据 sessionToken 获取会话信息
    async getSessionByToken(sessionToken: string): Promise<SessionDTO> {
        console.log(sessionToken);
        const session = await this.sessionRepository.findOne({ where: { sessionToken } });
        if (!session) {
            throw new NotFoundException('Session not found');
        }
        return plainToInstance(SessionDTO, session, { excludeExtraneousValues: true });
    }

    // 获取对话回复（包含上下文）
    async getChatResponse(sessionToken: string, content: string): Promise<string> {
        // 获取会话信息
        const session = await this.sessionRepository.findOne({
            where: { sessionToken },
            relations: ['messages'], // 如果需要加载相关联的消息
        });
        if (!session) {
            throw new NotFoundException('Session not found');
        }

        const model = session.model;

        // 获取历史消息
        const historyMessages = await this.messageRepository.find({
            where: { session: { sessionToken } },
            order: { createdAt: 'ASC' },
        });

        // 将历史消息映射为OpenAI需要的格式
        const chatMessages = historyMessages.map((msg) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
        }));

        // 保存当前用户消息
        const userMessageEntity = this.messageRepository.create({
            session,
            role: 'user',
            content: content,
            createdAt: new Date(),
        });
        await this.messageRepository.save(userMessageEntity);

        // 将本次用户消息加入上下文中
        chatMessages.push({
            role: 'user',
            content: content,
        });

        // 调用 OpenAIChatAssistant 获取带有上下文的回复
        const messageDTO = await this.openAIChatAssistant.getChatCompletion(
            session.id, // 传递 sessionId
            model,
            chatMessages,
        );

        // 更新 totalTokenUsage
        const updatedTokenUsage = session.totalTokenUsage + messageDTO.tokenUsage;
        await this.sessionRepository.update(
            { sessionToken },
            { totalTokenUsage: updatedTokenUsage },
        );

        return messageDTO.content;
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
