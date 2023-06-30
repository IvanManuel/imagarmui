
import axios from "axios";

const imagarApi = axios.create({
    baseURL: '/api'
});

export default imagarApi;