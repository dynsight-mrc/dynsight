import { Test, TestingModule } from '@nestjs/testing';
import { FloorService } from '../services/floor.service';
import { FloorModel } from '../models/floor.model';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Floor } from '../entities/floor.entity';
import { FloorServiceHelper } from '../services/floor-helper.service';
import mongoose, { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RoomService } from '@modules/room/services/room.service';
import { log } from 'console';
import { BuildingService } from '@modules/building/services/building.service';

describe('FloorService', () => {
  let floorService: FloorService;
  let floorServiceHelper: FloorServiceHelper;
  let floorModel: FloorModel;
  let mockFloorModel = {
    find: jest.fn(),
    insertMany: jest.fn(),
    select: jest.fn(),
    lean: jest.fn(),
  };
  let mockRoomService = { findByFloorId: jest.fn(), createMany: jest.fn() };
  let mockBuildingService = {
    findOne: jest.fn(),
  };
  let mockConnection = {
    startSession: jest.fn().mockResolvedValue({
      startTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      endSession: jest.fn(),
    }),
  };
  let mockBuildingId = new mongoose.Types.ObjectId();
  let mockOrganizationId = new mongoose.Types.ObjectId();
  let createFloorsWithRoomsDto = {
    floors: {
      name: ['etage 1', 'etage 2', 'etage 3'],
      number: [1, 2, 3],
    },
    blocs: {
      name: ['bloc 1', 'bloc 2'],
      type: ['office', 'storage'],
      surface: [25, 40],
      floors: ['etage 1', 'etage 3'],
    },
  };
  let mockBuildingPopulatedOrganization = {
    id: mockBuildingId,
    organization: {
      id: mockOrganizationId,
      name: 'organizaion',
      owner: 'owner',
    },
    reference: 'string',
    name: 'string',
    constructionYear: 2012,
    surface: 290,
    address: {
      streetAddress: '123 Main St',
      streetNumber: '123',
      streetName: 'Main St',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: 75001,
      country: 'France',
      coordinates: {
        lat: 123,
        long: 3344,
      },
    },
    type: 'industry',
  };
  const mockFloorsDocs = [
    {
      name: 'etage 1',
      id: new mongoose.Types.ObjectId(),
      number: 1,
      buildingId: mockBuildingId,
      organizationId: mockOrganizationId,
    },
    {
      name: 'etage 2',
      id: new mongoose.Types.ObjectId(),
      number: 1,
      buildingId: mockBuildingId,
      organizationId: mockOrganizationId,
    },
    {
      name: 'etage 3',
      id: new mongoose.Types.ObjectId(),
      number: 1,
      buildingId: mockBuildingId,
      organizationId: mockOrganizationId,
    },
  ];

  const mockRoomsDocs = [
    {
      id: new mongoose.Types.ObjectId(),
      name: 'bloc 1',
      floorId: mockFloorsDocs[0].id,
      buildingId: mockBuildingId,
      organizationId: mockOrganizationId,
      surface: 25,
    },
    {
      id: new mongoose.Types.ObjectId(),
      name: 'bloc 2',
      floorId: mockFloorsDocs[1].id,
      buildingId: mockBuildingId,
      organizationId: mockOrganizationId,
      surface: 40,
    },
  ];
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FloorService,
        FloorServiceHelper,
        { provide: RoomService, useValue: mockRoomService },
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: getModelToken(Floor.name), useValue: mockFloorModel },
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
      ],
    }).compile();
    floorService = module.get<FloorService>(FloorService);
    floorServiceHelper = module.get<FloorServiceHelper>(FloorServiceHelper);
    floorModel = module.get<FloorModel>(getModelToken(Floor.name));
  });

  it('should be defined', () => {
    expect(floorService).toBeDefined();
    expect(floorServiceHelper).toBeDefined();
    expect(floorModel).toBeDefined();
  });

  describe('createMany', () => {
    it('should throw error on duplicate key', async () => {
      let createFloorsDto = {
        name: ['etage 1', 'etage 2', 'etage 3'],
        number: [1, 2, 3],
        organizationId: new mongoose.Types.ObjectId(),
        buildingId: new mongoose.Types.ObjectId(),
      };
      const duplicateKeyError = { code: 11000 };

      jest.spyOn(floorModel, 'insertMany').mockRejectedValue(duplicateKeyError);
      await expect(floorService.createMany(createFloorsDto)).rejects.toThrow(
        new HttpException(
          'Un ou plusieurs étages existent déja avec ces paramètres',
          HttpStatus.CONFLICT,
        ),
      );
    });
    it('should return a list of created floors', async () => {
      let createFloorsDto = {
        name: ['etage 1', 'etage 2', 'etage 3'],
        number: [1, 2, 3],
        organizationId: new mongoose.Types.ObjectId(),
        buildingId: new mongoose.Types.ObjectId(),
      };
      let mockFormtedFloors =
        floorServiceHelper.formatFloorsRawData(createFloorsDto);
      let mockReturnedFloors = mockFormtedFloors.map((ele) => ({
        ...ele,
        id: new mongoose.Types.ObjectId(),
      }));

      let session = {};
      //@ts-ignore
      jest        .spyOn(floorModel, 'insertMany')        .mockResolvedValue(mockReturnedFloors);
      const floorsDocs = await floorService.createMany(createFloorsDto);
      expect(floorModel.insertMany).toHaveBeenCalledWith(
        mockFormtedFloors,
        session,
      );
      expect(floorsDocs).toEqual(mockReturnedFloors);
    });
  });
  describe('findByBuildingId', () => {
    it('should throw an error if could not return the floors for any reason', async () => {
      let mockBuildingId = new mongoose.Types.ObjectId();

      mockFloorModel.find.mockReturnThis();
      mockFloorModel.select.mockRejectedValueOnce(new Error(''));

      await expect(() =>
        floorService.findByBuildingId(mockBuildingId.toString()),
      ).rejects.toThrow(
        "Erreur s'est produite lors de la récupértion des données des étages",
      );
      /* try {
        await floorService.findByBuildingId(mockBuildingId.toString());
      } catch (error) {
        
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récupértion des données des étages",
        );
      } */
    });
    it('should return empty array if no room was found', async () => {
      let mockBuildingId = new mongoose.Types.ObjectId();
      let mockReturneValue = [];

      mockFloorModel.find.mockReturnThis();
      mockFloorModel.select.mockResolvedValue(mockReturneValue);

      let floors = await floorService.findByBuildingId(
        mockBuildingId.toString(),
      );

      expect(mockFloorModel.find).toHaveBeenCalledWith({
        buildingId: mockBuildingId,
      });
      expect(mockFloorModel.select).toHaveBeenCalledWith({
        name: 1,
        id: 1,
        buildingId: 1,
        number: 1,
      });
      expect(floors.length).toEqual(0);
    });
    it('should return a list of floors', async () => {
      let mockBuildingId = new mongoose.Types.ObjectId();
      let floorsData = [
        {
          name: 'etage 1',
          id: new mongoose.Types.ObjectId(),
          number: 1,
          buildingId: mockBuildingId,
        },
      ];
      let mockReturnedValue = floorsData.map((ele) => ({ toJSON: () => ele }));

      mockFloorModel.find.mockReturnThis();
      mockFloorModel.select.mockResolvedValueOnce(mockReturnedValue);

      let mockRoomsDocs = [
        {
          id: new mongoose.Types.ObjectId(),
          name: 'bloc 1',
          floorId: floorsData[0].id,
        },
      ];

      mockRoomService.findByFloorId.mockResolvedValueOnce(mockRoomsDocs);

      let floors = await floorService.findByBuildingId(
        mockBuildingId.toString(),
      );
      expect(mockFloorModel.find).toHaveBeenCalledWith({
        buildingId: mockBuildingId,
      });
      expect(mockFloorModel.select).toHaveBeenCalledWith({
        name: 1,
        id: 1,
        buildingId: 1,
        number: 1,
      });

      floors.forEach((floor) => {
        expect(floor).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          number: expect.any(Number),
          buildingId: expect.any(Types.ObjectId),
          rooms: expect.any(Array),
        });
      });
      floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          expect(room).toEqual({
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
            floorId: expect.any(Types.ObjectId),
          });
        });
      });
    });
  });

  describe('createManyWithRooms', () => {
    it('should throw an error if could not create the floors for any reason', async () => {
      mockBuildingService.findOne.mockResolvedValueOnce(
        mockBuildingPopulatedOrganization,
      );
      mockFloorModel.insertMany.mockRejectedValueOnce(new Error(''));
      await expect(() =>
        floorService.createManyWithRooms(
          mockBuildingId.toString(),
          createFloorsWithRoomsDto,
        ),
      ).rejects.toThrow('Erreur lors de la création des étages');
    });
    it('should throw 11000 error if a floor already exists', async () => {
      mockBuildingService.findOne.mockResolvedValueOnce(
        mockBuildingPopulatedOrganization,
      );
      mockFloorModel.insertMany.mockRejectedValueOnce({ code: 11000 });
      await expect(() =>
        floorService.createManyWithRooms(
          mockBuildingId.toString(),
          createFloorsWithRoomsDto,
        ),
      ).rejects.toThrow(
        'Un ou plusieurs étages existent déja avec ces paramètres',
      );
    });
    it('should throw an error if could create the rooms for any reason', async () => {
      mockBuildingService.findOne.mockResolvedValueOnce(
        mockBuildingPopulatedOrganization,
      );
      mockFloorModel.insertMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.createMany.mockRejectedValueOnce(new Error(''));

      await expect(() =>
        floorService.createManyWithRooms(
          mockBuildingId.toString(),
          createFloorsWithRoomsDto,
        ),
      ).rejects.toThrow('Erreur lors de la création les blocs des étages');
    });
    it('should return a list of created floors and created rooms', async () => {
      mockBuildingService.findOne.mockResolvedValueOnce(
        mockBuildingPopulatedOrganization,
      );
      mockFloorModel.insertMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.createMany.mockResolvedValueOnce(mockRoomsDocs);

      let { floors, rooms } = await floorService.createManyWithRooms(
        mockBuildingId.toString(),
        createFloorsWithRoomsDto,
      );
      
      
      floors.forEach(floor=>{
        expect(floor).toEqual({
          name: expect.any(String),
        id: expect.any(Types.ObjectId),
        number: expect.any(Number),
        buildingId: expect.any(Types.ObjectId),
        organizationId: expect.any(Types.ObjectId),
        })
      })
      rooms.forEach(room=>{
        expect(room).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
          type:expect.any(String)
        })
      })
    });
  });
});
