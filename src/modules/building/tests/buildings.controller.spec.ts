import { Test, TestingModule } from '@nestjs/testing';

import mongoose, { Types } from 'mongoose';
import { BuildingController } from '../controllers/building.controller';
import { BuildingService } from '../services/building.service';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { BuildingsService } from '../services/buildings.service';
import { BuildingsController } from '../controllers/buildings.controller';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import {
  mockBuildingService,
  mockBuildingSharedService,
  mockBuildingsService,
  mockRequestSharedService,
} from './__mocks__/building.services.mock';
import { HttpException } from '@nestjs/common';
import {
  createBuildingDto,
  createBuildingWithDetails,
  mockBuildingDoc,
  mockBuildingDocWithDetails,
  mockBuildingDocWithFloorsDetails,
  mockOrganizationId,
} from './__mocks__/building.docs.mock';

describe('BuildingsController', () => {
  let buildingsController: BuildingsController;
  let buildingService: BuildingService;
  let buildingsService: BuildingsService;
  let buildingSharedService: BuildingSharedService;
  let requestSharedService: RequestSharedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingsController],
      providers: [
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: BuildingsService, useValue: mockBuildingsService },
        { provide: BuildingSharedService, useValue: mockBuildingSharedService },
        { provide: RequestSharedService, useValue: mockRequestSharedService },
      ],
    }).compile();

    buildingsController = module.get<BuildingsController>(BuildingsController);
    buildingService = module.get<BuildingService>(BuildingService);
    buildingsService = module.get<BuildingsService>(BuildingsService);
    buildingSharedService = module.get<BuildingSharedService>(
      BuildingSharedService,
    );
    requestSharedService =
      module.get<RequestSharedService>(RequestSharedService);
  });

  it('should be defined', () => {
    expect(buildingsController).toBeDefined();
  });

  describe('find', () => {
    it('should throw error parse information for building throws error', async () => {
      let details = 'true';

      let fields: Record<string, any> = {
        organizationId: mockOrganizationId.toString(),
      };
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockImplementationOnce(
        () => {
          throw new Error('');
        },
      );
      try {
        //@ts-ignore
        let response = await buildingsController.find(details, fields);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Erreur lors du traitement des informations des batiments!',
        );
      }
    });
    it('should call findAll if no field neither details are specified with the request', async () => {
      mockBuildingSharedService.findAll.mockResolvedValueOnce([
        mockBuildingDoc,
      ]);

      let response = await buildingsController.find(undefined, undefined);
      expect(mockBuildingSharedService.findAll).toHaveBeenCalled();
      response.forEach((ele) =>
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
    it('should call findAlllWithDetails if no field is specified, and details is specified', async () => {
      let details = 'true';

      mockBuildingsService.findAllWithDetails.mockResolvedValueOnce([
        mockBuildingDocWithDetails,
      ]);

      let response = await buildingsController.find(undefined, details);
      expect(mockBuildingsService.findAllWithDetails).toHaveBeenCalled();
      response.forEach((ele) =>
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
    it('should call findMany if no details is specified, but searching fields are specified ', async () => {
      let details = undefined;

      let fields: Record<string, any> = {
        organizationId: mockOrganizationId.toString(),
      };

      mockBuildingSharedService.findMany.mockResolvedValueOnce([
        mockBuildingDoc,
      ]);

      let response = await buildingsController.find(fields.toString(), details);
      expect(mockBuildingSharedService.findMany).toHaveBeenCalled();
      response.forEach((ele) =>
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
    it('should call findManyWithDetails if the fields and details are specified', async () => {
      let details = 'true';

      let fields: Record<string, any> = {
        organizationId: mockOrganizationId.toString(),
      };

      mockBuildingsService.findManyWithDetails.mockResolvedValueOnce([
        mockBuildingDocWithDetails,
      ]);

      let response = await buildingsController.find(fields.toString(), details);
      expect(mockBuildingsService.findManyWithDetails).toHaveBeenCalled();
      response.forEach((ele) =>
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
    it('should throw error if any of buildingSharingService throws error ', async () => {
      let details = undefined;

      let fields: Record<string, any> = {
        organizationId: mockOrganizationId.toString(),
      };
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockReturnValueOnce(
        fields,
      );
      mockBuildingSharedService.findMany.mockRejectedValueOnce(Error(''));

      try {
        let response = await buildingsController.find(
          JSON.stringify(fields),
          details,
        );
      } catch (error) {
        expect(mockBuildingSharedService.findMany).toHaveBeenCalled();

        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Erreur lors de la récupération des données des batiments!',
        );
      }
    });
  });

  describe('findManyWithFloorsDetails', () => {
    let fields = { organizationId: mockOrganizationId.toString };
    it('should throw error if could parse buildigs data', async () => {
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockImplementationOnce(
        () => {
          throw new Error('');
        },
      );
      mockBuildingSharedService.findManyWithFloorsDetails.mockResolvedValueOnce(
        [mockBuildingDocWithFloorsDetails],
      );
      try {
        await buildingsController.findManyWithFloors(JSON.stringify(fields));
      } catch (error) {
        expect(
          mockBuildingSharedService.findManyWithFloorsDetails,
        ).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          "Erreur lors de la récupération des données de l'immeuble",
        );
      }
    });
    it('should throw error if findManyWithFloorsDetails Service throws error', async () => {
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockReturnValueOnce(
        fields,
      );
      mockBuildingSharedService.findManyWithFloorsDetails.mockRejectedValueOnce(
        Error(''),
      );

      try {
        await buildingsController.findManyWithFloors(JSON.stringify(fields));
      } catch (error) {
        expect(error.message).toBe(
          "Erreur lors de la récupération des données de l'immeuble",
        );
      }
    });
    it('should return a list of buildings with the related floors details', async () => {
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockReturnValueOnce(
        fields,
      );
      mockBuildingSharedService.findManyWithFloorsDetails.mockResolvedValueOnce(
        [mockBuildingDocWithFloorsDetails],
      );

      let response = await buildingsController.findManyWithFloors(
        JSON.stringify(fields),
      );
      response.forEach((ele) => {
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
    it('throw error if buildingSHaredService createOne throws error', async () => {
      mockBuildingSharedService.createOne.mockRejectedValueOnce(Error('nyx'));
      try {
        await buildingsController.createOne(createBuildingDto);
      } catch (error) {
        expect(error.message).toBe('Erreur lors de la creation du batiment');
      }
    });
    it('should return the created building', async () => {
      mockBuildingSharedService.createOne.mockResolvedValueOnce(
        mockBuildingDoc,
      );
      try {
        let response = await buildingsController.createOne(createBuildingDto);
        expect(response).toEqual({
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
      } catch (error) {
        expect(error.message).toBe('Erreur lors de la creation du batiment');
      }
    });
  });
  describe('createOneWithFloors', () => {
    it('throw error if buildingSharedService createOne throws error', async () => {
      mockBuildingService.createOneWithFloorsDetails.mockRejectedValueOnce(
        Error('nyx'),
      );
      try {
        await buildingsController.createOne(createBuildingDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Erreur lors de la création du batiment!');
      }
    });
    it('should return the created building with floors', async () => {
      mockBuildingService.createOneWithFloorsDetails.mockResolvedValueOnce(
        mockBuildingDocWithFloorsDetails,
      );

      let response = await buildingsController.createOneWithFloors(
        mockOrganizationId.toString(),
        createBuildingWithDetails,
      );
      expect(response).toEqual({
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
      response.floors.forEach((floor) =>
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
 afterEach(() => {
    mockBuildingSharedService.findManyWithFloorsDetails.mockReset();
    mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockRestore();
    mockBuildingService.createOneWithFloorsDetails.mockReset()
  });
});
