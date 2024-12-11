import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Floor } from '../entities/floor.entity';
import { FloorModel } from '../models/floor.model';
import { Connection } from 'mongoose';
import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import { ReadFloorDocumentDetailsWithRoomsDto, ReadFloorDocumentWithDetailsDto } from '@modules/shared/dto/floor/read-floor.dto';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { log } from 'console';

@Injectable()
export class FloorService {
  constructor(
    @InjectModel(Floor.name) private readonly floorModel: FloorModel,
    @InjectConnection() private connection: Connection,
    private readonly mongoSharedService: MongoSharedService,
    private readonly roomSharedService:RoomSharedService,
  ) {}

  findOneWithRooms=async(
    floorId: string,
  ): Promise<ReadFloorDocumentDetailsWithRoomsDto>=> {
    try {
      let floorDoc:Floor = await this.floorModel.findById(floorId)
      .populate(this.mongoSharedService.getReferenceFields(this.floorModel));
      
      let floor =  this.mongoSharedService.transformIdAttributes(floorDoc.toJSON()) as undefined as ReadFloorDocumentWithDetailsDto;   
      
      let rooms = await this.roomSharedService.findMany({floorId:floorId})
      
      let floorsWithRoomsDetails:ReadFloorDocumentDetailsWithRoomsDto={
        ...floor,
        rooms:rooms
      }
        
      return floorsWithRoomsDetails;
    } catch (error) {
      throw new Error('Error occured while retrieving the floor data');
    }
  }
}
