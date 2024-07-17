import { Test, TestingModule } from '@nestjs/testing';
import { PasswordServiceHelper } from '../services/password-helper.service';

describe('Password Helper', () => {
  let passwordServiceHelper: PasswordServiceHelper;
  beforeAll(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [PasswordServiceHelper],
    }).compile();

    passwordServiceHelper = module.get<PasswordServiceHelper>(
      PasswordServiceHelper,
    );

  });

  it("should be defined",()=>{
    expect(passwordServiceHelper).toBeDefined()
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
