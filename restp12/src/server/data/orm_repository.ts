import { Sequelize } from "sequelize";
import { ApiRepository, Result } from "./repository";
import { addSeedData, defineRelationships, fromOrmModel, initializeModels } from
    "./orm_helpers";
import { Calculation, Person, ResultModel } from "./orm_models";
export class OrmRepository implements ApiRepository {//crud
    sequelize: Sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",//se configura p/usar sqlite
            storage: "orm_age.db",//archivo de almacenamiento
            logging: console.log,//permite ver los logs en la consola
            logQueryParameters: true
        });
        this.initModelAndDatabase();//llama a ese metodo p/configurar
        //sincronizar datos
    }//se conecta a db configura tablas y relaciones
    async initModelAndDatabase(): Promise<void> {
        //configuran modelos de datos
        initializeModels(this.sequelize);
        defineRelationships();
        await this.sequelize.drop();//eliminamos tablas
        await this.sequelize.sync();//sincroniza DB con objetos del mod DB
        await addSeedData(this.sequelize);//add initial data to DB
    }//escritura de archivos
    async saveResult(r: Result): Promise<number> {
        //transaction agrupa operaciones
        return await this.sequelize.transaction(async (tx) => {
            const [person] = await Person.findOrCreate({//busca o crea una entrada
                //verifica si person existe basado en el nombre, sino lo crea
                where: { name: r.name },
                transaction: tx
            });//verifica si caluclation existe basado en el age, years,nextage sino lo crea
            const [calculation] = await Calculation.findOrCreate({
                where: {
                    age: r.age, years: r.years, nextage: r.nextage
                },
                    transaction: tx
                });
            return (await ResultModel.create(
                {
                    personId: person.id,
                    calculationId: calculation.id
                },
                { transaction: tx })).id;
        });
    }//se consultan bd, incluyen modelos Person y Calculation
    async getAllResults(limit: number): Promise<Result[]> {
        //obtiene todos los resultados
        return (await ResultModel.findAll({
            //incluye datos de Person, Calculation
            include: [Person, Calculation],
            limit,//orden desc, rec-antiguo
            order: [["id", "DESC"]]
            //map y fromOrmModel convierte resuktados para interfaz Result
        })).map(row => fromOrmModel(row));
    }
    async getResultsByName(name: string, limit: number): Promise<Result[]> {
        return (await ResultModel.findAll({
            //incluye a Person y Calculation
            include: [Person, Calculation],
            //filtra res donde arg name coincide con Person.name
            where: {
                "$Person.name$": name
            },
            limit, order: [["id", "DESC"]]
        })).map(row => fromOrmModel(row));
    }
    async getResultById(id: number): Promise<Result | undefined> {
        const model = await ResultModel.findByPk(id, {
            include: [Person, Calculation ]
        });
        return model ? fromOrmModel(model): undefined;
    }
    async delete(id: number): Promise<boolean> {
        const count = await ResultModel.destroy({ where: { id }});
        return count == 1;
    }
    async update(r: Result) : Promise<Result | undefined > {
        const mod = await this.sequelize.transaction(async (transaction) => {
        //es leer los datos que se van a actualizar
            const stored = await ResultModel.findByPk(r.id);
        if (stored !== null) {
            //si hay coindidencias se localizan os datos de person
            const [person] = await Person.findOrCreate({
                where: { name : r.name}, transaction
            });//coincide con result
            const [calculation] = await Calculation.findOrCreate({
                where: {
                    age: r.age, years: r.years, nextage: r.nextage
                }, transaction
            });
            //actualizar ID para hacer referencia a los datos actuales
            stored.personId = person.id;
            stored.calculationId = calculation.id;
            //save detecta cambios y los actualiza
            return await stored.save({transaction});
        }
        });
        return mod ? this.getResultById(mod.id) : undefined;
    }
}