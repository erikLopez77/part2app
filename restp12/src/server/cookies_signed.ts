import { createHmac, timingSafeEqual } from "crypto";
//secret es la llave secreta
export const signCookie = (value: string, secret: string) => {
return value + "." + createHmac("sha512", secret)
//updateaplica el hash al valor de la cookie, digest devuelve el hash en base64
    .update(value).digest("base64url");
    //el retorno se verá como value.<valor hash>
}
export const validateCookie = (value: string, secret: string) => {
    const cookieValue = value.split(".")[0];
    //buffer from convierte en binario
    const compareBuf = Buffer.from(signCookie(cookieValue, secret));
    const candidateBuf = Buffer.from(value);
    //función timingSafeEqual, que
/* realiza una comparación byte a byte de dos objetos Buffer, que se crean a partir de los dos
códigos hash que se van a comparar. */
    if (compareBuf.length == candidateBuf.length &&
    timingSafeEqual(compareBuf, candidateBuf)) {
    return cookieValue;
}
return undefined;
}
