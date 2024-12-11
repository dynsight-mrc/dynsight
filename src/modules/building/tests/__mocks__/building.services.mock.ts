export let mockRequestSharedService = {
  formatQueryParamsArrayToMongoFilterObject: jest.fn(),
};

export const mockFloorService = {
  findOneWithRooms:jest.fn(),
  findByBuildingId: jest.fn(),
  createMany: jest.fn(),

};
export const mockFloorSharedService = {
  formatFloorsRawData:jest.fn(),
  createMany:jest.fn()
};
export const mockRoomSharedService = {
  findMany: jest.fn(),
  createMany:jest.fn(),
  formatRoomsRawData:jest.fn(),
  findManyWithDetails:jest.fn()
};
export const mockBuildingSharedService = {
  createOne:jest.fn(),
  findOneWithFloorsDetails:jest.fn(),
  findOneById:jest.fn(),
  findOneByIdWithDetails:jest.fn(),
  findAll:jest.fn(),
  findMany:jest.fn(),
  findManyWithFloorsDetails:jest.fn(),
};

export const mockRoomService = {
  findByFloorId: jest.fn(),
  createMany: jest.fn(),

};
export const mockBuildingService = {
  findOne: jest.fn(),
  createOneWithFloorsDetails:jest.fn()
  
};

export const mockBuildingsService = {
  findOne: jest.fn(),
  
findAllWithDetails:jest.fn(),
findManyWithDetails:jest.fn()
};
