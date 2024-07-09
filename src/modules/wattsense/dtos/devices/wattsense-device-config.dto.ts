import { WattsenseEquipmentDto } from "../equipments/wattsense-equipment.dto";
import {  WattsenseNetworkDto } from "../networks/wattsense-network.dto";
import { WattsensePropertyDto } from "../properties/wattsense-property.dto";

enum ConfigStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  DISCARDED = 'DISCARDED',
  CURRENT = 'CURRENT',
  ARCHIVED = 'ARCHIVED',
}

export class WattsenseDeviceConfigDto {
  revisionId: string;
  parentRevisionId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  status: ConfigStatus;
  errors: string[];
  properties: WattsensePropertyDto[];
  networks: WattsenseNetworkDto[]
  equipments: WattsenseEquipmentDto[ ];
  connectors: {};
  configCommandId: string;
  restartCommandId: string;
  tags: {};
}
