import { Test, TestingModule } from '@nestjs/testing';
import { BuildingService } from '../services/building.service';
import { BuildingServiceHelper } from '../services/building-helper.service';
import { Building, BuildingModel } from '../models/building.model';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { CreateBuildingDto } from '../dtos/create-building.dto';
import mongoose, { mongo } from 'mongoose';
import { RoomService } from '@modules/room/services/room.service';
import { FloorService } from '@modules/floor/services/floor.service';

describe('BuildingService', () => {
  let buildingService: BuildingService;
  let buildngServiceHelper: BuildingServiceHelper;
  let buildingModel: BuildingModel;
  let mockFloorService = {
    findByBuildingId: jest.fn(),
  };
  let mockRoomService = {
    findByFloorId:jest.fn()
  };
  let mockBuildingId = new mongoose.Types.ObjectId();

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
      postalCode: '75001',
      country: 'France',
      coordinates: {
        lat: 123,
        long: 3344,
      },
    },
    type: 'industry',
    save: jest.fn().mockResolvedValue(true),
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
    build: jest.fn().mockReturnValue(mockBuilding),
    find: jest.fn(),
    select: jest.fn(),
    lean: jest.fn(),
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
      ],
    }).compile();

    buildingService = module.get<BuildingService>(BuildingService);
    buildngServiceHelper = module.get<BuildingServiceHelper>(
      BuildingServiceHelper,
    );
    buildingModel = module.get<BuildingModel>(getModelToken(Building.name));
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

      expect(buildingModel.build).toHaveBeenCalledWith(createBuildingDto);
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
      mockBuildingModel.findOne.mockResolvedValueOnce(({toJSON : ()=>mockBuilding}));
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
      mockBuildingModel.findOne.mockResolvedValueOnce(({toJSON : ()=>mockBuilding}));

      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockRejectedValueOnce(
        new Error(""),
      );
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
    it('should return the requested building with the related entites',async()=>{
      mockBuildingModel.findOne.mockResolvedValueOnce(({toJSON : ()=>mockBuilding}));
      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockResolvedValueOnce(mockRoomsDocs)
      let buildingDoc = await buildingService.findOne(mockBuildingId.toString());


      expect(buildingDoc).toBeDefined()
      expect(buildingDoc.floors.length).toEqual(1)
      expect(buildingDoc.floors[0].rooms.length).toEqual(2)
    });
  });
  describe('findAllOverview', () => { 
    it.todo('should throw an error if could not fetch the requsted building for any reasons')
    it.todo("should throw en error if could not fetch related floors for any reasons")
    it.todo("should throw error if could not fetch related rooms for any reason")
    it.todo("should return a list of building with the format ReadBuildingOverview[]")
   })
  afterEach(() => {
    mockFloorService.findByBuildingId.mockReset();
  });
});
