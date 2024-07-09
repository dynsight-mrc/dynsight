import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EquipmentWithNestedProperties } from 'src/modules/wattsense/dtos/equipments/equipment-with-nested-properties.dto';


enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}





export class UpdateRoomPropertiesDto {
  @IsString()
  deviceId: string;

  @IsString()
  name: string;

  @IsString()
  orgranizationId: string | null;

  @IsString()
  @IsOptional()
  siteId?: string;

  @IsEnum(DeviceStatus, { message: 'Invalid Status' })
  status: DeviceStatus | string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentWithNestedProperties)
  equipments: EquipmentWithNestedProperties[];
}
