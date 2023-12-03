import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateModbusIpServerDto } from '../../dtos/modbus-server/create-modbus-ip-server.dto';
import { RequestValidationError } from 'src/common/errors/request-validation-error';

import { ReadModbusIpServerDto } from '../../dtos/modbus-server/read-modbus-ip-server.dto';
import {
  ModbusIpServer,
  ModbusIpServerModel,
} from '../../models/modbus-ip-server.model';

@Injectable()
export class ModbusIpServerService {
  constructor(
    @InjectModel(ModbusIpServer.name)
    private readonly modbusIpServerModel: ModbusIpServerModel,
  ) {}

  async create(
    createModbusIpServerDto: CreateModbusIpServerDto,
  ): Promise<ReadModbusIpServerDto> {
    let modbusIpServer = this.modbusIpServerModel.build(
      createModbusIpServerDto,
    );

    await modbusIpServer.save();
    return modbusIpServer as undefined as ReadModbusIpServerDto;
  }

  async find(
    modbusIpServer: CreateModbusIpServerDto,
  ): Promise<ReadModbusIpServerDto> {
    let foundModbusIpServer = await this.modbusIpServerModel.findOne({
      $and: [
        { name: modbusIpServer.name },
        { ipAddress: modbusIpServer.ipAddress },
        { port: modbusIpServer.port },
      ],
    });
    if (foundModbusIpServer) {
      return foundModbusIpServer as undefined as ReadModbusIpServerDto;
    }
    foundModbusIpServer = await this.modbusIpServerModel.findOne({
      $or: [
        { name: modbusIpServer.name },
        {
          $and: [
            { ipAddress: modbusIpServer.ipAddress },
            { port: modbusIpServer.port },
          ],
        },
      ],
    });
    if(foundModbusIpServer){
      throw new Error(
        'Modbus server name already exists with other connetion credentials /n Connetion credentials already exists with different modbus server name',
      );
    }

    return null
    
  }
}
