import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
    sessionToken: string;

    @Column({ type: 'varchar', length: 50, default: 'gpt-4o' })
    model: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'int',default: 0 })
    totalTokenUsage: number;

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Message, (message) => message.session, { cascade: true })
    messages: Message[];
}
