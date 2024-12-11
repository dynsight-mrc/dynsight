import {
  Injectable,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Room, RoomModel } from '../models/room.model';

import mongoose, { Connection } from 'mongoose';
import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import { ReadRoomDocumentWithDetails } from '@modules/shared/dto/room/read-rooms.dto';
import { ReadRoomDocumentDto } from '@modules/shared/dto/room/read-rooms.dto';
import { CreateRoomDocumentAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';



@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel,
    private readonly mongoSharedService:MongoSharedService,
    @InjectConnection() private readonly connection: Connection,

  ) {}

   /* FINDONE BY ID */
  async findOneById(id: string) :Promise<ReadRoomDocumentDto>{
    try {
      let roomDocument =  await this.roomModel
        .findOne({ _id: id })
        return roomDocument.toJSON()
    } catch (error) {
      throw new Error("Error occured while retrieving room data");
    }
  }
  async findOneByIdWithDetails(id: string):Promise<ReadRoomDocumentWithDetails> {
    let roomRefs= this.mongoSharedService.getReferenceFields(this.roomModel)
    
    try {
      let roomDocument =  await this.roomModel
        .findOne({ _id: id })
        .populate(roomRefs)
      
      let room = this.mongoSharedService.transformIdAttributes(roomDocument.toJSON())
      return room  
    } catch (error) {
      throw new Error("Error occured while retrieving room data");
    }
  }
  async createOne(createRoomAttrsDto: CreateRoomDocumentAttrsDto, session?: any) :Promise<ReadRoomDocumentDto>{
    let foundRoom = await this.roomModel.findOne({ name: createRoomAttrsDto.name });
    if (foundRoom) {
      throw new Error(
        'Room Already exist with this name'
      );
    }
    const room = this.roomModel.build({
      name: createRoomAttrsDto.name,
      floorId: new mongoose.Types.ObjectId(createRoomAttrsDto.floorId),
      buildingId: new mongoose.Types.ObjectId(createRoomAttrsDto.buildingId),
      organizationId: new mongoose.Types.ObjectId(createRoomAttrsDto.organizationId),
      //zone: createRoomAttrsDto.organization,
    });
    await room.save({ session });

    return room.toJSON();
  }
}
