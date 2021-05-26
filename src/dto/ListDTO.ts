import {IsDefined, IsInt} from "class-validator";
import {Type} from "class-transformer";

export class ListFilterDTO {
    /** Pagination position **/
    @IsDefined()
    @IsInt()
    @Type(() => Number)
    page: number;

    /** How many records are being bought **/
    @IsDefined()
    @IsInt()
    @Type(() => Number)
    entries: number;
}

export class ListResponseDTO {
    /** Generic array **/
    data: Array<any>

    /** Total records for search **/
    total: number
}