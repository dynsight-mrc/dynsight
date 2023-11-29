import { WattsenseProtocols } from "../wattsense-protocol.dto";

export class WattsenseEquipmentDto{
    equipmentId: string;
    name: string;
    config: {
      protocol: WattsenseProtocols;
    };
    tags: {};
  }