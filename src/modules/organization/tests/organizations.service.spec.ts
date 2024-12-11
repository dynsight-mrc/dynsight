import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../services/organization.service';
import { Organization, OrganizationModel } from '../models/organization.model';
import { getModelToken } from '@nestjs/mongoose';

import mongoose, { Types } from 'mongoose';

import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { OrganizationsService } from '../services/organizations.service';
import { FunctionSharedService } from '@modules/shared/services/functions.shared.service';
import { mockOrganizationModel } from './__mocks__/organization.model.mock';
import { mockBuildingSharedService } from './__mocks__/organization.services.mock';
import {
  mockBuildingDocs,
  mockBuildingDocWithFloorsDetails,
  mockOrganizationDoc,
} from './__mocks__/organization.docs.mock';

describe('OrganizationsService', () => {
  let organizationsService: OrganizationsService;
  let buildingSharedService: BuildingSharedService;
  let organizationModel: OrganizationModel;
  let functionSharedService: FunctionSharedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getModelToken(Organization.name),
          useValue: mockOrganizationModel,
        },
        { provide: BuildingSharedService, useValue: mockBuildingSharedService },
        FunctionSharedService,
      ],
    }).compile();

    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
    buildingSharedService = module.get<BuildingSharedService>(
      BuildingSharedService,
    );
    functionSharedService = module.get<FunctionSharedService>(
      FunctionSharedService,
    );
  });

  it('should be defined', () => {
    expect(organizationsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should throw error if mongoose find throws error', async () => {
      mockOrganizationModel.find.mockRejectedValueOnce(Error(''));
      try {
        await organizationsService.findAll();
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the organizations data',
        );
      }
    });
    it('should return empty array if no organization is found', async () => {
      mockOrganizationModel.find.mockResolvedValueOnce([]);
      let results = await organizationsService.findAll();
      expect(results.length).toBe(0);
    });
    it('should return a list of organizations', async () => {
      mockOrganizationModel.find.mockResolvedValueOnce(
        [mockOrganizationDoc].map((ele) => ({ toJSON: () => ele })),
      );
      let results = await organizationsService.findAll();
      results.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          reference: expect.any(String),
          description: expect.any(String),
          owner: expect.any(String),
        }),
      );
    });
  });
  describe('findAllWithDetails', () => {
    it('should throw error if mongoose find throws error', async () => {
      mockOrganizationModel.find.mockRejectedValueOnce(Error(''));
      try {
        await organizationsService.findAllWithDetails();
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the organizations data',
        );
      }
    });
    it('should return empty array if no organization is found', async () => {
      mockOrganizationModel.find.mockResolvedValueOnce([]);
      let results = await organizationsService.findAllWithDetails();
      expect(results.length).toBe(0);
    });
    it('should throw error if buildngSharedService findmanywithfloors throws error', async () => {
      mockOrganizationModel.find.mockResolvedValueOnce(
        [mockOrganizationDoc].map((ele) => ({ toJSON: () => ele })),
      );
      mockBuildingSharedService.findManyWithFloorsDetails.mockRejectedValueOnce(
        Error(''),
      );
      try {
        let results = await organizationsService.findAllWithDetails();
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving the organizations data',
        );
      }
    });
    it('should return a list of organizations with related entities', async () => {
      mockOrganizationModel.find.mockResolvedValueOnce(
        [mockOrganizationDoc].map((ele) => ({ toJSON: () => ele })),
      );
      mockBuildingSharedService.findManyWithFloorsDetails.mockResolvedValueOnce(
        [mockBuildingDocWithFloorsDetails],
      );
      let results = await organizationsService.findAllWithDetails();
      results.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          reference: expect.any(String),
          description: expect.any(String),
          owner: expect.any(String),

          buildings: expect.anything(),
        });

        ele.buildings.forEach((ele) => {
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
  });

  afterEach(() => {
    mockOrganizationModel.find.mockReset();
  });
});
