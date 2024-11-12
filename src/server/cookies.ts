//import { IncomingMessage, ServerResponse } from "http";
//import { signCookie, validateCookie } from "./cookies_signed";
import { CookieOptions, Request, Response } from "express";
//const setheaderName = "Set-Cookie";
//const cookieSecret = "mysecret";
export const setCookie = (resp: Response, name: string, val: string,
    opts?: CookieOptions) => {
    //crear cookies 
    resp.cookie(name, val, {
        maxAge: 300 * 1000,//milisec
        sameSite: "strict",
        signed: true,
        ...opts
    });
}
export const setJsonCookie = (resp: Response, name: string,
    val: any) => {
    setCookie(resp, name, JSON.stringify(val));
}
export const getCookie = (req: Request, key: string): string | undefined => {
    //devuelve objetos cuyas p. corresponden a nombres de cookies
    return req.signedCookies[key];
}
export const getJsonCookie = (req: Request, key: string): any => {
    const cookie = getCookie(req, key);
    return cookie ? JSON.parse(cookie) : undefined;
}