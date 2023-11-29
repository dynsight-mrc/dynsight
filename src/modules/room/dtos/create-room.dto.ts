import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class CreateRoomDto{

    @IsNotEmpty()
    @IsString()
    name:string

    @IsString()
    @IsOptional()
    floor?: string

    @IsString()
    @IsOptional()
    building?: string

    @IsString()
    @IsOptional()
    organization?:string

    @IsArray()
    @IsString()
    @IsOptional()
    zone?: string
    
    @IsOptional()
    @IsArray()
    @IsString()
    properties? : string[]


}