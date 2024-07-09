import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RoomServiceHelper } from '../services/room-helper.service';
import { Room, RoomModel } from '../models/room.model';
import { RoomService } from '../services/room.service';
import mongoose from 'mongoose';
import { Floor } from 'src/modules/floor/models/floor.model';

describe('Blocs Service Helper', () => {
  let mockRoomModel = {
    insertMany: jest.fn(),
  };
  let roomServiceHelper: RoomServiceHelper;
  let roomService: RoomService;
  let roomModel: RoomModel;
  beforeEach(async () => {
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
    it('should throw error if createRoomsData is inconveniet', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();

      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12],
        floors: ['etage 1s', 'etage 3s'],
      };
      let mockFloorsDocs = [
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
      ] as unknown as Floor[];
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
    it('should return a list of created blocs', async () => {
      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12, 12],
        floors: ['etage 1s', 'etage 3s'],
      };

      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();
      let mockFloorsDocs = [
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
      ] as unknown as Floor[];
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
      expect(createdRooms).toEqual(mockReturnedRooms );
    });
  });
});
