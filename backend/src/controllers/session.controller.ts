import { Controller, Get, Post, Param, Body, NotFoundException } from "@nestjs/common";
import { SessionService } from "../services/session.service";
import { SessionDTO, CreateSessionDTO } from "../dto/session.dto";
import { MessageDTO } from "../dto/message.dto";

@Controller('sessions')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    // 创建新的会话
    @Post()
    async createSession(@Body() createSessionDTO: CreateSessionDTO): Promise<SessionDTO> {
        return this.sessionService.createSession(createSessionDTO);
    }

    // 根据 sessionId 获取会话信息
    @Get(':sessionToken')
    async getSessionByToken(@Param('sessionToken') sessionToken: string): Promise<SessionDTO> {
        const session = await this.sessionService.getSessionByToken(sessionToken);
        if (!session) {
            throw new NotFoundException('Session not found');
        }
        return session;
    }

    // 获取对话回复（包含上下文）
    @Post(':sessionToken/messages')
    async getChatResponse(@Param('sessionToken') sessionToken: string, @Body('content') content: string): Promise<string> {
        return this.sessionService.getChatResponse(sessionToken, content);
    }

    @Get(':sessionToken/list')
    async getChatList(@Param('sessionToken') sessionToken: string): Promise<MessageDTO[]> {
        return this.sessionService.getMessages(sessionToken);
    }
}
