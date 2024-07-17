import { Room } from '../../room/models/room.model';
import { Floor } from '../../floor/models/floor.model';
import { Organization } from '../../organization/models/organization.model';
import { Building } from '../../building/models/building.model';
import { UserAccount } from '@modules/user/models/user.model';

export type CreatedAccountDto = {
    organization: Organization;
    building: Building;
    floors: Floor[];
    blocs: Room[];
    users: UserAccount[];
  };