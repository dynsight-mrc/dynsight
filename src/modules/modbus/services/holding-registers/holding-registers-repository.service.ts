import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  HoldingRegister,
  HoldingRegisterModel,
} from '../../models/holding-regster.model';
import { CreateHoldingRegisterDto } from '../../dtos/holding-register/create-holding-register.dto';
import { ModbusIpServerService } from '../modbus-ip-server/modbus-ip-server.service';
import { ReadModbusIpServerDto } from '../../dtos/modbus-server/read-modbus-ip-server.dto';
import { ReadHoldingRegisterDto } from '../../dtos/holding-register/read-holding-register.dto';

@Injectable()
export class HoldingRegistersRepositoryService {
  constructor(
    @InjectModel(HoldingRegister.name)
    private readonly holdinRegisterModel: HoldingRegisterModel,
    private readonly modbusIpServerService: ModbusIpServerService,
  ) {}

  async findAll() {
    return await this.holdinRegisterModel.find();
  }

  async find(id: string) {
    try {
      let holdingRegister = (
        await this.holdinRegisterModel.findById(id)
      ).populate('modbusServer');
      return holdingRegister;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(createHoldingRegisterDto: CreateHoldingRegisterDto) {
    let foundHoldingRegister = await this.holdinRegisterModel.findOne({
      $or: [
        { name: createHoldingRegisterDto.name },
        { startAddress: createHoldingRegisterDto.startAddress },
      ],
    });

    if (foundHoldingRegister) {
      throw new Error(
        'Holding Register with one of the provided credentials already exist',
      );
    }

    let { modbusServer } = createHoldingRegisterDto;
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

    let holdingRegister = null;
    const session = await this.holdinRegisterModel.startSession();
    session.startTransaction();
    try {
      holdingRegister = this.holdinRegisterModel.build({
        name: createHoldingRegisterDto.name,
        startAddress: createHoldingRegisterDto.startAddress,
        inputQuantity: createHoldingRegisterDto.inputQuantity,
        modbusServer: modbusIpServer.id,
        endianness: createHoldingRegisterDto.endianness,
        dataType: createHoldingRegisterDto.dataType,
      });
      await holdingRegister.save();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      await session.abortTransaction();
    }
    return holdingRegister.toJSON();
  }

  async createMany(
    createHoldingRegistersDtos: CreateHoldingRegisterDto[],
  ): Promise<ReadHoldingRegisterDto[]> {
    let holdingRegisters: ReadHoldingRegisterDto[] = [];
    for (let createHoldingRegisterDto of createHoldingRegistersDtos) {
      let holdingRegister = await this.create(createHoldingRegisterDto);
      holdingRegisters.push(holdingRegister);
    }

    return holdingRegisters;
  }

  async remove(id: string) {
    try {
      await this.holdinRegisterModel.deleteOne({ _id: id });
      return {
        status: 200,
        message: 'Holding Register deleted successfully',
      };
    } catch (error) {
      throw new Error('Holding Register deletion failed');
    }
  }
}
