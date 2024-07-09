import { IsEnum, IsString } from 'class-validator';
import { ProtocolList } from 'src/common/wattsense/enums/protocol-list.enum';

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
