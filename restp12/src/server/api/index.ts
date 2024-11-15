import { Express } from "express";
//import repository from "../data";
import { createAdapter } from "./http_adapter";
import { ResultWebService } from "./results_api";
import { Validator } from "./validation_adapters";
import { ResultWebServiceValidation } from "./results_api_validation";

export const createApi = (app: Express) => {
    createAdapter(app, new Validator(new ResultWebService(),
        ResultWebServiceValidation), "/api/results");
}