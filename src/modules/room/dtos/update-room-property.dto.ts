
import { IsArray, IsEnum,  IsOptional,  IsString,  IsUUID, ValidateNested } from 'class-validator';
import { ReadEquipmentDto } from 'src/modules/wattsense/dtos/equipment/read-equipment.dto';


enum DeviceStatus {ONLINE='ONLINE',OFFLINE='OFFLINE'}

export class UpdateRoomPropertiesDto {
  @IsString()
  deviceId: string;

  @IsString()
  name: string;

  @IsString()
  
  orgranizationId: string|null;

  @IsString()
  @IsOptional()
  siteId?: string;

  @IsEnum(DeviceStatus,{message:"Invalid Status"})
  status:DeviceStatus | string;

  @IsArray()
  @IsString()
  @ValidateNested({ each: true })
  equipments: ReadEquipmentDto[];
}
