import axios from "axios";
import { config } from "../config/constants.js";

export const getDataWithoutURL = async endpoint => {
  return axios.get(config.URL + endpoint);
};

export const postDataWithoutURL = (endpoint, body) => {
  axios
    .get(config.URL + endpoint, body)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      return false;
    });
};
