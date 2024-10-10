import { readFile } from "fs";
import { Express } from "express";
//lee la plantilla y despues usa parseTemplate para buscar a {{y}}
//se le pasa la ruta de plantilla, objeto p/renderizar y 
//calback p/ darle a express un error o contenido
const renderTemplate = (path: string, context: any,
    callback: (err: any, response: string | undefined) => void) => {
    readFile(path, (err, data) => {
        if (err != undefined) {
            callback("Cannot generate content", undefined);
        } else {
            callback(undefined, parseTemplate(data.toString(), context));
        }
    });
};//buscar a {{y}} e inserta el valor de datos de objeto 
const parseTemplate = (template: string, context: any) => {
    const expr = /{{(.*)}}/gm;
    return template.toString().replaceAll(expr, (match, group) => {
        return context[group.trim()] ?? "(no data)"
    });
}
//registra el motor de la plantilla con express
export const registerCustomTemplateEngine = (expressApp: Express) =>
    //especifica la extension del archivo, para que es tipo de file sea renderizado
    expressApp.engine("custom", renderTemplate);