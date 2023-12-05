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
import { RoomServiceHelper } from './room-helper.service';
import { EquipmentWithNestedProperties } from 'src/modules/equipment/dtos/equipment-with-nested-properties.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel,
    private readonly roomServiceHelper: RoomServiceHelper,
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
      floor: createRoomDto.floor,
      building: createRoomDto.building,
      organization: createRoomDto.organization,
      zone: createRoomDto.organization,
    });
    await room.save();

    return room;
  }
  async remove(id: string) {
    return await this.roomModel.deleteOne({ _id: id });
  }


  async findOrCreatePropertiesFromDevice(
    roomId: string,
    updateRoomPropertiesDto: UpdateRoomPropertiesDto,
  ): Promise<string[]> {
    const session = await this.roomModel.startSession();
    session.startTransaction();
    let createdProperties: string[] = [];
    //fct check if room exists
    let room: Room = await this.findOne(roomId);
    if (!room) throw new Error('Room not found');
    try {
      //fct extract device and create one, return created device
      let device = await this.deviceService.findOrCreateOne(
        updateRoomPropertiesDto,
      );
      let { equipments } = updateRoomPropertiesDto;

      //fct that create equipment, givenr deviceId, return equip
      //fct create property, given equipId, DeviceId,RoomId, return property

      createdProperties =
        await this.equipmentService.createEquipmentsWithProperties(
          equipments,
          device.deviceId,
        );
    } catch (error) {
      await session.abortTransaction();
      console.log(error);

      throw new Error(error);
    } finally {
      session.endSession();
    }
    return createdProperties;
  }

  async updateProperties(
    roomId: string,
    updateRoomPropertiesDtos: UpdateRoomPropertiesDto[],
  ): Promise<Room> {
    const session = await this.roomModel.startSession();
    session.startTransaction();

    //fct check if room exists
    let room: Room = await this.findOne(roomId);
    if (!room) throw new Error('Room not found');
    
    let createdProperties: string[] = await this.findOrCreatePropertiesFromDevices(
      roomId,
      updateRoomPropertiesDtos,
    );

    await this.roomModel.updateOne(
      { _id: room.id },
      { properties: createdProperties },
    );

    return await this.roomModel.findById(roomId);
  }

  async findOrCreatePropertiesFromDevices(
    roomId: string,
    updateRoomPropertiesDtos: UpdateRoomPropertiesDto[],
  ): Promise<string[]> {
    let createdProperties: string[] = [];
    for (let updateRoomPropertiesDto of updateRoomPropertiesDtos) {
      let properties = await this.findOrCreatePropertiesFromDevice(
        roomId,
        updateRoomPropertiesDto,
      );
      createdProperties = [...createdProperties, ...properties];
    }
    return createdProperties;
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
