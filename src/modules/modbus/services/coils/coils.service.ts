import { Injectable } from '@nestjs/common';
import { ModbusServer } from '../modbus-ip-server/modbus-server';
import ModbusRTU from 'modbus-serial';
import { ModbusCoil } from './modbus-coil';
import { CoilsRepositoryService } from './coils-repository.service';
import { CreateCoilDto } from '../../dtos/coils/create-coil.dto';
import { Coil, CoilModel } from '../../models/coil.model';
import { CreateModbusIpServerDto } from '../../dtos/modbus-server/create-modbus-ip-server.dto';
import { ReadCoilDto } from '../../dtos/coils/read-coil.dto';

@Injectable()
export class CoilsService {
  constructor(
    private readonly coilsRepositoryService: CoilsRepositoryService,
  ) {}

  async readCoil(id: string) {
    let coil = (await this.coilsRepositoryService.find(
      id,
    )) as undefined as ReadCoilDto;

    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        ModbusServer.generateServerId(),
        coil.modbusServer.ipAddress,
        coil.modbusServer.port,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    let modbusEquipment = new ModbusCoil(
      modbusClient,
      parseInt(coil.startAddress),
      parseInt(coil.coilQuantity),
    );

    try {
      let data = await modbusEquipment.readCoilRegister();
      modbusEquipment.closeConnection();
      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }

  async writeCoil(id: string, value: number) {
    let coil = (await this.coilsRepositoryService.find(
      id,
    )) as undefined as ReadCoilDto;

    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        ModbusServer.generateServerId(),
        coil.modbusServer.ipAddress,
        coil.modbusServer.port,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    let modbusEquipment = new ModbusCoil(
      modbusClient,
      parseInt(coil.startAddress),
      parseInt(coil.coilQuantity),
    );

    try {
      await modbusEquipment.writeCoilRegister(Boolean(value));

      modbusEquipment.closeConnection();

      return { success: true };
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }
}
