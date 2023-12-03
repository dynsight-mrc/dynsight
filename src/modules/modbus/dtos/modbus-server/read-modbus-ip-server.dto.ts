import { IsNumber, IsString } from 'class-validator';

export class ReadModbusIpServerDto {

  @IsString()
  id:string

  @IsString()
  name: string;

  /* @IsNumber()
  serverId: number; */
  
  @IsString()
  ipAddress: string;

  @IsNumber()
  port: number;
}
