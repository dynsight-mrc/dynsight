import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { InputRegistersRepositoryService } from '../../services/input-registers/input-registers-repository.service';
import { CreateInputRegisterDto } from '../../dtos/input-registers/create-input-register.dto';

@Controller('modbus/repository')
export class InputRegistersRepositoryController {
  constructor(private readonly inputRegisterRepositoryService:InputRegistersRepositoryService) {

  }

  @Get('inputregisters')
  async getInputRegisters() {
    return await this.inputRegisterRepositoryService.findAll()
  }

  @Get('inputregister/:id')
  async getInputRegister(@Param("id") id:string) {
      return await this.inputRegisterRepositoryService.find(id)
  }

  @Post('inputregisters')
  async createInputRegister(@Body() createInputRegisterDto:CreateInputRegisterDto) {
    let inputRegister
    try {
      inputRegister = await this.inputRegisterRepositoryService.create(createInputRegisterDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return inputRegister
  }

  @Delete('inputregister/:id')
  async deleteInputRegister(@Param("id") id:string) {
    try {
      return await this.inputRegisterRepositoryService.remove(id)
      
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
