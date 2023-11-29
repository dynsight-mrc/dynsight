import { ModbusGateway } from "./modbus-gateway.dto";
import { MqttGateway } from "./mqtt-gateway.dto";

export class ReadPropertyDto {
    'propertyId': string;
    'name': string;
    'config': MqttGateway | ModbusGateway
    'unit': string | null;
    'accessType': string;
    'disabled': boolean;
  }