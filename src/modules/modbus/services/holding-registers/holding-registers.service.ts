import { Injectable } from '@nestjs/common';
import { HoldingRegistersRepositoryService } from './holding-registers-repository.service';
import { ReadHoldingRegisterDto } from '../../dtos/holding-register/read-holding-register.dto';
import ModbusRTU from 'modbus-serial';
import { ModbusServer } from '../modbus-ip-server/modbus-server';
import { ModbusHoldingRegister } from './modbus-holding-register';
import { endianness } from 'os';

@Injectable()
export class HoldingRegistersService {
  constructor(
    private readonly holdingRegisterRepositoryService: HoldingRegistersRepositoryService,
  ) {}

  async readHoldingRegister(id: string) {
    
    let holdingRegister = (await this.holdingRegisterRepositoryService.find(
      id,
    )) as undefined as ReadHoldingRegisterDto;

      
    let modbusClient: ModbusRTU;
    try {
      modbusClient = await new ModbusServer(
        ModbusServer.generateServerId(),
        holdingRegister.modbusServer.ipAddress,
        holdingRegister.modbusServer.port,
        'TCP',
      ).connect();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    let modbusEquipment = new ModbusHoldingRegister(
      modbusClient,
      holdingRegister.startAddress,
      holdingRegister.inputQuantity,
      holdingRegister.endianness,
      holdingRegister.dataType,
    );
        
    try {
      let data = await modbusEquipment.readHoldingRegister();
      modbusEquipment.closeConnection();
      return data;
    } catch (error) {
      modbusEquipment.closeConnection();

      throw new Error(error.message);
    }
  }


  async writeHoldingRegister(id:string,value:number){
    
    let holdingRegister = (await this.holdingRegisterRepositoryService.find(
        id,
      )) as undefined as ReadHoldingRegisterDto;
        
      let modbusClient: ModbusRTU;
      try {
        modbusClient = await new ModbusServer(
          ModbusServer.generateServerId(),
          holdingRegister.modbusServer.ipAddress,
          holdingRegister.modbusServer.port,
          'TCP',
        ).connect();
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
      let modbusEquipment = new ModbusHoldingRegister(
        modbusClient,
        holdingRegister.startAddress,
        holdingRegister.inputQuantity,
        holdingRegister.endianness,
        holdingRegister.dataType,
      );
  
      try {
        let data = await modbusEquipment.writeHoldingRegister(value);
        modbusEquipment.closeConnection();
        return data;
      } catch (error) {
        modbusEquipment.closeConnection();
  
        throw new Error(error.message);
      }
  }
}
