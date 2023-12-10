import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  InputRegister,
  InputRegisterModel,
} from '../../models/input-register.model';
import { CreateInputRegisterDto } from '../../dtos/input-registers/create-input-register.dto';
import { ModbusIpServerService } from '../modbus-ip-server/modbus-ip-server.service';
import { ReadModbusIpServerDto } from '../../dtos/modbus-server/read-modbus-ip-server.dto';
import { ReadInputRegisterDto } from '../../dtos/input-registers/read-input-register.dto';

@Injectable()
export class InputRegistersRepositoryService {
  constructor(
    @InjectModel(InputRegister.name)
    private readonly inputRegisterModel: InputRegisterModel,
    private readonly modbusIpServerService: ModbusIpServerService,
  ) {}

  async find(id: string) {
    return (await this.inputRegisterModel.findById(id)).populate(
      'modbusServer',
    );
  }

  async findAll() {
    return await this.inputRegisterModel.find();
  }

  async create(createInputRegisterDto: CreateInputRegisterDto) {
    let foundInputRegister = await this.inputRegisterModel.findOne({
      $or: [
        { name: createInputRegisterDto.name },
        { startAddress: createInputRegisterDto.startAddress },
      ],
    });

    if (foundInputRegister) {
      throw new Error(
        'Holding Register with one of the provided credentials already exist',
      );
    }

    let { modbusServer } = createInputRegisterDto;
    let modbusIpServer;
    try {
      modbusIpServer = (await this.modbusIpServerService.find(
        modbusServer,
      )) as ReadModbusIpServerDto;
    } catch (error) {
      throw new Error(error.message);
    }
    if (!modbusIpServer) {
      modbusIpServer = await this.modbusIpServerService.create(modbusServer);
    }

    let inputRegister = null;
    const session = await this.inputRegisterModel.startSession();
    session.startTransaction();
    try {
      inputRegister = this.inputRegisterModel.build({
        name: createInputRegisterDto.name,
        startAddress: createInputRegisterDto.startAddress,
        inputQuantity: createInputRegisterDto.inputQuantity,
        modbusServer: modbusIpServer.id,
        endianness: createInputRegisterDto.endianness,
        dataType: createInputRegisterDto.dataType,
      });
      await inputRegister.save();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      await session.abortTransaction();
    }
    return inputRegister.toJSON();
  }

  async createMany(createInputRegistersDtos : CreateInputRegisterDto[]):Promise<ReadInputRegisterDto[]>{
    let inputRegisters : ReadInputRegisterDto[] =[]
    for(let createInputRegisterDto of createInputRegistersDtos){
        let coil = await this.create(createInputRegisterDto)
        inputRegisters.push(coil)
      }

    return inputRegisters
  }

  async remove(id: string) {
    try {
      await this.inputRegisterModel.deleteOne({ _id: id });
      return {
        status: 'success',
        message: 'Input Register deleted successfully',
      };
    } catch (error) {
      throw new Error('Input Register deletion failed');
    }
  }
}
