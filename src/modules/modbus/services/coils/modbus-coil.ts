import ModbusRTU from 'modbus-serial';
import { ConnectionType } from '../../dtos/enums/connection-type.enum';
import { ModbusServer } from '../modbus-ip-server/modbus-server';

export class ModbusCoil {
  constructor(
    private client: ModbusRTU,
    private startAddress: number,
    private coilQuantity: number,
  ) {}

  public async readCoilRegister() {
    try {
      let data = await this.client.readCoils(
        this.startAddress,
        this.coilQuantity,
      );
      return data.data[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  public async writeCoilRegister(value: boolean) {
    try {
      return await this.client.writeCoil(this.startAddress, value);
    } catch (error) {
        
      throw new Error(error)
    }
  }

  public closeConnection() {
    this.client.close((err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Modbus Connection Closed');
    });
  }
}
