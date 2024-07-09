import { WattsenseProtocols } from "../wattsense-protocol.dto";

export class ModbusGateway {
    protocol: WattsenseProtocols.MODBUS_IP_GATEWAY | string;
    modbusRegisterType: string;
    modbusDataFormat: string;
    modbusRegisterAddress: number;
    modbusNumberOfRawRegisters: number;
  }