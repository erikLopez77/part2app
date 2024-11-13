"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = void 0;
const data_1 = __importDefault(require("../data"));
const createApi = (app) => {
    app.get("/api/results", async (req, resp) => {
        if (req.query.name) {
            const data = await data_1.default.getResultsByName(req.query.name.toString(), 10);
            if (data.length > 0) {
                resp.json(data);
            }
            else {
                resp.writeHead(404);
            }
        }
        else {
            resp.json(await data_1.default.getAllResults(10));
        }
        resp.end();
    });
    app.all("/api/results/:id", async (req, resp) => {
        const id = Number.parseInt(req.params.id);
        if (req.method == "GET") {
            const result = await data_1.default.getResultById(id);
            if (result == undefined) {
                resp.writeHead(404);
            }
            else {
                resp.json(result);
            }
        }
        else if (req.method == "DELETE") {
            let deleted = await data_1.default.delete(id);
            resp.json({ deleted });
        }
        resp.end();
    });
    app.post("/api/results", async (req, resp) => {
        const { name, age, years } = req.body;
        const nextage = Number.parseInt(age) + Number.parseInt(years);
        const id = await data_1.default.saveResult({ id: 0, name, age,
            years, nextage });
        resp.json(await data_1.default.getResultById(id));
        resp.end();
    });
};
exports.createApi = createApi;
