import { Express } from "express";
//import repository from "../data";
import { createAdapter } from "./http_adapter";
import { ResultWebService } from "./results_api";
import { Validator } from "./validation_adapters";
import { ResultWebServiceValidation } from "./results_api_validation";
import { FeathersWrapper } from "./feathers_adapters";
import { feathers } from "@feathersjs/feathers";
import feathersExpress, { rest } from "@feathersjs/express";
import { ValidationError } from "./validation_types";
import { roleHook } from "../auth";
import passport from "passport";

export const createApi = (app: Express) => {
    //createAdapter(app, new Validator(new ResultWebService(),
    // ResultWebServiceValidation), "/api/results");
    const feathersApp = feathersExpress(feathers(), app).configure(rest());
    const service = new Validator(new ResultWebService(),
        ResultWebServiceValidation);
    feathersApp.use('/api/results',
        //authenticate validará tokens usando estrategia jwt
        passport.authenticate("jwt", { session: false }),
        (req, resp, next) => {
            req.feathers.user = req.user;
            req.feathers.authenticated
                = req.authenticated = req.user !== undefined;
            next();
        },
        new FeathersWrapper(service));

    feathersApp.hooks({
        error: {
            all: [(ctx) => {
                if (ctx.error instanceof ValidationError) {
                    ctx.http = { status: 400 };
                    ctx.error = undefined;
                }
            }]
        },
        before: {
            create: [roleHook("Users")],
            remove: [roleHook("Admins")],
            update: [roleHook("Admins")],
            patch: [roleHook("Admins")]
        }
    });
}