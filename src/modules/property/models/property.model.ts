import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { Document, Model } from 'mongoose';
import { Device } from '../../device/models/device.model';
import { Equipment } from '../../equipment/models/equipment.model';
import { AccessType } from '../../../common/wattsense/enums/access-type';
import { ProtocolList } from '../../../common/wattsense/enums/protocol-list.enum';

interface PropertyAttrs {
  propertyId: string;
  equipmentId: string;
  deviceId: string;
  name: string;
  accessType?: AccessType|string;
  disabled?: boolean;
  config: MqttGateway | ModbusGateway;
  unit?: string;
}


/* interface MqttGatewayAttrs{
  protocol: ProtocolList.MQTT_GATEWAY;
  mqttSlug:string
} */

export interface PropertyModel extends Model<Property> {
  build(attrs: PropertyAttrs):Property;
}
//export interface MqttGatewayModel extends Model<MqttGateway>{} 

@Schema({ _id: false })
class MqttGateway  {
  @Prop({ type: String, enum: ProtocolList })
  protocol: ProtocolList.MQTT_GATEWAY |string;
  @Prop({ type: String })
  mqttSlug: string;
}

@Schema({ _id: false })
class ModbusGateway {
  @Prop({ type: String, enum: ProtocolList })
  protocol: ProtocolList.MODBUS_IP_GATEWAY |string;
  @Prop({ type: String })
  modbusRegisterType: string;
  @Prop({ type: String })
  modbusDataFormat: string;
  @Prop({ type: Number })
  modbusRegisterAddress: number;

  @Prop({ type: Number })
  modbusNumberOfRawRegisters: number;
}

@Schema()
export class Property extends Document{
  @Prop()
  propertyId: string;

  @Prop({ type: String, required: false, ref: Equipment.name })
  equipmentId: string;

  @Prop({ type: String, ref: Device.name })
  deviceId: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, enum: AccessType })
  accessType?: AccessType|string;

  @Prop({ type: Boolean })
  disabled?: boolean;

  @Prop({ type: Object })
  config: MqttGateway | ModbusGateway;

  @Prop({ type: String })
  unit?: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
//const MqttGatewaySchema = SchemaFactory.createForClass(MqttGateway)

PropertySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

PropertySchema.statics.build = function(propAttrs: PropertyAttrs){
  //const MqttGateway = new MqttGateway(propAttrs.config)
  return new this(propAttrs);

};

/* const MqttGatewayModel = mongoose.model<MqttGateway, MqttGatewayModel>(
  'MqttGateway',
  MqttGatewaySchema,
); */
 //export const PropertyModel: Model<PropertyDoc,PropertyModel> = PropertySchema as Model<Property>;
/* const PropertyModel = mongoose.model<Property, PropertyModel>(
  'Property',
  PropertySchema,
);
 */