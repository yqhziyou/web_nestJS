import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDTO, CreateUserDTO } from '../dto/user.dto';



@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<UserDTO> {
        try {
            return await this.userService.getUserById(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserDTO> {
        try {
            return await this.userService.createUser(createUserDTO);
        } catch (error) {
            throw new HttpException(
                error.message || 'Error creating user',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserDTO: CreateUserDTO,
    ): Promise<UserDTO> {
        try {
            return await this.userService.updateUser(id, updateUserDTO);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        try {
            await this.userService.deleteUser(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id/list')
    async getChatList(@Param('id') id: number): Promise<any> {
        return this.userService.getSessionById(id);
    }
}
