const axios = require('axios');
require('dotenv').config();

var refreshToken;

module.exports.getToken = async (cbr) => {
    refreshToken
    ? getTokenFromRefresh(refreshToken, callback => { cbr(callback) })
    : getNewToken(callback => { cbr(callback) })
}

async function getNewToken(callback) {
    axios.post(process.env.TOKEN_URL, {
        "email": process.env.LOGIN_EMAIL,
        "password": process.env.LOGIN_PASSWORD
    }).then((response) => {
        if(response.status === 200) {
            refreshToken = response.data.refresh_token;

            callback(response.data.token);
        }
    }).catch((data) => {
        callback(data.response.data);
    })
}

function getTokenFromRefresh(refresh) {
    axios.post(process.env.TOKEN_REFRESH_URL, {
        "refresh_token": refresh
    }).then((response) => {
        refreshToken = response.data.refresh_token

        return response.data.token;
    }).catch((data) => {
        return data.response.data;
    })
}