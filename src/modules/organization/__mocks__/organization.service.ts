export const organizationServiceMock = jest.fn().mockImplementation(()=>({
    findAll:jest.fn().mockResolvedValue(["room1","room2"])
    
}))