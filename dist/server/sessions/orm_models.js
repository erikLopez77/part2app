"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeModel = exports.SessionModel = void 0;
const sequelize_1 = require("sequelize");
//se crea el modelo
class SessionModel extends sequelize_1.Model {
} //inicia el modelo
exports.SessionModel = SessionModel;
const initializeModel = (sequelize) => {
    SessionModel.init({
        id: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
        //serializara y deserializara automaticamente en objetos de tipo DataTypes.Json
        data: { type: sequelize_1.DataTypes.JSON },
        expires: { type: sequelize_1.DataTypes.DATE }
    }, { sequelize });
};
exports.initializeModel = initializeModel;
