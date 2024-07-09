import { IsString } from "class-validator";

export type Gender = 'Male' | 'Female';
export type UserRole = 'Root' | 'Admin' | 'User';

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
};
export type ProfileInformationDto = {
  picture: string;
};
export type PreferencesDto = {
  language: string;
  theme: string;
};

