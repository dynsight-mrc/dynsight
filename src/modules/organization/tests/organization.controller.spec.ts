import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';

import mongoose from 'mongoose';

import { AuthorizationGuard } from '@common/guards/authorization.guard';

const mockOrganizationService = {
  findAll: jest.fn().mockResolvedValue(['ok']),
  findAllOverview: jest.fn(),
  findById: jest.fn(),
};

describe('OrganizationController', () => {
  let organizationController: OrganizationController;
  let organizationService: OrganizationService;
  let mockOrganizationId = new mongoose.Types.ObjectId(
    '6698f8f03b58ac9f0cd9dc41',
  );
  let mockResolvedOrganizationsOverview = [
    {
      name: 'Xiaomi',
      reference: 'AB13',
      description: 'Tech Company',
      owner: 'Mao Si Tong',
      numberOfBuildings: 1,
      totalSurface: 350,
      id: mockOrganizationId,
    },
  ];
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

  describe('findAllOverview', () => {
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
  });
});
