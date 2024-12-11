
export const mockBuildingSharedService={
  findManyWithFloorsDetails:jest.fn()
}
const mockBuildingService = {
  findByOrganizationId: jest.fn(),
};
const mockFloorService = {
  findByBuildingId: jest.fn(),
};
const mockRoomService = {
  findByFloorId: jest.fn(),
};

export const mockOrganizationService={
  findAll: jest.fn(),
  findAllOverview: jest.fn(),
  findById: jest.fn(),
  findOneById:jest.fn(),
  findOneByIdWithDetails:jest.fn(),
  updateOneById:jest.fn()
}
