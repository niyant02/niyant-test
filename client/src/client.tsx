import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:4000/api/',
    timeout: 1000,
    headers: {},
});
export default client;
