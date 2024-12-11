import { Test, TestingModule } from '@nestjs/testing';
import { FloorsService } from '../services/floors.service';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import { FloorsController } from '../controllers/floors.controller';
import {
  mockBuildingSharedService,
  mockFloorSharedService,
  mockFloorsService,
  mockRequestSharedService,
  mockRoomSharedService,
} from './__mocks__/floor.services.mock';
import {
  createFloorsWithRoomsDto,
  mockBuildingId,
  mockCreateFloorsAttrs,
  mockFloorsData,
  mockFloorsDocs,
  mockFloorWithDetails,
  mockRoomsDocs,
} from './__mocks__/floor.docs.mock';
import { HttpException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('FloorsController', () => {
  let floorsController: FloorsController;
  let floorsService: FloorsService;
  let floorSharedService: FloorSharedService;
  let requestSharedService: RequestSharedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorsController],
      providers: [
        { provide: FloorsService, useValue: mockFloorsService },
        { provide: FloorSharedService, useValue: mockFloorSharedService },
        { provide: RequestSharedService, useValue: mockRequestSharedService },
      ],
    }).compile();

    floorsController = module.get<FloorsController>(FloorsController);
    floorsService = module.get<FloorsService>(FloorsService);
    floorSharedService = module.get<FloorSharedService>(FloorSharedService);
    requestSharedService =
      module.get<RequestSharedService>(RequestSharedService);
  });

  it('should be defined', () => {
    expect(floorsController).toBeDefined();
  });

  describe('createMany', () => {
    it('throw Error if could not createMany floors for any reasons', async () => {
      let createFloorsAttrs = JSON.parse(JSON.stringify(mockFloorsDocs)).map(
        (ele) => {
          delete ele.id;
          return ele;
        },
      );

      mockFloorSharedService.formatFloorsRawData.mockReturnValueOnce(
        createFloorsAttrs,
      );
      mockFloorSharedService.createMany.mockRejectedValueOnce(Error(''));
      try {
        let results = await floorsController.createMany(mockCreateFloorsAttrs);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Erreur lors de la création des étages');
      }
    });

    it('It should return the created floors', async () => {
      let createFloorsAttrs = JSON.parse(JSON.stringify(mockFloorsDocs)).map(
        (ele) => {
          delete ele.id;
          return ele;
        },
      );
      //      console.log(createFloorsAttrs)
      mockFloorSharedService.formatFloorsRawData.mockReturnValueOnce(
        createFloorsAttrs,
      );
      mockFloorSharedService.createMany.mockResolvedValue(mockFloorsDocs);

      let results = await floorsController.createMany(mockCreateFloorsAttrs);
      //      console.log(results);

      results.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
        }),
      );
    });
  });

  describe('createManyWithRooms', () => {
    it('should throw Error if could not createMany floors with rooms for any reasons', async () => {
      mockFloorsService.createManyWithRooms.mockRejectedValueOnce(Error(''));
      try {
        let results = await floorsController.createMany(mockCreateFloorsAttrs);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Erreur lors de la creation des étages');
      }
    });

    it('It should return the created floors', async () => {
      mockFloorsService.createManyWithRooms.mockResolvedValueOnce({
        floors: mockFloorsDocs,
        rooms: mockRoomsDocs,
      });

      let results = await floorsController.createManyWithRooms(
        mockBuildingId.toString(),
        createFloorsWithRoomsDto,
      );

      let { floors, rooms } = results;
      floors.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
        }),
      );
      rooms.forEach((ele) => {
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
  describe('find', () => {
    it('should throw error if could not parse the information for floor filtering', async () => {
      let details = 'true';

      let fields: Record<string, any> = {
        buildingId: mockBuildingId.toString(),
      };
      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockImplementationOnce(
        () => {
          throw new Error('');
        },
      );
      try {
        //@ts-ignore
        let response = await floorsController.find(details, fields);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Erreur lors du traitement des informations blocs!',
        );
      }
    });
    it('should call findAll if no field neither details are specified with the request', async () => {
      mockFloorsService.findAll.mockResolvedValueOnce(mockFloorsDocs);

      let response = await floorsController.find(undefined, undefined);
      expect(mockFloorsService.findAll).toHaveBeenCalled();
      response.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),

          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
        }),
      );
    });
    it('should call findAlllWithDetails if no field is specified, and details is specified', async () => {
      let details = 'true';

      mockFloorsService.findAllWithDetails.mockResolvedValueOnce([
        mockFloorWithDetails,
      ]);

      let response = await floorsController.find(undefined, details);
      expect(mockFloorsService.findAllWithDetails).toHaveBeenCalled();
      response.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),

          building: expect.anything(),
          organization: expect.anything(),
        }),
      );
    });
    it('should call findMany if no details is specified, but searching fields are specified ', async () => {
      let details = undefined;

      let fields: Record<string, any> = {
        buildingId: mockBuildingId.toString(),
      };

      mockFloorsService.findMany.mockResolvedValueOnce(mockFloorsDocs);

      let response = await floorsController.find(fields.toString(), details);
      expect(mockFloorsService.findMany).toHaveBeenCalled();
      response.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),

          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
        }),
      );
    });
    it('should call findManyWithDetails if the fields and details are specified', async () => {
      let details = 'true';

      let fields: Record<string, any> = {
        buildingId: mockBuildingId.toString(),
      };

      mockFloorSharedService.findManyWithDetails.mockResolvedValueOnce([
        mockFloorWithDetails,
      ]);

      let response = await floorsController.find(fields.toString(), details);
      expect(mockFloorSharedService.findManyWithDetails).toHaveBeenCalled();
      response.forEach((ele) =>
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),

          building: expect.anything(),
          organization: expect.anything(),
        }),
      );
    });
    it('should throw error if any of floorservice throws error ', async () => {
      let details = 'true';

      let fields: Record<string, any> = {
        buildingId: mockBuildingId.toString(),
      };

      mockFloorSharedService.findManyWithDetails.mockRejectedValueOnce(
        Error(''),
      );

      try {
        let response = await floorsController.find(fields.toString(), details);
      } catch (error) {
        expect(mockFloorSharedService.findManyWithDetails).toHaveBeenCalled();

        expect(error).toBeInstanceOf(HttpException)
        expect(error.message).toBe("Erreur lors de la récupération des données des étages")
      }
    });
  });
  describe('findManyWithRooms', () => {
    it('should throw error if could not parse the information for floor filtering', async () => {
      let fields: Record<string, any> = {
        buildingId: mockBuildingId.toString(),
      };

      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockImplementationOnce(
        () => {
          throw new Error('');
        },
      );
      try {
        //@ts-ignore
        let response = await floorsController.findManyWithRooms(fields);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Erreur lors de la récupération des données des étages',
        );
      }
    });
    it('should throw error if could not find floor information', async () => {
      let fields = JSON.stringify({
        buildingId: mockBuildingId.toString(),
      });

      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockReturnValueOnce(
        JSON.parse(fields),
      );
      mockFloorsService.findManyWithRooms.mockRejectedValueOnce(Error(''));
      try {
        //@ts-ignore
        let response = await floorsController.findManyWithRooms(fields);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Erreur lors de la récupération des données des étages',
        );
      }
    });
    it('should return a list of floors with rooms details', async () => {
      let fields = JSON.stringify({
        buildingId: mockBuildingId.toString(),
      });

      mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockReturnValueOnce(
        JSON.parse(fields),
      );
      mockFloorsService.findManyWithRooms.mockResolvedValueOnce(
        mockFloorsData,
      );

      let response = await floorsController.findManyWithRooms(fields);
      response.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          name: expect.any(String),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
          rooms: expect.anything(),
        });
        let {rooms} = ele

        rooms.forEach((ele) => {
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

  afterEach(() => {
    mockFloorsService.createManyWithRooms.mockReset();
    mockFloorSharedService.createMany.mockReset();
    mockFloorSharedService.formatFloorsRawData.mockReset();
    mockRequestSharedService.formatQueryParamsArrayToMongoFilterObject.mockReset();
  });
});
