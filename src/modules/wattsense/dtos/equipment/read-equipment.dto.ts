import { ReadPropertyDto } from "../property/read-property.dto";

export class ReadEquipmentDto {
    'equipmentId': string;
    'name': string;
    'properties': ReadPropertyDto[];
  }
  