import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../services/organization.service';
import { Organization, OrganizationModel } from '../models/organization.model';
import { getModelToken } from '@nestjs/mongoose';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { OrganizationServiceHelper } from '../services/organization-helper.service';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';
import { FloorService } from '@modules/floor/services/floor.service';
import { RoomService } from '@modules/room/services/room.service';
import { BuildingService } from '@modules/building/services/building.service';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationServiceHelper: OrganizationServiceHelper;
  let organizationModel: OrganizationModel;
  let mockResolvedOrganizationsOverview = [
    {
      name: 'Xiaomi',
      reference: 'AB13',
      description: 'Tech Company',
      owner: 'Mao Si Tong',
      numberOfBuildings: 1,
      totalSurface: 350,
      id: new mongoose.Types.ObjectId('6698f8f03b58ac9f0cd9dc41'),
    },
  ];
  const mockOrganizationDoc = {
    id: '620b48f4a4e10b001e6d2b3d',
    name: 'string',
    reference: 'string',
    description: 'string',
    owner: 'string',
    save: jest.fn().mockResolvedValue(true),
  };
  const mockBuildingDocs = [
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

  const mockFloorsDocs = [
    {
      name: 'etage 1',
      id: new mongoose.Types.ObjectId(),
      number: 1,
      buildingId: mockBuildingDocs[0].id,
    },
    {
      name: 'etage 2',
      id: new mongoose.Types.ObjectId(),
      number: 1,
      buildingId: mockBuildingDocs[0].id,
    },
  ];

  let mockRoomsDocs = [
    { name: 'bloc 1', floorId: mockFloorsDocs[0].id },
    { name: 'bloc 2', floorId: mockFloorsDocs[1].id },
  ];

  const mockOrganizationModel = {
    findById: jest.fn(),
    build: jest.fn().mockReturnValue(mockOrganizationDoc),
    aggregate: jest.fn(),
    findOne: jest.fn(),
  };
  const mockBuildingService = {
    findByOrganizationId: jest.fn(),
  };
  const mockFloorService = {
    findByBuildingId: jest.fn(),
  };
  const mockRoomService = {
    findByFloorId: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        OrganizationServiceHelper,
        {
          provide: getModelToken(Organization.name),
          useValue: mockOrganizationModel,
        },
        { provide: FloorService, useValue: mockFloorService },
        { provide: RoomService, useValue: mockRoomService },
        { provide: BuildingService, useValue: mockBuildingService },
      ],
    }).compile();

    organizationServiceHelper = module.get<OrganizationServiceHelper>(
      OrganizationServiceHelper,
    );
    organizationService = module.get<OrganizationService>(OrganizationService);
    organizationModel = module.get<OrganizationModel>(
      getModelToken(Organization.name),
    );
  });

  it('should be defined', () => {
    expect(organizationService).toBeDefined();
  });

  describe('Create', () => {
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
      mockOrganizationModel.findOne.mockRejectedValueOnce(new Error(''));

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
  });
});
