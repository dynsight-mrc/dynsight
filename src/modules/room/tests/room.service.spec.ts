import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Room, RoomModel } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { Types } from 'mongoose';

import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import {
  createRoomDocumentAttrsDto,
  mockConnection,
  mockRoomDoc,
  mockRoomDocWithDetails,
  mockRoomId,
} from './__mocks__/room.docs.mock';
import { mockRoomModel } from './__mocks__/room.model.mock';
import { CreateRoomDocumentAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';

describe('Room Serivce', () => {
  let roomService: RoomService;
  let mongoSharedService: MongoSharedService;
  let roomModel: RoomModel;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Room.name), useValue: mockRoomModel },

        RoomService,
        MongoSharedService,
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
      ],
    }).compile();
    roomService = module.get<RoomService>(RoomService);
    mongoSharedService = module.get<MongoSharedService>(MongoSharedService);
    roomModel = module.get<RoomModel>(getModelToken(Room.name));
  });

  it('It should be defined', () => {
    expect(roomService).toBeDefined();
  });

  describe('findOneById', () => {
    it('create should throw error if could not find room for any reason', async () => {
      jest.spyOn(roomModel, 'findOne').mockRejectedValueOnce(Error);
      try {
        await roomService.findOneById(mockRoomId.toString());
      } catch (error) {
        expect(error.message).toEqual(
          'Error occured while retrieving room data',
        );
      }
    });

    it('should return a room document', async () => {
      jest
        .spyOn(roomModel, 'findOne')
        .mockResolvedValueOnce({ toJSON: () => mockRoomDoc });
      let roomDoc = await roomService.findOneById(mockRoomId.toString());
      expect(roomDoc).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        floorId: expect.any(Types.ObjectId),
        buildingId: expect.any(Types.ObjectId),
        organizationId: expect.any(Types.ObjectId),
        surface: expect.any(Number),
      });
    });
  });
  describe('findOneByIdWithDetails', () => {
    it('should throw error if couldnot retrieve document for any reason', async () => {
      jest.spyOn(roomModel, 'findOne').mockRejectedValueOnce(Error);
      try {
        await roomService.findOneById(mockRoomId.toString());
      } catch (error) {
        expect(error.message).toEqual(
          'Error occured while retrieving room data',
        );
      }
    });

    it('should return a room with more details in reference attributes', async () => {
      jest
        .spyOn(mongoSharedService, 'getReferenceFields')
        .mockReturnValue(['floorId', 'buildingId', 'organizationId']),
        //jest.spyOn(mongoSharedService,"transformIdAttributes").mockReturnValueOnce(mockRoomTransformedAttrs)
        jest.spyOn(roomModel, 'findOne').mockReturnThis();
      jest
        .spyOn(roomModel, 'populate')
        .mockResolvedValueOnce({ toJSON: () => mockRoomDocWithDetails } as any);
      let room = await roomService.findOneByIdWithDetails(
        mockRoomId.toString(),
      );

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
      });
    });
  });
  describe('createOne', () => {
    it('should throw error if room already exist', async () => {
      jest.spyOn(roomModel, 'findOne').mockResolvedValueOnce(mockRoomDoc);
      try {
        await roomService.createOne(createRoomDocumentAttrsDto);
      } catch (error) {
        expect(error.message).toEqual('Room Already exist with this name');
      }
    });
    it('should create room and return its value', async () => {
      jest.spyOn(roomModel, 'findOne').mockResolvedValueOnce(null);
      let roomDoc = {
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => mockRoomDoc,
      };
      jest.spyOn(roomModel, 'build').mockReturnValueOnce(roomDoc as any);
      let room = await roomService.createOne(createRoomDocumentAttrsDto);
      expect(room).toEqual({
        id: expect.any(Types.ObjectId),
        name: expect.any(String),
        floorId: expect.any(Types.ObjectId),
        buildingId: expect.any(Types.ObjectId),
        organizationId: expect.any(Types.ObjectId),
        surface: expect.any(Number),
      });
    });
  });

  /*
   describe('createMany', () => {
    it('throw error if createRoomsData is inconveniet', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();

      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12],
        floors: ['etage 1s', 'etage 3s'],
      };
      let mockFloorsDocs: CreateFloorDto[] = [
        {
          id: new mongoose.Types.ObjectId(),
          name: 'etage 1s',
          number: 1,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
        {
          id: new mongoose.Types.ObjectId(),
          name: 'etage 3s',
          number: 2,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
      ];
      let session = {};
      expect(() =>
        roomService.createMany(
          createRoomsDto,
          mockFloorsDocs,
          mockBuildingId,
          mockOrganizationId,
          session,
        ),
      ).rejects.toThrow('Inadéquation des valeurs');
    });
    it("throw error if room already exists in the same organization's building", async () => {
      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12, 12],
        floors: ['etage 1s', 'etage 3s'],
      };
      let session = {};

      jest.spyOn(roomModel, 'insertMany').mockRejectedValue({ code: 11000 });
      let formatedRoomsData = roomServiceHelper.formatRoomsRawData(
        createRoomsDto,
        mockFloorsDocs,
        mockBuildingId,
        mockOrganizationId,
      );
      try {
        await roomService.createMany(
          createRoomsDto,
          mockFloorsDocs,
          mockBuildingId,
          mockOrganizationId,
          session,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toEqual(
          'Un ou plusieurs blocs existent déja avec ces paramètres',
        );
      }
      expect(mockRoomModel.insertMany).toHaveBeenCalledWith(formatedRoomsData, {
        session,
      });
    });
    it("should throw error if if users couldn't be inserted for any reason", async () => {
      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12, 12],
        floors: ['etage 1s', 'etage 3s'],
      };
      let session = {};

      jest.spyOn(roomModel, 'insertMany').mockRejectedValue({ code: 500 });
      let formatedRoomsData = roomServiceHelper.formatRoomsRawData(
        createRoomsDto,
        mockFloorsDocs,
        mockBuildingId,
        mockOrganizationId,
      );
      try {
        await roomService.createMany(
          createRoomsDto,
          mockFloorsDocs,
          mockBuildingId,
          mockOrganizationId,
          session,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual('Erreur lors de la création des blocs');
      }
      expect(mockRoomModel.insertMany).toHaveBeenCalledWith(formatedRoomsData, {
        session,
      });
    });
    it('should return a list of created blocs', async () => {
      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12, 12],
        floors: ['etage 1s', 'etage 3s'],
      };

      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();
      let mockFloorsDocs: CreateFloorDto[] = [
        {
          id: new mongoose.Types.ObjectId(),
          name: 'etage 1s',
          number: 1,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
        {
          id: new mongoose.Types.ObjectId(),
          name: 'etage 3s',
          number: 2,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
      ];
      let session = {};
      let mockFormatedRoomsData = roomServiceHelper.formatRoomsRawData(
        createRoomsDto,
        mockFloorsDocs,
        mockBuildingId,
        mockOrganizationId,
      );

      let mockReturnedRooms = mockFormatedRoomsData.map((ele) => ({
        id: new mongoose.Types.ObjectId(),
        ...ele,
      }));

      let formatRoomsRawData = jest.spyOn(
        roomServiceHelper,
        'formatRoomsRawData',
      );

      //@ts-ignore
      jest.spyOn(roomModel, 'insertMany').mockResolvedValue(mockReturnedRooms);

      let createdRooms = await roomService.createMany(
        createRoomsDto,
        mockFloorsDocs,
        mockBuildingId,
        mockOrganizationId,
        session,
      );

      expect(formatRoomsRawData).toHaveBeenCalledWith(
        createRoomsDto,
        mockFloorsDocs,
        mockBuildingId,
        mockOrganizationId,
      );
      expect(createdRooms).toEqual(mockReturnedRooms);
    });
  });
  describe('findByFoorId', () => {
    it('should throw an error if could not return the rooms for any reasosn', async () => {
      let mockfloorId = new mongoose.Types.ObjectId();

      mockRoomModel.find.mockReturnThis();
      mockRoomModel.select.mockRejectedValueOnce(new Error(''));

      try {
        await roomService.findByFloorId(mockfloorId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual(
          'Erreur sest produite lors de la récupérations des données des blocs',
        );
      }
    });
    it('should return empty array if no room was found', async () => {
      let mockfloorId = new mongoose.Types.ObjectId();
      let mockReturneValue = [];
      mockRoomModel.find.mockReturnThis();
      mockRoomModel.select.mockResolvedValueOnce(
        mockReturneValue.map((ele) => ({ toJSON: () => ele })),
      );

      let rooms = await roomService.findByFloorId(mockfloorId);

      expect(mockRoomModel.find).toHaveBeenCalledWith({ floorId: mockfloorId });
      expect(mockRoomModel.select).toHaveBeenCalledWith({
        organizationId: 0,
        buildingId: 0,
      });
      expect(rooms.length).toEqual(0);
    });
    it('should return a list of rooms', async () => {
      let mockfloorId = new mongoose.Types.ObjectId();
      let mockReturneValue = [{ name: 'bloc 1' }, { name: 'bloc 2' }];
      mockRoomModel.find.mockReturnThis();
      mockRoomModel.select.mockResolvedValueOnce(
        mockReturneValue.map((ele) => ({ toJSON: () => ele })),
      );

      let rooms = await roomService.findByFloorId(mockfloorId);
      expect(mockRoomModel.find).toHaveBeenCalledWith({ floorId: mockfloorId });
      expect(mockRoomModel.select).toHaveBeenCalledWith({
        organizationId: 0,
        buildingId: 0,
      });
      expect(rooms).toEqual([{ name: 'bloc 1' }, { name: 'bloc 2' }]);
    });
  });
  describe('findAllOverview', () => {
    it('should throw an error if could not fetch the requsted room for any reasons', async () => {
   
      jest.spyOn(roomModel, 'find').mockReturnThis();
      jest.spyOn(roomModel, 'populate').mockRejectedValueOnce(new Error(''));

      // try {
        //await roomService.findAllOverview();
      //} catch (error) {
        //expect(error).toEqual('Error occured while retrieving the rooms data');
      //}
       

      await expect(() => roomService.findAllOverview()).rejects.toThrow(
        'Error occured while retrieving the rooms data',
      );
    });
    it('should return a list of building with the format ReadBuildingOverview[]', async () => {
      mockRoomModel.find.mockReturnThis();
      mockRoomModel.populate.mockResolvedValueOnce([mockPopulatedRoom]);

      let rooms: ReadRoomOverview[] = await roomService.findAllOverview();
      expect(rooms).toBeDefined();
      expect(rooms.length).toEqual(1);
      expect(rooms[0].floor).not.toEqual(undefined);
      expect(rooms[0].building).not.toEqual(undefined);
      expect(rooms[0].organization).not.toEqual(undefined);
    });
  });

  describe('finByBuildingId', () => {
    it('should throw an error if could not fetch rooms data for any reason', async () => {
      mockRoomModel.find.mockReturnThis();
      mockRoomModel.select.mockReturnThis();
      mockRoomModel.populate.mockRejectedValueOnce(new Error(''));
      await expect(() =>
        roomService.findByBuildingId(mockBuildingId.toString()),
      ).rejects.toThrow(
        'Erreur sest produite lors de la récupérations des données des blocs',
      );
    });
    it('should return ampty list if no room is found', async () => {
      mockRoomModel.find.mockReturnThis();
      mockRoomModel.select.mockReturnThis();
      mockRoomModel.populate.mockResolvedValueOnce([]);
      let roomsDocs = await roomService.findByBuildingId(
        mockBuildingId.toString(),
      );
      expect(roomsDocs).toBeDefined();
      expect(roomsDocs.length).toEqual(0);
    });
    it('should return a list of rooms of specific bloc', async () => {
      mockRoomModel.find.mockReturnThis();
      mockRoomModel.select.mockReturnThis();
      mockRoomModel.populate.mockResolvedValueOnce([mockRoomDoc]);
      let roomsDocs = await roomService.findByBuildingId(
        mockBuildingId.toString(),
      );
      roomsDocs.forEach((room) => {
        expect(room).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floor: {
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
            number: expect.any(Number),
          },
          building: expect.any(Types.ObjectId),
          organization: expect.any(Types.ObjectId),
          surface: expect.any(Number),
        });
      });
    });
  }); */
});
