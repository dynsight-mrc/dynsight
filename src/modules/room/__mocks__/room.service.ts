import mongoose from "mongoose";
import { RoomStub } from "../tests/stubs/room.stub";

export const mockRoomService = {
    findAll:jest.fn().mockResolvedValue(()=>{

    }),
    findOne:jest.fn().mockImplementation((id:string)=>{
        
    }),
    create:jest.fn().mockImplementation((room)=>{
        return RoomStub(room)
    }),
    update:jest.fn().mockResolvedValue(()=>{

    }),
    delete:jest.fn().mockResolvedValue("ok")
}