import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Session } from './Session';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    sessionId: number;

    @Column({ type: 'text' })
    content: string;
    
    @Column({ type: 'varchar'})
    role: string;

    @Column({ type: 'int', default: 0 })
    tokenUsage: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Session, (session) => session.messages, { onDelete: 'CASCADE' })
    session: Session;
}
