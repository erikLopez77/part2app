"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultModel = exports.Calculation = exports.Person = void 0;
const sequelize_1 = require("sequelize"); //definimos la clase Person
//inferAttributes, definen atributos de un moelo,tal y como aparecen
//inferCreationAttributes define atribuyosnecesarios al momento de crear una instancia
class Person extends sequelize_1.Model {
} //tabla calculation
exports.Person = Person;
class Calculation extends sequelize_1.Model {
} //tabla result model
exports.Calculation = Calculation;
class ResultModel extends sequelize_1.Model {
}
exports.ResultModel = ResultModel;
