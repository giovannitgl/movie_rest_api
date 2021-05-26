import {IsDefined, IsEmail, IsString} from "class-validator";

export class AuthRequestDTO {
    @IsDefined()
    @IsEmail()
    email: string

    @IsDefined()
    @IsString()
    password: string
}


export class AuthDTO {
    token: string
}