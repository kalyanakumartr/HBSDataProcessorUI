import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';
import { Media } from './media.model';

export class UserModel extends AuthModel {
  id: number;
  userName: string;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  roles: number[];
  occupation: string;
  companyName: string;
  dateOfJoin:string;
  dob:string;
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
  firstname: string;
  lastname: string;
  mediaList:Media[];
  language: string;
  timeZone: string;
  uniqueId:string;
  // email settings
  emailSettings: {
    emailNotification: boolean,
    sendCopyToPersonalEmail: boolean,
    activityRelatesEmail: {
      youHaveNewNotifications: boolean,
      youAreSentADirectMessage: boolean,
      someoneAddsYouAsAsAConnection: boolean,
      uponNewOrder: boolean,
      newMembershipApproval: boolean,
      memberRegistration: boolean
    },
    updatesFromKeenthemes: {
      newsAboutKeenthemesProductsAndFeatureUpdates: boolean,
      tipsOnGettingMoreOutOfKeen: boolean,
      thingsYouMissedSindeYouLastLoggedIntoKeen: boolean,
      newsAboutMetronicOnPartnerProductsAndOtherServices: boolean,
      tipsOnMetronicBusinessProducts: boolean
    }
  };

  setUser(user: any) {
    this.id = user.id;
    this.userName = user.userName || '';
    this.password = user.password || '';
    this.fullname = user.userName || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.roles = user.roles || [];
    this.occupation = user.occupation || '';
    this.companyName = user.companyName || '';
    this.phone = user.phone || '';
    this.address = user.address;
    this.socialNetworks = user.socialNetworks;
  }
}
