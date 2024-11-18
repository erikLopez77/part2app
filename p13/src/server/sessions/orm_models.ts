import {
    DataTypes, InferAttributes, InferCreationAttributes, Model,
    Sequelize
} from "sequelize";
//se crea el modelo
export class SessionModel extends Model<InferAttributes<SessionModel>,
    InferCreationAttributes<SessionModel>> {
    declare id: string
    declare data: any;
    declare expires: Date
}//inicia el modelo
export const initializeModel = (sequelize: Sequelize) => {
    SessionModel.init({
        id: { type: DataTypes.STRING, primaryKey: true },
        //serializara y deserializara automaticamente en objetos de tipo DataTypes.Json
        data: { type: DataTypes.JSON },
        expires: { type: DataTypes.DATE }
    }, { sequelize });
}