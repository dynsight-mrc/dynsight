import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ModbusCoil } from '../services/modbus-coil';
import { ModbusServer } from '../services/modbus-server';
import ModbusRTU from 'modbus-serial';
import { ModbusDiscreteInput } from '../services/modbus-discrete-input';
import { ModbusService } from '../services/modbus.service';

@Controller('modbus')
export class ModbusController {
  constructor(private readonly modbusService: ModbusService) {}

  @Get('coil/:id')
  async getCoil(@Param('id') id: string) {
    try {
      let data = await this.modbusService.readCoil(id);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  @Post('coil/:id')
  async writeCoil(@Param('id') id: string) {
    try {
      let data = await this.modbusService.writeCoil(id);
      console.log(data);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('inputregister/:refdfsdg')
  async readRegister(@Param('id') id: string) {
    try {
      let data = await this.modbusService.readInputRegister(id);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('holdingRegister/:id')
  async readHoldingRegister(@Param('id') id: string) {
    try {
      let data = await this.modbusService.readHoldingRegister(id);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('holdingRegister/:id')
  async writeHoldingRegister(@Param('id') id: string) {
    try {
      let data = await this.modbusService.writeHoldingRegister(id);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('inputRegister/:id')
  async readInputRegister(@Param('id') id: string) {
    try {
      let data = await this.modbusService.readInputRegister(id);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
