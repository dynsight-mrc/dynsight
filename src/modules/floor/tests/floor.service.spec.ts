import { Test, TestingModule } from '@nestjs/testing';
import { FloorModel } from '../models/floor.model';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Floor } from '../entities/floor.entity';

import mongoose, { Types } from 'mongoose';

import { FloorService } from '../services/floor.service';
import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { mockFloorModel } from './__mocks__/floor.model.mock';
import { mockRoomSharedService } from './__mocks__/floor.services.mock';
import {
  mockConnection,
  mockFloorId,
  mockFloorWithDetails,
  mockRoomsDocs,
} from './__mocks__/floor.docs.mock';

describe('FloorService', () => {
  let floorService: FloorService;
  let floorModel: FloorModel;
  let mongoSharedService: MongoSharedService;
  let roomSharedService: RoomSharedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FloorService,
        { provide: getModelToken(Floor.name), useValue: mockFloorModel },

        MongoSharedService,
        { provide: RoomSharedService, useValue: mockRoomSharedService },
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
      ],
    }).compile();

    floorService = module.get<FloorService>(FloorService);
    floorModel = module.get<FloorModel>(getModelToken(Floor.name));
    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);
    roomSharedService = module.get<RoomSharedService>(RoomSharedService);
  });

  it('should be defined', () => {
    expect(floorService).toBeDefined();
  });
  describe('findOneWithRooms', () => {
    it('should throw error if could not retrieve floors data', async () => {
      mockFloorModel.findById.mockReturnThis();
      mockFloorModel.populate.mockRejectedValueOnce(Error(''));
      try {
        await floorService.findOneWithRooms(mockFloorId.toString());
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the floor data',
        );
      }
    });
    it('should return a list of floors with the related rooms', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizationId', 'buildingId']);
      mockFloorModel.findById.mockReturnThis();
      mockFloorModel.populate.mockResolvedValue({
        toJSON: () => mockFloorWithDetails,
      });
      mockRoomSharedService.findMany.mockResolvedValueOnce(mockRoomsDocs);
      let floor = await floorService.findOneWithRooms(mockFloorId.toString());
      

      expect(floor).toEqual({
        name: expect.any(String),
        id: expect.any(Types.ObjectId),
        number: expect.any(Number),
        building: {
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
        },
        organization: {
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
        },
        rooms: expect.anything(),
      });
      expect(floor.rooms).toBeDefined();
      floor.rooms.forEach((room) =>
        expect(room).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
        }),
      );
    });
  });

  afterEach(() => {
    mockFloorModel.populate.mockReset();
  });
 });
