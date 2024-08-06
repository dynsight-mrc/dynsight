import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { OrganizationService } from '../../organization/services/organization.service';
import mongoose, { Connection } from 'mongoose';
import { RoomService } from '@modules/room/services/room.service';
import { InjectConnection } from '@nestjs/mongoose';
import { BuildingService } from '@modules/building/services/building.service';
import { FloorService } from '@modules/floor/services/floor.service';
import { UserService } from '@modules/user/services/user.service';
import { ReadAccountDto } from '../dto/read-account.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly buildingService: BuildingService,
    private readonly roomService: RoomService,
    private readonly floorService: FloorService,
    private readonly userService: UserService,
    @InjectConnection() private connection: Connection,
  ) {}
  async create(createAccountDto: CreateAccountDto): Promise<ReadAccountDto> {
    let { organization, building, location, floors, blocs, users } =
      createAccountDto;
    
    const session = await this.connection.startSession();
    session.startTransaction();
    
    try {
      const organizationDoc = await this.organizationService.create(
        organization,
        session,
      );
  
      //create building
      let buildingDoc = await this.buildingService.create(
        {
          ...building,
          address: location,
          organizationId: new mongoose.Types.ObjectId(organizationDoc.id),
          //organizationId: new mongoose.Types.ObjectId("668d5b6dcea37fd8147083ce"),
        },
        session,
      );

      //create floors
      const floorsDocs = await this.floorService.createMany(
        {
          organizationId: new mongoose.Types.ObjectId(organizationDoc.id),
          buildingId: new mongoose.Types.ObjectId(buildingDoc.id),
          ...floors,
        },
        session,
      );
        
      //create blocs

      const blocsDocs = await this.roomService.createMany(
        blocs,
        floorsDocs,
        buildingDoc.id,
        organizationDoc.id,
        session,
      );

      //create users
      const usersDocs = await this.userService.createMany(
        users,
        buildingDoc.id,
        organizationDoc.id,
        session,
      );
        
        
      await session.commitTransaction();

      return {
        organization: organizationDoc,
        building: buildingDoc,
        floors: floorsDocs,
        blocs: blocsDocs,
        users: usersDocs,
      };
    } catch (error) {
      await session.abortTransaction();

      if (error.code === 409) {

        throw new HttpException(
          `Erreur s'est produite lors de la création du compte, ${error.message}`,
          HttpStatus.CONFLICT,
        );
      }

      //throw new Error("Transaction aborted due to an error:")
      throw new HttpException(
        `Erreur s'est produite lors de la création du compte, ${error.message} ,veuillez réessayer !`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}