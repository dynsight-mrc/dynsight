import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoilsRepositoryService } from '../../services/coils/coils-repository.service';
import { CreateCoilDto } from '../../dtos/coils/create-coil.dto';

@Controller('modbus/repository')
export class CoilsRepositoryController {
  constructor(
    private readonly coilsRepositoryService: CoilsRepositoryService,
  ) {}

  @Get('coil/:id')
  async getCoil(@Param("id") id:string) {
    let coil =  await this.coilsRepositoryService.find(id);
    console.log(coil);
    return coil
  }

  @Get('coils')
  async getCoils() {
    return await this.coilsRepositoryService.findAll();
  }

  @Post('coils')
  async createCoil(@Body() createCoilDto: CreateCoilDto) {
    let coil
    try {
      coil = await this.coilsRepositoryService.create(createCoilDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
     
    return coil;
  }

  @Patch('coil/:id')
  async updateCoil() {
    
  }

  @Delete('coil/:id')
  async removeCoil(@Param('id') id:string) {
    try {
      return await this.coilsRepositoryService.remove(id)
      
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
