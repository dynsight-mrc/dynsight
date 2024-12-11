import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UserSharedService } from '../services/user.shared.service';
import { UserAccount, UserAccountModel } from '@modules/user/models/user.model';
import { PasswordServiceHelper } from '../services/password-helper.service';
import { CreateUsersAttrsDto } from '../dto/user/create-user.dto';
import { FunctionSharedService } from '../services/functions.shared.service';

describe('FunctionsSharedService', () => {
 
  let functionSharedService: FunctionSharedService;
  
  let mockCreateUsersData = {
    'firstName': ['user 1', 'user 2'],
    'lastName': ['last name 1', 'last name 2'],
    'password': ['password', 'password'],
    'email': ['email@dynsight.com', 'email2@dynsight.com'],
    'role': ['organization-owner', 'company-occupant'],
  };
  let mockCreateUsersMissingData=  {
    'firstName': ['user 1', 'user 2'],
    'lastName': ['last name 1'],
    'password': ['password'],
    'email': ['email@dynsight.com', 'email3@dynsight.com'],
    'role': ['organization-owner', 'facility-manager'],
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
      
        FunctionSharedService,
      ],
    }).compile();

    functionSharedService = module.get<FunctionSharedService>(
      FunctionSharedService,
    );
  });

  it('should be defined', () => {
    expect(functionSharedService).toBeDefined();
  });

 

  describe('checkAllObjectFieldsHasSameLength', () => {
    it('should return false if one of the attributes has diffent size than the others', () => {
      let haveAllAttributesSameLength =
        functionSharedService.checkAllObjectFieldsHasSameLength(
          mockCreateUsersMissingData,
        );
      expect(haveAllAttributesSameLength).toBeFalsy();
    });

    it('should return true if all attributes have the same size ', () => {
      let haveAllAttributesSameLength =
      functionSharedService.checkAllObjectFieldsHasSameLength(mockCreateUsersData);
      expect(haveAllAttributesSameLength).toBeTruthy();
    });
  });

  
});
