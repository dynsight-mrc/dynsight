import { IsNumber, IsString } from 'class-validator';

export class CreateModbusIpServerDto {
  @IsString()
  name: string;
  
  @IsString()
  ipAddress: string;

  @IsNumber()
  port: number;
}
