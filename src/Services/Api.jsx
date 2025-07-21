import axios from "axios";
import { buildFormData } from "../Utils/helper";

/**
 * Performs a GET request to fetch data from the specified route.
 * @param {string} route The API route to fetch data from.
 * @param {object} params Optional parameters for the GET request.
 * @returns {Promise} A promise resolving to the fetched data.
 */

export const getAll = async (route, params = {}) => {
  try {
    const { data } = await axios.get(route, { params });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error.response;
  }
};

/**
 * Performs a GET request to fetch details from the specified route.
 * @param {string} route The API route to fetch details from.
 * @returns {Promise} A promise resolving to the fetched details.
 */

export const getDetails = async (route) => {
  try {
    const { data } = await axios.get(route);
    return data;
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error.response;
  }
};

/**
 * Performs a POST request to submit data to the specified route.
 * @param {string} route The API route to submit data to.
 * @param {object} params The data to submit.
 * @returns {Promise} A promise resolving to the server response data.
 */

export const post = async (route, params = {}) => {
  try {
    const formData = new FormData();
    buildFormData(formData, params);
    const { data } = await axios.post(route, formData);
    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    return error.response.data;
  }
};

/**
 * Performs a DELETE request to delete data from the specified route.
 * @param {string} route The API route to delete data from.
 * @param {object} params Optional parameters for the DELETE request.
 * @returns {Promise} A promise resolving to the server response data.
 */

export const deleteData = async (route, params = {}) => {
  try {
    const formData = new FormData();
    buildFormData(formData, params);
    const { data } = await axios.delete(route, { data: formData });
    return data;
  } catch (error) {
    console.error('Error deleting data:', error);
    return error.response.data;
  }
};


export const logout = async (route, params = {}) => {
  try {
    let { data } = await axios.post(route);
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    return data;
  } catch (error) {
    return error.response.data;
  }
};
