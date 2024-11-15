import {
    ModelValidation, ValidationRequirements, ValidationRule,
    WebServiceValidation
} from "./validation_types";
import validator from "validator";
const intValidator: ValidationRule = {
    validation: [val => validator.isInt(val.toString())],
    converter: (val) => Number.parseInt(val)
}
const partialResultValidator: ValidationRequirements = {
    name: [(val) => !validator.isEmpty(val)],
    age: intValidator,
    years: intValidator
}//se definen cada de las propiedades dentro de este metodo
export const ResultWebServiceValidation: WebServiceValidation = {
    //validacion de enteros
    keyValidator: intValidator,
    store: partialResultValidator,
    replace: {
        ...partialResultValidator,
        nextage: intValidator
    }
}

export const ResultModelValidation: ModelValidation = {
    //reglas de validacion
    //intValidator funciona con strings, valores siempre se convierten a cadenas
    propertyRules: { ...partialResultValidator, nextage: intValidator },
    //se comprueba a nextage es la suma de age y years
    modelRule: [(m: any) => m.nextage === m.age + m.years]
}
