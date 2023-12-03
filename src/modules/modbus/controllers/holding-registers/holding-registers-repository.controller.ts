import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { HoldingRegistersRepositoryService } from '../../services/holding-registers/holding-registers-repository.service';
import { retry } from 'rxjs';
import { CreateHoldingRegisterDto } from '../../dtos/holding-register/create-holding-register.dto';

@Controller('modbus/repository')
export class HoldingRegistersRepositoryController {
  constructor(
    private readonly holdingRegisterRepositoryService: HoldingRegistersRepositoryService,
  ) {}

  @Get('holdingregisters')
  async getHoldingRegisters() {

    return await this.holdingRegisterRepositoryService.findAll();
  }

  @Get('holdingregister/:id')
  async getHoldingRegister(@Param('id') id: string) {
    try {
      return await this.holdingRegisterRepositoryService.find(id);

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

  @Post('holdingregisters')
  async createHoldingRegister(
    @Body() createHoldingRegisterDto: CreateHoldingRegisterDto,
  ) {
    let holdingRegister;
    try {
      holdingRegister = await this.holdingRegisterRepositoryService.create(
        createHoldingRegisterDto,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return holdingRegister;
  }

  @Delete('holdingregister/:id')
  async deleteHoldingRegister(@Param('id') id: string) {
    return this.holdingRegisterRepositoryService.remove(id);
  }
}
