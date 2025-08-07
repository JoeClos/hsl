import axios from "axios";

export const api = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const addStation = async (station) => {
  return await axios.post(`${api}/addStation`, station);
};
