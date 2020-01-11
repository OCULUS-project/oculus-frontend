import axios from "axios";
import { config } from "../config/constants.js";

export const getDataWithoutURL = async endpoint => {
  return axios.get(config.URL + endpoint);
};

export const postDataWithoutURL = async (endpoint, body) => {
  return axios.post(config.URL + endpoint, body, {
    "Content-Type": "application/json"
  });
};
