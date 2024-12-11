import { CreateFloorDto } from '@modules/floor/dtos/create-floors.dto';
import { CreateRoomDocumentAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import mongoose from 'mongoose';

export let mockRoomId = new mongoose.Types.ObjectId();
export let mockBuildingId = new mongoose.Types.ObjectId();
export let mockFloorId = new mongoose.Types.ObjectId();
export let mockOrganizationId = new mongoose.Types.ObjectId(
  '668e8c274bf69a2e53bf59f1',
);



export let mockFloorsDocs: CreateFloorDto[] = [
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

export let mockConnection = {
  startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    endSession: jest.fn(),
  }),
};


export const mockCreateFloorsDto = {
  name: ['étage 1', 'étage 2', 'étage 3'],
  number: [1, 2, 3],
  organizationId: new mongoose.Types.ObjectId().toString(),
  buildingId: new mongoose.Types.ObjectId().toString(),
};

export const mockCreateFloorDocumentDto = {
  name: 'étage 1',
  number: 1,
  organizationId: new mongoose.Types.ObjectId(),
  buildingId: new mongoose.Types.ObjectId(),
};