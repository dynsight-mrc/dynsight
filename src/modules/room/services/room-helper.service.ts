import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomModel } from '../models/room.model';
import { CreateRoomsDto } from '../dtos/create-rooms.dto';
import mongoose, { Types } from 'mongoose';
import { CreateRoomDtoV2 } from '../dtos/create-room.dto';
import { Floor } from 'src/modules/floor/models/floor.model';
import {
  CreateFloorDto,
  CreateFloorsDto,
} from '@modules/floor/dtos/create-floors.dto';
import { ReadRoomOverview } from '../dtos/read-room-dto';

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
  checkAllRoomsFieldsHasSameLength(roomsData: CreateRoomsDto) {
    let { name, floors, type, surface } = roomsData;

    return [name.length, floors.length, type.length, surface.length]
      .map((val, index, arr) => val === arr[0])
      .reduce((acc, val) => acc && val, true);
  }

  formatRoomsRawData(
    roomsData: CreateRoomsDto,
    floorsDocs: CreateFloorDto[],
    buildingId: Types.ObjectId,
    organizationId: Types.ObjectId,
  ): CreateRoomDtoV2[] {
    let { name, floors, type, surface } = roomsData;
    
    
    if (!this.checkAllRoomsFieldsHasSameLength(roomsData)) {
      
      
      throw new Error('Inadéquation des valeurs des blocs');
    }
    //CHECK IF THERE IS NO DOUBLE NAME VALUES
    if (Array.from(new Set(name)).length !== name.length) {
      throw new Error('Noms des blocs doivent etre uniques');
    }

    //CHECK IF CREATED FLOORS PROVIDED HAS INCLUDES NAMES FROM THE BLOCS ASSOCIATED FLOORS
    if (
      !floors
        .map((ele) => floorsDocs.map((ele) => ele.name).includes(ele))
        .every((ele) => ele === true)
    ) {
      
      
      throw new Error("erreur lors du mappage des identifiants d'étages");
    }

    return name.map((ele, index) => ({
      name: ele,
      organizationId: new mongoose.Types.ObjectId(organizationId),
      buildingId: new mongoose.Types.ObjectId(buildingId),
      floorId: new mongoose.Types.ObjectId(
        floorsDocs.find((ele) => ele.name === floors[index]).id,
      ),
      ...(type[index] && { type: type[index] }),
      ...(surface[index] && { surface: surface[index] }),
    }));
  }
  async forEachAsync(arr: any[], fn: any) {
    return arr.reduce(
      (promise, val) => promise.then(() => fn(val)),
      Promise.resolve(),
    );
  }
  replaceRoomFieldsWithId=(room:Room):ReadRoomOverview=>{
    let _room = room.toJSON()
    
    _room.floor = _room.floorId
    _room.building = _room.buildingId
    _room.organization = _room.organizationId
    delete _room.floorId
    delete _room.buildingId
    delete _room.organizationId

    return _room as undefined as ReadRoomOverview
  }
}
