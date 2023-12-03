import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoilsService } from '../../services/coils/coils.service';
import { WriteCoilDto } from '../../dtos/coils/write-coil.dto';

@Controller('modbus')
export class CoilsController {
  constructor(private readonly coilsService: CoilsService) {}

  @Get('coil/:id')
  async getCoil(@Param('id') id: string) {
    try {
      let data = await this.coilsService.readCoil(id);
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
  async writeCoil(@Param('id') id: string,@Body() body:WriteCoilDto) {
    try {
      let data = await this.coilsService.writeCoil(id,body.value);
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
