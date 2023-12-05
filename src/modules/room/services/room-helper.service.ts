import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomModel } from '../models/room.model';

@Injectable()
export class RoomServiceHelper {
  constructor(@InjectModel(Room.name) private readonly roomModel: RoomModel) {}

  async checkIfRoomExists(roomId: string): Promise<Room> {
    try {
      let room = await this.roomModel.findById(roomId);
      return room;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
