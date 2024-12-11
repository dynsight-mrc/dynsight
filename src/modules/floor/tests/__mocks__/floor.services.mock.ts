export let mockRequestSharedService = {
  formatQueryParamsArrayToMongoFilterObject: jest.fn(),
};
export const mockFloorService = {
  findOneWithRooms:jest.fn(),

};
export const mockFloorsService = {
  findManyWithRooms:jest.fn(),
  findMany:jest.fn(),
  findAllWithDetails:jest.fn(),
  findAll:jest.fn(),
  createManyWithRooms:jest.fn()
};
export const mockFloorSharedService = {
  findByBuildingId: jest.fn(),
  createMany: jest.fn(),
  formatFloorsRawData:jest.fn(),
  findManyWithDetails:jest.fn()
};
export  const mockRoomSharedService = {
  findByFloorId: jest.fn(),
  createMany: jest.fn(),
  findMany:jest.fn()

};
export const mockBuildingSharedService = {};

export const mockRoomService = {
  findByFloorId: jest.fn(),
  createMany: jest.fn(),
};
export const mockBuildingService = {
  findOne: jest.fn(),
};
