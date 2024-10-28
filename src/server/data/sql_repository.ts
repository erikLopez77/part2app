import { Database } from "sqlite3";
import { Repository, Result } from "./repository";
import { readFileSync } from "fs";
import { queryAllSql, queryByNameSql } from "./sql_queries";

export class SqlRepository implements Repository {
    db: Database;

    constructor() {
        this.db = new Database("age.db");
        this.db.exec(readFileSync("age.sql").toString(), err => {
            if (err != undefined) throw err;
        });
    }
    saveResult(r: Result): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getAllResults($limit: number): Promise<Result[]> {
        return this.executeQuery(queryAllSql, { $limit });
    }
    getResultsByName($name: string, $limit: number): Promise<Result[]> {
        return this.executeQuery(queryByNameSql, { $name, $limit });
    }
    executeQuery(sql: string, params: any): Promise<Result[]> {
        return new Promise<Result[]>((resolve, reject) => {
            this.db.all<Result>(sql, params, (err, rows) => {
                if (err == undefined) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            })
        });
    }
}

