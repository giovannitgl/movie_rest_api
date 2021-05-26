import {ValidationError} from "class-validator";
import {ListFilterDTO} from "../dto/ListDTO";
import bcrypt from 'bcrypt'

/**
 * A function that transforms validation error in a string
 * @param validation {Array<ValidationError>} - Validation error from class-validator
 */
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

/**
 * Creates required TypeORM filter pagination arguments
 * @param filter {ListFilterDTO} - An object containing page and entries
 */
export function getFilterPagination(filter: ListFilterDTO) {
    const {page, entries} = filter
    return {skip: page * entries, take: entries}
}
