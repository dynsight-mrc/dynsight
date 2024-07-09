import { IsString } from "class-validator";
import { Types } from "mongoose";

export type Gender = 'Male' | 'Female';
export type UserRole = 'Root' | 'Admin' | 'OO'|'CO'|'FM'|'PM'|'AM';

export type PersonalInformationDto = {
  firstName: string;
  lastName: string;
  gender: Gender;
  deteOfBirth: string;
};
export type ContactInformationDto = {
  address: string;
  phone: string;
  email: string;
};
export type AuthenticationDto = {
  username: string;
  password: string;
};
export type PermissionsDto = {
  role: UserRole;
  orgnizationId:Types.ObjectId
  buildingId:Types.ObjectId
  floorId:Types.ObjectId
};
export type ProfileInformationDto = {
  picture: string;
};
export type PreferencesDto = {
  language: string;
  theme: string;
};

