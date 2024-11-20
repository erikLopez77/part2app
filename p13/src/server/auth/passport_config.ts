import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { AuthStore } from "./auth_types";
type Config = {
    jwt_secret: string,
    store: AuthStore
}
export const configurePassport = (config: Config) => {
    passport.use(new LocalStrategy(async (username, password, callback) => {
        //se validan credenciales
        if (await config.store.validateCredentials(username, password)) {
            return callback(null, { username });
        }//devuelve objeto que representa usuario si pasa la verificación
        return callback(null, false);
        //es falso si falla la verificación
    }));
    passport.use(new JwtStrategy({
        //requiere función de verificación
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt_secret
    }, (payload, callback) => {//devuelve objeto que representa usuario
        return callback(null, { username: payload.username });
    }));
    passport.serializeUser((user, callback) => {
        callback(null, user);
    });
    passport.deserializeUser((user, callback) => {
        callback(null, user as Express.User);
    });
}