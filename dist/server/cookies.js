"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonCookie = exports.getCookie = exports.setJsonCookie = exports.setCookie = void 0;
const cookies_signed_1 = require("./cookies_signed");
const setheaderName = "Set-Cookie";
const cookieSecret = "mysecret";
const setCookie = (resp, name, val) => {
    const signedCookieVal = (0, cookies_signed_1.signCookie)(val, cookieSecret);
    //name=val.<valor hash>
    let cookieVal = [`${name}=${signedCookieVal}; Max-Age=300; SameSite=Strict }`];
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
const getCookie = (req, 
//string:|undefined es lo que se devuelve si no se encuentra la cookie
key) => {
    //inicializa el result como indefinido
    let result = undefined;
    //se accede a las cabeceras de cookies
    req.headersDistinct["cookie"]?.forEach(header => {
        //obtiene el clave-valor
        header.split(";").forEach(cookie => {
            const { name, val } = /^(?<name>.*)=(?<val>.*)$/.exec(cookie)?.groups;
            //name=myCookie.<valor hash>
            //si name sin espacios coincide con key
            if (name.trim() === key) {
                result = (0, cookies_signed_1.validateCookie)(val, cookieSecret);
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
