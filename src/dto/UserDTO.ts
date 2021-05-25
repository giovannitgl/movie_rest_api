import {IsDefined, IsEmail, IsInt, IsString, Min} from "class-validator";
import {UserTypes} from "../entity/User";

export class UserDTO {
    @IsDefined()
    @IsEmail()
    email: string

    @IsDefined()
    @IsString()
    firstName: string

    @IsDefined()
    @IsString()
    lastName: string

    @IsDefined()
    @IsInt()
    @Min(0)
    age: number
}

export class UserDisplayDTO extends UserDTO {
    @IsInt()
    id: number
}

export class UserInternalDTO extends UserDTO {
    type: UserTypes
    active: boolean
}

export class UserCreateDTO extends UserDTO {
    @IsDefined()
    @IsString()
    password: string
}