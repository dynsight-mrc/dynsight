import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';

import mongoose, { Types } from 'mongoose';

import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { OrganizationSharedService } from '@modules/shared/services/organization.shared.service';
import { OrganizationsController } from '../controllers/organizations.controller';
import { OrganizationsService } from '../services/organizations.service';
import { find } from 'rxjs';
import { mockOrganizationSharedService, mockOrganizationsService } from './__mocks__/organization.services.mock';
import {
  mockOrganizationDoc,
  mockOrganizationDocWithDetails,
} from './__mocks__/organization.docs.mock';
import { ReadOrganizationDocumentWithDetails } from '../dtos/read-organization.dto';
import { HttpException } from '@nestjs/common';

const mockOrganizationService = {
  findAll: jest.fn().mockResolvedValue(['ok']),
  findAllOverview: jest.fn(),
  findById: jest.fn(),
};

describe('OrganizationController', () => {
  let organizationsController: OrganizationsController;
  let organizationsService: OrganizationsService;
  let organizationSharedService: OrganizationSharedService;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        { provide: OrganizationsService, useValue: mockOrganizationsService },
        {
          provide: OrganizationSharedService,
          useValue: mockOrganizationSharedService,
        },
      ],
    })
      .overrideGuard(AuthorizationGuard)
      .useValue({ canActivate: () => true })
      .compile();

    organizationsController = module.get<OrganizationsController>(
      OrganizationsController,
    );
    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
    organizationSharedService = module.get<OrganizationSharedService>(
      OrganizationSharedService,
    );
  });

  it('should be defined', () => {
    expect(organizationsController).toBeDefined();
  });

  describe('find', () => {
    it('should throws error if findAll/findAllWithDetails throws error ', async () => {
      mockOrganizationsService.findAll.mockRejectedValueOnce(Error(''));
      try {
        await organizationsController.find(undefined);
      } catch (error) {
        expect(error.message).toBe(
          'Error occured while retrieving organizations data',
        );
      }
    });
    it('should return a list of organization with no details if details not provided', async () => {
      let details = undefined;
      mockOrganizationsService.findAll.mockResolvedValueOnce([
        mockOrganizationDoc,
      ]);
      let response = await organizationsController.find(details);
      response.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          reference: expect.any(String),
          description: expect.any(String),
          owner: expect.any(String),
        }),
      );
      expect(
        mockOrganizationsService.findAllWithDetails,
      ).not.toHaveBeenCalled();
    });
    it('should return a list of organization with details if details are provided', async () => {
      let details = 'true';
      mockOrganizationsService.findAllWithDetails.mockResolvedValueOnce([
        mockOrganizationDocWithDetails,
      ]);
      let response = (await organizationsController.find(
        details,
      )) as undefined as ReadOrganizationDocumentWithDetails[];
      response.forEach((ele) => {
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
        expect(
          mockOrganizationsService.findAll,
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('create', () => {
    it('should throw error if organizationsSharedService createone throws error',async()=>{
      let createOrganizationDocumentAttrsDto = JSON.parse(JSON.stringify(mockOrganizationDoc))
      delete createOrganizationDocumentAttrsDto.id

      mockOrganizationSharedService.createOne.mockRejectedValueOnce(Error(" "))
      try {
        await organizationsController.create(createOrganizationDocumentAttrsDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.message).toBe('Error occured while creating the organization')
      }
    });

    it('should throw return the created organization',async()=>{
      let createOrganizationDocumentAttrsDto = JSON.parse(JSON.stringify(mockOrganizationDoc))
      delete createOrganizationDocumentAttrsDto.id

      mockOrganizationSharedService.createOne.mockResolvedValue(mockOrganizationDoc)
      
      let response=  await organizationsController.create(createOrganizationDocumentAttrsDto)
      expect(response).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
      })
      
    });
  });
  /* describe('findAllOverview', () => {
    it('should return an array of organizations overview objects', async () => {
      mockOrganizationService.findAllOverview.mockResolvedValueOnce(
        mockResolvedOrganizationsOverview,
      );
      let organizationsOverview =
        await organizationController.findAllOverview();
      expect(mockOrganizationService.findAllOverview).toHaveBeenCalled();
      expect(organizationsOverview).toBeDefined();
      expect(organizationsOverview).toEqual(mockResolvedOrganizationsOverview);
    });
  });

  describe('findById', () => {
    it('should return the requested organization', async () => {
      mockOrganizationService.findById.mockResolvedValueOnce(
        mockResolvedOrganizationsOverview[0],
      );
      let organizationOverview = await organizationController.findOne(
        mockOrganizationId.toString(),
      );
      expect(organizationOverview).toBeDefined();
      expect(organizationOverview).toEqual(
        mockResolvedOrganizationsOverview[0],
      );
    });
  }); */
  afterEach(()=>{
    mockOrganizationsService.findAll.mockReset()
  })
});
