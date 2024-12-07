// user.ts
import axios from 'axios';

const baseURL = 'http://localhost:3000';


export const getUserInfo = async (userId: number) => {
    const response = await axios.get(`${baseURL}/users/${userId}`);
    return response.data;
};


export const createUser = async (CreateUserDTO: object) => {
    const response = await axios.post(`${baseURL}/users`, CreateUserDTO);
    return response.data;
};


export const login = async (CreateUserDTO: object) => {
    const response = await axios.post(`${baseURL}/users/login`, CreateUserDTO);
    return response.data;
};



export const updateUser = async (userId: number, CreateUserDTO: object) => {
    const response = await axios.put(`${baseURL}/users/${userId}`, CreateUserDTO);
    return response.data;
};


export const deleteUser = async (userId: number) => {
    const response = await axios.delete(`${baseURL}/users/${userId}`);
    return response.data;
};


export const getUserSessions = async (userId: number) => {
    const response = await axios.get(`${baseURL}/users/${userId}/list`);
    return response.data;
};
