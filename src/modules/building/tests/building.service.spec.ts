import { Test, TestingModule } from '@nestjs/testing';
import { BuildingService } from '../services/building.service';
import { BuildingServiceHelper } from '../services/building-helper.service';
import { Building, BuildingModel } from '../models/building.model';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { CreateBuildingDto } from '../dtos/create-building.dto';
import mongoose, { mongo } from 'mongoose';

describe('BuildingService', () => {
  let buildingService: BuildingService;
  let buildngServiceHelper: BuildingServiceHelper;
  let buildingModel: BuildingModel;
  let mockBuilding = {
    id: new mongoose.Types.ObjectId('620b48f4a4e10b001e6d2b3d'),
    organizationId:new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
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

  let mockBuildingModel = {
    findOne: jest.fn(),
    build: jest.fn().mockReturnValue(mockBuilding),
    find:jest.fn(),
    select:jest.fn()
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

  describe('Create a Building', () => {
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

  describe('Get buildings by Organization Id', () => { 
    it('should throw an error if could not return the buildings for any reasosn', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();

      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.select.mockRejectedValueOnce(new Error(''));

      try {
        await buildingService.findByOrganizationId(mockOrganizationId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récupération  des données de l'immeuble",
        );
      }
    });
    it('should return empty array if no building was found', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockReturneValue = [];

      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.select.mockResolvedValue(mockReturneValue);

      let buildings = await buildingService.findByOrganizationId(mockOrganizationId);

      expect(mockBuildingModel.find).toHaveBeenCalledWith({
        organizationId: mockOrganizationId,
      });
      expect(mockBuildingModel.select).toHaveBeenCalledWith(
        { organizationId: 0 }
      );
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
        
      ]
      let mockReturneValue = buildingsData.map(ele=>({toJSON:()=>ele}))
      
      mockBuildingModel.find.mockReturnThis();
      mockBuildingModel.select.mockResolvedValueOnce(mockReturneValue);

      let buildings = await buildingService.findByOrganizationId(mockOrganizationId);
      expect(mockBuildingModel.find).toHaveBeenCalledWith({
        organizationId: mockOrganizationId,
      });
      expect(mockBuildingModel.select).toHaveBeenCalledWith({
        organizationId:0
      });
      expect(buildings.length).toEqual(1)
      expect(buildings).toEqual(buildingsData);
    });
   })
});
