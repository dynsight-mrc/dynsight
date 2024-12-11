import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../services/organization.service';
import { Organization, OrganizationModel } from '../models/organization.model';
import { getModelToken } from '@nestjs/mongoose';

import mongoose, { Types } from 'mongoose';
import { FloorService } from '@modules/floor/services/floor.service';
import { RoomService } from '@modules/room/services/room.service';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { Building } from '@modules/building/models/building.model';
import { mockOrganizationModel } from './__mocks__/organization.model.mock';
import { mockBuildingSharedService } from './__mocks__/organization.services.mock';
import {
  mockBuildingDocWithFloorsDetails,
  mockOrganizationDoc,
  mockOrganizationId,
} from './__mocks__/organization.docs.mock';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationModel: OrganizationModel;
  let buildingSharedService: BuildingSharedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getModelToken(Organization.name),
          useValue: mockOrganizationModel,
        },
        { provide: BuildingSharedService, useValue: mockBuildingSharedService },
      ],
    }).compile();

    organizationService = module.get<OrganizationService>(OrganizationService);
    buildingSharedService = module.get<BuildingSharedService>(
      BuildingSharedService,
    );
    organizationModel = module.get<OrganizationModel>(
      getModelToken(Organization.name),
    );
  });

  it('should be defined', () => {
    expect(organizationService).toBeDefined();
  });

  describe('findOneById', () => {
    it('should throw error if could not retrieve building data', async () => {
      mockOrganizationModel.findOne.mockRejectedValueOnce(Error);

      try {
        await organizationService.findOneById(mockOrganizationId.toString());
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving organization details',
        );
      }
    });
    it('should return null if could not found any data', async () => {
      mockOrganizationModel.findOne.mockResolvedValueOnce(null);

      let results = await organizationService.findOneById(
        mockOrganizationId.toString(),
      );
      expect(results).toBe(null);
    });
    it('should return the requested building object', async () => {
      mockOrganizationModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockOrganizationDoc,
      });

      let results = await organizationService.findOneById(
        mockOrganizationId.toString(),
      );

      expect(results).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
      });
    });
  });

  describe('findOneByIdWithDetails', () => {
    it('should throw error if findone throws error', async () => {
      mockOrganizationModel.findOne.mockRejectedValueOnce(Error(''));

      try {
        await organizationService.findOneByIdWithDetails(
          mockOrganizationId.toString(),
        );
      } catch (error) {
        expect(error.message).toBe(
          'Error while retrieving organization details!',
        );
      }
    });
    it('should return null if could not found any organization', async () => {
      mockOrganizationModel.findOne.mockResolvedValueOnce(null);
      let results = await organizationService.findOneByIdWithDetails(
        mockOrganizationId.toString(),
      );
      expect(results).toBe(null);
    });
    it('should throw error of buildingSharedService-findManyWithFloorsDetails throws error', async () => {
      mockOrganizationModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockOrganizationDoc,
      });
      mockBuildingSharedService.findManyWithFloorsDetails.mockRejectedValueOnce(
        Error(''),
      );
      try {
        let results = await organizationService.findOneByIdWithDetails(
          mockOrganizationId.toString(),
        );
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving organzation data',
        );
      }
    });
    it('should return the organization with related details', async () => {
      mockOrganizationModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockOrganizationDoc,
      });
      
      mockBuildingSharedService.findManyWithFloorsDetails.mockResolvedValueOnce([
        mockBuildingDocWithFloorsDetails,
      ]);

      let results = await organizationService.findOneByIdWithDetails(
        mockOrganizationId.toString(),
      );
      expect(results).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
        buildings: expect.anything(),
      });
      results.buildings.forEach((ele) => {
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

  describe('updateOneById', () => {
    it('should throw error if mongoose update throws error', async () => {
      mockOrganizationModel.findOneAndUpdate.mockRejectedValueOnce(Error(''));
      let updateFields = JSON.parse(JSON.stringify(mockOrganizationDoc));
      delete updateFields.id;
      try {
        await organizationService.updateOneById(
          mockOrganizationId.toString(),
          updateFields,
        );
      } catch (error) {
        expect(error.message).toBe('Error occured while updating organization');
      }
    });
    it('should update and return new organization', async () => {
      mockOrganizationModel.findOneAndUpdate.mockResolvedValueOnce(
        mockOrganizationDoc,
      );
      let updateFields = JSON.parse(JSON.stringify(mockOrganizationDoc));
      delete updateFields.id;

      let results = await organizationService.updateOneById(
        mockOrganizationId.toString(),
        updateFields,
      );

      expect(results).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
      });
    });
  });
  /* describe('Create', () => {
    it('Throw error if organization name exists', async () => {
      jest
        .spyOn(organizationServiceHelper, 'checkIfOrganizationExists')
        .mockResolvedValue(true);

      let session = {};

      await expect(
        organizationService.create(mockOrganizationDoc, session),
      ).rejects.toThrow('Organisation existe déja !');
    });

    it('should create new organization if not exists', async () => {
      jest
        .spyOn(organizationServiceHelper, 'checkIfOrganizationExists')
        .mockResolvedValue(false);
      let session = {};
      let createOrganizationDto: CreateOrganizationDto = {
        name: 'string',
        reference: 'string',
        description: 'string',
        owner: 'string',
      };
      let organization = await organizationService.create(
        createOrganizationDto,
        session,
      );

      expect(organizationModel.build).toHaveBeenCalled();
      expect(organizationModel.build).toHaveBeenCalledWith(
        createOrganizationDto,
      );
      expect(mockOrganizationDoc.save).toHaveBeenCalled();
      expect(organization).toEqual(mockOrganizationDoc);
    });
  });
  describe('findAllOverview', () => {
    it('should throw internal error if could not retrieve organizations for any reason', async () => {
      let error = new Error('database error');
      jest.spyOn(organizationModel, 'aggregate').mockRejectedValueOnce(error);
      try {
        await organizationService.findAllOverview();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);

        expect(error.message).toEqual(
          'error lors du récupération des données des organizations',
        );
      }
    });
    it('should return an array of organizations overview objects', async () => {
      let spyAggregateOrganizations = jest
        .spyOn(organizationModel, 'aggregate')
        .mockResolvedValueOnce(mockResolvedOrganizationsOverview);

      let organizations = await organizationService.findAllOverview();
      expect(spyAggregateOrganizations).toHaveBeenCalled();
      expect(organizations.length).toEqual(1);
    });
  });
  describe('findById', () => {
    it('should throw error if could not fetch organization for any reasons', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      mockOrganizationModel.findOne.mockRejectedValueOnce("new Error('')");

      try {
        await organizationService.findById(mockOrganizationId.toString());
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          "Erreur s'est produite lors lors de la récupération des données de l'organisation",
        );
      }
    });
    it('should return null if organization is not found', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      mockOrganizationModel.findOne.mockResolvedValueOnce(null);
      let returnedOrganization = await organizationService.findById(
        mockOrganizationId.toString(),
      );
      expect(returnedOrganization).toEqual(null);
    });
    it('should throw error if could not fetch the related buildings for any reason', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      mockBuildingService.findByOrganizationId.mockRejectedValueOnce(
        InternalServerErrorException,
      );
      mockOrganizationModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockResolvedOrganizationsOverview,
      });
      try {
        let organ = await organizationService.findById(
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
    it('should throw error if could not fetch the related floors for any reasons', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      mockOrganizationModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockResolvedOrganizationsOverview,
      });
      mockBuildingService.findByOrganizationId.mockResolvedValueOnce(
        mockBuildingDocs,
      );
      mockFloorService.findByBuildingId.mockRejectedValueOnce(
        InternalServerErrorException,
      );
      try {
        await organizationService.findById(mockOrganizationId.toString());
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récupértion des données des étages",
        );
      }
    });
    it('should throw error if could not fetch related rooms for ant reasosn', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      mockOrganizationModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockResolvedOrganizationsOverview,
      });
      mockBuildingService.findByOrganizationId.mockResolvedValueOnce(
        mockBuildingDocs,
      );
      mockFloorService.findByBuildingId.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomService.findByFloorId.mockRejectedValueOnce(
        InternalServerErrorException,
      );
      try {
        await organizationService.findById(mockOrganizationId.toString());
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          'Erreur sest produite lors de la récupérations des données des blocs',
        );
      }
    });
    it('should return the organization object with all related entities', async () => {

      let mockOrganizationId = new mongoose.Types.ObjectId();
      mockOrganizationModel.findOne.mockResolvedValueOnce({
        toJSON: () => mockResolvedOrganizationsOverview[0],
      });
      mockBuildingService.findByOrganizationId.mockResolvedValueOnce(
        mockBuildingDocs,
      );
      mockFloorService.findByBuildingId.mockImplementation(async()=>mockFloorsDocs);
      mockRoomService.findByFloorId.mockImplementation(async()=>mockRoomsDocs);

      let organizationDoc = await organizationService.findById(
        mockOrganizationId.toString(),
      );
      expect(organizationDoc).toBeDefined()
      expect(organizationDoc.buildings.length).toEqual(1)
      expect(organizationDoc.buildings[0].floors.length).toEqual(2)
    });
  });
  beforeEach(() => {
    mockBuildingService.findByOrganizationId.mockReset();
    mockFloorService.findByBuildingId.mockReset();
    mockRoomService.findByFloorId.mockReset();
  }); */

  afterEach(() => {
    mockOrganizationModel.updateOne.mockReset();
    mockOrganizationModel.findOne.mockReset();
    mockBuildingSharedService.findManyWithFloorsDetails.mockReset();
  });
});
