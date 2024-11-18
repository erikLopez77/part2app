"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdapter = createAdapter;
const validation_types_1 = require("./validation_types");
//crea rutas Express que dependen de los métodos
//WebService<T> para producir resultados.
function createAdapter(app, ws, baseUrl) {
    app.get(baseUrl, async (req, resp) => {
        try {
            resp.json(await ws.getMany(req.query));
            resp.end();
        }
        catch (err) {
            writeErrorResponse(err, resp);
        }
    });
    app.get(`${baseUrl}/:id`, async (req, resp) => {
        try {
            const data = await ws.getOne((req.params.id));
            if (data == undefined) {
                resp.writeHead(404);
            }
            else {
                resp.json(data);
            }
            resp.end();
        }
        catch (err) {
            writeErrorResponse(err, resp);
        }
    });
    app.post(baseUrl, async (req, resp) => {
        try {
            const data = await ws.store(req.body);
            resp.json(data);
            resp.end();
        }
        catch (err) {
            writeErrorResponse(err, resp);
        }
    });
    app.delete(`${baseUrl}/:id`, async (req, resp) => {
        try {
            resp.json(await ws.delete(req.params.id));
            resp.end();
        }
        catch (err) {
            writeErrorResponse(err, resp);
        }
    });
    app.put(`${baseUrl}/:id`, async (req, resp) => {
        try {
            resp.json(await ws.replace(req.params.id, req.body));
            resp.end();
        }
        catch (err) {
            writeErrorResponse(err, resp);
        }
    });
    app.patch(`${baseUrl}/:id`, async (req, resp) => {
        try {
            resp.json(await ws.modify(req.params.id, req.body));
            resp.end();
        }
        catch (err) {
            writeErrorResponse(err, resp);
        }
    });
    const writeErrorResponse = (err, resp) => {
        console.error(err);
        //se lanzan excepciones como respuesta 400badRequest p/errores de validacion
        //respuesta 500 internal server error p/ cualquier otro problema
        resp.writeHead(err instanceof validation_types_1.ValidationError ? 400 : 500);
        resp.end();
    };
}
