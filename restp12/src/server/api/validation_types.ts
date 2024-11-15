//requisitos de validación para un servicio web.
export interface WebServiceValidation {
    //los requisitos de validación para los valores de ID
    keyValidator?: ValidationRule;
    getMany?: ValidationRequirements;
    store?: ValidationRequirements;
    replace?: ValidationRequirements;
    modify?: ValidationRequirements;
}//forma que espera el webservice
export type ValidationRequirements = {
    [key: string]: ValidationRule
}
export type ValidationRule =
    ((value: any) => boolean)[] |
    {
        required?: boolean,
        validation: ((value: any) => boolean)[],
        converter?: (value: any) => any,
    }
export class ValidationError implements Error {
    constructor(public name: string, public message: string) { }
    stack?: string | undefined;
    cause?: unknown;
}