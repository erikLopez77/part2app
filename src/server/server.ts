import { createServer } from "http";
import express, { Express } from "express";
import { testHandler } from "./testHandler";
import httpProxy from "http-proxy";
import helmet from "helmet";
import { engine } from "express-handlebars";
import * as helpers from "./template_helpers";
import { registerFormMiddleware, registerFormRoutes } from "./forms";

const port = 5000;
const expressApp: Express = express();
const proxy = httpProxy.createProxyServer({
    target: "http://localhost:5100", ws: true
});
//express busca  archivos de plantilla en esa carpeta
expressApp.set("views", "templates/server");
//establece a Handlebars como motor de plantillas
expressApp.engine("handlebars", engine());
//se usa el motor de plantillas "handlebars"
expressApp.set("view engine", "handlebars");

expressApp.use(helmet());
expressApp.use(express.json());
registerFormMiddleware(expressApp);
registerFormRoutes(expressApp);
//hace coincidir soli. por medio de plantillas
//get creauna ruta
expressApp.get("/dynamic/:file", (req, resp) => {
    //se renderiza una vista, y se le pasa message,req y helpers
    resp.render(`${req.params.file}.handlebars`,
        {
            message: "Hello template", req,
            helpers: { ...helpers } //toda funcion helpers, estaran disponibles en handlebars
        });
});

expressApp.post("/test", testHandler);
expressApp.use(express.static("static"));
expressApp.use(express.static("node_modules/bootstrap/dist"));
//use agrega middleware redirige req a la url de target, no Sockets
expressApp.use((req, resp) => proxy.web(req, resp));
const server = createServer(expressApp);
//se activa una req de upgrade, redirecciona a webSockets
server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));
server.listen(port, () => console.log(`HTTP Server listening on http://localhost:${port}`));
