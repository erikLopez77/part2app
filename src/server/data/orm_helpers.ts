import { DataTypes, Sequelize } from "sequelize";
import { Calculation, Person, ResultModel } from "./orm_models";
import { Result } from "./repository";
const primaryKey = {//objeto reutilizable
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
};
//...funciones omitidas por brevedad...
//se convierte resultModel a Result
export const fromOrmModel = (model: ResultModel | null): Result => {
    return {
        id: model?.id || 0,
        name: model?.Person?.name || "",
        age: model?.Calculation?.age || 0,
        years: model?.Calculation?.years || 0,
        nextage: model?.Calculation?.nextage || 0
    }
}
export const initializeModels = (sequelize: Sequelize) => {
    //se defineen modelos por init 
    Person.init({
        ...primaryKey,//incluye las propiedades de pk ya definidas
        name: { type: DataTypes.STRING }
    }, { sequelize });
    Calculation.init({
        ...primaryKey,
        age: { type: DataTypes.INTEGER },
        years: { type: DataTypes.INTEGER },
        nextage: { type: DataTypes.INTEGER },
    }, { sequelize });
    ResultModel.init({
        ...primaryKey,
    }, { sequelize });//conecta el modelo a la base de datos
}
export const defineRelationships = () => {
    //resultModel está relacionado con person y calculation por medio de esas fk
    ResultModel.belongsTo(Person, { foreignKey: "personId" });
    ResultModel.belongsTo(Calculation, { foreignKey: "calculationId" });
}
export const addSeedData = async (sequelize: Sequelize) => {
    //Sequelize.query acepta una cadena que contiene una declaración SQL.
    //inserción de datos prueba
    await sequelize.query(`
        INSERT INTO Calculations
        (id, age, years, nextage, createdAt, updatedAt) VALUES
        (1, 35, 5, 40, date(), date()),
        (2, 35, 10, 45, date(), date())`);
    await sequelize.query(`
        INSERT INTO People (id, name, createdAt, updatedAt) VALUES
        (1, 'Alice', date(), date()), (2, "Bob", date(), date())`);
    await sequelize.query(`
        INSERT INTO ResultModels (calculationId, personId, createdAt, updatedAt) VALUES
        (1, 1, date(), date()), (2, 2, date(), date()),
        (2, 1, date(), date());`);
}