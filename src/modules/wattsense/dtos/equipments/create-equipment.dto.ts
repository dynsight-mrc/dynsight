import { ProtocolList } from '@common/wattsense/enums/protocol-list.enum';
import { IsEnum, IsString } from 'class-validator';


export class CreateEquipmentDto {
  @IsString()
  equipmentId: string;

  @IsString()
  deviceId: string;

  @IsString()
  name: string;
  
  @IsEnum(ProtocolList)
  protocol?: ProtocolList | string;

}
