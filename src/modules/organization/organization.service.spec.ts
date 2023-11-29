import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { Organization } from './models/organization.model';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationModel : Model<Organization>
  const mockOrganizationService = {
    findById:jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService,{provide:getModelToken(Organization.name),useValue:mockOrganizationService}],
    }).compile();

    organizationService = module.get<OrganizationService>(OrganizationService);
    organizationModel = module.get<Model<Organization>>(getModelToken(Organization.name))
  });

  it('should be defined', () => {
    expect(organizationService).toBeDefined();
  });
});
