// session.ts
import axios from 'axios';

const baseURL = 'http://localhost:3000';

// 创建新会话
export const createSession = async (CreateSessionDTO: object) => {
    const response = await axios.post(`${baseURL}/sessions`, CreateSessionDTO);
    return response.data;
};

// 根据 sessionToken 获取会话信息
export const getSessionInfo = async (sessionToken: string) => {
    const response = await axios.get(`${baseURL}/sessions/${sessionToken}`);
    return response.data;
};

// 获取对话回复（包含上下文）
export const getMessageReply = async (sessionToken: string, content: string) => {
    const response = await axios.post(`${baseURL}/sessions/${sessionToken}/messages`, { content });
    return response.data;
};

// 获取会话的消息列表
export const getMessageList = async (sessionToken: string) => {
    const response = await axios.get(`${baseURL}/sessions/${sessionToken}/list`);
    return response.data;
};
