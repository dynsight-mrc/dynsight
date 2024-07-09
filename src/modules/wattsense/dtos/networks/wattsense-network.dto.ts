import {  WattsenseProtocols } from "../wattsense-protocol.dto";

export class WattsenseNetworkDto{
    networkId: 'string';
    name: 'string';
    description: 'string';
    equipments: string[];
    config: {
      protocol: WattsenseProtocols;
    };
    interFrameDelay: number;
    responseTimeout: number;
    retryNumber: number;
    tags: {};
  }
