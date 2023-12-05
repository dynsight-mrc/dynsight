import { Type } from "class-transformer";
import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { ProtocolList } from "src/common/wattsense/enums/protocol-list.enum";
import { PropertyDto } from "src/modules/property/dtos/property.dto";

export class EquipmentWithNestedProperties {
    @IsString()
    equipmentId: string;
  
    @IsString()
    name: string;
  
    @IsEnum(ProtocolList)
    protocol?: ProtocolList | string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyDto)
    properties: PropertyDto[];
  }