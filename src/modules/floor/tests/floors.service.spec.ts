import { Test, TestingModule } from '@nestjs/testing';
import { FloorModel } from '../models/floor.model';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Floor } from '../entities/floor.entity';

import mongoose, { Types } from 'mongoose';

import { FloorService } from '../services/floor.service';
import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { FloorsService } from '../services/floors.service';
import { FunctionSharedService } from '@modules/shared/services/functions.shared.service';
import { mockFloorModel } from './__mocks__/floor.model.mock';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import {
  mockBuildingSharedService,
  mockFloorService,
  mockFloorSharedService,
  mockRoomSharedService,
} from './__mocks__/floor.services.mock';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import {
  mockBuildingId,
  mockConnection,
  mockFloorsData,
  mockFloorsDocs,
  mockFloorWithDetails,
} from './__mocks__/floor.docs.mock';

describe('FloorsService', () => {
  let floorsService: FloorsService;
  let floorService: FloorService;
  let floorModel: FloorModel;
  let roomSharedService: RoomSharedService;
  let mongoSharedService: MongoSharedService;
  let functionSharedService: FunctionSharedService;
  let floorSharedService: FloorSharedService;
  let buildingSharedService: BuildingSharedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Floor.name), useValue: mockFloorModel },
        FloorsService,
        { provide: FloorService, useValue: mockFloorService },
        { provide: RoomSharedService, useValue: mockRoomSharedService },
        { provide: FloorSharedService, useValue: mockFloorSharedService },
        { provide: BuildingSharedService, useValue: mockBuildingSharedService },

        FunctionSharedService,
        MongoSharedService,
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
      ],
    }).compile();

    floorsService = module.get<FloorsService>(FloorsService);
    floorModel = module.get<FloorModel>(getModelToken(Floor.name));
    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);
    roomSharedService = module.get<RoomSharedService>(RoomSharedService);
    floorSharedService = module.get<FloorSharedService>(FloorSharedService);
    buildingSharedService = module.get<BuildingSharedService>(
      BuildingSharedService,
    );
  });

  it('should be defined', () => {
    expect(floorsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should throw error if could not retrieve floors data', async () => {
      mockFloorModel.find.mockRejectedValueOnce(Error(''));
      try {
        await floorsService.findAll();
      } catch (error) {
        expect(error.message).toBe('Error while retrieving the floors data');
      }
    });
    it('should return a empty array if no floor is found', async () => {
      mockFloorModel.find.mockResolvedValue([]);
      let results = await floorsService.findAll();
      expect(results.length).toBe(0);
    });
    it('should return a list of floors with the requested details', async () => {
      mockFloorModel.find.mockResolvedValueOnce(
        mockFloorsDocs.map((ele) => ({ toJSON: () => ele })),
      );
      let results = await floorsService.findAll();
      results.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),

          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
        }),
      );
    });
  });

  describe('findAllWithDetails', () => {
    it('should throw error if could not retrieve floors data', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['buildingId', 'organizationId']);
      mockFloorModel.find.mockReturnThis();
      mockFloorModel.populate.mockRejectedValueOnce(Error(''));
      try {
        await floorsService.findAllWithDetails();
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the floors data',
        );
      }
    });
    it('should return a empty array if no floor is found', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['buildingId', 'organizationId']);
      mockFloorModel.find.mockReturnThis();
      mockFloorModel.populate.mockResolvedValueOnce([]);

      let results = await floorsService.findAllWithDetails();
      expect(results.length).toBe(0);
    });
    it('should return a list of floors with the requested details', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['buildingId', 'organizationId']);
      mockFloorModel.find.mockReturnThis();
      mockFloorModel.populate.mockResolvedValueOnce([
        { toJSON: () => mockFloorWithDetails },
      ]);

      let results = await floorsService.findAllWithDetails();

      results.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),

          building: expect.anything(),
          organization: expect.anything(),
        }),
      );
    });
  });

  describe('findMany', () => {
    it('should throw error if could not retrieve floors data', async () => {
      mockFloorModel.find.mockRejectedValueOnce(Error(''));
      try {
        await floorsService.findMany({
          buildingId: mockBuildingId.toString(),
        });
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the floors data',
        );
      }
    });
    it('should return an empty array if no floor is found', async () => {
      mockFloorModel.find.mockResolvedValueOnce([]);
      let results = await floorsService.findMany({
        buildingId: mockBuildingId.toString(),
      });
      expect(results).toBeDefined();
    });
    it('should return a list of floors with the requested details', async () => {
      mockFloorModel.find.mockResolvedValueOnce([
        { toJSON: () => mockFloorsDocs[0] },
      ]);
      let results = await floorsService.findMany({
        buildingId: mockBuildingId.toString(),
      });
      results.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
        }),
      );
    });
  });

  describe('findManyWithRooms', () => {
    it('should throw error if could not retrieve floors data', async () => {
      mockFloorModel.findById.mockReturnThis();
      mockFloorModel.populate.mockRejectedValueOnce(Error(''));
      try {
        await floorsService.findManyWithRooms({
          buildingId: mockBuildingId.toString(),
        });
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the buildings data',
        );
      }
    });
    it('should return a empty list if no floor is found', async () => {
      mockFloorModel.find.mockResolvedValueOnce([]);

      let floor = await floorsService.findManyWithRooms({
        buildingId: mockBuildingId.toString(),
      });

      expect(floor.length).toBe(0);
    });
    it('should return a list of floors with the related rooms', async () => {
      mockFloorModel.find.mockResolvedValueOnce(
        mockFloorsDocs.map((ele) => ({ toJSON: () => ele })),
      );

      mockFloorService.findOneWithRooms
        .mockResolvedValue(mockFloorsData[0])
        .mockResolvedValueOnce(mockFloorsData[0])
        .mockResolvedValueOnce(mockFloorsData[0]);

      let results = await floorsService.findManyWithRooms({
        buildingId: mockBuildingId.toString(),
      });
      results.forEach((floor) =>
        expect(floor).toEqual({
          name: expect.any(String),
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          buildingId: expect.any(Types.ObjectId),

          organizationId: expect.any(Types.ObjectId),

          rooms: expect.anything(),
        }),
      );
      results.forEach((floor) => expect(floor.rooms).toBeDefined());

      results.forEach((floor) => {
        let { rooms } = floor;
        rooms.forEach((room) =>
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
  });

  afterEach(() => {
    mockFloorModel.find.mockReset();
    mockFloorModel.populate.mockReset();
  });
});
