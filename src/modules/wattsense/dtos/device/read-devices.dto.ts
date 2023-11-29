import { ReadEquipmentDto } from "../equipment/read-equipment.dto";

export class ReadDevicesDto {
  'deviceId': string;
  'name': string;
  'orgranizationId': string;
  'siteId': string | null;
  'status': string;
  'equipments': ReadEquipmentDto[];
}
