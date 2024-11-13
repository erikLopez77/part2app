"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultWebService = void 0;
const data_1 = __importDefault(require("../data"));
class ResultWebService {
    getOne(id) {
        return data_1.default.getResultById(Number.parseInt(id));
    }
    getMany(query) {
        if (query.name) {
            return data_1.default.getResultsByName(query.name, 10);
        }
        else {
            return data_1.default.getAllResults(10);
        }
    }
    async store(data) {
        const { name, age, years } = data;
        const nextage = Number.parseInt(age) + Number.parseInt(years);
        const id = await data_1.default.saveResult({ id: 0, name, age, years, nextage });
        return await data_1.default.getResultById(id);
    }
    delete(id) {
        return data_1.default.delete(Number.parseInt(id));
    }
    replace(id, data) {
        const { name, age, years, nextage } = data;
        return data_1.default.update({ id, name, age, years, nextage });
    }
}
exports.ResultWebService = ResultWebService;
