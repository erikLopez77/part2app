import { Express } from "express";
import repository from "../data";
export const createApi = (app: Express) => {
    app.get("/api/results", async (req, resp) => {
            if (req.query.name) {
                const data = await repository.getResultsByName(
                    req.query.name.toString(), 10);
            if (data.length > 0) {
                resp.json(data);
            } else {
                resp.writeHead(404);
            }
        } else {
            resp.json(await repository.getAllResults(10));
        }
        resp.end();
    });
    app.all("/api/results/:id", async (req, resp) => {
            const id = Number.parseInt(req.params.id);
            if (req.method == "GET") {
                const result = await repository.getResultById(id);
                if (result == undefined) {
                    resp.writeHead(404);
                } else {
                    resp.json(result);
                }
            } else if (req.method == "DELETE") {
                let deleted = await repository.delete(id);
                resp.json({ deleted });
            }
            resp.end();
        })
        app.post("/api/results", async (req, resp) => {
            const { name, age, years} = req.body;
            const nextage = Number.parseInt(age) + Number.parseInt(years);
            const id = await repository.saveResult({ id: 0, name, age,
                years, nextage});
            resp.json(await repository.getResultById(id));
            resp.end();
        });
}