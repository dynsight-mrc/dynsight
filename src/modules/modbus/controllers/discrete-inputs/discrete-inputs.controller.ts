import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { DiscreteInputsService } from '../../services/discrete-inputs/discrete-inputs.service';

@Controller('modbus')
export class DiscreteInputsController {
  constructor(private readonly discreateInputsService: DiscreteInputsService) {}

  @Get('discreteinput/:id')
  async getDiscreteInput(@Param('id') id: string) {
    try {
      let value =  await this.discreateInputsService.readDiscreteInput(id);
      return {value}
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
