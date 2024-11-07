"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonCookie = exports.getCookie = exports.setJsonCookie = exports.setCookie = void 0;
const setheaderName = "Set-Cookie";
const setCookie = (resp, name, val) => {
    let cookieVal = [`${name}=${val}; Max-Age=300; SameSite=Strict }`];
    if (resp.hasHeader(setheaderName)) {
        cookieVal.push(resp.getHeader(setheaderName));
    } //cookies se envían por ese encabezado
    resp.setHeader("Set-Cookie", cookieVal);
};
exports.setCookie = setCookie;
const setJsonCookie = (resp, name, val) => {
    (0, exports.setCookie)(resp, name, JSON.stringify(val));
};
exports.setJsonCookie = setJsonCookie;
const getCookie = (req, key) => {
    let result = undefined;
    req.headersDistinct["cookie"]?.forEach(header => {
        //obtiene el clave-valor
        header.split(";").forEach(cookie => {
            const { name, val } = /^(?<name>.*)=(?<val>.*)$/.exec(cookie)?.groups;
            if (name.trim() === key) {
                result = val;
            }
        });
    });
    return result;
};
exports.getCookie = getCookie;
const getJsonCookie = (req, key) => {
    const cookie = (0, exports.getCookie)(req, key);
    return cookie ? JSON.parse(cookie) : undefined;
};
exports.getJsonCookie = getJsonCookie;
