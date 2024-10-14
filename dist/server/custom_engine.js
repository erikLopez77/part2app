"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomTemplateEngine = void 0;
const fs_1 = require("fs");
const features = __importStar(require("./custom_features"));
//lee la plantilla y despues usa parseTemplate para buscar a {{y}}
//se le pasa la ruta de plantilla, objeto p/renderizar y 
//calback p/ darle a express un error o contenido
const renderTemplate = (path, context, callback) => {
    (0, fs_1.readFile)(path, (err, data) => {
        if (err != undefined) {
            callback("Cannot generate content", undefined);
        }
        else {
            callback(undefined, parseTemplate(data.toString(), { ...context, features }));
        }
    });
}; //buscar a {{y}} e inserta el valor de datos de objeto 
const parseTemplate = (template, context) => {
    const ctx = Object.keys(context)
        .map((k) => `const ${k} = context.${k}`)
        .join(";");
    const expr = /{{(.*)}}/gm;
    return template.toString().replaceAll(expr, (match, group) => {
        const evalFunc = (expr) => {
            return eval(`${ctx};${group}`);
        };
        try {
            if (group.trim()[0] === "@") {
                group = `features.${group.trim().substring(1)}`;
                group = group.replace(/\)$/m, ", context, evalFunc)");
            }
            let result = evalFunc(group);
            if (expr.test(result)) {
                result = parseTemplate(result, context);
            }
            return result;
        }
        catch (err) {
            return err;
        }
    });
};
//registra el motor de la plantilla con express
const registerCustomTemplateEngine = (expressApp) => 
//especifica la extension del archivo, para que es tipo de file sea renderizado
expressApp.engine("custom", renderTemplate);
exports.registerCustomTemplateEngine = registerCustomTemplateEngine;
