const axios = require('axios');

// I have made this file because if in future we want to make change in big project then we just have to edit in one config file.

const baseUrl = "https://ws.audioscrobbler.com";     // this is the base Url.

const api_key = "4a9f5581a9cdf20a699f540ac52a95c9";  // this api_key i got from google which is necesary to get response.

const instance = axios.create({
    baseURL: `${baseUrl}`,
  });

module.exports = {baseUrl,api_key, instance};