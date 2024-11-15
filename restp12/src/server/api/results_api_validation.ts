import {
    ValidationRequirements, ValidationRule,
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
