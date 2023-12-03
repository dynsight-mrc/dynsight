import {  IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReadModbusIpServerDto } from '../modbus-server/read-modbus-ip-server.dto';

export class ReadDiscreteInputDto {
  @IsString()
  name: string;
  @IsString()
  startAddress: string;
  @IsString()
  inputQuantity: string;
  
  @ValidateNested()
  @Type(()=>ReadModbusIpServerDto)
  modbusServer: ReadModbusIpServerDto;
}
