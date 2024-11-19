"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrmAuthStore = void 0;
const sequelize_1 = require("sequelize");
const orm_auth_models_1 = require("./orm_auth_models");
const crypto_1 = require("crypto");
class OrmAuthStore {
    sequelize;
    constructor() {
        this.sequelize = new sequelize_1.Sequelize({
            dialect: "sqlite",
            storage: "orm_auth.db", //db
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase();
    }
    async initModelAndDatabase() {
        (0, orm_auth_models_1.initializeAuthModels)(this.sequelize);
        await this.sequelize.drop();
        await this.sequelize.sync();
        await this.storeOrUpdateUser("alice", "mysecret");
        await this.storeOrUpdateUser("bob", "mysecret");
        await this.storeOrUpdateRole({
            name: "Users", members: ["alice", "bob"]
        });
        await this.storeOrUpdateRole({
            name: "Admins", members: ["alice"]
        });
    }
    async getUser(name) {
        return await orm_auth_models_1.CredentialsModel.findByPk(name);
    }
    async storeOrUpdateUser(username, password) {
        const salt = (0, crypto_1.randomBytes)(16);
        const hashedPassword = await this.createHashCode(password, salt);
        const [model] = await orm_auth_models_1.CredentialsModel.upsert({
            username, hashedPassword, salt
        });
        return model;
    }
    async validateCredentials(username, password) {
        const storedCreds = await this.getUser(username);
        if (storedCreds) {
            const candidateHash = //calcula  nuevo codigo hash con contraseña candidata
             await this.createHashCode(password, storedCreds.salt);
            //compara hash de forma segura
            return (0, crypto_1.timingSafeEqual)(candidateHash, storedCreds.hashedPassword);
        }
        return false;
    } //crea un codigo hash usando pbkdf
    createHashCode(password, salt) {
        return new Promise((resolve, reject) => {
            //contraseña a codificar, salt, iteraciones,logitud, algoritmo
            (0, crypto_1.pbkdf2)(password, salt, 100000, 64, "sha512", (err, hash) => {
                if (err) {
                    reject(err);
                }
                ;
                resolve(hash);
            });
        });
    }
    async getRole(name) {
        const stored = await orm_auth_models_1.RoleModel.findByPk(name, {
            //datos asociados al modelo de credenciales, prop.del  modelo que se completarán en el resultado
            include: [{ model: orm_auth_models_1.CredentialsModel, attributes: ["username"] }]
        });
        if (stored) {
            return {
                name: stored.name,
                members: stored.CredentialsModels?.map(m => m.username) ?? []
            };
        }
        return null;
    }
    async getRolesForUser(username) {
        return (await orm_auth_models_1.RoleModel.findAll({
            //acepta role y consulta bd p/ objetos coincidentes
            include: [{
                    model: orm_auth_models_1.CredentialsModel,
                    where: { username }, //selección en función de los datos asociados
                    attributes: [] //selección en función de los datos asociados
                }]
        })).map(rm => rm.name);
    }
    async storeOrUpdateRole(role) {
        return await this.sequelize.transaction(async (transaction) => {
            //en la bd se busca credentialsmodels coincidentes
            const users = await orm_auth_models_1.CredentialsModel.findAll({
                where: { username: { [sequelize_1.Op.in]: role.members } },
                transaction
            }); //se garantiza la membresía de rol
            const [rm] = await orm_auth_models_1.RoleModel.findOrCreate({
                where: { name: role.name }, transaction
            }); //establece la membresía de rol
            await rm.setCredentialsModels(users, { transaction });
            return role;
        });
    } //obtiene roles de un usuario y verifica que coincidan con un rol requerido
    async validateMembership(username, rolename) {
        return (await this.getRolesForUser(username)).includes(rolename);
    }
}
exports.OrmAuthStore = OrmAuthStore;
