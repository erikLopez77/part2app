import { Model, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes }
    from "sequelize"; //definimos la clase Person
//inferAttributes, definen atributos de un moelo,tal y como aparecen
//inferCreationAttributes define atribuyosnecesarios al momento de crear una instancia
export class Person extends Model<InferAttributes<Person>,
    //declare indica a TS que se comporte como si las prop. se hubieran definido
    InferCreationAttributes<Person>> {//su tipo es creationOptional
    declare id?: CreationOptional<number>;//PK, se evita un error cada que hay objeto sin ID(id opc)
    declare name: string//se declara campo name de tipo str
}//tabla calculation
export class Calculation extends Model<InferAttributes<Calculation>,
    InferCreationAttributes<Calculation>> {
    declare id?: CreationOptional<number>;//opcional crear la instancia id
    declare age: number;
    declare years: number;
    declare nextage: number;
}//tabla result model
export class ResultModel extends Model<InferAttributes<ResultModel>,
    InferCreationAttributes<ResultModel>> {
    declare id: CreationOptional<number>;
    declare personId: ForeignKey<Person["id"]>;//fk personId de campo id de modelo Person 
    declare calculationId: ForeignKey<Calculation["id"]>;//pk de datos relacionados
    declare Person?: InferAttributes<Person>;//campo opcional
    declare Calculation?: InferAttributes<Calculation>;//campo opcional 
}