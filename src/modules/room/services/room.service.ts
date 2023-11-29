import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomModel } from '../models/room.model';
import { CreateRoomDto } from '../dtos/create-room.dto';
import { UpdateRoomPropertiesDto } from '../dtos/update-room-property.dto';
import { PropertyService } from '../../property/services/property.service';
import { DeviceService } from '../../device/services/device.service';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { ReadRoomDto } from '../dtos/read-room-dto';
import { RequestValidationError } from '../../../common/errors/request-validation-error';
import { UpdateRoomZone } from '../dtos/update-room-zone.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel,

    private readonly propertyService: PropertyService,
    private readonly deviceService: DeviceService,
    private readonly equipmentService: EquipmentService,
  ) {}

  async findAll(): Promise<ReadRoomDto[]> {
    return await this.roomModel.find();
  }

  async findOne(id: string) {
    return await this.roomModel.findOne({ _id: id }).populate('properties');
  }

  async create(createRoomDto: CreateRoomDto) {
    let foundRoom = await this.roomModel.findOne({ name: createRoomDto.name });
    if (foundRoom) {
      throw new RequestValidationError(
        'Room Already exist with this name',
        400,
      );
    }
    const room = this.roomModel.build({
      name: createRoomDto.name,
      properties: [],
    });
    await room.save();

    return room;
  }
  async remove(id: string) {
    return await this.roomModel.deleteOne({ _id: id });
  }

  async updateProperties(id: string, Dto: UpdateRoomPropertiesDto) {
    const session = await this.roomModel.startSession();
    session.startTransaction();
    let room = await this.roomModel.findById(id);
    if(!room) throw new NotFoundException("Room not found")
    let { equipments } = Dto;
    try {
      let device = await this.deviceService.create({
        deviceId: Dto.deviceId,
        name: Dto.name,
        orgranizationId: Dto.orgranizationId,
        siteId: Dto.siteId,
        status: Dto.status,
      });

      equipments.map(async (equip) => {
        let { properties } = equip;

        let equipment = await this.equipmentService.create({
          deviceId: device.id,
          equipmentId: equip.equipmentId,
          name: equip.name,
        });

        properties.forEach(async (property) => {
          const prop = await this.propertyService.create({
            propertyId: property.propertyId,
            deviceId: device.id,
            equipmentId: equipment.id,
            name: property.name,
            unit: property.unit,
            config: property.config,
            accessType: property.accessType,
            disabled: property.disabled,
          });
          room.set({ properties: [...properties, prop.id] });
          room.save();
          /* room =  await this.roomModel.updateOne(
            { _id: id },
            { $addToSet: { properties: prop.id } },
          ); */
        });
      });
    } catch (error) {
      await session.abortTransaction();
      console.log(error);

      throw new Error(error);
    } finally {
      session.endSession();
      
    }
    return room;
    //==============++++++++
    /* let { equipments } = Dto;

    let deviceObj = Dto;
    delete deviceObj.equipments;

    const device = this.deviceModel.build({
      deviceId: deviceObj.deviceId,
      name: deviceObj.name,
      orgranizationId: deviceObj.orgranizationId,
      siteId: deviceObj.siteId,
      status: deviceObj.status,
    });

    await device.save();

    equipments.map(async (equip) => {
      let { properties } = equip;

      let equipment = this.equipmentModel.build({
        deviceId: deviceObj.deviceId,
        equipmentId: equip.equipmentId,
        name: equip.name,
      });

      await equipment.save();

      properties.forEach(async (property) => {
        const prop = this.propertyModel.build({
          propertyId: property.propertyId,
          deviceId: deviceObj.deviceId,
          equipmentId: equip.equipmentId,
          name: property.name,
          unit: property.unit,
          config: property.config,
          accessType: property.accessType,
          disabled: property.disabled,
        });
        await prop.save();
        return { device, prop, equipment };
      });
    }); */
  }

  async updateZone(id: string, updateRoomZone: UpdateRoomZone) {
    let room = await this.roomModel.findById(id);

    if (!room) {
      throw new NotFoundException("Room doesn't exist with this id");
    }
    room.set({ zone: updateRoomZone.zone });
    await room.save();
    return room;
  }

  async removeAll() {
    return await this.roomModel.deleteMany({});
  }
}
