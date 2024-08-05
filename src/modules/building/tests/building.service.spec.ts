import { Test, TestingModule } from '@nestjs/testing';
import { BuildingService } from '../services/building.service';
import { BuildingServiceHelper } from '../services/building-helper.service';
import { Building, BuildingModel } from '../models/building.model';
import {
  getConnectionToken,
  getModelToken,
  InjectConnection,
} from '@nestjs/mongoose';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import mongoose, { Connection, mongo, startSession, Types } from 'mongoose';
import { RoomService } from '@modules/room/services/room.service';
import { FloorService } from '@modules/floor/services/floor.service';
import {
  CreateBuildingDto,
  CreateBuildingWithRelatedEntities,
} from '../dtos/create-building.dto';

describe('BuildingService', () => {
  let buildingService: BuildingService;
  let buildngServiceHelper: BuildingServiceHelper;
  let mockConnection = {
    startSession: jest.fn().mockResolvedValue({
      startTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      endSession: jest.fn(),
    }),
  };
  let mockFloorService = {
    findByBuildingId: jest.fn(),
    createMany: jest.fn(),
  };
  let mockRoomService = {
    findByFloorId: jest.fn(),
    createMany: jest.fn(),
  };
  let mockBuildingId = new mongoose.Types.ObjectId();
  let mockOrganizationId = new mongoose.Types.ObjectId().toString();

  let mockBuilding = {
    id: mockBuildingId,
    organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
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
    save: jest.fn().mockResolvedValue(true),
  };

  let createBuildingWithRelatedEntites: CreateBuildingWithRelatedEntities = {
    building: {
      reference: 'building mine pro',
      name: 'building mine pro',
      constructionYear: 2003,
      surface: 250,
      type: 'commercial',
    },
    floors: {
      name: ['etage 1', 'etage 2', 'etage 3'],
      number: [1, 2, 3],
    },
    blocs: {
      name: ['bloc 1', 'bloc 2'],
      type: ['office', 'storage'],
      surface: [200, 400],
      floors: ['etage 1', 'etage 3'],
    },
    location: {
      streetAddress: '123 MINE LOCATION',
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
  };
  const mockFloorsDocs = [
    {
      name: 'etage 1',
      id: new mongoose.Types.ObjectId(),
      number: 1,
      buildingId: mockBuildingId,
    },
  ];

  let mockRoomsDocs = [
    { name: 'bloc 1', floorId: mockFloorsDocs[0].id },
    { name: 'bloc 2', floorId: mockFloorsDocs[0].id },
  ];
  let mockBuildingModel = {
    findOne: jest.fn(),
    build: jest.fn(),
    find: jest.fn(),
    select: jest.fn(),
    lean: jest.fn(),
    populate: jest.fn(),
  };

  let mockBuildingDoc = {
    id: mockBuildingId,
    reference: 'string',
    name: 'string',
    constructionYear: 2012,
    surface: 290,
    coordinates: {
      lat: 123,
      long: 123,
    },
    type: 'industry',
    organizationId: { name: 'organization', owner: 'owner' },
  };
  let mockBuildingOverview = {
    toJSON: () => ({ ...mockBuildingDoc }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingService,
        BuildingServiceHelper,
        {
          provide: getModelToken(Building.name),
          useValue: mockBuildingModel,
        },
        { provide: RoomService, useValue: mockRoomService },
        { provide: FloorService, useValue: mockFloorService },
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
      ],
    }).compile();

    buildingService = module.get<BuildingService>(BuildingService);
    buildngServiceHelper = module.get<BuildingServiceHelper>(
      BuildingServiceHelper,
    );
    //buildingModel = module.get<BuildingModel>(getModelToken(Building.name));
  });

  it('should be defined', () => {
    expect(buildingService).toBeDefined();
    expect(buildngServiceHelper).toBeDefined();
  });

  describe('Create', () => {
    it('should throw an error if a building with the same name exists', async () => {
      jest
        .spyOn(buildngServiceHelper, 'checkIfBuildingExists')
        .mockResolvedValue(true);
      let session = {};
      let organizationId = new mongoose.Types.ObjectId();

      let createBuildingDto = {
        reference: 'string',
        name: 'string',
        constructionYear: 2012,
        surface: 290,
        organizationId,
        type: 'industry',
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
      };
      try {
        await buildingService.create(createBuildingDto, session);
      } catch (error) {
        expect(buildingService.create).rejects.toThrow(
          InternalServerErrorException,
        );
      }
    });
    it('should create new building if it does ot exists', async () => {
      jest
        .spyOn(buildngServiceHelper, 'checkIfBuildingExists')
        .mockResolvedValue(false);
      let session = {};
      let organizationId = new mongoose.Types.ObjectId();
      mockBuildingModel.build.mockReturnValueOnce(mockBuilding);
      let createBuildingDto = {
        reference: 'string',
        name: 'string',
        constructionYear: 2012,
        surface: 290,
        organizationId,
        type: 'industry',
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
      };
      let createdBuilding = await buildingService.create(
        createBuildingDto,
        session,
      );

      expect(mockBuildingModel.build).toHaveBeenCalledWith(createBuildingDto);
      expect(mockBuilding.save).toHaveBeenCalled();
      expect(createdBuilding).toEqual(mockBuilding);
    });
  });

  describe('findByOrganizationId', () => {
    it('should throw an error if could not return the buildings for any reason', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();

      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.select.mockReturnThis();

      mockBuildingModel.lean.mockRejectedValueOnce(new Error(''));

      try {
        await buildingService.findByOrganizationId(
          mockOrganizationId.toString(),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récupération  des données des immeubles",
        );
      }
    });
    it('should return empty array if no building was found', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockReturneValue = [];

      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.select.mockResolvedValue(mockReturneValue);

      let buildings = await buildingService.findByOrganizationId(
        mockOrganizationId.toString(),
      );

      expect(mockBuildingModel.find).toHaveBeenCalledWith({
        organizationId: mockOrganizationId,
      });
      expect(mockBuildingModel.select).toHaveBeenCalledWith({
        organizationId: 0,
      });
      expect(buildings.length).toEqual(0);
    });
    it('should return a list of buildings', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let buildingsData = [
        {
          reference: 'BAT_1',
          name: 'Mobile Corporation',
          constructionYear: 2020,
          surface: 125,
          address: {},
          type: 'commercial',
          id: new mongoose.Types.ObjectId(),
        },
      ];
      let mockReturneValue = buildingsData.map((ele) => ({
        toJSON: () => ele,
      }));

      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.select.mockResolvedValueOnce(mockReturneValue);

      let buildings = await buildingService.findByOrganizationId(
        mockOrganizationId.toString(),
      );
      expect(mockBuildingModel.find).toHaveBeenCalledWith({
        organizationId: mockOrganizationId,
      });
      expect(mockBuildingModel.select).toHaveBeenCalledWith({
        organizationId: 0,
      });
      expect(buildings.length).toEqual(1);
      expect(buildings).toEqual(buildingsData);
    });
  });

  describe('findOne', () => {
    it('should throw an error if could not retrive the building for any reasons', async () => {
      mockBuildingModel.findOne.mockRejectedValueOnce(new Error(''));
      //await expect(()=>buildingService.findOne(mockBuildingId.toString())).toThrow(InternalServerErrorException)

      try {
        await buildingService.findOne(mockBuildingId.toString());
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récuperation de l'immeuble",
        );
      }
    });
    it('should return null if no building is found', async () => {
      mockBuildingModel.findOne.mockResolvedValueOnce(null);
      //await expect(()=>buildingService.findOne(mockBuildingId.toString())).toThrow(InternalServerErrorException)

      let building = await buildingService.findOne(mockBuildingId.toString());
      expect(building).toBe(null);
    });
    it('should throw error if could not fetch the related floors for any reasons', async () => {
      mockBuildingModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockBuilding,
      });
      mockFloorService.findByBuildingId.mockRejectedValueOnce(new Error(''));
      try {
        await buildingService.findOne(mockBuildingId.toString());
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récupértion des données des étages",
        );
      }
    });
    it('should throw error if could not fetch related rooms for ant reason', async () => {
      mockBuildingModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockBuilding,
      });

      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockRejectedValueOnce(new Error(''));
      try {
        await buildingService.findOne(mockBuildingId.toString());
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          'Erreur sest produite lors de la récupérations des données des blocs',
        );
      }
    });
    it('should return the requested building with the related entites', async () => {
      mockBuildingModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockBuilding,
      });
      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockResolvedValueOnce(mockRoomsDocs);
      let buildingDoc = await buildingService.findOne(
        mockBuildingId.toString(),
      );

      expect(buildingDoc).toBeDefined();
      expect(buildingDoc.floors.length).toEqual(1);
      expect(buildingDoc.floors[0].rooms.length).toEqual(2);
    });
  });
  describe('findAllOverview', () => {
    it('should throw an error if could not fetch the requsted building for any reasons', async () => {
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockRejectedValueOnce(new Error(''));

      await expect(() => buildingService.findAllOverview()).rejects.toThrow(
        "Erreur s'est produite lors de la récupération  des données des immeubles",
      );
    });
    it('should throw en error if could not fetch related floors for any reasons', async () => {
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce([mockBuildingOverview]);

      mockFloorService.findByBuildingId.mockRejectedValueOnce(new Error(''));

      await expect(() => buildingService.findAllOverview()).rejects.toThrow(
        "Erreur s'est produite lors de la récupération  des données des étages",
      );
    });
    it('should throw error if could not fetch related rooms for any reason', async () => {
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce([mockBuildingOverview]);

      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockRejectedValueOnce(new Error(''));

      await expect(() => buildingService.findAllOverview()).rejects.toThrow(
        "Erreur s'est produite lors de la récupération  des données des blocs",
      );
    });
    it('should return a list of building with the format ReadBuildingOverview[]', async () => {
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce([mockBuildingOverview]);

      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockResolvedValueOnce(mockRoomsDocs);

      let buildings = await buildingService.findAllOverview();
      expect(buildings).toBeDefined();
      expect(buildings.length).toEqual(1);
      expect(buildings[0].numberOfFloors).toEqual(1);
      expect(buildings[0].numberOfRooms).toEqual(1);
    });
  });

  describe('createBuildingWithRelatedEntites', () => {
    it('should throw error if could not create the building for any reason', async () => {
      //mockBuildingModel.build.mockReturnValueOnce(mockBuildingWithRejection);
      jest.spyOn(mockBuildingModel, 'build').mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error('')),
      });
      await expect(
        buildingService.createBuildingWithRelatedEntites(
          createBuildingWithRelatedEntites,
          mockOrganizationId,
        ),
      ).rejects.toThrow("Erreur lors de la création de l'immeuble");
    });
    it('should throw error if the building already exist (organizarionId,name)', async () => {
      //mockBuildingModel.build.mockReturnValueOnce(mockBuildingWithRejection);
      jest.spyOn(mockBuildingModel, 'build').mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce({ code: 11000 }),
      });
      await expect(
        buildingService.createBuildingWithRelatedEntites(
          createBuildingWithRelatedEntites,
          mockOrganizationId,
        ),
      ).rejects.toThrow('Immeuble existe déja avec ces paramètres');
    });
    it('should throw error if could not create the floors for any reason', async () => {
      mockBuildingModel.build.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(mockBuilding),
        toJSON: () => mockBuilding,
      });
      jest
        .spyOn(mockFloorService, 'createMany')
        .mockRejectedValueOnce(new Error(''));
      try {
        await buildingService.createBuildingWithRelatedEntites(
          createBuildingWithRelatedEntites,
          mockOrganizationId,
        );
      } catch (error) {
        expect(error.message).toEqual('Erreur lors de la création des étages');
      }
    });
    it('should throw error if any floor already existe (organizaitonId, buildingId,name,number)', async () => {
      mockBuildingModel.build.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(mockBuilding),
        toJSON: () => mockBuilding,
      });
      jest
        .spyOn(mockFloorService, 'createMany')
        .mockRejectedValueOnce({ code: 409 });
      try {
        await buildingService.createBuildingWithRelatedEntites(
          createBuildingWithRelatedEntites,
          mockOrganizationId,
        );
      } catch (error) {
        expect(error.message).toEqual(
          'Étage(s) existe(nt) déja avec ces paramètres',
        );
      }
    });
    it('should throw error if could not create the blocs for any reason', async () => {
      mockBuildingModel.build.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(mockBuilding),
        toJSON: () => mockBuilding,
      });
      mockFloorService.createMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.createMany.mockRejectedValueOnce(new Error(''));
      try {
        await buildingService.createBuildingWithRelatedEntites(
          createBuildingWithRelatedEntites,
          mockOrganizationId,
        );
      } catch (error) {
        expect(error.message).toEqual('Erreur lors de la création des blocs');
      }
    });
    it('should throw error if a bloc already exist (building,name)', async () => {
      mockBuildingModel.build.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(mockBuilding),
        toJSON: () => mockBuilding,
      });
      mockFloorService.createMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.createMany.mockRejectedValueOnce({ code: 409 });
      try {
        await buildingService.createBuildingWithRelatedEntites(
          createBuildingWithRelatedEntites,
          mockOrganizationId,
        );
      } catch (error) {
        expect(error.message).toEqual(
          'Bloc(s) existe(nt) déja avec ces paramètres',
        );
      }
    });
    it('should return all the created entities, building, floors[],rooms[]', async () => {
      let buildingDoc = { ...mockBuilding };
      delete buildingDoc.save;
      mockBuildingModel.build.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(buildingDoc),
        toJSON: () => buildingDoc,
      });
      mockFloorService.createMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.createMany.mockResolvedValueOnce(mockRoomsDocs);
      let results = await buildingService.createBuildingWithRelatedEntites(
        createBuildingWithRelatedEntites,
        mockOrganizationId,
      );
      

      expect(results).toBeDefined();
      
      expect(results.building).toBeDefined();
      expect(results.building).toEqual({
        id: expect.any(Types.ObjectId),
        reference: expect.any(String),
        name: expect.any(String),
        constructionYear: expect.any(Number),
        surface: expect.any(Number),
        type: expect.any(String),
        address: {
          streetAddress: expect.any(String),
          streetNumber: expect.any(String),
          streetName: expect.any(String),
          city: expect.any(String),
          state: expect.any(String),
          postalCode: expect.any(Number),
          country: expect.any(String),
          coordinates: {
            lat: expect.any(Number),
            long: expect.any(Number),
          },
        },
        organizationId: expect.any(Types.ObjectId),
      });
      expect(results.floors).toBeDefined();
      results.floors.forEach((floor) =>
        expect({
          name: expect.any(String),
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          buildingId: expect.any(Types.ObjectId),
        }),
      );
      expect(results.blocs).toBeDefined();
      results.blocs.forEach((bloc) =>
        expect({
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
        }),
      );
      expect(results.organization).toBeDefined()
      expect(results.organization).toEqual(expect.any(Types.ObjectId))
    });
  });
  afterEach(() => {
    mockFloorService.findByBuildingId.mockReset();
  });
});
