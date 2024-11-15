import { WebService } from "./http_adapter";
import { Result } from "../data/repository";
import repository from "../data";
import * as jsonpatch from "fast-json-patch";

export class ResultWebService implements WebService<Result> {
    getOne(id: any): Promise<Result | undefined> {
        return repository.getResultById(Number.parseInt(id));
    }
    getMany(query: any): Promise<Result[]> {
        if (query.name) {
            return repository.getResultsByName(query.name, 10);
        } else {
            return repository.getAllResults(10);
        }
    }
    async store(data: any): Promise<Result | undefined> {
        const { name, age, years } = data;
        // const nextage = Number.parseInt(age) + Number.parseInt(years);
        const nextage = age + years;
        const id = await repository.saveResult({ id: 0, name, age, years, nextage });
        return await repository.getResultById(id);
    }
    delete(id: any): Promise<boolean> {
        return repository.delete(Number.parseInt(id));
    }
    replace(id: any, data: any): Promise<Result | undefined> {
        const { name, age, years, nextage } = data;
        return repository.update({ id, name, age, years, nextage });
    }
    async modify(id: any, data: any): Promise<Result | undefined> {
        const dbData = await this.getOne(id);
        //verifica si los datos recibidos de la solicitud contienen un valor de reemplazo.
        if (dbData !== undefined) {
            //trate los datos que recibe
            //como un documento JSON Patch y los aplique mediante el paquete fast-json-patch.
            return await this.replace(id,
                jsonpatch.applyPatch(dbData, data).newDocument);
        }
    }
}