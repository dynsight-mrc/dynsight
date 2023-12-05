import {

    IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccessType } from 'src/common/wattsense/enums/access-type';
import { ModbusGateway } from 'src/modules/wattsense/dtos/property/modbus-gateway.dto';
import { MqttGateway } from 'src/modules/wattsense/dtos/property/mqtt-gateway.dto';

export class PropertyDto {
    @IsString()
    propertyId: string;
  
    @IsString()
    name: string;
  
    @IsEnum(AccessType)
    accessType?: AccessType | string;
  
    @IsBoolean()
    disabled?: boolean;
  
    @IsDefined()
    config: MqttGateway | ModbusGateway;
  
    @IsString()
    @IsOptional()
    unit?: string;
  }