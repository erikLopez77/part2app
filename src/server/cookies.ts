import { IncomingMessage, ServerResponse } from "http";
const setheaderName = "Set-Cookie";
export const setCookie = (resp: ServerResponse, name: string,
    val: string) => {
    let cookieVal: any[] = [`${name}=${val}; Max-Age=300; SameSite=Strict }`];
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
    key: string): string | undefined => {
    let result: string | undefined = undefined;
    req.headersDistinct["cookie"]?.forEach(header => {
        //obtiene el clave-valor
        header.split(";").forEach(cookie => {
            const { name, val }
                = /^(?<name>.*)=(?<val>.*)$/.exec(cookie)?.groups as any;
            if (name.trim() === key) {
                result = val;
            }
        })
    });
    return result;
}
export const getJsonCookie = (req: IncomingMessage, key: string): any => {
    const cookie = getCookie(req, key);
    return cookie ? JSON.parse(cookie) : undefined;
}