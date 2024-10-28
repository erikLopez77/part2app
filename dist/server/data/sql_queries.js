"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryByNameSql = exports.queryAllSql = void 0;
const baseSql = `
SELECT Results.*, name, age, years, nextage FROM Results
INNER JOIN People ON personId = People.id
INNER JOIN Calculations ON calculationId = Calculations.id`;
const endSql = `ORDER BY id DESC LIMIT $limit`;
exports.queryAllSql = `${baseSql} ${endSql}`;
exports.queryByNameSql = `${baseSql} WHERE name = $name ${endSql}`;
