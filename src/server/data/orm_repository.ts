import { Sequelize } from "sequelize";
import { Repository, Result } from "./repository";
import { addSeedData, defineRelationships, fromOrmModel, initializeModels } from
    "./orm_helpers";
import { Calculation, Person, ResultModel } from "./orm_models";
export class OrmRepository implements Repository {
    sequelize: Sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "orm_age.db",
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase();
    }
    async initModelAndDatabase(): Promise<void> {
        //configuran modelos de datos
        initializeModels(this.sequelize);
        defineRelationships();
        await this.sequelize.drop();//eliminamos tablas
        await this.sequelize.sync();//sincroniza DB con objetos del mod DB
        await addSeedData(this.sequelize);//add initial data to DB
    }//escritura de archivos
    async saveResult(r: Result): Promise<number> {
        return await this.sequelize.transaction(async (tx) => {
            const [person] = await Person.findOrCreate({
                where: { name: r.name },
                transaction: tx
            });
            const [calculation] = await Calculation.findOrCreate({
                where: {
                    age: r.age, years: r.years, nextage: r.nextage
                },
                transaction: tx
            });
            return (await ResultModel.create({
                personId: person.id, calculationId: calculation.id
            },
                { transaction: tx })).id;
        });
    }
    async getAllResults(limit: number): Promise<Result[]> {
        return (await ResultModel.findAll({
            include: [Person, Calculation],
            limit,
            order: [["id", "DESC"]]
        })).map(row => fromOrmModel(row));
    }
    async getResultsByName(name: string, limit: number): Promise<Result[]> {
        return (await ResultModel.findAll({
            include: [Person, Calculation],
            where: {
                "$Person.name$": name
            },
            limit, order: [["id", "DESC"]]
        })).map(row => fromOrmModel(row));
    }
}