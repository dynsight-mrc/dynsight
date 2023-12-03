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
import { DiscreteInputsRepositoryService } from '../../services/discrete-inputs/discrete-inputs-repository.service';
import { CreateDiscreteInputDto } from '../../dtos/discreteinputs/create-discrete-input.dto';

@Controller('modbus/repository')
export class DiscreteInputsRepositoryController {
  constructor(
    private readonly discreteInputsRepositoryService: DiscreteInputsRepositoryService,
  ) {}

  @Get('discreteinput/:id')
  async getDiscreteInput(@Param('id') id: string) {
    let discreteInput = await this.discreteInputsRepositoryService.find(id);
    return discreteInput;
  }

  @Get('discreteinputs')
  async getDiscreteInputs() {
    let discreteInputS = await this.discreteInputsRepositoryService.findAll();
    return discreteInputS;
  }

  @Post('discreteinputs')
  async createDiscreteInput(@Body() createDiscreteInput: CreateDiscreteInputDto) {
    let discreteInput;
    console.log(createDiscreteInput);
    
    try {
      discreteInput =
        await this.discreteInputsRepositoryService.create(createDiscreteInput);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return discreteInput;
  }

  @Delete('discreteinput/:id')
  async deleteDiscreteInput(@Param('id') id: string) {
    try {
      return await this.discreteInputsRepositoryService.remove(id);
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
