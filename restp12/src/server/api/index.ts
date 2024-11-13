import { Express } from "express";
//import repository from "../data";
import { createAdapter } from "./http_adapter";
import { ResultWebService } from "./results_api";
export const createApi = (app: Express) => {
    createAdapter(app, new ResultWebService(), "/api/results");
}