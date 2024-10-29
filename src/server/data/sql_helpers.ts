import { Database } from "sqlite3";
export class TransactionHelper {
    steps: [sql: string, params: any][] = [];
    //crear lista de instrucciones sql, parametros de consulta
    add(sql: string, params: any): TransactionHelper {
        this.steps.push([sql, params]);
        return this;
    }//se envía begin a SQLite, ejecuta cada instruccion sql y ejecuta cada instruccion
    run(db: Database): Promise<number> {
        return new Promise((resolve, reject) => {
            let index = 0;
            let lastRow: number = NaN;
            const cb = (err: any, rowID?: number) => {
                //se envía "ROLLBACK" por si alguna sentencia falla, SQLite, abandina cambios realizados anteriormente
                if (err) {
                    db.run("ROLLBACK", () => reject());
                } else {
                    lastRow = rowID ? rowID : lastRow;
                    //si todo sale bien, se envía "COMMIT" y SQLiteplaica cambios a db
                    if (++index === this.steps.length) {
                        db.run("COMMIT", () => resolve(lastRow));
                    } else {
                        this.runStep(index, db, cb);
                    }
                }
            }
            db.run("BEGIN", () => this.runStep(0, db, cb));
        });
    }
    runStep(idx: number, db: Database, cb: (err: any, row: number) => void) {
        const [sql, params] = this.steps[idx];
        db.run(sql, params, function (err: any) {
            cb(err, this.lastID)
        });
    }
}