import { ArrayMinSize, ArrayNotEmpty, IsArray, IsIn, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";


export class CreateRoomsDto{

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    name:string[]

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    floors: string[]

   /*  @IsMongoId()
    buildingId: Types.ObjectId

    @IsMongoId()
    organizationId:Types.ObjectId */

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    surface? : number[]

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    type? : string[]

}
export class createRoomsWithExistingFloorsDto{
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    floors:string[]

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    name:string[]

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    surface:number[]

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    type:string[]
}