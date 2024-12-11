import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { Message } from './entities/Message';
import { Session } from './entities/Session';
import { User } from './entities/User';
import { OpenAIChatAssistant } from 'src/services/message.service';
import { SessionService } from './services/session.service';
import { SessionController } from './controllers/session.controller';
import * as dotenv from 'dotenv';

dotenv.config();
console.log('DB_HOST:', process.env.DB_HOST);
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      autoLoadEntities: true,
      //synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Message, Session, User]),
  ],
  controllers: [UserController, SessionController],
  providers: [UserService, OpenAIChatAssistant, SessionService],
})
export class AppModule {}
