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
import { UpdateRoomModbusProprtiesDto } from '../dtos/update-room-modbus-proprties.dto';
import { CoilsService } from 'src/modules/modbus/services/coils/coils.service';
import { CoilsRepositoryService } from 'src/modules/modbus/services/coils/coils-repository.service';
import { DiscreteInputsRepositoryService } from 'src/modules/modbus/services/discrete-inputs/discrete-inputs-repository.service';
import { HoldingRegistersRepositoryService } from 'src/modules/modbus/services/holding-registers/holding-registers-repository.service';
import { InputRegistersRepositoryService } from 'src/modules/modbus/services/input-registers/input-registers-repository.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel,
    private readonly deviceService: DeviceService,
    private readonly equipmentService: EquipmentService,
    private readonly coilsRepositoryService: CoilsRepositoryService,
    private readonly discreteInputRepositoryService: DiscreteInputsRepositoryService,
    private readonly holdingRegisterRepositoryServcie: HoldingRegistersRepositoryService,
    private readonly inputRegisterRepositoryService: InputRegistersRepositoryService,
  ) {}

  async findAll(): Promise<ReadRoomDto[]> {
    try {
      return await this.roomModel.find().populate("properties")
      .populate({
        path:"devices.coils",
        populate:{
          path:"modbusServer"
        }
      })
      .populate({
        path:"devices.discreteInputs",
        populate:{
          path:"modbusServer"
        }
      })
      .populate({
        path:"devices.discreteInputs",
        populate:{
          path:"modbusServer"
        }
      })
      .populate({
        path:"devices.inputRegisters",
        populate:{
          path:"modbusServer"
        }
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: string) {
    try {
      return (
       
          await this.roomModel.findOne({ _id: id })
          .populate("properties")
          .populate({
            path:"devices.coils",
            populate:{
              path:"modbusServer"
            }
          })
          .populate({
            path:"devices.discreteInputs",
            populate:{
              path:"modbusServer"
            }
          })
          .populate({
            path:"devices.discreteInputs",
            populate:{
              path:"modbusServer"
            }
          })
          .populate({
            path:"devices.inputRegisters",
            populate:{
              path:"modbusServer"
            }
          })
   
      )
      
    } catch (error) {
      throw new Error(error.message);
    }
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

    let createdProperties: string[] =
      await this.findOrCreatePropertiesFromDevices(
        roomId,
        updateRoomPropertiesDtos,
      );

    await this.roomModel.updateOne(
      { _id: room.id },
      { properties: createdProperties },
    );
    session.endSession();
    return await this.roomModel.findById(roomId);
  }

  async updateModbus(
    roomId: string,
    updateRoomModbusProprtiesDto: UpdateRoomModbusProprtiesDto,
  ) {
    let { coils, discreteInputs, holdingRegisters, inputRegisters } =
      updateRoomModbusProprtiesDto;

    let modbusDevices = {
      coils: [],
      discreteInputs: [],
      holdingRegisters: [],
      inputRegisters: [],
    };
    let room: Room = await this.findOne(roomId);
    if (!room) throw new Error('Room not found');

    const session = await this.roomModel.startSession();
    session.startTransaction();
    try {
      let room: Room = await this.findOne(roomId);
      if (!room) throw new Error('Room not found');
      
      if (coils.length > 0) {
        modbusDevices.coils = (
          await this.coilsRepositoryService.createMany(coils)
        ).map((coil) => coil.id.toString());
      }
      console.log(updateRoomModbusProprtiesDto.discreteInputs);

      if (discreteInputs.length > 0) {
        
        modbusDevices.discreteInputs = (
          await this.discreteInputRepositoryService.createMany(discreteInputs)
        ).map((discreteInput) => discreteInput.id.toString());
      }
      if (holdingRegisters.length > 0) {
        modbusDevices.holdingRegisters = (
          await this.holdingRegisterRepositoryServcie.createMany(
            holdingRegisters,
          )
        ).map((holdingRegister) => holdingRegister.id.toString());
      }
      if (discreteInputs.length > 0) {
        modbusDevices.inputRegisters = (
          await this.inputRegisterRepositoryService.createMany(inputRegisters)
        ).map((inputRegister) => inputRegister.id.toString());
      }
      /*  return {
        createdCoils,
      }; */


      await this.roomModel.updateOne(
        { _id: roomId },
        {
          $addToSet: {
            'devices.coils': modbusDevices.coils,
            'devices.discreteInputs': modbusDevices.discreteInputs,
            'devices.holdingRegisters': modbusDevices.holdingRegisters,
            'devices.inputRegisters': modbusDevices.inputRegisters,
          },
        },
      );
      session.commitTransaction();
    } catch (error) {
      console.log(error.message);
      session.abortTransaction();
    }
    //fct check if room exists
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
