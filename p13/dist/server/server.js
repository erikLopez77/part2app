"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const helmet_1 = __importDefault(require("helmet"));
const express_handlebars_1 = require("express-handlebars");
const forms_1 = require("./forms");
const api_1 = require("./api");
const auth_1 = require("./auth");
const port = 5000;
const expressApp = (0, express_1.default)();
const proxy = http_proxy_1.default.createProxyServer({
    target: "http://localhost:5100", ws: true
});
//express busca  archivos de plantilla en esa carpeta
expressApp.set("views", "templates/server");
//establece a Handlebars como motor de plantillas
expressApp.engine("handlebars", (0, express_handlebars_1.engine)());
//se usa el motor de plantillas "handlebars"
expressApp.set("view engine", "handlebars");
//hace coincidir soli. por medio de plantillas
expressApp.use((0, helmet_1.default)());
expressApp.use(express_1.default.json({ type: ["application/json", "application/json-patch+json"] }));
(0, forms_1.registerFormMiddleware)(expressApp);
(0, auth_1.createAuth)(expressApp);
(0, forms_1.registerFormRoutes)(expressApp);
(0, api_1.createApi)(expressApp);
expressApp.use("^/$", (req, resp) => resp.redirect("/form"));
expressApp.use(express_1.default.static("static"));
expressApp.use(express_1.default.static("node_modules/bootstrap/dist"));
//use agrega middleware redirige req a la url de target, no Sockets
expressApp.use((req, resp) => proxy.web(req, resp));
const server = (0, http_1.createServer)(expressApp);
//se activa una req de upgrade, redirecciona a webSockets
server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));
server.listen(port, () => console.log(`HTTP Server listening on http://localhost:${port}`));
