"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonCookie = exports.getCookie = exports.setJsonCookie = exports.setCookie = void 0;
//const setheaderName = "Set-Cookie";
//const cookieSecret = "mysecret";
const setCookie = (resp, name, val, opts) => {
    //crear cookies 
    resp.cookie(name, val, {
        maxAge: 300 * 1000,
        sameSite: "strict",
        signed: true,
        ...opts
    });
};
exports.setCookie = setCookie;
const setJsonCookie = (resp, name, val) => {
    (0, exports.setCookie)(resp, name, JSON.stringify(val));
};
exports.setJsonCookie = setJsonCookie;
const getCookie = (req, key) => {
    //devuelve objetos cuyas p. corresponden a nombres de cookies
    return req.signedCookies[key];
};
exports.getCookie = getCookie;
const getJsonCookie = (req, key) => {
    const cookie = (0, exports.getCookie)(req, key);
    return cookie ? JSON.parse(cookie) : undefined;
};
exports.getJsonCookie = getJsonCookie;
