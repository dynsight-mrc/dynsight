import { Types } from 'mongoose';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}
export type UserRole =
  | 'root'
  | 'admin'
  | 'organization-owner'
  | 'company-occupant'
  | 'facility-manager'
  | 'property-manager'
  | 'asset-manager'
  | 'installer';
  
export enum UserRoleMap {
  'root' = 'Root',
  'admin' = 'Admin',
  'organization-owner' = 'Organization Owner',
  'company-occupant' = 'Company Occupant',
  'facility-manager' = 'Facility Manager',
  'property-manager' = 'Property Manager',
  'asset-manager' = 'Asset Manager',
  'installer' = 'Installer',
}

export type PersonalInformationDto = {
  firstName: string;
  lastName: string;
  gender?: Gender;
  deteOfBirth?: string;
};
export type ContactInformationDto = {
  address?: string;
  phone?: string;
  email: string;
};
export type AuthenticationDto = {
  username: string;
  password: string;
};
export type PermissionsDto = {
  role: UserRole | string;
  organizationId?: Types.ObjectId;
  buildingId?: Types.ObjectId;
  floorId?: Types.ObjectId;
};
export type ProfileInformationDto = {
  picture?: string;
};
export type PreferencesDto = {
  language?: string;
  theme?: string;
};
