import axios from 'axios';

const stationsUrl = 'http://localhost:8000';

export const addStation = async (station) => {
    return await axios.post(`${stationsUrl}/addStation`, station);
}
