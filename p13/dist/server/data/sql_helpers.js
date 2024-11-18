"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHelper = void 0;
class TransactionHelper {
    steps = [];
    //crear lista de instrucciones sql, parametros de consulta
    add(sql, params) {
        this.steps.push([sql, params]);
        return this;
    } //se envía begin a SQLite, ejecuta cada instruccion sql y ejecuta cada instruccion
    run(db) {
        return new Promise((resolve, reject) => {
            let index = 0;
            let lastRow = NaN;
            const cb = (err, rowID) => {
                //se envía "ROLLBACK" por si alguna sentencia falla, SQLite, abandina cambios realizados anteriormente
                if (err) {
                    db.run("ROLLBACK", () => reject());
                }
                else {
                    lastRow = rowID ? rowID : lastRow;
                    //si todo sale bien, se envía "COMMIT" y SQLiteplaica cambios a db
                    if (++index === this.steps.length) {
                        db.run("COMMIT", () => resolve(lastRow));
                    }
                    else {
                        this.runStep(index, db, cb);
                    }
                }
            };
            db.run("BEGIN", () => this.runStep(0, db, cb));
        });
    }
    runStep(idx, db, cb) {
        const [sql, params] = this.steps[idx];
        db.run(sql, params, function (err) {
            cb(err, this.lastID);
        });
    }
}
exports.TransactionHelper = TransactionHelper;
