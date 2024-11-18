"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAuthModels = exports.CredentialsModel = void 0;
const sequelize_1 = require("sequelize");
class CredentialsModel extends sequelize_1.Model {
}
exports.CredentialsModel = CredentialsModel;
const initializeAuthModels = (sequelize) => {
    CredentialsModel.init({
        username: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
        //Blob permite cadenas o bufferes
        hashedPassword: { type: sequelize_1.DataTypes.BLOB },
        salt: { type: sequelize_1.DataTypes.BLOB }
    }, { sequelize });
};
exports.initializeAuthModels = initializeAuthModels;
