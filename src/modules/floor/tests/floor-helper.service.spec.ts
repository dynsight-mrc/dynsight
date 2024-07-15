import { Test, TestingModule } from '@nestjs/testing';
import { FloorServiceHelper } from '../services/floor-helper.service';
import { getModelToken } from '@nestjs/mongoose';
import { Floor, FloorModel } from '../models/floor.model';
import mongoose from 'mongoose';
//import { Building, BuildingModel } from 'src/modules/building/models/building.model';

describe('FloorHelperService', () => {
  let floorServiceHelper: FloorServiceHelper;
  let floorModel: FloorModel;
  //let buildingModel : BuildingModel
  let mockFloorModel = {};
  
  //let mockBuildingModel = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FloorServiceHelper,
        { provide: getModelToken(Floor.name), useValue: mockFloorModel },
      ],
    }).compile();
    //{provide:getModelToken(Building.name),useValue:mockBuildingModel}
    floorServiceHelper = module.get<FloorServiceHelper>(FloorServiceHelper);
    floorModel = module.get<FloorModel>(getModelToken(Floor.name));
    // buildingModel = module.get<BuildingModel>(getModelToken(Building.name))
  });

  it('should be defined', () => {
    expect(floorServiceHelper).toBeDefined();
    expect(floorModel).toBeDefined();
    //expect(buildingModel).toBeDefined()
  });
  describe('formatFloorsRawData', () => {
    it('should throw error if names array and number arrays length are incompatible', () => {
      let createFloorDto = {
        name: ['etage 1', 'étage 2', 'étage 3'],
        number: [1, 2],
        organizationId:new mongoose.Types.ObjectId(),
        buildingId:new mongoose.Types.ObjectId()
      };

      expect(() =>
        floorServiceHelper.formatFloorsRawData(createFloorDto),
      ).toThrow(
        "Erreur s'est produite lors du formatage de la liste des étages",
      );
    });
    it('should return formated Array of floors', () => {
      let createFloorDto = {
        name: ['etage 1', 'etage 2', 'etage 3'],
        number: [1, 2, 3],
        organizationId:new mongoose.Types.ObjectId(),
        buildingId:new mongoose.Types.ObjectId()
      };

      let formatedFloors =
        floorServiceHelper.formatFloorsRawData(createFloorDto);
      expect(formatedFloors).toEqual([
        { number: 1, name: 'etage 1',organizationId:createFloorDto.organizationId,buildingId:createFloorDto.buildingId },
        { number: 2, name: 'etage 2' ,organizationId:createFloorDto.organizationId,buildingId:createFloorDto.buildingId },
        { number: 3, name: 'etage 3' ,organizationId:createFloorDto.organizationId,buildingId:createFloorDto.buildingId },
      ]);
    });

    it('should throw error if names list has doubles', () => {
      let createFloorDto = {
        name: ['etage 1', 'etage 2', 'etage 1'],
        number: [1, 2, 3],
        organizationId:new mongoose.Types.ObjectId(),
        buildingId:new mongoose.Types.ObjectId()
      };

      expect(() =>
        floorServiceHelper.formatFloorsRawData(createFloorDto),
      ).toThrow('Noms des étages doivent etre uniques');
    });
    it('should throw error if numbers list has doubles', () => {
      let createFloorDto = {
        name: ['etage 1', 'etage 2', 'etage 3'],
        number: [1, 2, 1],
        organizationId:new mongoose.Types.ObjectId(),
        buildingId:new mongoose.Types.ObjectId()
      };

      expect(() =>
        floorServiceHelper.formatFloorsRawData(createFloorDto),
      ).toThrow('Numéros des étages doivent etre uniques');
    });
  });
});
