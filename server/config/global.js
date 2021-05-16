require('dotenv').config();

const restrictController = false;
const useAuth = true;
const secretKey = process.env.API_ACCESS_KEY;
const tokenExpiresIn = 600; // second
const refreshTokenExpiresIn = 7 * 24 * 60 * 60;
const useDecodeQueryParam = false;

const controllerList = [
    
];

const exceptAuth = [
    
]

module.exports = {
    restrictController,
    controllerList,
    useAuth: controller => exceptAuth.includes(controller) ? false : useAuth,
    useAuth,
    secretKey,
    tokenExpiresIn,
    refreshTokenExpiresIn,
    useDecodeQueryParam
}