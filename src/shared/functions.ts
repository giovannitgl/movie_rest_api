import {ValidationError} from "class-validator";

export function printValidationError(validation: Array<ValidationError>) {
    let val: ValidationError;
    const errors: Array<string> = validation.map((val) => {
        const internal_error = []
        for (const key of Object.keys(val['constraints'])) {
            internal_error.push(val['constraints'][key])
        }
        return internal_error.join(', ')
    })
    return errors.join(', ')

}
