import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/User";
import { UserDTO, CreateUserDTO } from "../dto/user.dto";
import {Injectable, NotFoundException} from "@nestjs/common";
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {SessionDTO} from "../dto/session.dto";
import {Session} from "../entities/Session"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) {}

    async getUserById(id: number): Promise<UserDTO> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return plainToInstance(UserDTO, user);
    }

    async createUser(createUserDTO: CreateUserDTO): Promise<UserDTO> {
        const user = this.userRepository.create(createUserDTO);
        const savedUser = await this.userRepository.save(user);
        return plainToInstance(UserDTO, savedUser);
    }

    async updateUser(id: number, updateUserDTO: CreateUserDTO): Promise<UserDTO> {
        await this.userRepository.update(id, updateUserDTO);
        const updatedUser = await this.userRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return plainToInstance(UserDTO, updatedUser);
    }

    async deleteUser(id: number): Promise<void> {
        const deleteResult = await this.userRepository.delete(id);
        if (!deleteResult.affected) {
            throw new Error('User not found');
        }
    }
    
    async getSessionById(id: number): Promise<SessionDTO[]> {
        console.log("service:",id);
        if (!id){
            throw new Error('User not found');
        }

        const sessions = await this.sessionRepository.find({
            where: { userId: id },
            order: { updatedAt: 'DESC' },
        });
        
        if (!sessions) {
            throw new NotFoundException('session not found');
        }
        
        return plainToInstance(SessionDTO, sessions,{ excludeExtraneousValues: true });
        
    }
    
}
