import { genSaltSync, hashSync } from "bcryptjs";



interface IUser {
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
}

export interface IUserNotPassword {
  userid: number;
  usercode: string;
  username: string;
  useflag: number;
  usertype: number;
  creater: string;
  createdAt: Date;
  updater: string;
  updatedAt: Date;
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

  public passwordHash(){
    this.password = hashSync(this.password, genSaltSync(10));
  }

}