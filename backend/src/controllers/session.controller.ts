import { Controller, Get, Post, Param, Body, NotFoundException } from "@nestjs/common";
import { SessionService } from "../services/session.service";
import { SessionDTO, CreateSessionDTO } from "../dto/session.dto";
import { MessageDTO } from "../dto/message.dto";

@Controller('sessions')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}
    
    @Post()
    async createSession(@Body() createSessionDTO: CreateSessionDTO): Promise<SessionDTO> {
        return this.sessionService.createSession(createSessionDTO);
    }
    
    @Get(':sessionToken')
    async getSessionByToken(@Param('sessionToken') sessionToken: string): Promise<SessionDTO> {
        const session = await this.sessionService.getSessionByToken(sessionToken);
        if (!session) {
            throw new NotFoundException('Session not found');
        }
        return session;
    }
    
    @Post(':sessionToken/messages')
    async getChatResponse(@Param('sessionToken') sessionToken: string, @Body('content') content: string): Promise<MessageDTO> {
        return this.sessionService.getChatResponse(sessionToken, content);
    }

    @Get(':sessionToken/list')
    async getChatList(@Param('sessionToken') sessionToken: string): Promise<MessageDTO[]> {
        return this.sessionService.getMessages(sessionToken);
    }
}
