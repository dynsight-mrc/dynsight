import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';


import mongoose from 'mongoose';

import { AuthorizationGuard } from '@common/guards/authorization.guard';



const mockOrganizationService = {
  findAll: jest.fn().mockResolvedValue(['ok']),
  findAllOverview: jest.fn(),
};

describe('OrganizationController', () => {
  let organizationController: OrganizationController;
  let organizationService: OrganizationService;
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

    organizationController = module.get<OrganizationController>(OrganizationController);
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
       let organizationsOverview = await organizationController.findAllOverview()
       expect(mockOrganizationService.findAllOverview).toHaveBeenCalled()
       expect(organizationsOverview).toBeDefined()
       expect(organizationsOverview).toEqual(mockResolvedOrganizationsOverview)

    });
  });


  describe('overview', () => { 
    it.todo("should throw error if couldn't retrieve organization")
    it.todo("should return the requested organization")
   })
});
