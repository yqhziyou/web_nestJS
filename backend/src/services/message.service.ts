import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message';
import { MessageDTO } from '../dto/message.dto';
import { plainToInstance } from 'class-transformer';
import OpenAI from "openai";

@Injectable()
export class OpenAIChatAssistant {
    private openai: OpenAI;

    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // 请确保已在环境变量中配置
        });
    }

    public async getChatCompletion(sessionId: number, model: string, chatMessages: { role: "user" | "assistant" | "system"; content: string; name?: string }[]): Promise<MessageDTO> {
        try {
            const completion = await this.openai.chat.completions.create({
                model,
                messages: chatMessages,
            });

            const responseContent = completion.choices[0].message.content;
            const tokenUsage = completion.usage?.total_tokens || 0;

            // 构造assistant消息的MessageDTO
            const messageDTO = plainToInstance(MessageDTO, {
                sessionId: sessionId,
                role: 'assistant',
                content: responseContent,
                tokenUsage: tokenUsage,
                createdAt: new Date(),
            });

            // 保存assistant消息到数据库
            const messageEntity = this.messageRepository.create(messageDTO);
            await this.messageRepository.save(messageEntity);

            return messageDTO;
        } catch (error) {
            console.error("Error fetching chat completion: ", error);
            throw error;
        }
    }
}
