"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrmRepository = void 0;
const sequelize_1 = require("sequelize");
const orm_helpers_1 = require("./orm_helpers");
const orm_models_1 = require("./orm_models");
class OrmRepository {
    sequelize;
    constructor() {
        this.sequelize = new sequelize_1.Sequelize({
            dialect: "sqlite",
            storage: "orm_age.db",
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase(); //llama a ese metodo p/configurar
        //sincronizar datos
    } //se conecta a db configura tablas y relaciones
    async initModelAndDatabase() {
        //configuran modelos de datos
        (0, orm_helpers_1.initializeModels)(this.sequelize);
        (0, orm_helpers_1.defineRelationships)();
        await this.sequelize.drop(); //eliminamos tablas
        await this.sequelize.sync(); //sincroniza DB con objetos del mod DB
        await (0, orm_helpers_1.addSeedData)(this.sequelize); //add initial data to DB
    } //escritura de archivos
    async saveResult(r) {
        //transaction agrupa operaciones 
        return await this.sequelize.transaction(async (tx) => {
            const [person] = await orm_models_1.Person.findOrCreate({
                //verifica si person existe basado en el nombre, sino lo crea 
                where: { name: r.name },
                transaction: tx
            }); //verifica si caluclation existe basado en el age, years,nextage sino lo crea 
            const result = await orm_models_1.ResultModel.create({
                personId: person.id,
            }, { transaction: tx });
            return result.id;
        });
    } //se consultan bd, incluyen modelos Person y Calculation
    async getAllResults(limit) {
        //obtiene todos los resultados
        return (await orm_models_1.ResultModel.findAll({
            //incluye datos de Person, Calculation
            include: [orm_models_1.Person, orm_models_1.Calculation],
            limit,
            order: [["id", "DESC"]]
            //map y fromOrmModel convierte resuktados para interfaz Result
        })).map(row => (0, orm_helpers_1.fromOrmModel)(row));
    }
    async getResultsByName(name, limit) {
        return (await orm_models_1.ResultModel.findAll({
            //incluye a Person y Calculation
            include: [orm_models_1.Person, orm_models_1.Calculation],
            //filtra res donde arg name coincide con Person.name
            where: {
                "$Person.name$": name
            },
            limit, order: [["id", "DESC"]]
        })).map(row => (0, orm_helpers_1.fromOrmModel)(row));
    }
}
exports.OrmRepository = OrmRepository;
