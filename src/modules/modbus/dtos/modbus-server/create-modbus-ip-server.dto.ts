import { IsNumber, IsString } from 'class-validator';

export class CreateModbusIpServerDto {
  @IsString()
  name: string;

  /* @IsNumber()
  serverId: number; */
  
  @IsString()
  ipAddress: string;

  @IsNumber()
  port: number;
}
