const axios = require('axios');
require('dotenv').config();

var Token = {};

module.exports.getToken = async (cb) => {
    checkToken(pass => {
        // If token not valid then pass them
        pass
        ? cb(Token.token)
        // Else check if refresh token is stock
        : Token.refresh
            // Check if refresh token exist and if not generate new token
            ? getTokenFromRefresh((data) => cb(data.status == true ? Token.token : data))
            : getNewToken((data) => cb(data.status == true ? Token.token : data));
    })
}

// Check if token is not valid.
async function checkToken(cb) {
    Token.token
    // Checking is token not valid
    ?   axios({
            method: "GET",
            url: process.env.TOKEN_CHECK_URL,
            headers: {
                "Authorization": `Bearer ${Token.token}`,
            }
        }).then(() => {
            cb(true)
        }).catch(() => {
            cb(false)
        })
    // Return false if token does not exist
    :   cb(false)
}

async function getNewToken(cb) {
    axios({
        method: "POST",
        url: process.env.TOKEN_URL,
        data: {
            "email": process.env.LOGIN_EMAIL,
            "password": process.env.LOGIN_PASSWORD
        },
        headers: {
            "Content-Type":"application/json"
        }
    }).then((response) => {
        Token.token = response.data.token,
        Token.refresh = response.data.refresh_token

        cb({status: true});
    }).catch((data) => {
        data 
        ? cb({status: false, data: data.response.data})
        : cb({status: false, data: 'Cannot connect to API server.'})
    })
}

// Get new token from refresh and check is not valid.
function getTokenFromRefresh(cb) {
    axios({
        method: "POST",
        url: process.env.TOKEN_REFRESH_URL,
        data: {
            "refresh_token": Token.refresh
        },
        headers: {
            "Content-Type":"application/json"
        }
    }).then((response) => {
        Token.token = response.data.token

        checkToken(pass => {
            pass
                ? cb({status: true})
                : getNewToken((data) => cb(data));
        })
    }).catch(() => {
        getNewToken((data) => cb(data));
    })
}