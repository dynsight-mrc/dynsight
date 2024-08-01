import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../services/room.service';
import { RoomController } from '../controllers/room.controller';
import mongoose from 'mongoose';

describe('UserController', () => {
  let roomController: RoomController;
  let mockRoomService = {
    findAllOverview: jest.fn(),
  };
  let roomService: RoomService;
  let mockRoom = {
    id: new mongoose.Types.ObjectId(),
    name: 'bloc 1',
    floorId: {
      id: new mongoose.Types.ObjectId(),
      name: 'etage 1',
      number: 1,
    },
    buildingId: {
      id: new mongoose.Types.ObjectId(),
      name: 'bloc 1',
    },
    organizationId: {
      id: new mongoose.Types.ObjectId(),
      name: 'organization_name',
    },
    surface: 25,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [{ provide: RoomService, useValue: mockRoomService }],
    }).compile();

    roomController = module.get<RoomController>(RoomController);
    roomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(roomService).toBeDefined();
  });
  describe('findAllOverview', () => {
    it('should return a list of rooms', async () => {
      mockRoomService.findAllOverview.mockResolvedValueOnce([mockRoom]);
      let rooms = await roomController.findAllOverview();
      expect(rooms.length).toEqual(1);
    });
  });
});
