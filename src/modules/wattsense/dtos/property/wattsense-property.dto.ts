import { WattsenseProtocols } from "../wattsense-protocol.dto";
import { ModbusGateway } from "./modbus-gateway.dto";
import { MqttGateway } from "./mqtt-gateway.dto";

enum PropertyKind {
  DATE = 'date',
  DATE_TIME = 'date-time',
  FREE_FORM_DATE_TIME = 'free-form-date-time',
  DAILY_SCHEDULE = 'daily-schedule',
  SYNCO_EXCEPTION_PERIOD = 'synco-exception-period',
  BACNET_SCHEDULE = 'bacnet-schedule',
}
enum AccessType {
  REMOTE_READ_ONLY = 'REMOTE_READ_ONLY',
  REMOTE_WRITE_ONLY = 'REMOTE_WRITE_ONLY',
  REMOTE_READ_WRITE = 'REMOTE_READ_WRITE',
  LOCAL = 'LOCAL',
}


export class WattsensePropertyDto {
  propertyId: string;
  equipmentId: string;
  gatewayInterfaceId: string;
  name: string;
  slug: string;
  description: string;
  accessType:AccessType;
  redirectToProperties: string[];
  disabled: boolean;
  kind: PropertyKind;
  config: MqttGateway | ModbusGateway;
  timer: number;
  unit: string;
  scaling: {
    a: number;
    b: number;
  };
  tags: {};
}
