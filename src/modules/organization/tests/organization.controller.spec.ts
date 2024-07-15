import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';

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
    })
    .overrideGuard(AuthorizationGuard)
    .useValue({canActivate:()=>true})
    .compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service =  module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
