// session.ts
import axios from 'axios';

const baseURL = 'https://portable-ai.xyz';


export const createSession = async (CreateSessionDTO: object) => {
    const response = await axios.post(`${baseURL}/sessions`, CreateSessionDTO);
    return response.data;
};


export const getSessionInfo = async (sessionToken: string) => {
    const response = await axios.get(`${baseURL}/sessions/${sessionToken}`);
    return response.data;
};


export const getMessageReply = async (sessionToken: string, content: string) => {
    const response = await axios.post(`${baseURL}/sessions/${sessionToken}/messages`, { content });
    return response.data;
};


export const getMessageList = async (sessionToken: string) => {
    const response = await axios.get(`${baseURL}/sessions/${sessionToken}/list`);
    return response.data;
};
