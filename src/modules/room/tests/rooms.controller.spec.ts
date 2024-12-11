import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from '../controllers/room.controller';
import mongoose, { Types } from 'mongoose';
import { RoomsService } from '../services/rooms.service';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import { RoomsController } from '../controllers/rooms.controller';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import {
  mockRequestSharedService,
  mockRoomSharedService,
  mockRoomsService,
} from './__mocks__/room.services.mock';
import { HttpException } from '@nestjs/common';
import {
  createRoomsAttrsDto,
  mockBuildingId,
  mockRoomDoc,
  mockRoomDocWithDetails,
  mockRoomId,
} from './__mocks__/room.docs.mock';

describe('Rooms Controller', () => {
  let roomsController: RoomsController;
  let requestSharedService: RequestSharedService;
  let roomsService: RoomsService;
  let roomSharedService: RoomSharedService;

  let fieldsString = `'[{"name":"buildingId","value":"${mockRoomId.toString()}"}]'`;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        { provide: RoomsService, useValue: mockRoomsService },
        { provide: RoomSharedService, useValue: mockRoomSharedService },
        { provide: RequestSharedService, useValue: mockRequestSharedService },
      ],
    }).compile();

    roomsController = module.get<RoomsController>(RoomsController);
    roomsService = module.get<RoomsService>(RoomsService);
    roomSharedService = module.get<RoomSharedService>(RoomSharedService);
    requestSharedService =
      module.get<RequestSharedService>(RequestSharedService);
  });

  it('should be defined', () => {
    expect(roomsController).toBeDefined();
  });

  describe('find', () => {
    it('should throw error if could not parse the information for bloc filtering', async () => {
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockImplementationOnce(
        () => {
          throw new Error('');
        },
      );
      try {
        let response = await roomsController.find();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Erreur avec les informations du filtrage des blocs!',
        );
      }
    });
    it('should call findAll if no field neither details are specified with the request', async () => {
      let mockRoomServiceFindAll = jest
        .spyOn(roomsService, 'findAll')
        .mockResolvedValueOnce([mockRoomDoc]);

      let response = await roomsController.find();
      expect(mockRoomServiceFindAll).toHaveBeenCalledTimes(1);
      response.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
        });
      });
    });
    it('should call findAlllWithDetails if no field is specified, and details is specified', async () => {
      let details = 'true';
      let mockRoomServiceFindAllWithDetails = jest
        .spyOn(roomsService, 'findAlllWithDetails')
        .mockResolvedValueOnce([mockRoomDocWithDetails]);

      let response = await roomsController.find(undefined, details);
      expect(mockRoomServiceFindAllWithDetails).toHaveBeenCalledTimes(1);
      response.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floor: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
            number: expect.any(Number),
          },
          building: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
          },
          organization: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
          },
          surface: expect.any(Number),
        });
      });
    });
    it('should call findMany if no details is specified, but searching fields are specified ', async () => {
      let details = undefined;

      let fields: Record<string, any> = {
        buildingId: mockBuildingId.toString(),
      };

      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockResolvedValueOnce(
        fields,
      );

      let mockRoomSharedServiceFindMany = jest
        .spyOn(roomSharedService, 'findMany')
        .mockResolvedValueOnce([mockRoomDoc]);

      let response = await roomsController.find(fieldsString);
      expect(mockRoomSharedServiceFindMany).toHaveBeenCalledTimes(1);
      response.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
        });
      });
    });
    it('should call findManyWithDetails if the fields and details are specified', async () => {
      let details = 'true';

      let fields: Record<string, any> = {
        buildingId: mockBuildingId.toString(),
      };
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockResolvedValueOnce(
        fields,
      );

      let mockRoomSharedServiceFindManyWithDetails = jest
        .spyOn(roomSharedService, 'findManyWithDetails')
        .mockResolvedValueOnce([mockRoomDocWithDetails]);

      let response = await roomsController.find(fieldsString, details);
      expect(mockRoomSharedServiceFindManyWithDetails).toHaveBeenCalledTimes(1);
      response.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floor: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
            number: expect.any(Number),
          },
          building: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
          },
          organization: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
          },
          surface: expect.any(Number),
        });
      });
    });
  });

  describe('createMany', () => {
    it('should return the created buildings', async () => {
      // mockRoomsService.createMany.mockResolvedValueOnce([mockRoomDoc])
      let mockRoomServiceCreateMany = jest
        .spyOn(mockRoomsService, 'createMany')
        .mockResolvedValueOnce([mockRoomDoc]);
      let response = await roomsController.createMany(
        mockBuildingId.toString(),
        createRoomsAttrsDto,
      );
      expect(mockRoomServiceCreateMany).toHaveBeenCalledTimes(1);
      response.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
        });
      });
    });
  });
  });
