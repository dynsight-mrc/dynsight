import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationServiceHelper } from './organization-helper.service';
import { getModelToken } from '@nestjs/mongoose';
import { Organization, OrganizationModel } from '../models/organization.model';

describe('Organization Service Helper', () => {
  const mockOrganizationModel = {
    findOne: jest.fn(),
  };
  let organizationServiceHelper: OrganizationServiceHelper;
  let organizationModel: OrganizationModel;
  const mockOrganizationDoc = {
    name: 'string',
    reference: 'string',
    description: 'string',
    owner: 'string',
  };
  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationServiceHelper,
        {
          provide: getModelToken(Organization.name),
          useValue: mockOrganizationModel,
        },
      ],
    }).compile();
    organizationServiceHelper = module.get<OrganizationServiceHelper>(
      OrganizationServiceHelper,
    );
    organizationModel = module.get<OrganizationModel>(
      getModelToken(Organization.name),
    );
  });

  it('should be defined', () => {
    expect(organizationServiceHelper).toBeDefined();
  });

  describe('Check organization if it exists', () => {
    it('should return true if organization exists', () => {
      jest.spyOn(organizationModel, 'findOne').mockResolvedValue({
        ...mockOrganizationDoc,
      });

      expect(
        organizationServiceHelper.checkIfOrganizationExists(
          mockOrganizationDoc.name,
        ),
      ).toBeTruthy();
    });
    it('should return false if organization does not exist', async () => {
      jest.spyOn(organizationModel, 'findOne').mockResolvedValue(null);

      expect(
        await organizationServiceHelper.checkIfOrganizationExists(
          mockOrganizationDoc.name,
        ),
      ).toEqual(false);
    });
   
  });
});
