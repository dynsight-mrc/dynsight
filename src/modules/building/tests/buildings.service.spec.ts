import { Test, TestingModule } from '@nestjs/testing';

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
import { BuildingsService } from '../services/buildings.service';
import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import { mockBuildingModel } from './__mocks__/building.model.mock';
import {
  mockBuildingDoc,
  mockBuildingDocWithDetails,
  mockConnection,
  mockOrganizationId,
} from './__mocks__/building.docs.mock';

describe('BuildingsService', () => {
  let buildingsService: BuildingsService;
  let mongoSharedService: MongoSharedService;

 
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingsService,
        {
          provide: getModelToken(Building.name),
          useValue: mockBuildingModel,
        },
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
        MongoSharedService,
      ],
    }).compile();

    buildingsService = module.get<BuildingsService>(BuildingsService);
    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);

    //buildingModel = module.get<BuildingModel>(getModelToken(Building.name));
  });

  it('should be defined', () => {
    expect(buildingsService).toBeDefined();
  });

  describe('findAllWithDetails', () => {
    it('should throw error if could not retrieve buildings data', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizationId']);
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockRejectedValueOnce(Error(''));

      try {
        await buildingsService.findAllWithDetails();
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the buildings data',
        );
      }
    });
    it('should return a empty array if no buildings is found', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizationId']);
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce([]);

      let results = await buildingsService.findAllWithDetails();
      expect(results.length).toBe(0);
    });
    it('should return a list of buildings with the requested details', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['buildingId', 'organizationId']);
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce([
        { toJSON: () => mockBuildingDocWithDetails },
      ]);

      let results = await buildingsService.findAllWithDetails();

      results.forEach((ele) =>
        expect(ele).toEqual({
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
          organization: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
            owner: expect.any(String),
          },
        }),
      );
    });
  });
  describe('findManyWithDetails', () => {
    let fields = {organizationId:mockOrganizationId.toString()}
    it('should throw error if could not retrieve buildings data', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizationId']);
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockRejectedValueOnce(Error(''));

      try {
        await buildingsService.findManyWithDetails(fields);
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the buildings data',
        );
      }
    });
    it('should return a empty array if no buildings is found', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizationId']);
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce([]);

      let results = await buildingsService.findManyWithDetails(fields);
      expect(results.length).toBe(0);
    });
    it('should return a list of buildings with the requested details', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['buildingId', 'organizationId']);
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce([
        { toJSON: () => mockBuildingDocWithDetails },
      ]);

      let results = await buildingsService.findManyWithDetails(fields);

      results.forEach((ele) =>
        expect(ele).toEqual({
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
          organization: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
            owner: expect.any(String),
          },
        }),
      );
    });
  });

  /* describe('Create', () => {
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

      mockBuildingModel.findOne.mockReturnThis();
      mockBuildingModel.populate.mockRejectedValueOnce(new Error(''));
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
      
      mockBuildingModel.findOne.mockReturnThis();
      mockBuildingModel.populate.mockReturnValue(null);
      //await expect(()=>buildingService.findOne(mockBuildingId.toString())).toThrow(InternalServerErrorException)

      let building = await buildingService.findOne(mockBuildingId.toString());
      expect(building).toBe(null);
    });
    it('should throw error if could not fetch the related floors for any reasons', async () => {

      mockBuildingModel.findOne.mockReturnThis();

      mockBuildingModel.populate.mockResolvedValueOnce({
        toJSON: () => ({...mockBuildingPopulatedOrganization}),
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
    it('should throw error if could not fetch related rooms for any reason', async () => {

      mockBuildingModel.findOne.mockReturnThis();

      mockBuildingModel.populate.mockResolvedValueOnce({
        toJSON: () => ({...mockBuildingPopulatedOrganization}),
      });

      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockRejectedValueOnce(new Error(''));
      try {
        await buildingService.findOne(mockBuildingId.toString());
      } catch (error) {

        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          'Erreur sest produite lors de la récupération des données des blocs',
        );
      }
    });
    it('should return the requested building with the related entites', async () => {
      mockBuildingModel.findOne.mockReturnThis();

      mockBuildingModel.populate.mockReturnValueOnce({
        toJSON: () =>({... mockBuildingPopulatedOrganization}),
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
      expect(results.organization).toBeDefined();
      expect(results.organization).toEqual(expect.any(Types.ObjectId));
    });
  });


  afterEach(() => {
    mockFloorService.findByBuildingId.mockReset();
    mockBuildingModel.findOne.mockReset()
    mockBuildingModel.populate.mockReset()
  }); */
});
