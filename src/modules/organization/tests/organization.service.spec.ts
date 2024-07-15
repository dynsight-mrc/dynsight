import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../services/organization.service';
import { Organization, OrganizationModel } from '../models/organization.model';
import { getModelToken } from '@nestjs/mongoose';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { OrganizationServiceHelper } from '../services/organization-helper.service';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationServiceHelper: OrganizationServiceHelper;
  let organizationModel: OrganizationModel;

  const mockOrganizationDoc = {
    id:"620b48f4a4e10b001e6d2b3d",
    name: 'string',
    reference: 'string',
    description: 'string',
    owner: 'string',
    save: jest.fn().mockResolvedValue(true),
  };
  const mockOrganizationService = {
    findById: jest.fn(),

    build: jest.fn().mockReturnValue(mockOrganizationDoc),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        OrganizationServiceHelper,
        {
          provide: getModelToken(Organization.name),
          useValue: mockOrganizationService,
        },
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
      }
      let organization = await organizationService.create(
        createOrganizationDto,
        session,
      );
       
        expect(organizationModel.build).toHaveBeenCalled()
        expect(organizationModel.build).toHaveBeenCalledWith(createOrganizationDto)
        expect(mockOrganizationDoc.save).toHaveBeenCalled()
        expect(organization).toEqual(mockOrganizationDoc);  
    });
  });
});
