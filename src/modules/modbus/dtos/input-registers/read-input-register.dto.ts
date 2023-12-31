import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateModbusIpServerDto } from '../modbus-server/create-modbus-ip-server.dto';
import { DataType } from '../enums/data-types.enum';

export class ReadInputRegisterDto {
    @IsString()
    id:string

  @IsString()
  name: string;
  @IsString()
  startAddress: string;
  @IsString()
  inputQuantity: string;

  @IsBoolean()
  endianness: boolean;

  @IsString()
  dataType: string;

  @ValidateNested()
  @Type(() => CreateModbusIpServerDto)
  modbusServer: CreateModbusIpServerDto;
}
