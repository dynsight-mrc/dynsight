import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../controllers/account.controller';
import { AccountService } from '../services/account.service';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import mongoose from 'mongoose';
import { CreateAccountAttrsDto } from '../dto/create-account.dto';
import { mockAccountService } from './__mocks__/account.services.mock';
import { mockCreateAccountAttrs, mockCreatedAccount } from './__mocks__/account.docs.mock';
import { HttpException } from '@nestjs/common';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [{ provide: AccountService, useValue: mockAccountService }],
    })
      .overrideGuard(AuthorizationGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

      accountController = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });
  describe('Create account', () => { 
    it('should throw error if accountservice - create throws error',async()=>{
      mockAccountService.create.mockRejectedValueOnce(Error(""))
      try {
        await accountController.create(mockCreateAccountAttrs)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
      }
    })
    it("should return object with all entities of the created account",async()=>{
      mockAccountService.create.mockResolvedValueOnce(mockCreatedAccount)
    
      let response = await accountController.create(mockCreateAccountAttrs)
      expect(response).toEqual({
        building:expect.anything(),
        organization:expect.anything(),
        floors:expect.anything(),
        rooms:expect.anything(),
        users:expect.anything(),
       })

    })
   })

});
