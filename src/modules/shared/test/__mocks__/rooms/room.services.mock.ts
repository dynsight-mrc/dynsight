export let mockRoomService = {
  findOneById: jest.fn(),
  findOneByIdWithDetails: jest.fn(),
};

export let mockRoomsService = {
  findAll: jest.fn(),
  findAlllWithDetails: jest.fn(),
  createMany: jest.fn(),
};

export let mockRoomSharedService = {
  findMany: jest.fn(),
  findManyWithDetails: jest.fn(),
  formatRoomsRawData:jest.fn(),
  createMany:jest.fn()
};

export let mockRequestSharedService = {
  formatQueryParamsArrayToMongoFilterObject: jest.fn(),
};

export let mockFloorSharedService = {
  findOneByFields:jest.fn()
};
export let mockBuildingSharedService = {
  findOneById:jest.fn()
};