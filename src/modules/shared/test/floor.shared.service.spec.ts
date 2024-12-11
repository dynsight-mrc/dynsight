import { Test, TestingModule } from '@nestjs/testing';
import { FloorSharedService } from '../services/floor.shared.service';
import { MongoSharedService } from '../services/mongo.shared.service';
import { getModelToken } from '@nestjs/mongoose';
import { Floor } from '@modules/floor/entities/floor.entity';
import mongoose, { Types } from 'mongoose';
import { mockFloorModel } from './__mocks__/floors/floor.model.mock';
import {
  mockBuildingId,
  mockCreateFloorDocumentDto,
  mockCreateFloorsDto,
  mockFloorId,
  mockFloorsDocs,
} from './__mocks__/floors/floor.docs.mock';
import { mockFloorSharedService } from './__mocks__/floors/floor.services.mock';
import { mockFloorWithDetails } from '@modules/floor/tests/__mocks__/floor.docs.mock';

describe('FloorSharedService', () => {
  let floorSharedService: FloorSharedService;
  let mongoSharedService: MongoSharedService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FloorSharedService,
        { provide: getModelToken(Floor.name), useValue: mockFloorModel },
        MongoSharedService,
      ],
    }).compile();

    floorSharedService = module.get<FloorSharedService>(FloorSharedService);
    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);
  });

  it('should be defined', () => {
    expect(floorSharedService).toBeDefined();
  });

  describe('formatFloorsRawData', () => {
    it('should throw error if names array and number arrays length are incompatible', () => {
      let _mockCreateFloorDto = JSON.parse(JSON.stringify(mockCreateFloorsDto));
      _mockCreateFloorDto.name.pop();

      expect(() =>
        floorSharedService.formatFloorsRawData(_mockCreateFloorDto),
      ).toThrow('Error occured when formating floors data');
    });
    it('should throw error if names list has doubles', () => {
      let _mockCreateFloorDto = JSON.parse(JSON.stringify(mockCreateFloorsDto));
      _mockCreateFloorDto.name[1] = _mockCreateFloorDto.name[0];

      expect(() =>
        floorSharedService.formatFloorsRawData(_mockCreateFloorDto),
      ).toThrow('floors names must be unique');
    });
    it('should throw error if numbers list has doubles', () => {
      let _mockCreateFloorDto = JSON.parse(JSON.stringify(mockCreateFloorsDto));
      _mockCreateFloorDto.number[1] = _mockCreateFloorDto.number[0];

      expect(() =>
        floorSharedService.formatFloorsRawData(_mockCreateFloorDto),
      ).toThrow('floors numbers must be unqiue');
    });
    it('should return formated Array of floors', () => {
      let formatedFloors =
        floorSharedService.formatFloorsRawData(mockCreateFloorsDto);
      formatedFloors.forEach((floor) =>
        expect(floor).toEqual({
          number: expect.any(Number),
          name: expect.any(String),
          organizationId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
        }),
      );
    });
  });

  describe('createMany', () => {
    it('should throw error on duplicate key', async () => {
      const duplicateKeyError = { code: 11000 };

      mockFloorModel.insertMany.mockRejectedValue(duplicateKeyError);
      await expect(
        floorSharedService.createMany([mockCreateFloorDocumentDto]),
      ).rejects.toThrow(
        'Un ou plusieurs étages existent déja avec ces paramètres',
      );
    });
    it('should return a list of created floors', async () => {
      mockFloorModel.insertMany.mockResolvedValueOnce([
        { toJSON: () => mockCreateFloorDocumentDto },
      ]);

      let session = {};

      const floorsDocs = await floorSharedService.createMany(
        [mockCreateFloorDocumentDto],
        session,
      );

      floorsDocs.forEach((ele) =>
        expect(ele).toEqual({
          number: expect.any(Number),
          name: expect.any(String),
          organizationId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
        }),
      );
    });
  });

  describe('findOneByFields', () => {
    it('should throw error if could not retrieve floor data', async () => {
      mockFloorModel.findOne.mockRejectedValueOnce(Error);
      let mockFields = [
        { name: 'buildingId', value: mockBuildingId.toString() },
      ];
      try {
        await floorSharedService.findOneByFields(mockFields);
      } catch (error) {
        expect(error.message).toBe('Error while retrieving the floor data');
      }
    });
    it('should return null if could not found any data', async () => {
      mockFloorModel.findOne.mockResolvedValueOnce(null);
      let mockFields = [
        { name: 'buildingId', value: mockBuildingId.toString() },
      ];

      let floors = await floorSharedService.findOneByFields(mockFields);
      expect(floors).toBe(null);
    });
    it('should return the requested floor object', async () => {
      mockFloorModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockFloorsDocs[0],
      });
      let mockFields = [
        { name: 'buildingId', value: mockBuildingId.toString() },
      ];
      let results = await floorSharedService.findOneByFields(mockFields);
      expect(results).toEqual({
        id: expect.any(Types.ObjectId),
        number: expect.any(Number),
        name: expect.any(String),
        buildingId: expect.any(Types.ObjectId),
        organizationId: expect.any(Types.ObjectId),
      });
    });
  });
  describe('findOneById', () => {
    it('should throw error if could not retrieve floor data', async () => {
      mockFloorModel.findOne.mockRejectedValueOnce(Error);

      try {
        await floorSharedService.findOneById(mockFloorId.toString());
      } catch (error) {
        expect(error.message).toBe('Error while retrieving the floor data');
      }
    });
    it('should return null if could not found any data', async () => {
      mockFloorModel.findOne.mockResolvedValueOnce(null);

      let results = await floorSharedService.findOneById(
        mockFloorId.toString(),
      );
      expect(results).toBe(null);
    });
    it('should return the requested floor object', async () => {
      mockFloorModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockFloorsDocs[0],
      });

      let results = await floorSharedService.findOneById(
        mockFloorId.toString(),
      );

      expect(results).toEqual({
        id: expect.any(Types.ObjectId),
        number: expect.any(Number),
        name: expect.any(String),
        buildingId: expect.any(Types.ObjectId),
        organizationId: expect.any(Types.ObjectId),
      });
    });
  });
  describe('findManyWithDetails', () => {
    it('should throw error if could not retrieve floors data', async () => {
      mockFloorModel.find.mockReturnThis();
      mockFloorModel.populate.mockRejectedValueOnce(Error(''));
      try {
        await floorSharedService.findManyWithDetails({
          buildingId: mockBuildingId,
        });
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
      let results = await floorSharedService.findManyWithDetails({
        buildingId: mockBuildingId.toString(),
      });
      expect(results.length).toBe(0)
    });
    it('should return a list of floors with the requested details', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['buildingId', 'organizationId']);
      mockFloorModel.find.mockReturnThis();
      mockFloorModel.populate.mockResolvedValueOnce([
        { toJSON: () => mockFloorWithDetails },
      ]);
      let results = await floorSharedService.findManyWithDetails({
        buildingId: mockBuildingId.toString(),
      });
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

  afterEach(() => {
    mockFloorModel.findOne.mockReset();
    mockFloorModel.populate.mockReset();
  });
});
