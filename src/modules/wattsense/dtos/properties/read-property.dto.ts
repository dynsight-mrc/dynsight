import { IsBoolean, IsDefined, IsEnum, IsString } from 'class-validator';
import { AccessType } from 'src/common/wattsense/enums/access-type';
import { ModbusGateway } from 'src/modules/wattsense/dtos/properties/modbus-gateway.dto';
import { MqttGateway } from 'src/modules/wattsense/dtos/properties/mqtt-gateway.dto';

export class ReadPropertyDto {
  @IsString()
  id: string;

  @IsString()
  propertyId: string;

  @IsString()
  equipmentId: string;

  @IsString()
  deviceId: string;

  @IsString()
  name: string;

  @IsEnum(AccessType)
  accessType?: AccessType | string;

  @IsBoolean()
  disabled?: boolean;

  @IsDefined()
  config: MqttGateway | ModbusGateway;

  @IsString()
  unit?: string;
}
