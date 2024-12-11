import { Test, TestingModule } from '@nestjs/testing';
import { BuildingSharedService } from '../services/building.shared.service';
import { getModelToken } from '@nestjs/mongoose';
import { Building } from '@modules/building/models/building.model';
import { MongoSharedService } from '../services/mongo.shared.service';
import { FloorSharedService } from '../services/floor.shared.service';
import { RoomSharedService } from '../services/room.shared.service';
import { FunctionSharedService } from '../services/functions.shared.service';
import { Organization } from '@modules/organization/models/organization.model';
import { OrganizationSharedService } from '../services/organization.shared.service';
import { mockOrganizationModel } from './__mocks__/organizations/organization.model.mock';
import { mockOrganizationDoc } from './__mocks__/organizations/organization.docs.mock';
import { Types } from 'mongoose';

describe('OrganizationSharedService', () => {
  let organizationSharedService: OrganizationSharedService
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationSharedService,
        { provide: getModelToken(Organization.name), useValue: mockOrganizationModel },
     ],
    }).compile();

    organizationSharedService = module.get<OrganizationSharedService>(OrganizationSharedService);
  });

  it('should be defined', () => {
    expect(organizationSharedService).toBeDefined();
  });

  describe('checkIfOrganizationExists',()=>{
    it('should throw error if mongoose find throws error',async()=>{
      mockOrganizationModel.findOne.mockRejectedValueOnce(Error(''))
      try {
        await organizationSharedService.checkIfOrganizationExists('')
      } catch (error) {
        expect(error.message).toBe('Error occured while retrieving the organization data')
      }
    })
    it("should retrun true if organization exists",async()=>{
      mockOrganizationModel.findOne.mockResolvedValueOnce(mockOrganizationDoc)
      let results = await organizationSharedService.checkIfOrganizationExists("")
      expect(results).toBeTruthy()

    })
    it("should retrun false if organization does not exists",async()=>{
      mockOrganizationModel.findOne.mockResolvedValueOnce(null)
      let results = await organizationSharedService.checkIfOrganizationExists("")
      expect(results).toBeFalsy()
    })
  })
  describe('createOne',()=>{
    it('should throw error if checkIfOrganizationExists throws error',async()=>{
     let spyOnCheckOrganizationExists =  jest.spyOn(organizationSharedService,"checkIfOrganizationExists").mockRejectedValueOnce(Error(""))
      let createOrganizationDocumentAttrsDto = JSON.parse(JSON.stringify(mockOrganizationDoc))
      delete createOrganizationDocumentAttrsDto.id
      try {
        let response = await organizationSharedService.createOne(createOrganizationDocumentAttrsDto)
      } catch (error) {
        expect(error.message).toBe("Error occured while creating organization")
      }
      spyOnCheckOrganizationExists.mockRestore()
    })
    it("should throw error if try to create organization already exists",async()=>{
      let spyOnCheckOrganizationExists =  jest.spyOn(organizationSharedService,"checkIfOrganizationExists").mockResolvedValueOnce(true)
      let createOrganizationDocumentAttrsDto = JSON.parse(JSON.stringify(mockOrganizationDoc))
      delete createOrganizationDocumentAttrsDto.id
      try {
        let response = await organizationSharedService.createOne(createOrganizationDocumentAttrsDto)
      } catch (error) {
        expect(error.message).toBe("Organization already exists")
      }
      spyOnCheckOrganizationExists.mockRestore()
    })
    it("should return the created organization ",async()=>{
      jest.spyOn(organizationSharedService,"checkIfOrganizationExists").mockResolvedValueOnce(false)
      mockOrganizationModel.build.mockReturnValueOnce({save:async()=>{},toJSON:()=>mockOrganizationDoc})
      let createOrganizationDocumentAttrsDto = JSON.parse(JSON.stringify(mockOrganizationDoc))
      delete createOrganizationDocumentAttrsDto.id
      let results = await organizationSharedService.createOne(createOrganizationDocumentAttrsDto)
      expect(results).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        reference: expect.any(String),
        description: expect.any(String),
        owner: expect.any(String),
      })
    })
  })
 
 
});
