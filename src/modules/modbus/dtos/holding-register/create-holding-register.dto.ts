import { IsBoolean, IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateModbusIpServerDto } from '../modbus-server/create-modbus-ip-server.dto';

export class CreateHoldingRegisterDto {
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

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateModbusIpServerDto)
  modbusServer: CreateModbusIpServerDto;
}
