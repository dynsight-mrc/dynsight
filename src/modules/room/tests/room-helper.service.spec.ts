import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RoomServiceHelper } from '../services/room-helper.service';
import { Room, RoomModel } from '../models/room.model';
import mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import { Floor } from 'src/modules/floor/models/floor.model';

describe('Blocs Service Helper', () => {
  let mockRoomModel = {};
  let roomServiceHelper: RoomServiceHelper;
  let roomModel: RoomModel;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomServiceHelper,
        { provide: getModelToken(Room.name), useValue: mockRoomModel },
      ],
    }).compile();
    roomServiceHelper = module.get<RoomServiceHelper>(RoomServiceHelper);
    roomModel = module.get<RoomModel>(getModelToken(Room.name));
  });

  it('It should be defined', () => {
    expect(roomServiceHelper).toBeDefined();
    expect(roomModel).toBeDefined();
  });
  describe('formatRoomsRawData', () => {
    it('should throw error if raw data legnth is not identical', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();

      let createRoomsDto = {
        name: ['bloc 1', 'bloc 1'],
        type: ['office'],
        surface: [12, 43],
        floors: ['etage 1s', 'etage 3s'],
      };
      let mockFloorsDocs = [
        {
          name: 'bloc 1',
          number: 1,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
        {
          name: 'bloc 2',
          number: 2,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
      ] as unknown as Floor[];

      expect(() =>
        roomServiceHelper.formatRoomsRawData(
          createRoomsDto,
          mockFloorsDocs,
          mockBuildingId,
          mockOrganizationId,
        ),
      ).toThrow('Inadéquation des valeurs');
    });
    it('should throw error if blocs names have double values', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();

      let createRoomsDto = {
        name: ['bloc 1', 'bloc 1'],
        type: ['office', 'office 2'],
        surface: [12, 43],
        floors: ['etage 1s', 'etage 3s'],
      };
      let mockFloorsDocs = [
        {
          name: 'bloc 1',
          number: 1,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
        {
          name: 'bloc 2',
          number: 2,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
      ] as unknown as Floor[];

      expect(() =>
        roomServiceHelper.formatRoomsRawData(
          createRoomsDto,
          mockFloorsDocs,
          mockBuildingId,
          mockOrganizationId,
        ),
      ).toThrow('Noms des blocs doivent etre uniques');
    });
    it('should throw error if blocs names have double values', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();

      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12, 43],
        floors: ['etage 1s', 'etage 3s'],
      };
      let mockFloorsDocs = [
        {
          name: 'bloc 11',
          number: 1,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
        {
          name: 'bloc 2',
          number: 2,
          buildingId: mockBuildingId,
          organizationId: mockOrganizationId,
        },
      ] as unknown as Floor[];

      expect(() =>
        roomServiceHelper.formatRoomsRawData(
          createRoomsDto,
          mockFloorsDocs,
          mockBuildingId,
          mockOrganizationId,
        ),
      ).toThrow("erreur lors du mappage des identifiants d'étages");
    });
    it('should create list of blocs object ready to save in db', async () => {
      let mockOrganizationId = new mongoose.Types.ObjectId();
      let mockBuildingId = new mongoose.Types.ObjectId();

      let createRoomsDto = {
        name: ['bloc 1', 'bloc 2'],
        type: ['office', 'office 2'],
        surface: [12, 43],
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

      let mockedReturnedBlocs = roomServiceHelper.formatRoomsRawData(
        createRoomsDto,
        mockFloorsDocs,
        mockBuildingId,
        mockOrganizationId,
      );
      expect(mockedReturnedBlocs).toBeDefined();
      expect(mockedReturnedBlocs[0]).toEqual({
        name: createRoomsDto.name[0],
        organizationId: mockOrganizationId,
        buildingId: mockBuildingId,
        floorId: mockFloorsDocs[0].id,
        surface: createRoomsDto.surface[0],
        type: createRoomsDto.type[0],
      });
      expect(mockedReturnedBlocs[1]).toEqual({
        name: createRoomsDto.name[1],
        organizationId: mockOrganizationId,
        buildingId: mockBuildingId,
        floorId: mockFloorsDocs[1].id,
        surface: createRoomsDto.surface[1],
        type: createRoomsDto.type[1],
      });
    });
  });
});
