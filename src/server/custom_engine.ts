import { readFile } from "fs";
import { Express } from "express";
import * as features from "./custom_features";
//lee la plantilla y despues usa parseTemplate para buscar a {{y}}
//se le pasa la ruta de plantilla, objeto p/renderizar y 
//calback p/ darle a express un error o contenido
const renderTemplate = (path: string, context: any,
    callback: (err: any, response: string | undefined) => void) => {
    readFile(path, (err, data) => {
        if (err != undefined) {
            callback("Cannot generate content", undefined);
        } else {
            callback(undefined, parseTemplate(data.toString(), { ...context, features }));
        }
    });
};//buscar a {{y}} e inserta el valor de datos de objeto 
const parseTemplate = (template: string, context: any) => {
    const ctx = Object.keys(context)
        .map((k) => `const ${k} = context.${k}`)
        .join(";");
    const expr = /{{(.*)}}/gm;
    return template.toString().replaceAll(expr, (match, group) => {
        const evalFunc = (expr: string) => {
            return eval(`${ctx};${group}`);
        }
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
        } catch (err: any) {
            return err;
        }
    });
}

//registra el motor de la plantilla con express
export const registerCustomTemplateEngine = (expressApp: Express) =>
    //especifica la extension del archivo, para que es tipo de file sea renderizado
    expressApp.engine("custom", renderTemplate);