import { Injectable } from '@nestjs/common';
import { CreateDiscreteInputDto } from '../../dtos/discreteinputs/create-discrete-input.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  DiscreteInput,
  DiscreteInputModel,
} from '../../models/discrete-input.model';
import { ModbusIpServerService } from '../modbus-ip-server/modbus-ip-server.service';
import { ReadDiscreteInputDto } from '../../dtos/discreteinputs/read-discrete-input.dto';
import { ReadModbusIpServerDto } from '../../dtos/modbus-server/read-modbus-ip-server.dto';

@Injectable()
export class DiscreteInputsRepositoryService {
  constructor(
    @InjectModel(DiscreteInput.name)
    private readonly discreteInputModel: DiscreteInputModel,
    private readonly modbusIpServerService: ModbusIpServerService,
  ) {}

  async find(id: string) {
    console.log(id);
    
    try {
      let discreteInput = (await this.discreteInputModel.findById(id)).populate("modbusServer")
      return discreteInput;
    } catch (error) {
      throw new Error('Something went wrong while retrieving the document');
    }
  }

  async findAll() {
    return this.discreteInputModel.find();
  }

  async create(createDiscreteInputDto: CreateDiscreteInputDto) {
    let foundDiscreteInput = await this.discreteInputModel.findOne({
      $or: [
        { name: createDiscreteInputDto.name },
        { startAddress: createDiscreteInputDto.startAddress },
      ],
    });

    if (foundDiscreteInput) {
      throw new Error(
        'Discrete input with one of the provided credentials already exist',
      );
    }

    let { modbusServer } = createDiscreteInputDto;
    let modbusIpServer = (await this.modbusIpServerService.find(modbusServer)) as undefined as ReadModbusIpServerDto;;

    if (!modbusIpServer) {
      modbusIpServer = (await this.modbusIpServerService.create(
        modbusServer,
      )) as undefined as ReadModbusIpServerDto;
    }

    let discreteInput = null;
    const session = await this.discreteInputModel.startSession();
    session.startTransaction();
    try {
      discreteInput = this.discreteInputModel.build({
        name: createDiscreteInputDto.name,
        startAddress: createDiscreteInputDto.startAddress,
        inputQuantity: createDiscreteInputDto.inputQuantity,
        modbusServer: modbusIpServer.id,
      });
      await discreteInput.save();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      await session.abortTransaction();
    }
    return discreteInput;
  }

  async remove(id: string) {
    try {
      await this.discreteInputModel.deleteOne({ _id: id });
      return {
        status: 'success',
        message: 'Discrete Input deleted successfully',
      };
    } catch (error) {
      throw new Error('Discrete Input deletion failed');
    }
  }
}
