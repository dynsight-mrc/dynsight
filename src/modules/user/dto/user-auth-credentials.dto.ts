import { IsString } from "class-validator"

export class UserAuthCredentials {
    @IsString()
    username:string;
    @IsString()
    password:string;
}