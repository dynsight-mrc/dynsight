import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coil, CoilModel } from '../../models/coil.model';
import { CreateCoilDto } from '../../dtos/coils/create-coil.dto';
import { ModbusIpServerService } from '../modbus-ip-server/modbus-ip-server.service';

import { ReadModbusIpServerDto } from '../../dtos/modbus-server/read-modbus-ip-server.dto';

@Injectable()
export class CoilsRepositoryService {
  constructor(
    @InjectModel(Coil.name) private readonly coilModel: CoilModel,
    private readonly modbusIpServerService: ModbusIpServerService,
  ) {}

  async create(createCoilDto: CreateCoilDto) {
    let foundCoil = await this.coilModel.findOne({
      $or: [
        { name: createCoilDto.name },
        { startAddress: createCoilDto.startAddress },
      ],
    });

    if (foundCoil) {
      throw new Error(
        'Coil with one of the provided credentials already exist',
      );
    }

    let { modbusServer } = createCoilDto;
    let modbusIpServer
    try {
      modbusIpServer  = await this.modbusIpServerService.find(
        modbusServer 
      ) as  ReadModbusIpServerDto;
    } catch (error) {
        throw new Error(error);
        
    }      
    if (!modbusIpServer) {
      modbusIpServer = await this.modbusIpServerService.create(modbusServer);
    }

    let coil = null;
    const session = await this.coilModel.startSession();
    session.startTransaction();
    try {
      coil = this.coilModel.build({
        name: createCoilDto.name,
        startAddress: createCoilDto.startAddress,
        coilQuantity: createCoilDto.coilQuantity,
        modbusServer: modbusIpServer.id,
      });
      await coil.save();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      await session.abortTransaction();
    }
    return coil;
  }

  async findAll() {
    return await this.coilModel.find();
  }

  async find(id: string) {
    let coil = (await this.coilModel.findById(id)).populate('modbusServer');
    return coil;
  }
  async remove(id: string) {
    try {
      await this.coilModel.deleteOne({_id:id})
      return {status:"success",message:"Coil deleted successfully"};

    } catch (error) {
      throw new Error("Coil deletion failed")
    }
  }

}
