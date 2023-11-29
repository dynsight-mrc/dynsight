import { WattsenseProtocols } from "../wattsense-protocol.dto";

export class MqttGateway {
    protocol: WattsenseProtocols.MQTT_GATEWAY | string ;
    mqttSlug: string;
  }

export  function isMqttGatewayLike(obj: any): obj is MqttGateway {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'protocol' in obj &&
      'mqttSlug' in obj &&
      (obj.protocol === WattsenseProtocols.MQTT_GATEWAY || typeof obj.protocol === 'string')
    );
  }
