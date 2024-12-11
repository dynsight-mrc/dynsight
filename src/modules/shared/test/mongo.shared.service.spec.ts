import { Test, TestingModule } from '@nestjs/testing';

import { FunctionSharedService } from '../services/functions.shared.service';
import { MongoSharedService } from '../services/mongo.shared.service';
import mongoose, { Model, Types } from 'mongoose';
import { Schema } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('FunctionsSharedService', () => {
  let mongoSharedService: MongoSharedService;
  let mockModel: Model<any>;

  const schema = new Schema({
    property1: { type: String },
    property2: { type: Schema.Types.ObjectId, ref: 'Schema2' },
  });

  beforeAll(async () => {
    mockModel = { schema } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoSharedService,
        { provide: getModelToken('MockModel'), useValue: mockModel },
      ],
    }).compile();

    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);
  });

  it('should be defined', () => {
    expect(mongoSharedService).toBeDefined();
  });

  describe('getReferenceFields', () => {
    it('should return a list of reference fields', () => {
      let referenceFields = mongoSharedService.getReferenceFields(mockModel);
      expect(referenceFields).toEqual(['property2']);
    });
    it('should return a empty array if no reference field', () => {
      const schemaWithNoReference = new Schema({
        property1: { type: String },
        property2: { type: Schema.Types.ObjectId },
      });
      mockModel.schema = schemaWithNoReference;

      let referenceFields = mongoSharedService.getReferenceFields(mockModel);
      expect(referenceFields).toEqual([]);
    });
    it('should handle nested reference fields', async () => {
      const nestedSchema = new Schema({
        nested: {
          prorperty1: { type: Schema.Types.ObjectId, ref: 'property2' },
          prorperty2: { type: [Schema.Types.ObjectId], ref: 'property2' },
        },
        title: { type: String },
      });
      mockModel.schema = nestedSchema; // Mock a nested schema

      const referenceFields = mongoSharedService.getReferenceFields(mockModel);
      expect(referenceFields).toEqual([
        'nested.prorperty1',
        'nested.prorperty2',
      ]);
    });
  });

  describe('transformObjectStringIdsToMongoObjectIds', () => {
    it('should create mongoose ObjectId for any id or attribute that ends with Id ', () => {
      let obj = {
        proprty: 'propertyValue',
        id: new mongoose.Types.ObjectId().toString(),
        propertyId: new mongoose.Types.ObjectId().toString(),
      };
      let newMongodbQuery =
        mongoSharedService.transformObjectStringIdsToMongoObjectIds(obj);
      

      expect(newMongodbQuery).toEqual({
        proprty: expect.any(String),
        id: expect.any(Types.ObjectId),
        propertyId: expect.any(Types.ObjectId),
      });
    });
  });

  describe('transformIdAttributes', () => {
    it('should remove id from attrbute name if value is an object ', () => {
      let mockRoomDocWithDetails = {
        floorId: {
          id: new mongoose.Types.ObjectId(),
          name: 'etage 1',
          number: 1,
        },
      };
      let transformedObj = mongoSharedService.transformIdAttributes(
        mockRoomDocWithDetails,
      );
      expect(transformedObj).toEqual({
        floor: mockRoomDocWithDetails.floorId,
      });
    });
    it('should pass recursively through all objects of an array and removes the id from the attribute if its value is an object', () => {
      let mockRoomDocWithDetails = [
        {
          id: new mongoose.Types.ObjectId(),
          name: 'bloc 1',
          floorId: {
            id: new mongoose.Types.ObjectId(),
            name: 'etage 1',
            number: 1,
          },
        },
      ];
      let transformedObj = mongoSharedService.transformIdAttributes(
        mockRoomDocWithDetails,
      );
      transformedObj.forEach((ele) =>
        expect(ele).toEqual({
          id: mockRoomDocWithDetails[0].id,
          name: mockRoomDocWithDetails[0].name,
          floor: mockRoomDocWithDetails[0].floorId,
        }),
      );
    });
    it('should return the same attibute if the value is not an object', () => {
      let mockRoomDocWithDetails = {
        id: new mongoose.Types.ObjectId(),
        name: 'bloc 1',
      };
      let transformedObj = mongoSharedService.transformIdAttributes(
        mockRoomDocWithDetails,
      );
      expect(transformedObj).toEqual({
        id: mockRoomDocWithDetails.id,
        name: mockRoomDocWithDetails.name,
      });
    });
  });
});
