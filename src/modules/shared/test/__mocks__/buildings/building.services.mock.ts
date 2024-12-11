export const mockFloorService = {
  findOneWithRooms:jest.fn(),
  findByBuildingId: jest.fn(),
  createMany: jest.fn(),

};
export const mockFloorSharedService = {
  findManyWithDetails:jest.fn()
};
export const mockRoomSharedService = {
  findMany: jest.fn(),
  findManyWithDetails:jest.fn()

};
export const mockBuildingSharedService = {
  findOneById:jest.fn(),
  findOneByIdWithDetails:jest.fn()
};

export const mockRoomService = {
  findByFloorId: jest.fn(),
  createMany: jest.fn(),

};
export const mockBuildingService = {
  findOne: jest.fn(),
};
