import axios from "axios";

const baseUrl: string | undefined = process.env.REACT_APP_BASEURL;
export const get = (url: string, headers: any = {}) => {
  return axios.get(`${baseUrl}/${url}`, headers);
};
export const post = (url: string, data: any = {}, headers: any = {"Content-Type": "application/json"}) => {
  return axios.post(`${baseUrl}/${url}`, data, headers);
};
