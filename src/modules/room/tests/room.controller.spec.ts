import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../services/room.service';
import { RoomController } from '../controllers/room.controller';


describe('UserController', () => {
  let roomController: RoomController;
  let mockRoomService={}
  let roomService:RoomService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [{provide:RoomService,useValue:mockRoomService}],
    }).compile();

    roomController = module.get<RoomController>(RoomController);
    roomService = module.get<RoomService>(RoomService)
  });

  it('should be defined', () => {
    expect(roomService).toBeDefined();
  });
  describe('findAllOverview', () => { 
    it.todo('should return a list of rooms')
   })
});
