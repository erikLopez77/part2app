"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = exports.getSession = void 0;
const express_session_1 = __importDefault(require("express-session"));
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const sequelize_1 = require("sequelize");
//as any devuelve la p. de sesion almacenada en request
const getSession = (req) => req.session;
exports.getSession = getSession;
const sessionMiddleware = () => {
    const sequelize = new sequelize_1.Sequelize({
        dialect: "sqlite",
        storage: "pkg_sessions.db" //instancia de sequelize para conectarse a SQlite
    });
    //sessionStores conector entre express-session y sequelize
    const store = new ((0, connect_session_sequelize_1.default)(express_session_1.default.Store))({
        db: sequelize
    });
    store.sync(); //inicializa db
    //representar los datos de sesión por parte del paquete.
    //gestion de cada sesion de usuario de un servidor web
    return (0, express_session_1.default)({
        secret: "mysecret",
        store: store, //almacena las sesiones en db
        cookie: { maxAge: 300 * 1000, sameSite: "strict" }, //tiempode vida de la cookie
        //resave no guarda la sesion si no hubo cambios 
        resave: false,
        //no guarda sesion vacía
        saveUninitialized: false
    });
};
exports.sessionMiddleware = sessionMiddleware;
