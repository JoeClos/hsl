import axios from "axios";

export const api = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const addStation = async (station) => {
  return await axios.post(`${api}/addStation`, station);
};
