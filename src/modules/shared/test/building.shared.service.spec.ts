import { Test, TestingModule } from '@nestjs/testing';
import { BuildingSharedService } from '../services/building.shared.service';
import { getModelToken } from '@nestjs/mongoose';
import { Building } from '@modules/building/models/building.model';
import { MongoSharedService } from '../services/mongo.shared.service';
import { FloorSharedService } from '../services/floor.shared.service';
import { RoomSharedService } from '../services/room.shared.service';
import { FunctionSharedService } from '../services/functions.shared.service';
import { mockBuildingModel } from './__mocks__/buildings/building.model.mock';
import {
  mockBuildingSharedService,
  mockFloorSharedService,
  mockRoomSharedService,
} from './__mocks__/buildings/building.services.mock';
import {
  createBuildingDto,
  mockBuildingDoc,
  mockBuildingDocWithDetails,
  mockBuildingDocWithFloorsDetails,
  mockBuildingId,
  mockFloorsDocs,
  mockOrganizationId,
  mockRoomDocWithDetails,
  mockRoomsDocs,
} from './__mocks__/buildings/building.docs.mock';
import { Types } from 'mongoose';
import { mockFloorWithDetails } from '@modules/floor/tests/__mocks__/floor.docs.mock';

describe('BuildingSharedService', () => {
  let buildingSharedService: BuildingSharedService;
  let mongoSharedService: MongoSharedService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingSharedService,
        { provide: getModelToken(Building.name), useValue: mockBuildingModel },
        MongoSharedService,
        { provide: FloorSharedService, useValue: mockFloorSharedService },
        { provide: RoomSharedService, useValue: mockRoomSharedService },
        FunctionSharedService,
      ],
    }).compile();

    buildingSharedService = module.get<BuildingSharedService>(
      BuildingSharedService,
    );
    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);
  });

  it('should be defined', () => {
    expect(buildingSharedService).toBeDefined();
  });

  describe('findAll', () => {
    it('should throw error if could not retrieve building data', async () => {
      mockBuildingModel.find.mockRejectedValueOnce(Error);

      try {
        await buildingSharedService.findAll();
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the buildings data',
        );
      }
    });
    it('should return emty array if could not found any data', async () => {
      mockBuildingModel.find.mockResolvedValueOnce([]);

      let results = await buildingSharedService.findAll();
      expect(results.length).toBe(0);
    });
    it('should return the requested building object', async () => {
      mockBuildingModel.find.mockResolvedValueOnce(
        [mockBuildingDoc].map((ele) => ({ toJSON: () => ele })),
      );

      let results = await buildingSharedService.findAll();

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
          organizationId: expect.any(Types.ObjectId),
        }),
      );
    });
  });
  describe('findOneById', () => {
    it('should throw error if could not retrieve building data', async () => {
      mockBuildingModel.findOne.mockRejectedValueOnce(Error);

      try {
        await buildingSharedService.findOneById(mockBuildingId.toString());
      } catch (error) {
        expect(error.message).toBe('Error while retrieving building data');
      }
    });
    it('should return null if could not found any data', async () => {
      mockBuildingModel.findOne.mockResolvedValueOnce(null);

      let results = await buildingSharedService.findOneById(
        mockBuildingId.toString(),
      );
      expect(results).toBe(null);
    });
    it('should return the requested building object', async () => {
      mockBuildingModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockBuildingDoc,
      });

      let results = await buildingSharedService.findOneById(
        mockBuildingId.toString(),
      );

      expect(results).toEqual({
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
    });
  });
  describe('findOneByIdWithDetails', () => {
    it('should throw error if could not retrieve building data', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizarionId']);
      mockBuildingModel.findOne.mockReturnThis();
      mockBuildingModel.populate.mockRejectedValueOnce(Error);

      try {
        await buildingSharedService.findOneByIdWithDetails(
          mockBuildingId.toString(),
        );
      } catch (error) {
        expect(error.message).toBe('Error while retrieving building data');
      }
    });
    it('should return null if could not found any data', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizarionId']);

      mockBuildingModel.findOne.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce(null);

      let results = await buildingSharedService.findOneByIdWithDetails(
        mockBuildingId.toString(),
      );
      expect(results).toBe(null);
    });
    it('should return the requested building object', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValueOnce(['organizarionId']);

      mockBuildingModel.findOne.mockReturnThis();
      mockBuildingModel.populate.mockResolvedValueOnce({
        toJSON: () => mockBuildingDocWithDetails,
      });

      let results = await buildingSharedService.findOneByIdWithDetails(
        mockBuildingId.toString(),
      );

      expect(results).toEqual({
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
          reference: expect.any(String),
          description: expect.any(String),
        },
      });
    });
  });
  describe('findMany', () => {
    let fields = { organzaitonId: mockOrganizationId.toString() };
    it('should throw error if could not retrieve buildings data', async () => {
      mockBuildingModel.find.mockRejectedValueOnce(Error);

      try {
        await buildingSharedService.findMany(fields);
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the buildings data',
        );
      }
    });
    it('should return empty array if could not found any data', async () => {
      mockBuildingModel.find.mockResolvedValueOnce([]);

      let results = await buildingSharedService.findMany(fields);
      expect(results.length).toBe(0);
    });
    it('should return the requested building object', async () => {
      mockBuildingModel.find.mockResolvedValueOnce(
        [mockBuildingDoc].map((ele) => ({ toJSON: () => ele })),
      );

      let results = await buildingSharedService.findMany(fields);

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
          organizationId: expect.any(Types.ObjectId),
        }),
      );
    });
  });

  describe('findOneWithFloorsDetails', () => {
    it('should throw error if could not retrieve building data', async () => {
      mockBuildingSharedService.findOneByIdWithDetails.mockRejectedValueOnce(
        Error,
      );

      try {
        await buildingSharedService.findOneWithFloorsDetails(
          mockBuildingId.toString(),
        );
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving building floors data',
        );
      }
    });
    it('should return NULL if could not found any BUILDING', async () => {
      jest
        .spyOn(buildingSharedService, 'findOneByIdWithDetails')
        .mockResolvedValueOnce(null);

      let results = await buildingSharedService.findOneWithFloorsDetails(
        mockBuildingId.toString(),
      );
      expect(results).toBe(null);
    });

    it('should throw error if could not retrieve the corresponding building floors', async () => {
      jest
        .spyOn(buildingSharedService, 'findOneByIdWithDetails')
        .mockResolvedValueOnce(mockBuildingDocWithDetails);

      jest
        .spyOn(mongoSharedService, 'transformObjectStringIdsToMongoObjectIds')
        //@ts-ignore
        .mockResolvedValueOnce({ buildingId: mockBuildingId });

      mockFloorSharedService.findManyWithDetails.mockRejectedValueOnce(Error);
      try {
        await buildingSharedService.findOneWithFloorsDetails(
          mockBuildingId.toString(),
        );
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving building floors data',
        );
      }
    });
    it('should throw error if could not retrieve the corresponding building rooms', async () => {
      jest
        .spyOn(buildingSharedService, 'findOneByIdWithDetails')
        .mockResolvedValueOnce(mockBuildingDocWithDetails);

      jest
        .spyOn(mongoSharedService, 'transformObjectStringIdsToMongoObjectIds')
        //@ts-ignore
        .mockResolvedValueOnce({ buildingId: mockBuildingId });

      mockFloorSharedService.findManyWithDetails.mockResolvedValueOnce([
        mockFloorWithDetails,
      ]);
      mockRoomSharedService.findManyWithDetails.mockRejectedValueOnce(Error);
      try {
        await buildingSharedService.findOneWithFloorsDetails(
          mockBuildingId.toString(),
        );
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving building rooms data',
        );
      }
    });
    it('should return the requested building object', async () => {
      jest
        .spyOn(buildingSharedService, 'findOneByIdWithDetails')
        .mockResolvedValueOnce(mockBuildingDocWithDetails);

      jest
        .spyOn(mongoSharedService, 'transformObjectStringIdsToMongoObjectIds')
        //@ts-ignore
        .mockResolvedValueOnce({ buildingId: mockBuildingId });

      mockFloorSharedService.findManyWithDetails.mockResolvedValueOnce([
        mockFloorWithDetails,
      ]);
      mockRoomSharedService.findManyWithDetails.mockResolvedValueOnce([
        mockRoomDocWithDetails,
      ]);

      let results = await buildingSharedService.findOneWithFloorsDetails(
        mockBuildingId.toString(),
      );

      expect(results).toEqual({
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
          owner: expect.any(String),
          name: expect.any(String),
          reference: expect.any(String),
          description: expect.any(String),
        },
        floors: expect.anything(),
      });
      results.floors.forEach((floor) =>
        expect(floor).toEqual({
          name: expect.any(String),
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          building: expect.anything(),
          organization: expect.anything(),
          rooms: expect.anything(),
        }),
      );
    });
  });
  describe('findManyWithFloorsDetails', () => {
    it('should throw error if could not retrieve building data', async () => {
      mockBuildingModel.find.mockRejectedValueOnce(Error);

      try {
        await buildingSharedService.findManyWithFloorsDetails({
          organizationId: mockBuildingId.toString(),
        });
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the buildings data',
        );
      }
    });
    it('should return empty array if could not found any BUILDING', async () => {
      mockBuildingModel.find.mockResolvedValueOnce([]);

      let results = await buildingSharedService.findManyWithFloorsDetails({
        buildingId: mockBuildingId.toString(),
      });
      expect(results.length).toBe(0);
    });

    it('should return the requested building object', async () => {
      let fields = { organizationId: mockOrganizationId.toString() };
      mockBuildingModel.find.mockResolvedValueOnce(
        [mockBuildingDoc].map((ele) => ({ toJSON: () => mockBuildingDoc })),
      );
      jest
        .spyOn(mongoSharedService, 'transformIdAttributes')
        //@ts-ignore
        .mockResolvedValueOnce(mockBuildingDocWithDetails);

      //jest.spyOn(mockBuildingSharedService,"findOneByIdWithDetails").mockResolvedValueOnce()
      jest
        .spyOn(buildingSharedService, 'findOneWithFloorsDetails')
        .mockResolvedValueOnce(mockBuildingDocWithFloorsDetails);
      let results =
        await buildingSharedService.findManyWithFloorsDetails(fields);
      results.forEach((ele) => {
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
            owner: expect.any(String),
            name: expect.any(String),
            reference: expect.any(String),
            description: expect.any(String),
          },
          floors: expect.anything(),
        });
        let { floors } = ele;
        floors.forEach((floor) =>
          expect(floor).toEqual({
            name: expect.any(String),
            id: expect.any(Types.ObjectId),
            number: expect.any(Number),
            building: expect.anything(),
            organization: expect.anything(),
            rooms: expect.anything(),
          }),
        );
      });
    });
  });
  describe('createOne', () => {
    it('create should throw error if try to save building doc already exists', async () => {
      mockBuildingModel.build.mockReturnValue({
        save: () => {
          let error = new Error('Building already exists with these details');
          (error as any).code = 11000;
          throw error;
        },
      });

      try {
        await buildingSharedService.createOne(createBuildingDto);
      } catch (error) {
        expect(error.message).toBe(
          'Building already exists with these details',
        );
      }
    });
    it('create should throw error mongo build function throw any errror', async () => {
      mockBuildingModel.build.mockReturnValue({
        save: () => {
          throw new Error();
        },
      });

      try {
        await buildingSharedService.createOne(createBuildingDto);
      } catch (error) {
        expect(error.message).toBe('Error occured while creating building');
      }
    });

    it('create should return the created building', async () => {
      mockBuildingModel.build.mockReturnValue({
        save: async() => mockBuildingDoc,
        
      });
      let results = await buildingSharedService.createOne(createBuildingDto)
      expect(results).toEqual({
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
    });
  });

 afterEach(() => {
    mockBuildingModel.findOne.mockReset();
    mockBuildingModel.build.mockReset();
    mockBuildingModel.populate.mockReset();
    mockBuildingSharedService.findOneByIdWithDetails.mockRestore();
    mockFloorSharedService.findManyWithDetails.mockRestore();
  });
});
