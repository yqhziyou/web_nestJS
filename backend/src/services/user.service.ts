import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/User";
import { UserDTO, CreateUserDTO } from "../dto/user.dto";
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {SessionDTO} from "../dto/session.dto";
import {Session} from "../entities/Session";
import * as bcrypt from 'bcrypt';

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
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);

        const user = this.userRepository.create({ ...createUserDTO, password: hashedPassword });
        const savedUser = await this.userRepository.save(user);
        return plainToInstance(UserDTO, savedUser);
    }

    async login(createUserDTO: CreateUserDTO): Promise<UserDTO> {
        const { username, password } = createUserDTO;
        if (!username || !password) {
            throw new NotFoundException('Username or password is missing');
        }
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new BadRequestException('User not found or credentials are incorrect');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('User not found or credentials are incorrect');
        }

        return plainToInstance(UserDTO, user);
    }

    async updateUser(id: number, updateUserDTO: CreateUserDTO): Promise<UserDTO> {
        if (updateUserDTO.password) {
            const salt = await bcrypt.genSalt();
            updateUserDTO.password = await bcrypt.hash(updateUserDTO.password, salt);
        }
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
