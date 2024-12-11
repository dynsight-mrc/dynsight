import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../services/room.service';
import { RoomController } from '../controllers/room.controller';
import { Types } from 'mongoose';
import { mockRoomService } from './__mocks__/room.services.mock';
import {
  mockRoomDoc,
  mockRoomDocWithDetails,
  mockRoomId,
} from './__mocks__/room.docs.mock';

describe('RoomController', () => {
  let roomController: RoomController;
  let roomService: RoomService;

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

  describe('findOne', () => {
    it('should call findOneById if no details are provided', async () => {
      let details = undefined;
      let mockFindoneById = jest
        .spyOn(mockRoomService, 'findOneById')
        .mockResolvedValueOnce(mockRoomDoc);
      let reponse = await roomController.findOne(
        mockRoomId.toString(),
        details,
      );

      expect(mockFindoneById).toHaveBeenCalledTimes(1);
      expect(reponse).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        floorId: expect.any(Types.ObjectId),
        buildingId: expect.any(Types.ObjectId),
        organizationId: expect.any(Types.ObjectId),
        surface: expect.any(Number),
      });
    });
    it('should call findOneByIdWithDetails if no details are provided', async () => {
      let details = 'true';
      let mockFindOneByIdWithDetails = jest
        .spyOn(mockRoomService, 'findOneByIdWithDetails')
        .mockResolvedValueOnce(mockRoomDocWithDetails);
      let reponse = await roomController.findOne(
        mockRoomId.toString(),
        details,
      );

      expect(mockFindOneByIdWithDetails).toHaveBeenCalledTimes(1);
      expect(reponse).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        floor: {
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          number: expect.any(Number),
        },
        building: { id: expect.any(Types.ObjectId), name: expect.any(String) },
        organization: {
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
        },
        surface: expect.any(Number),
      });
    });
  });

  });
