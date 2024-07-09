import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from '../services/organization.service';

const mockOrganizationService = {
  findAll:jest.fn().mockResolvedValue(["ok"])
}
describe('OrganizationController', () => {
  let controller: OrganizationController;
  let service : OrganizationService
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers:[{provide:OrganizationService,useValue:mockOrganizationService}]
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service =  module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
