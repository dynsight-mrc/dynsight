import { Injectable } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { ModbusServer } from './modbus-server';
import { ModbusCoil } from './modbus-coil';
import { ModbusDiscreteInput } from './modbus-discrete-input';
import { ModbusHoldingRegister } from './modbus-holding-register';
import { ModbusInputRegister } from './modbus-input-register';
import { DataType } from '../dtos/enums/data-types.enum';

@Injectable()
export class ModbusService {
  constructor() {}

  async readCoil(id: string) {
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        1,
        '194.104.16.166',
        502,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    let modbusEquipment = new ModbusCoil(modbusClient, 0x00f, 0x0001);

    try {
      let data = await modbusEquipment.readCoilRegister();
      modbusEquipment.closeConnection();
      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }

  async writeCoil(id: string) {
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        1,
        '194.104.16.166',
        502,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    let modbusEquipment = new ModbusCoil(modbusClient, 0x00f, 0x0001);

    try {
      await modbusEquipment.writeCoilRegister(true);

      modbusEquipment.closeConnection();

      return { success: 'operation done' };
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }

  async readInputRegister(id: string) {
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        1,
        '194.104.16.166',
        502,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
    }
    let modbusEquipment = new ModbusDiscreteInput(modbusClient, 0x00a1, 0x0001);
    try {
      let data = await modbusEquipment.readInputRegister();
      modbusEquipment.closeConnection();

      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }

  async readHoldingRegister(id: string) {
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        1,
        '194.104.16.166',
        502,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
    }
    let modbusEquipment = new ModbusHoldingRegister(
      modbusClient,
      0x0010,
      0x0002,
      true,
      DataType.DOUBLE_PRECISION_32BIT_IEEE_FLOAT,
    );
    try {
      let data = await modbusEquipment.readHoldingRegister();
      modbusEquipment.closeConnection();

      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }

  async writeHoldingRegister(id: string) {
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        1,
        '194.104.16.166',
        502,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
    }
    let modbusEquipment = new ModbusHoldingRegister(
      modbusClient,
      0x0010,
      0x0002,
      true,
      DataType.DOUBLE_PRECISION_32BIT_IEEE_FLOAT,
    );
    try {
      let data = await modbusEquipment.writeHoldingRegister();
      modbusEquipment.closeConnection();

      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }

  async readInputsRegister(id: string) {
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        1,
        '194.104.16.166',
        502,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
    }
    let modbusEquipment = new ModbusInputRegister(
      modbusClient,
      0x0010,
      0x0002,
      true,
      DataType.DOUBLE_PRECISION_32BIT_IEEE_FLOAT,
    );
    try {
      let data = await modbusEquipment.readInputRegister();
      modbusEquipment.closeConnection();

      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error);
    }
  }
}
