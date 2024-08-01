import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Building, BuildingModel } from '../models/building.model';
import { BuildingServiceHelper } from '../services/building-helper.service';
import mongoose from 'mongoose';

describe('Building Service Helper', () => {
  let buildngServiceHelper: BuildingServiceHelper;
  let buildingModel: BuildingModel;
  let mockBuildingService = {
    findOne:jest.fn()
  };
  let mockOrganizationId= new mongoose.Types.ObjectId()
  let mockBuilding = {
    reference: 'string',
    name: 'string',
    constructionYear: 2012,
    surface: 290,
    coordinates: {
      lat: 123,
      long: 123,
    },
    type: 'industry',
  };
  let mockBuildingOverviewDoc = {
    toJSON:()=>({...mockBuilding,organizationId:{name:"organization",owner:"owner"}})
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingServiceHelper,
        {
          provide: getModelToken(Building.name),
          useValue: mockBuildingService,
        },
      ],
    }).compile();

    buildngServiceHelper = module.get<BuildingServiceHelper>(
      BuildingServiceHelper,
    );
    buildingModel = module.get<BuildingModel>(getModelToken(Building.name));
  });

  it('should be defined', () => {
    expect(buildngServiceHelper).toBeDefined();
  });

  describe('Check if Buildng exists - with name', () => {
    it('should return true if a building with same name exists', async () => {
      let check = jest.spyOn(buildingModel, 'findOne').mockResolvedValue(mockBuilding);
      
      let results = await buildngServiceHelper.checkIfBuildingExists(mockBuilding.name)
      expect(check).toHaveBeenCalled()
      expect(check).toHaveBeenCalledWith({name:mockBuilding.name})
      
      expect(results).toBeTruthy()

    });
    it('should return false if no building exists with the the provided name', async () => {
      let check = jest.spyOn(buildingModel, 'findOne').mockResolvedValue(null);
      
      let results = await buildngServiceHelper.checkIfBuildingExists(mockBuilding.name)
      expect(check).toHaveBeenCalled()
      expect(check).toHaveBeenCalledWith({name:mockBuilding.name})
      
      expect(results).toBeFalsy()

    });
  });

  describe('replaceBuildingOranizationIdField', () => { 
    it("should return a formated building with organization field instead of organizationId",async()=>{
      let building = buildngServiceHelper.replaceBuildingOranizationIdField(mockBuildingOverviewDoc as undefined as Building)
      expect(building.organization).not.toEqual(undefined)
      expect(building.organization.name).toBeDefined()
      expect(building.organization.owner).toBeDefined()
      expect(building.organizationId).not.toBeDefined()
    })
   })
});
