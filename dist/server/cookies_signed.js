"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCookie = exports.signCookie = void 0;
const crypto_1 = require("crypto");
//secret es la llave secreta
const signCookie = (value, secret) => {
    return value + "." + (0, crypto_1.createHmac)("sha512", secret)
        //updateaplica el hash al valor de la cookie, digest devuelve el hash en base64
        .update(value).digest("base64url");
    //el retorno se verá como value.<valor hash>
};
exports.signCookie = signCookie;
const validateCookie = (value, secret) => {
    const cookieValue = value.split(".")[0];
    //buffer from convierte en binario
    const compareBuf = Buffer.from((0, exports.signCookie)(cookieValue, secret));
    const candidateBuf = Buffer.from(value);
    //función timingSafeEqual, que
    /* realiza una comparación byte a byte de dos objetos Buffer, que se crean a partir de los dos
    códigos hash que se van a comparar. */
    if (compareBuf.length == candidateBuf.length &&
        (0, crypto_1.timingSafeEqual)(compareBuf, candidateBuf)) {
        return cookieValue;
    }
    return undefined;
};
exports.validateCookie = validateCookie;
