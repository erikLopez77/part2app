import { Sequelize, Op } from "sequelize";
import { CredentialsModel, initializeAuthModels, RoleModel }
    from "./orm_auth_models";
import { AuthStore, Role } from "./auth_types";
import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
export class OrmAuthStore implements AuthStore {
    sequelize: Sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "orm_auth.db",//db
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase();
    }
    async initModelAndDatabase(): Promise<void> {
        initializeAuthModels(this.sequelize);
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
    async getUser(name: string) {//recupera credenciales
        return await CredentialsModel.findByPk(name);
    }
    async storeOrUpdateUser(username: string, password: string) {
        const salt = randomBytes(16);
        const hashedPassword = await this.createHashCode(password, salt);
        const [model] = await CredentialsModel.upsert({
            username, hashedPassword, salt
        });
        return model;
    }
    async validateCredentials(username: string, password: string):
        Promise<boolean> {
        const storedCreds = await this.getUser(username);
        if (storedCreds) {
            const candidateHash =//calcula  nuevo codigo hash con contraseña candidata
                await this.createHashCode(password, storedCreds.salt);
            //compara hash de forma segura
            return timingSafeEqual(candidateHash, storedCreds.hashedPassword);
        }
        return false;
    }//crea un codigo hash usando pbkdf
    private createHashCode(password: string, salt: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            //contraseña a codificar, salt, iteraciones,logitud, algoritmo
            pbkdf2(password, salt, 100000, 64, "sha512", (err, hash) => {
                if (err) {
                    reject(err)
                };
                resolve(hash);
            })
        })
    }
    async getRole(name: string) {
        const stored = await RoleModel.findByPk(name, {
            //datos asociados al modelo de credenciales, prop.del  modelo que se completarán en el resultado
            include: [{ model: CredentialsModel, attributes: ["username"] }]
        });
        if (stored) {
            return {
                name: stored.name,
                members: stored.CredentialsModels?.map(m => m.username) ?? []
            }
        }
        return null;
    }
    async getRolesForUser(username: string): Promise<string[]> {
        return (await RoleModel.findAll({
            //acepta role y consulta bd p/ objetos coincidentes
            include: [{
                model: CredentialsModel,
                where: { username },//selección en función de los datos asociados
                attributes: []//selección en función de los datos asociados
            }]
        })).map(rm => rm.name);
    }
    async storeOrUpdateRole(role: Role) {
        return await this.sequelize.transaction(async (transaction) => {
            //en la bd se busca credentialsmodels coincidentes
            const users = await CredentialsModel.findAll({
                where: { username: { [Op.in]: role.members } },
                transaction
            });//se garantiza la membresía de rol
            const [rm] = await RoleModel.findOrCreate({
                where: { name: role.name }, transaction
            });//establece la membresía de rol
            await rm.setCredentialsModels(users, { transaction });
            return role;
        });
    }//obtiene roles de un usuario y verifica que coincidan con un rol requerido
    async validateMembership(username: string, rolename: string) {
        return (await this.getRolesForUser(username)).includes(rolename);
    }
}