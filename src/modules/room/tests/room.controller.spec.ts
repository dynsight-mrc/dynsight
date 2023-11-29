import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from '../controllers/room.controller';
import { RoomStub } from './stubs/room.stub';
import { RoomService } from '../services/room.service';
import { mockRoomService } from '../__mocks__/room.service';
import mongoose from 'mongoose';

describe('RoomController', () => {
  let roomController: RoomController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [{ provide: RoomService, useValue: mockRoomService }],
    }).compile();
    roomController = module.get<RoomController>(RoomController);
  });

  it('should be defined', () => {
    expect(roomController).toBeDefined();
  });

  /*  describe('Create ',async()=>{

  })*/
  describe('findOne', () => {
    it('should return the requested room', async () => {
      let room = {
        name: 'room_1',
        floor: new mongoose.Types.ObjectId().toHexString(),

        building: new mongoose.Types.ObjectId().toHexString(),

        organization: new mongoose.Types.ObjectId().toHexString(),
      };
      let createdRoom = RoomStub(room);
      const result = await roomController.findOne(createdRoom.id);
      expect(result.id).toEqual(createdRoom.id);
    });
  });
  describe('findAll', () => {
    it('should return an array of ReadRoomDto', async () => {
      const result = await roomController.findAll();
     // expect(result).toEqual([RoomStub()]);
    });
  });

  describe('create', () => {

    it('should return the created room', async () => {
      let room = {
        name: 'room_1',
        floor: new mongoose.Types.ObjectId().toHexString(),

        building: new mongoose.Types.ObjectId().toHexString(),

        organization: new mongoose.Types.ObjectId().toHexString(),
      };

      const result = await roomController.create(room);
      expect(result.id).toBeDefined();
      expect(result.properties).toEqual([]);
    });
  });
  /*   describe('delete',async()=>{
      
  })
  describe('updateProperties',async()=>{
      
  }) */

  /* afterAll(async () => {
      await closeInMongodConnection()
  }) */
});
