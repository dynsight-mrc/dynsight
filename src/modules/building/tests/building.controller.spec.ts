import { Test, TestingModule } from '@nestjs/testing';

import mongoose, { Types } from 'mongoose';
import { BuildingController } from '../controllers/building.controller';
import { BuildingService } from '../services/building.service';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import {
  mockBuildingService,
  mockBuildingSharedService,
} from './__mocks__/building.services.mock';
import {
  mockBuildingDoc,
  mockBuildingDocWithDetails,
  mockBuildingDocWithFloorsDetails,
  mockBuildingId,
  mockFloorsDocs,
} from './__mocks__/building.docs.mock';
import { HttpException } from '@nestjs/common';

describe('BuildingController', () => {
  let buildingController: BuildingController;
  let buildingService: BuildingService;
  let buildingSharedService: BuildingSharedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingController],
      providers: [
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: BuildingSharedService, useValue: mockBuildingSharedService },
      ],
    }).compile();

    buildingController = module.get<BuildingController>(BuildingController);
    buildingService = module.get<BuildingService>(BuildingService);
  });

  it('should be defined', () => {
    expect(buildingController).toBeDefined();
  });

  describe('findOne', () => {
    it('throw error if any error occured', async () => {
      let details = undefined;
      mockBuildingSharedService.findOneById.mockRejectedValueOnce(Error(''));
      try {
        let response = await buildingController.findOne(
          mockBuildingId.toString(),
          details,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          "Erreur lors de la récupération des données De l'immeuble",
        );
      }
    });
    it('should return a building with details when "details" query is not provided', async () => {
      let details = undefined;
      mockBuildingSharedService.findOneById.mockResolvedValueOnce(
        mockBuildingDoc,
      );

      let response = await buildingController.findOne(
        mockBuildingId.toString(),
        details,
      );
      expect(mockBuildingSharedService.findOneById).toHaveBeenCalled();
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
    });
    it('should return a building with details when "details" query is provided', async () => {
      let details = 'true';
      mockBuildingSharedService.findOneByIdWithDetails.mockResolvedValueOnce(
        mockBuildingDocWithDetails,
      );

      let response = await buildingController.findOne(
        mockBuildingId.toString(),
        details,
      );
      expect(
        mockBuildingSharedService.findOneByIdWithDetails,
      ).toHaveBeenCalled();
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
          name: expect.any(String),
          owner: expect.any(String),
        },
      });
    });
  });

  describe('findOneWithFloors', () => {
    it('throw error if any error occured', async () => {
      mockBuildingSharedService.findOneWithFloorsDetails.mockRejectedValueOnce(
        Error(''),
      );
      try {
        let response = await buildingController.findOneWithFloors(
          mockBuildingId.toString(),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          "Erreur lors de la récupération des données de l'immeuble",
        );
      }
    });

    it('should return a building with floors details', async () => {
      mockBuildingSharedService.findOneWithFloorsDetails.mockResolvedValueOnce(
        mockBuildingDocWithFloorsDetails,
      );

      let response = await buildingController.findOneWithFloors(
        mockBuildingId.toString(),
      );
      expect(
        mockBuildingSharedService.findOneWithFloorsDetails,
      ).toHaveBeenCalled();
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
          name: expect.any(String),
          owner: expect.any(String),
          description:expect.any(String),
          reference:expect.any(String)
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
 });
