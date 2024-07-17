import { Test } from '@nestjs/testing';
import { PasswordServiceHelper } from '../services/password-helper.service';

describe('PasswordServiceHlper', () => {
  let passwordServiceHelper: PasswordServiceHelper;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [PasswordServiceHelper],
    }).compile();

    passwordServiceHelper = module.get<PasswordServiceHelper>(
      PasswordServiceHelper,
    );
  });

  it("Should be defined",()=>{
    expect(passwordServiceHelper).toBeDefined()
  })
  describe("createHashPassword",()=>{
    it("should return hashed password",async()=>{
       let hash = await passwordServiceHelper.createPasswordHash("myPassword")
       expect(hash).toBeDefined()
       
    })
  })
  describe("checkHashPassword",()=>{
    it("should return false if password is wrong",async()=>{
      let password = "myPassword"
      let anotherPass = "anotherPassword"
       let hash = await passwordServiceHelper.createPasswordHash(password)
       let check = await passwordServiceHelper.checkPasswordHash(anotherPass,hash)
       expect(check).toBeFalsy()
       
    })
    it("should return true if password is correct",async()=>{
      let password = "myPassword"
       let hash = await passwordServiceHelper.createPasswordHash(password)
       let check = await passwordServiceHelper.checkPasswordHash(password,hash)
       expect(check).toBeTruthy()
      
   })
  })
});
