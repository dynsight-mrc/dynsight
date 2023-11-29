import mongoose from 'mongoose';

export const RoomStub = (room: {
  name: string;
  floor?: string;
  building?: string;
  organization?: string;
}) => {
  return {
    id: new mongoose.Types.ObjectId().toHexString(),
    name: room.name,

    floor: room.floor ? room.floor : new mongoose.Types.ObjectId(),

    building: room.building ? room.building  : new mongoose.Types.ObjectId(),

    organization: room.organization ? room.organization : new mongoose.Types.ObjectId() ,

    properties: [],
  };
};
