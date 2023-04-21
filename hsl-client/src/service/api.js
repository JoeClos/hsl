import axios from 'axios';

const stationsUrl = 'https://server-2tr8.onrender.com';

export const addStation = async (station) => {
    return await axios.post(`${stationsUrl}/addStation`, station);
}
