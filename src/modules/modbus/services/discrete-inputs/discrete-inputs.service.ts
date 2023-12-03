import { Injectable } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { ModbusServer } from '../modbus-ip-server/modbus-server';
import { ReadDiscreteInputDto } from '../../dtos/discreteinputs/read-discrete-input.dto';
import { DiscreteInputsRepositoryService } from './discrete-inputs-repository.service';
import { ModbusDiscreteInput } from './modbus-discrete-input';

@Injectable()
export class DiscreteInputsService {
  constructor(
    private readonly discreteInputRepositoryService: DiscreteInputsRepositoryService,
  ) {}

  async readDiscreteInput(id: string) {
    let discreteInput = (await this.discreteInputRepositoryService.find(
      id,
    )) as undefined as ReadDiscreteInputDto;
        console.log(discreteInput);
        
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        ModbusServer.generateServerId(),
        discreteInput.modbusServer.ipAddress,
        discreteInput.modbusServer.port,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    let modbusEquipment = new ModbusDiscreteInput(
      modbusClient,
      parseInt(discreteInput.startAddress),
      parseInt(discreteInput.inputQuantity),
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
