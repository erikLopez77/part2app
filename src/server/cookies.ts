import { IncomingMessage, ServerResponse } from "http";
import { signCookie, validateCookie } from "./cookies_signed";

const setheaderName = "Set-Cookie";
const cookieSecret = "mysecret";
export const setCookie = (resp: ServerResponse, name: string,
    val: string) => {
        const signedCookieVal = signCookie(val, cookieSecret);
         //name=val.<valor hash>
    let cookieVal: any[] = [`${name}=${signedCookieVal}; Max-Age=300; SameSite=Strict }`];
    if (resp.hasHeader(setheaderName)) {
        cookieVal.push(resp.getHeader(setheaderName));
    }//cookies se envían por ese encabezado
    resp.setHeader("Set-Cookie", cookieVal);
}
export const setJsonCookie = (resp: ServerResponse, name: string,
    val: any) => {
    setCookie(resp, name, JSON.stringify(val));
}
export const getCookie = (req: IncomingMessage,
    //string:|undefined es lo que se devuelve si no se encuentra la cookie
    key: string): string | undefined => {
    //inicializa el result como indefinido
    let result: string | undefined = undefined;
    //se accede a las cabeceras de cookies
    req.headersDistinct["cookie"]?.forEach(header => {
        //obtiene el clave-valor
        header.split(";").forEach(cookie => {
            const { name, val }
                = /^(?<name>.*)=(?<val>.*)$/.exec(cookie)?.groups as any;
                //name=myCookie.<valor hash>
                //si name sin espacios coincide con key
            if (name.trim() === key) {
                result = validateCookie(val, cookieSecret)
            }
        })
    });
    return result;
}
export const getJsonCookie = (req: IncomingMessage, key: string): any => {
    const cookie = getCookie(req, key);
    return cookie ? JSON.parse(cookie) : undefined;
}