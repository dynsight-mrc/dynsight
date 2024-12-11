import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';

import mongoose, { Types } from 'mongoose';

import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { mockOrganizationService } from './__mocks__/organization.services.mock';
import { HttpException } from '@nestjs/common';
import {
  mockOrganizationDoc,
  mockOrganizationDocWithDetails,
} from './__mocks__/organization.docs.mock';
import { ReadOrganizationDocumentWithDetails } from '../dtos/read-organization.dto';

describe('OrganizationController', () => {
  let organizationController: OrganizationController;
  let organizationService: OrganizationService;
  let mockOrganizationId = new mongoose.Types.ObjectId(
    '6698f8f03b58ac9f0cd9dc41',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        { provide: OrganizationService, useValue: mockOrganizationService },
      ],
    })
      .overrideGuard(AuthorizationGuard)
      .useValue({ canActivate: () => true })
      .compile();

    organizationController = module.get<OrganizationController>(
      OrganizationController,
    );
    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(organizationController).toBeDefined();
  });

  describe('findOne', () => {
    it('it should throw error if findOneById throw error ', async () => {
      let details = undefined;
      mockOrganizationService.findOneById.mockRejectedValueOnce(Error(''));
      try {
        await organizationController.findOne(
          mockOrganizationId.toString(),
          undefined,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Error occured while retrieving organization data',
        );
      }
    });
    it('it should return organization document if no details are provided', async () => {
      let details = undefined;
      mockOrganizationService.findOneById.mockResolvedValueOnce(
        mockOrganizationDoc,
      );

      let response = await organizationController.findOne(
        mockOrganizationId.toString(),
        details,
      );
      expect(response).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
      });
    });
    it('it should return organization document with related entities if details are provided', async () => {
      let details = 'true';
      mockOrganizationService.findOneByIdWithDetails.mockResolvedValueOnce(
        mockOrganizationDocWithDetails,
      );

      let response = (await organizationController.findOne(
        mockOrganizationId.toString(),
        details,
      )) as undefined as ReadOrganizationDocumentWithDetails;
      expect(response).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
        buildings: expect.anything(),
      });
      response.buildings.forEach((ele) => {
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

  describe('updateOne', () => {
    it('should throw error if organizaionService updateOneById throws error',async()=>{
      mockOrganizationService.updateOneById.mockRejectedValueOnce(Error(""))
      let updateFields = JSON.parse(JSON.stringify(mockOrganizationDoc));
      delete updateFields.id;
      try {
        await organizationController.updateOne(mockOrganizationId.toString(),updateFields)
      } catch (error) {
        expect(error.message).toBe("Erreur lors de la mise a jour de l'organization")
      }
    });
    it("should return the updated organization",async()=>{
      mockOrganizationService.updateOneById.mockResolvedValueOnce(mockOrganizationDoc)
      let updateFields = JSON.parse(JSON.stringify(mockOrganizationDoc));
      delete updateFields.id;
      
      let reponse=  await organizationController.updateOne(mockOrganizationId.toString(),updateFields)
      expect(reponse).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
      });
    })
  });
});
