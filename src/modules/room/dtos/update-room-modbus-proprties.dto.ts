import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateCoilDto } from 'src/modules/modbus/dtos/coils/create-coil.dto';
import { CreateDiscreteInputDto } from 'src/modules/modbus/dtos/discreteinputs/create-discrete-input.dto';
import { CreateHoldingRegisterDto } from 'src/modules/modbus/dtos/holding-register/create-holding-register.dto';
import { CreateInputRegisterDto } from 'src/modules/modbus/dtos/input-registers/create-input-register.dto';

export class UpdateRoomModbusProprtiesDto {

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoilDto)
  coils: CreateCoilDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDiscreteInputDto)
  discreteInputs: CreateDiscreteInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHoldingRegisterDto)
  holdingRegisters: CreateHoldingRegisterDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInputRegisterDto)
  inputRegisters: CreateInputRegisterDto[];
}
