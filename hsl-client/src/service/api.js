import axios from "axios";

export const api = "https://hsl-q754.onrender.com";

export const addStation = async (station) => {
  return await axios.post(`${api}/addStation`, station);
};
