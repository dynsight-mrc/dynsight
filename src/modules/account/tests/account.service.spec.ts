import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../services/account.service';

import mongoose, { Connection, connection, mongo } from 'mongoose';
import { MongodbModule } from '../../../common/databaseConnections/mongodb.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { OrganizationSharedService } from '@modules/shared/services/organization.shared.service';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { UserSharedService } from '@modules/shared/services/user.shared.service';
import {
  mockBuildingSharedService,
  mockConnection,
  mockFloorSharedService,
  mockOrganizationSharedService,
  mockRoomSharedService,
  mockUserSharedService,
} from './__mocks__/account.services.mock';
import {
  mockBuildingDoc,
  mockCreateAccountAttrs,
  mockFloorsDocs,
  mockOrganizationDoc,
  mockRoomsDocs,
  mockUserDocs,
} from './__mocks__/account.docs.mock';

describe('AccountService', () => {
  let accoutService: AccountService;
  let userShareService: UserSharedService;
  let roomSharedService: RoomSharedService;
  let floorSharedService: FloorSharedService;
  let buildingSharedService: BuildingSharedService;
  let organizationSharedService: OrganizationSharedService;

 beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongodbModule],
      providers: [
        AccountService,
        {
          provide: OrganizationSharedService,
          useValue: mockOrganizationSharedService,
        },
        { provide: BuildingSharedService, useValue: mockBuildingSharedService },
        { provide: FloorSharedService, useValue: mockFloorSharedService },
        { provide: RoomSharedService, useValue: mockRoomSharedService },
        { provide: UserSharedService, useValue: mockUserSharedService },
        {
          provide: getConnectionToken('Database'),
          useValue: { startSession: async () => mockConnection },
        },
      ],
    })
      .overrideProvider(getConnectionToken)
      .useValue({})
      .compile();

    accoutService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(accoutService).toBeDefined();
  });

  describe('create', () => {
    it('should throws error if organizationSharedService createone throws error', async () => {
      mockOrganizationSharedService.createOne.mockRejectedValueOnce(
        Error('Failed to create organization'),
      );

      try {
        await accoutService.create(mockCreateAccountAttrs);
      } catch (error) {
        expect(error.message).toBe('Failed to create organization');
        expect(mockConnection.abortTransaction).toHaveBeenCalled();
      }
    });
    it('should throw error if floorSharedService --  createMany throws error', async () => {
      mockOrganizationSharedService.createOne.mockResolvedValueOnce(
        mockOrganizationDoc,
      );
      mockBuildingSharedService.createOne.mockRejectedValueOnce(
        Error('Failed to create building'),
      );
      try {
        await accoutService.create(mockCreateAccountAttrs);
      } catch (error) {
        expect(mockOrganizationSharedService.createOne).toHaveBeenCalled();
        expect(error.message).toBe('Failed to create building');
        expect(mockConnection.abortTransaction).toHaveBeenCalled();
      }
    });
    it('Should throw error if floorSharedService - crateMany throws error', async () => {
      let formatedFloors = JSON.parse(JSON.stringify(mockFloorsDocs));
      formatedFloors = formatedFloors.map((ele) => {
        delete ele.id;
        return ele;
      });
      mockOrganizationSharedService.createOne.mockResolvedValueOnce(
        mockOrganizationDoc,
      );
      mockBuildingSharedService.createOne.mockResolvedValueOnce(
        mockBuildingDoc,
      );
      mockFloorSharedService.formatFloorsRawData.mockReturnValueOnce(
        formatedFloors,
      );
      mockFloorSharedService.createMany.mockRejectedValueOnce(
        Error('Failed to create floors'),
      );
      try {
        await accoutService.create(mockCreateAccountAttrs);
      } catch (error) {
        expect(mockOrganizationSharedService.createOne).toHaveBeenCalled();
        expect(mockBuildingSharedService.createOne).toHaveBeenCalled();
        expect(mockFloorSharedService.formatFloorsRawData).toHaveBeenCalled();
        expect(mockConnection.abortTransaction).toHaveBeenCalled();

        expect(error.message).toBe('Failed to create floors');
      }
    });
    it('should throws error if roomSharedService createMany throws error', async () => {
      let formatedFloors = JSON.parse(JSON.stringify(mockFloorsDocs));
      formatedFloors = formatedFloors.map((ele) => {
        delete ele.id;
        return ele;
      });
      let formatedRooms = JSON.parse(JSON.stringify(mockRoomsDocs));
      formatedRooms = formatedRooms.map((ele) => {
        delete ele.id;
        return ele;
      });
      mockOrganizationSharedService.createOne.mockResolvedValueOnce(
        mockOrganizationDoc,
      );
      mockBuildingSharedService.createOne.mockResolvedValueOnce(
        mockBuildingDoc,
      );
      mockFloorSharedService.formatFloorsRawData.mockReturnValueOnce(
        formatedFloors,
      );
      mockFloorSharedService.createMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomSharedService.formatRoomsRawData.mockResolvedValueOnce(
        formatedRooms,
      );
      mockRoomSharedService.createMany.mockRejectedValueOnce(
        Error('Failed to create Rooms'),
      );
      try {
        await accoutService.create(mockCreateAccountAttrs);
      } catch (error) {
        expect(mockOrganizationSharedService.createOne).toHaveBeenCalled();
        expect(mockBuildingSharedService.createOne).toHaveBeenCalled();
        expect(mockFloorSharedService.formatFloorsRawData).toHaveBeenCalled();

        expect(mockConnection.abortTransaction).toHaveBeenCalled();

        expect(error.message).toBe('Failed to create Rooms');
      }
    });
    it('should throws error if userSharedService createMany throws error', async () => {
      let formatedFloors = JSON.parse(JSON.stringify(mockFloorsDocs));
      formatedFloors = formatedFloors.map((ele) => {
        delete ele.id;
        return ele;
      });
      let formatedRooms = JSON.parse(JSON.stringify(mockRoomsDocs));
      formatedRooms = formatedRooms.map((ele) => {
        delete ele.id;
        return ele;
      });
      mockOrganizationSharedService.createOne.mockResolvedValueOnce(
        mockOrganizationDoc,
      );
      mockBuildingSharedService.createOne.mockResolvedValueOnce(
        mockBuildingDoc,
      );
      mockFloorSharedService.formatFloorsRawData.mockReturnValueOnce(
        formatedFloors,
      );
      mockFloorSharedService.createMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomSharedService.formatRoomsRawData.mockResolvedValueOnce(
        formatedRooms,
      );
      mockRoomSharedService.createMany.mockResolvedValueOnce(mockRoomsDocs);
      mockUserSharedService.createMany.mockRejectedValueOnce(
        Error('Failed to create users'),
      );
      try {
        await accoutService.create(mockCreateAccountAttrs);
      } catch (error) {
        expect(mockOrganizationSharedService.createOne).toHaveBeenCalled();
        expect(mockBuildingSharedService.createOne).toHaveBeenCalled();
        expect(mockFloorSharedService.formatFloorsRawData).toHaveBeenCalled();
        expect(mockRoomSharedService.formatRoomsRawData).toHaveBeenCalled();
        expect(mockRoomSharedService.createMany).toHaveBeenCalled();
        expect(mockConnection.abortTransaction).toHaveBeenCalled();

        expect(error.message).toBe('Failed to create users');
      }
    });
    it('should return the created entities', async () => {
      let formatedFloors = JSON.parse(JSON.stringify(mockFloorsDocs));
      formatedFloors = formatedFloors.map((ele) => {
        delete ele.id;
        return ele;
      });
      let formatedRooms = JSON.parse(JSON.stringify(mockRoomsDocs));
      formatedRooms = formatedRooms.map((ele) => {
        delete ele.id;
        return ele;
      });
      mockOrganizationSharedService.createOne.mockResolvedValueOnce(
        mockOrganizationDoc,
      );
      mockBuildingSharedService.createOne.mockResolvedValueOnce(
        mockBuildingDoc,
      );
      mockFloorSharedService.formatFloorsRawData.mockReturnValueOnce(
        formatedFloors,
      );
      mockFloorSharedService.createMany.mockResolvedValueOnce(mockFloorsDocs);
      mockRoomSharedService.formatRoomsRawData.mockResolvedValueOnce(
        formatedRooms,
      );
      mockRoomSharedService.createMany.mockResolvedValueOnce(mockRoomsDocs);
      mockUserSharedService.createMany.mockResolvedValueOnce(mockUserDocs);

      let results = await accoutService.create(mockCreateAccountAttrs);
      expect(mockConnection.commitTransaction).toHaveBeenCalled()
      expect(mockConnection.endSession).toHaveBeenCalled()
       expect(results).toEqual({
        building:expect.anything(),
        organization:expect.anything(),
        floors:expect.anything(),
        rooms:expect.anything(),
        users:expect.anything(),
       })
    });
  });

  afterEach(() => {
    mockOrganizationSharedService.createOne.mockReset();
    mockBuildingSharedService.createOne.mockReset();
    mockFloorSharedService.createMany.mockReset();
    mockRoomSharedService.createMany.mockReset();
  });
});
