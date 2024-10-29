import { Model, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes }
    from "sequelize"; //infer seleccimna prop. de Person
export class Person extends Model<InferAttributes<Person>,
    //declare indica a TS que se comporte como si las prop. se hubieran definido
    InferCreationAttributes<Person>> {//su tipo es creationOptional
    declare id?: CreationOptional<number>;//PK, se ebvita un error cada que hay objeto sin ID
    declare name: string//se representaran por columnas
}
export class Calculation extends Model<InferAttributes<Calculation>,
    InferCreationAttributes<Calculation>> {
    declare id?: CreationOptional<number>;
    declare age: number;
    declare years: number;
    declare nextage: number;
}
export class ResultModel extends Model<InferAttributes<ResultModel>,
    InferCreationAttributes<ResultModel>> {
    declare id: CreationOptional<number>;
    declare personId: ForeignKey<Person["id"]>;//pk de datos relacionados
    declare calculationId: ForeignKey<Calculation["id"]>;//pk de datos relacionados
    declare Person?: InferAttributes<Person>;
    declare Calculation?: InferAttributes<Calculation>;
}