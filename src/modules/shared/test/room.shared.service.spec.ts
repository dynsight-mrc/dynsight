import { Test, TestingModule } from '@nestjs/testing';
import { MongoSharedService } from '../services/mongo.shared.service';
import { RoomSharedService } from '../services/room.shared.service';
import { getModelToken } from '@nestjs/mongoose';
import { Room, RoomModel } from '@modules/room/models/room.model';
import { FunctionSharedService } from '../services/functions.shared.service';
import mongoose, { Types } from 'mongoose';
import { ReadFloorDocumentDto } from '../dto/floor/read-floor.dto';
import { mockRoomSharedService } from './__mocks__/floors/floor.services.mock';
import {
  createRoomDocumentAttrsDto,
  createRoomsAttrsDto,
  mockBuildingDoc,
  mockBuildingId,
  mockConnection,
  mockFloorsDocs,
  mockOrganizationId,
  mockRoomDoc,
  mockRoomDocWithDetails,
} from './__mocks__/rooms/room.docs.mock';
import { mockRoomModel } from './__mocks__/rooms/room.model.mock';

describe('SharedService', () => {
  let roomSharedService: RoomSharedService;
  let mongoSharedService: MongoSharedService;
  let functionSharedService: FunctionSharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomSharedService,
        { provide: getModelToken(Room.name), useValue: mockRoomModel },
        MongoSharedService,
        FunctionSharedService,
      ],
    }).compile();

    roomSharedService = module.get<RoomSharedService>(RoomSharedService);
    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);
    functionSharedService = module.get<FunctionSharedService>(
      FunctionSharedService,
    );
  });

  it('should be defined', () => {
    expect(roomSharedService).toBeDefined();
  });

  describe('formatRoomsRawData', () => {
    it('should throw error if raw data legnth is not identical', async () => {
      let _mockCreateRoomsDto = JSON.parse(JSON.stringify(createRoomsAttrsDto));
      _mockCreateRoomsDto.name.pop();

      expect(() =>
        roomSharedService.formatRoomsRawData(
          _mockCreateRoomsDto,
          mockFloorsDocs,
          mockBuildingId.toString(),
          mockOrganizationId.toString(),
        ),
      ).toThrow('Inadéquation des valeurs');
    });
    it('should throw error if blocs names have double values', async () => {
      let _mockCreateRoomsDto = JSON.parse(JSON.stringify(createRoomsAttrsDto));
      _mockCreateRoomsDto.name[1] = _mockCreateRoomsDto.name[0];

      expect(() =>
        roomSharedService.formatRoomsRawData(
          _mockCreateRoomsDto,
          mockFloorsDocs,
          mockBuildingId.toString(),
          mockOrganizationId.toString(),
        ),
      ).toThrow('Noms des blocs doivent etre uniques');
    });

    it('should throw error if the no floors found in the db with same floors name in payload sent', async () => {
      let _mockCreateRoomsDto = JSON.parse(JSON.stringify(createRoomsAttrsDto));
      _mockCreateRoomsDto.floors[0] = 'floor 5s';

      expect(() =>
        roomSharedService.formatRoomsRawData(
          _mockCreateRoomsDto,
          mockFloorsDocs,
          mockBuildingId.toString(),
          mockOrganizationId.toString(),
        ),
      ).toThrow("erreur lors du mappage des identifiants d'étages");
    });

    it('should create list of blocs object ready to save in db', async () => {
      let formatedRooms = roomSharedService.formatRoomsRawData(
        createRoomsAttrsDto,
        mockFloorsDocs,
        mockBuildingId.toString(),
        mockOrganizationId.toString(),
      );

      expect(formatedRooms).toBeDefined();

      formatedRooms.forEach((ele) =>
        expect(ele).toEqual({
          name: expect.any(String),
          organizationId: mockOrganizationId,
          buildingId: expect.any(Types.ObjectId),
          floorId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
          type: expect.any(String),
        }),
      );
      formatedRooms.forEach((ele) => {
        expect(ele).toEqual({
          name: expect.any(String),
          organizationId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          floorId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
          type: expect.any(String),
        });
      });
    });
  });

  describe('createMany', () => {
    it('should throw error if could not create room for any reason', async () => {
      mockRoomModel.insertMany.mockRejectedValueOnce(Error(''));
      try {
        await roomSharedService.createMany(
          [createRoomDocumentAttrsDto],
          mockConnection,
        );
      } catch (error) {
        expect(error.message).toEqual('Error occured while creating rooms!');
      }
    });
    it('should throw error if room alread exist in the building with such information(name)', async () => {
      mockRoomModel.insertMany.mockRejectedValueOnce({ code: 11000 });
      try {
        await roomSharedService.createMany(
          [createRoomDocumentAttrsDto],
          mockConnection,
        );
      } catch (error) {
        expect(error.message).toEqual(
          'A bloc alredy exists with these parameters',
        );
      }
    });
    it('should return a list of rooms', async () => {
      mockRoomModel.insertMany.mockResolvedValueOnce([mockRoomDoc]);
      let results = await roomSharedService.createMany(
        [createRoomDocumentAttrsDto],
        mockConnection,
      );
      results.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          organizationId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          floorId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
          type: expect.any(String),
        });
      });
    });
  });

  describe('findMany', () => {
    it('should throw error if could not find rooms for any reason', async () => {
      jest
        .spyOn(mongoSharedService, 'transformObjectStringIdsToMongoObjectIds')
        .mockReturnValueOnce({ buildingId: mockBuildingId });
      mockRoomModel.find.mockRejectedValueOnce(Error(''));

      //let fieldsString = `'[{"name":"buildingId","value":"${mockBuildingDoc.toString()}"}]'`;
      let queryFields = { buildingId: mockBuildingDoc };
      try {
        let results = await roomSharedService.findMany(queryFields);
      } catch (error) {
        expect(error.message).toEqual(
          'Error occured while retrieving the rooms data',
        );
      }
    });
    it('should return a list of rooms', async () => {
      jest
        .spyOn(mongoSharedService, 'transformObjectStringIdsToMongoObjectIds')
        .mockReturnValueOnce({ buildingId: mockBuildingId });
      mockRoomModel.find.mockResolvedValueOnce([{ toJSON: () => mockRoomDoc }]);

      //let fieldsString = `'[{"name":"buildingId","value":"${mockBuildingDoc.toString()}"}]'`;
      let queryFields = { buildingId: mockBuildingId };

      let results = await roomSharedService.findMany(queryFields);
      results.forEach((ele) => {
        expect(ele).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          organizationId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          floorId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
          type: expect.any(String),
        });
      });
    });
  });
  describe('findManyWithDetails', () => {
    it('should throw error if could not create room for any reason', async () => {
      mockRoomModel.find.mockReturnThis();
      mockRoomModel.populate.mockRejectedValueOnce(Error(''));
      try {
        await roomSharedService.findManyWithDetails(
          {buildingId:mockBuildingId},
        );
      } catch (error) {
        expect(error.message).toEqual(
          'Error occured while retrieving the rooms data',
        );
      }
    });
    it('should return a list of rooms', async () => {
      jest.spyOn(mongoSharedService,"getReferenceFields").mockReturnValueOnce(["buildingId","floorId","organizationId"])

      jest
      .spyOn(mongoSharedService, 'transformIdAttributes')
      .mockReturnValueOnce(mockRoomDocWithDetails);

      mockRoomModel.find.mockReturnThis();
      mockRoomModel.populate.mockResolvedValueOnce([
        { toJSON: () => mockRoomDocWithDetails },
      ]);
     
      let results = await roomSharedService.findManyWithDetails(
        {buildingId:mockBuildingId},
      
      );
      
      results.forEach((room) =>
        expect(room).toEqual({
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
        }),
      );
    });
  });
  afterEach(()=>{
    mockRoomModel.find.mockReset();
    mockRoomModel.populate.mockReset();
  })
});
