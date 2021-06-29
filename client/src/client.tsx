import axios from 'axios';
import { AUTH_TOKEN } from './constants';

const authToken = localStorage.getItem(AUTH_TOKEN);

const client = axios.create({
    baseURL: 'http://localhost:4000/api/',
    timeout: 1000,
    headers: {
        Authorization: authToken || null,
    },
});
export default client;
