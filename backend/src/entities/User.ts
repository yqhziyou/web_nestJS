export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Session } from './Session';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;


    @OneToMany(() => Session, (session) => session.user, { cascade: true })
    sessions: Session[];
}
