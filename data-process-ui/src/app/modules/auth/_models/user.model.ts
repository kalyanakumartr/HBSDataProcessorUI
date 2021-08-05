import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';
import { Media } from './media.model';
import { BaseModel } from 'src/app/_metronic/shared/crud-table';
import { Producer } from './producer.model';
import { Country } from './country.model';

export class UserModel implements BaseModel {
  id: string;
  userName: string;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  roles: number[];
  occupation: string;
  companyName: string;
  dateOfJoin:string;
  dob:any;
  phone: string;
  employeeId:string;
  fatherName:string;
  sex:string;
  userId:string;
  userImage:string;
  userStatus:string;
  userType:string;
  producerId:string;
  producerName:string;
  parentProducerId:string;
  parentProducerName:string;

  address?: AddressModel;
  socialNetworks?: SocialNetworksModel;
  // personal information
  firstName: string;
  lastName: string;
  mediaList:Media[];
  language: string;
  timeZone: string;
  uniqueId:string;
  producer: Producer;
  country: Country;
  // email settings



}
