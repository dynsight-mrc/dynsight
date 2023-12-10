import { Type } from "class-transformer";
import { IsDefined, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateModbusIpServerDto } from "../modbus-server/create-modbus-ip-server.dto";

export class CreateDiscreteInputDto{
    @IsString()
    name: string;
    @IsString()
    startAddress: string;
    @IsString()
    inputQuantity: string;
    
    @IsDefined()
    @ValidateNested()
    @Type(()=>CreateModbusIpServerDto)
    modbusServer: CreateModbusIpServerDto;
}