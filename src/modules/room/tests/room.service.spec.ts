import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RoomServiceHelper } from '../services/room-helper.service';
import { Room, RoomModel } from '../models/room.model';
import { RoomService } from '../services/room.service';
import mongoose, { Query } from 'mongoose';
import { Floor } from 'src/modules/floor/models/floor.model';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFloorDto } from '@modules/floor/dtos/create-floors.dto';
import { ReadRoomOverview } from '../dtos/read-room-dto';

describe('Blocs Service Helper', () => {
  let mockRoomModel = {
    insertMany: jest.fn(),
    find: jest.fn(),
    select: jest.fn(),
    lean: jest.fn(),
    populate: jest.fn(),
  };
  let roomServiceHelper: RoomServiceHelper;
  let roomService: RoomService;
  let roomModel: RoomModel;
  let mockOrganizationId = new mongoose.Types.ObjectId(
    '668e8c274bf69a2e53bf59f1',
  );
  let mockBuildingId = new mongoose.Types.ObjectId('668e8c274bf69a2e53bf59f2');
  let mockFloorId = new mongoose.Types.ObjectId();
  let mockRoomId = new mongoose.Types.ObjectId();

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

  let mockPopulatedRoom = {
    toJSON: () => ({
      _id: mockRoomId,
      name: 'bloc 1',
      floorId: {
        id: mockFloorId,
        name: 'etage 1',
        number: 1,
      },
      buildingId: {
        id: mockBuildingId,
        name: 'bloc 1',
      },
      organizationId: {
        id: mockOrganizationId,
        name: 'organization_name',
      },
      surface: 25,
    }),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        RoomServiceHelper,
        { provide: getModelToken(Room.name), useValue: mockRoomModel },
      ],
    }).compile();
    roomService = module.get<RoomService>(RoomService);
    roomServiceHelper = module.get<RoomServiceHelper>(RoomServiceHelper);
    roomModel = module.get<RoomModel>(getModelToken(Room.name));
  });

  it('It should be defined', () => {
    expect(roomService).toBeDefined();
    expect(roomServiceHelper).toBeDefined();
    expect(roomModel).toBeDefined();
  });
  describe('Create Many', () => {
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
      mockRoomModel.select.mockReturnThis();
      mockRoomModel.lean.mockRejectedValueOnce(new Error(''));

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
      /*  mockRoomModel.find.mockReturnThis();
      mockRoomModel.populate.mockResolvedValue(mockPopulatedRoom);
 */
      jest.spyOn(roomModel, 'find').mockReturnThis();
      jest.spyOn(roomModel, 'populate').mockRejectedValueOnce(new Error(''));

      /* try {
        await roomService.findAllOverview();
      } catch (error) {
        expect(error).toEqual('Error while retrieving the rooms data');
      }
       */

      await expect(() => roomService.findAllOverview()).rejects.toThrow(
        'Error while retrieving the rooms data',
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
});
