import {  IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReadModbusIpServerDto } from '../modbus-server/read-modbus-ip-server.dto';

export class ReadCoilDto {

  @IsString()
  id:string
  
  @IsString()
  name: string;
  @IsString()
  startAddress: string;
  @IsString()
  coilQuantity: string;
  
  @ValidateNested()
  @Type(()=>ReadModbusIpServerDto)
  modbusServer: ReadModbusIpServerDto;
}
