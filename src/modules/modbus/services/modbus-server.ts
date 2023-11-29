import ModbusRTU from 'modbus-serial';
import { ConnectionType } from '../dtos/enums/connection-type.enum';



export class ModbusServer {
  serverId: number;
  protected ipAddress: string;
  port: number;
  connectionType: ConnectionType | string;

  protected client: ModbusRTU;

  constructor(
    serverId: number,
    ipAddress: string,
    port: number,
    connectionType: ConnectionType | string,
  ) {
    this.serverId = serverId;
    this.ipAddress = ipAddress;
    this.port = port;
    this.connectionType = connectionType;
    this.client = new ModbusRTU();
  }

  public async connect() {    
    if (this.connectionType === ConnectionType.TCP) {        
      try {
        await this.client.connectTCP(this.ipAddress, { port: this.port });
        
        this.client.setID(this.serverId);
        console.log("Connected to Modbus Equipment");
        //let data = await this.client.readCoils(0, 1);
        //console.log(data);
        
      } catch (error) {
        console.error('Modbus Connection Error:', error.message);
      }
    }else{
        console.log('please choose other type of connection');
        
    }
    return this.client
  }

 
}
