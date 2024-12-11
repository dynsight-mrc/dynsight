import { ArrayMinSize, ArrayNotEmpty, IsArray, IsIn, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";


export class CreateRoomsAttrsDto{
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


export class CreateRoomDocumentAttrsDto {
    @IsString()
    name: string;
  
    @IsMongoId()
    floorId: Types.ObjectId;
  
    @IsMongoId()
    buildingId:  Types.ObjectId;
  
    @IsMongoId()
    organizationId:  Types.ObjectId;
  
    @IsInt()
    @IsOptional()
    surface?: number;
  
    @IsOptional()
    @IsString()
    type?: string;
  
    @IsOptional()
    @IsMongoId()
    zone?:string
  
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    properties?: string[];
  }
