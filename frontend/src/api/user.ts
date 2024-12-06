// user.ts
import axios from 'axios';

const baseURL = 'http://localhost:3000';

// 根据用户 ID 获取用户信息
export const getUserInfo = async (userId: number) => {
    const response = await axios.get(`${baseURL}/users/${userId}`);
    return response.data;
};

// 创建新用户
export const createUser = async (CreateUserDTO: object) => {
    const response = await axios.post(`${baseURL}/users`, CreateUserDTO);
    return response.data;
};

//login
export const login = async (CreateUserDTO: object) => {
    const response = await axios.post(`${baseURL}/users/login`, CreateUserDTO);
    return response.data;
};


// 更新用户信息
export const updateUser = async (userId: number, CreateUserDTO: object) => {
    const response = await axios.put(`${baseURL}/users/${userId}`, CreateUserDTO);
    return response.data;
};

// 删除用户
export const deleteUser = async (userId: number) => {
    const response = await axios.delete(`${baseURL}/users/${userId}`);
    return response.data;
};

// 根据用户 ID 获取会话列表
export const getUserSessions = async (userId: number) => {
    const response = await axios.get(`${baseURL}/users/${userId}/list`);
    return response.data;
};
