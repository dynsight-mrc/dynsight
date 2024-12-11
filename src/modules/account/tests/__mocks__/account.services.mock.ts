export const mockConnection = {
  
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    endSession: jest.fn(),
  
};
export const mockAccountService = {
  create:jest.fn()
}
export const mockOrganizationService = {
  create: jest.fn(),
};
export const mockBuildingService = {
  create: jest.fn(),
};
export const mockFloorService = {
  createMany: jest.fn(),
};
export const mockRoomService = {
  createMany: jest.fn(),
};
export const mockUserService = {
  createMany: jest.fn(),
};

export const mockOrganizationSharedService = {
  createOne:jest.fn()
};
export const mockBuildingSharedService = {
  createOne:jest.fn()
};
export const mockFloorSharedService = {
  createMany:jest.fn(),
  formatFloorsRawData:jest.fn()
};
export const mockRoomSharedService = {
  formatRoomsRawData:jest.fn(),
  createMany:jest.fn()
};
export const mockUserSharedService = {
  createMany:jest.fn()
};