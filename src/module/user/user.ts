import { genSaltSync, hashSync } from "bcryptjs";



export interface IUser {
  userid: number;
  usercode: string;
  username: string;
  password: string;
  useflag: number;
  usertype: number;
  creater: string;
  createdAt: Date;
  updater: string;
  updatedAt: Date;
  del_uuid:number;
  deletedAt:Date;
  deleter:string;
  systemConfigHeadId:number;
}

export interface IUserNotPassword extends Omit<IUser, 'password'>{
  userid: number;
  usercode: string;
  username: string;
  useflag: number;
  usertype: number;
  creater: string;
  createdAt: Date;
  updater: string;
  updatedAt: Date;
  del_uuid:number;
  deletedAt:Date;
  deleter:string;
  systemConfigHeadId:number;
}

export class User implements IUser {
  userid: number;
  usercode: string;
  username: string;
  password: string;
  useflag: number;
  usertype: number;
  creater: string;
  createdAt: Date;
  updater: string;
  updatedAt: Date;
  del_uuid:number;
  deletedAt:Date;
  deleter:string;
  systemConfigHeadId:number;

  public passwordHash(){
    this.password = hashSync(this.password, genSaltSync(10));
  }

}