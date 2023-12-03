import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateModbusIpServerDto } from '../modbus-server/create-modbus-ip-server.dto';

export class CreateCoilDto {
  @IsString()
  name: string;
  @IsString()
  startAddress: string;
  @IsString()
  coilQuantity: string;
  
  @ValidateNested()
  @Type(()=>CreateModbusIpServerDto)
  modbusServer: CreateModbusIpServerDto;
}
