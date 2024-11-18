import {
    DataTypes, InferAttributes, InferCreationAttributes, Model,
    Sequelize
} from "sequelize";
import { Credentials } from "./auth_types";
export class CredentialsModel
    extends Model<InferAttributes<CredentialsModel>,
        InferCreationAttributes<CredentialsModel>>
    implements Credentials {
    declare username: string;
    declare hashedPassword: Buffer;
    declare salt: Buffer;
}
export const initializeAuthModels = (sequelize: Sequelize) => {
    CredentialsModel.init({
        username: { type: DataTypes.STRING, primaryKey: true },
        //Blob permite cadenas o bufferes
        hashedPassword: { type: DataTypes.BLOB },
        salt: { type: DataTypes.BLOB }
    }, { sequelize });
}