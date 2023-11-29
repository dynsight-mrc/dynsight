import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsString, ValidateIf, ValidateNested } from "class-validator";
import { AccessType } from "src/common/wattsense/enums/access-type";
import { ModbusGateway } from "src/modules/wattsense/dtos/property/modbus-gateway.dto";
import { MqttGateway } from "src/modules/wattsense/dtos/property/mqtt-gateway.dto";

export class CreatePropertyDto{
    @IsString()
    propertyId: string;

    @IsString()
  equipmentId: string;

  @IsString()
  deviceId: string;

  @IsString()
  name: string;

  @IsEnum(AccessType)
  accessType?: AccessType|string;

  @IsBoolean()
  disabled?: boolean;

  
  config: MqttGateway | ModbusGateway;

  @IsString()
  unit?: string;
}