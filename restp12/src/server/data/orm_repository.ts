import { Sequelize } from "sequelize";
import { Repository, Result } from "./repository";
import { addSeedData, defineRelationships, fromOrmModel, initializeModels } from
    "./orm_helpers";
import { Calculation, Person, ResultModel } from "./orm_models";
export class OrmRepository implements Repository {//crud
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
            const result = await ResultModel.create(
                {
                    personId: person.id,
                },
                { transaction: tx }
            );

            return result.id;
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
}