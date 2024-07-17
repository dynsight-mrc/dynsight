import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService={}
  let userService:UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{provide:UserService,useValue:mockUserService}],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService)
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
 
});
