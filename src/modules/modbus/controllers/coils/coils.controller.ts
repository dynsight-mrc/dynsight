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
      let value = await this.coilsService.readCoil(id);
      return {value};
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
       await this.coilsService.writeCoil(id,body.value);
       return { status: "sucess",message:"coil successfully modified" };
      
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
