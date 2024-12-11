import { Test } from '@nestjs/testing';
import { RequestSharedService } from '../services/request.shared.service';
import { Mongoose, Types } from 'mongoose';

describe('RequestSharedService', () => {
  let requestSharedService: RequestSharedService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [RequestSharedService],
    }).compile();

    requestSharedService =
      module.get<RequestSharedService>(RequestSharedService);
  });

  it('Should be defined', () => {
    expect(requestSharedService).toBeDefined();
  });

  describe('formatQueryParamsArrayToMongoFilterObjectV2', () => {
    it('should return undefined if no params are provided', () => {
      let fields = undefined;
      let formatedQueryParams =
        requestSharedService.formatQueryParamsArrayToMongoFilterObject(fields);
      expect(formatedQueryParams).toBeUndefined();
    });
    it('should throw an error  if no could not parse query params', () => {
      let fields = '{"field":"value}';
      try {
        let formatedQueryParams =
          requestSharedService.formatQueryParamsArrayToMongoFilterObject(
            fields,
          );
      } catch (error) {
        expect(error.message).toEqual(
          'Error while parsing request query params',
        );
      }
    });
    it('should throw an error  if no could not create mongoodb ObjectId from string', () => {
      let fields =
        '[{"name":"_id","value":"668e8c274bf69a2e53bf59f1"},{"name":"referenceId","value":"6e8c274bf69a2e53bf59f1"}]';
      try {
        let formatedQueryParams =
          requestSharedService.formatQueryParamsArrayToMongoFilterObject(
            fields,
          );
      } catch (error) {
        expect(error.message).toEqual(
          'Error while creating mongodb Object, hex should be 24 chars',
        );
      }
    });
    it('should return object that conforme to mongoose filter object', () => {
      let fields =
        '[{"name":"_id","value":"668e8c274bf69a2e53bf59f1"},{"name":"field1","value":"value1"}]';

      let formatedQueryParams: Record<string, any> =
        requestSharedService.formatQueryParamsArrayToMongoFilterObject(fields);
      expect(formatedQueryParams).toBeDefined();
      expect(formatedQueryParams).toEqual({
        field1: expect.anything(),
        _id: expect.any(String),
      });
    });

    it('should return mongoose objectId for any field that have "Id" within its name', () => {
      let fields =
        '[{"name":"_id","value":"668e8c274bf69a2e53bf59f1"},{"name":"referenceId","value":"668e8c274bf69a2e53bf59f1"}]';

      let formatedQueryParams: Record<string, any> =
        requestSharedService.formatQueryParamsArrayToMongoFilterObject(fields);
      expect(formatedQueryParams).toBeDefined();
      expect(formatedQueryParams).toEqual({
        _id: expect.any(String),

        referenceId: expect.any(Types.ObjectId),
      });
    });
  });
});
