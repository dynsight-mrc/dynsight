import { Injectable } from '@nestjs/common';
import { InputRegistersRepositoryService } from './input-registers-repository.service';
import { ReadInputRegisterDto } from '../../dtos/input-registers/read-input-register.dto';
import ModbusRTU from 'modbus-serial';
import { ModbusServer } from '../modbus-ip-server/modbus-server';
import { ModbusInputRegister } from './modbus-input-register';

@Injectable()
export class InputRegistersService {
  constructor(
    private readonly inputRegistersRepositoryService: InputRegistersRepositoryService,
  ) {}

  async readInputRegister(id: string) {
    let inputRegister = (await this.inputRegistersRepositoryService.find(
      id,
    )) as undefined as ReadInputRegisterDto;

    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        ModbusServer.generateServerId(),
        inputRegister.modbusServer.ipAddress,
        inputRegister.modbusServer.port,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    let modbusEquipment = new ModbusInputRegister(
      modbusClient,
      inputRegister.startAddress,
      inputRegister.inputQuantity,
      inputRegister.endianness,
      inputRegister.dataType,
    );

    try {
      let data = await modbusEquipment.readInputRegister();
      modbusEquipment.closeConnection();
      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error.message);
    }
  }
}
