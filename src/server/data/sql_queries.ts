const baseSql = `
SELECT Results.*, name, age, years, nextage FROM Results
INNER JOIN People ON personId = People.id
INNER JOIN Calculations ON calculationId = Calculations.id`;
const endSql = `ORDER BY id DESC LIMIT $limit`;
export const queryAllSql = `${baseSql} ${endSql}`;
export const queryByNameSql = `${baseSql} WHERE name = $name ${endSql}`;