import { Injectable } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { ModbusServer } from './modbus-ip-server/modbus-server';
import { ModbusCoil } from './coils/modbus-coil';
import { ModbusDiscreteInput } from './discrete-inputs/modbus-discrete-input';
import { ModbusHoldingRegister } from './holding-registers/modbus-holding-register';
import { ModbusInputRegister } from './input-registers/modbus-input-register';
import { DataType } from '../dtos/enums/data-types.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Coil, CoilModel } from '../models/coil.model';
import {
  DiscreteInput,
  DiscreteInputModel,
} from '../models/discrete-input.model';
import {
  HoldingRegister,
  HoldingRegisterModel,
} from '../models/holding-regster.model';
import {
  InputRegister,
  InputRegisterModel,
} from '../models/input-register.model';

@Injectable()
export class ModbusService {
  /* constructor(
    @InjectModel(ModbusServer.name)
    private readonly modbusServerModel: ModbusIpServerModel,
    @InjectModel(Coil.name) private readonly coilModel: CoilModel,
    @InjectModel(DiscreteInput.name)
    private readonly discreteInputModel: DiscreteInputModel,
    @InjectModel(HoldingRegister.name)
    private readonly holdingREgisterModel: HoldingRegisterModel,
    @InjectModel(InputRegister.name)
    private readonly inputRegisterModel: InputRegisterModel,
  ) {}

 

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
  } */
}
