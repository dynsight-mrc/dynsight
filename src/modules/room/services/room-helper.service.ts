import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomModel } from '../models/room.model';
import { CreateRoomsAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';

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
  checkAllRoomsFieldsHasSameLength(roomsData: CreateRoomsAttrsDto) {
    let { name, floors, type, surface } = roomsData;

    return [name.length, floors.length, type.length, surface.length]
      .map((val, index, arr) => val === arr[0])
      .reduce((acc, val) => acc && val, true);
  }


}
