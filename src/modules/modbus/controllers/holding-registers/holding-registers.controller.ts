import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { HoldingRegistersService } from '../../services/holding-registers/holding-registers.service';

@Controller('modbus')
export class HoldingRegistersController {
  constructor(
    private readonly holdingRegisterService: HoldingRegistersService,
  ) {}

  @Get('holdingregister/:id')
  async getHoldingRegister(@Param('id') id: string) {
    try {
      let value = await this.holdingRegisterService.readHoldingRegister(id);
      return { value };
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
  @Post('holdingregister/:id')
  async writeHoldingRegister(
    @Param('id') id: string,
    @Body() body: { value: number },
  ) {
    try {
      await this.holdingRegisterService.writeHoldingRegister(id, body.value);
      return {
        status: 'success',
        message: 'holding register successfully modified',
      };
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
