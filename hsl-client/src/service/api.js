import axios from "axios";

export const api = import.meta.env.REACT_APP_API_URL;

export const addStation = async (station) => {
  return await axios.post(`${api}/addStation`, station);
};
