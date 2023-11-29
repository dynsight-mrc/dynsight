import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../services/room.service';
import { getModelToken } from '@nestjs/mongoose';
import { Room, RoomModel } from '../models/room.model';
import { PropertyService } from '../../property/services/property.service';
import { DeviceService } from '../../device/services/device.service';
import { EquipmentService } from '../../equipment/services/equipment.service';
import mongoose, { Model } from 'mongoose';

const mockRoomService = {};

const mockDeviceService = {};

const mockEquipmentService = {};

const mockPropertyService = {};

describe('RoomService', () => {
  let roomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        { provide: getModelToken(Room.name), useValue: Model },
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: EquipmentService, useValue: mockEquipmentService },
      ],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(roomService).toBeDefined();
  });

  describe('create', () => {
    it('should create a room', async () => {
      let room = {
        name: 'room_1',
        floor: new mongoose.Types.ObjectId().toHexString(),

        building: new mongoose.Types.ObjectId().toHexString(),

        organization: new mongoose.Types.ObjectId().toHexString(),
      };
      let createdRoom = await roomService.create(room)
      console.log(createdRoom);
      
      expect(createdRoom.id).toBeDefined()
    });
  });
});
