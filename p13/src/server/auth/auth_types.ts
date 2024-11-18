export interface Credentials {
    username: string;
    hashedPassword: Buffer;
    salt: Buffer;
}//interfcae p/ recuperar y almacenar credenciales
export interface AuthStore {
    getUser(name: string): Promise<Credentials | null>;
    storeOrUpdateUser(username: string, password: string):
        Promise<Credentials>;
    validateCredentials(username: string, password: string): Promise<boolean>
}