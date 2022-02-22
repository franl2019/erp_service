import { HttpException, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { JWT_CONFIG } from "src/config/jwt";
import { User } from "../user/user";
import { RegisterDto } from "./dto/register.dto";
import { AddUserOperateAreaMxDto } from "../userOperateAreaMx/dto/addUserOperateAreaMx.dto";
import { AddOperateAreaDto } from "../operateArea/dto/addOperateArea.dto";
import { UserSql } from "../user/user.sql";
import { UserOperateAreaMxSql } from "../userOperateAreaMx/userOperateAreaMx.sql";
import { OperateareaSql } from "../operateArea/operatearea.sql";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class AuthService {
  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly usersService: UserService,
    private readonly userSql: UserSql,
    private readonly userOperateAreaMxSql: UserOperateAreaMxSql,
    private readonly operateareaSql: OperateareaSql
  ) {
  }

  async login(usercode: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(usercode);
    if (user && compareSync(password, user.password)) {
      return sign({
        userid: user.userid
      }, JWT_CONFIG.SECRET_KEY, { expiresIn: "7D" });
    } else {
      return Promise.reject(new HttpException("密码错误", 500));
    }
  }

  async register(register: RegisterDto): Promise<any> {
    return this.mysqldbAls.sqlTransaction(async () => {

      //创建用户
      const user = new User();
      user.userid = 0;
      user.usercode = register.usercode;
      user.username = register.username;
      user.password = register.password;
      user.useflag = 1;
      user.usertype = 3;
      user.creater = "admin";
      user.createdAt = new Date();
      user.passwordHash();
      const createRes_user = await this.userSql.createUser(user);

      //创建属于该用户自己的操作区域
      const addDto_operateArea = new AddOperateAreaDto();
      addDto_operateArea.operateareaname = register.username;
      addDto_operateArea.operateareatype = 0;
      addDto_operateArea.useflag = 1;
      addDto_operateArea.creater = register.username;
      addDto_operateArea.createdAt = new Date();
      const createRes_operateArea = await this.operateareaSql.add(addDto_operateArea);

      //为用户添加自己操作区域权限
      const addDto_userOperateAreaMx = new AddUserOperateAreaMxDto();
      addDto_userOperateAreaMx.userid = createRes_user.insertId;
      addDto_userOperateAreaMx.operateareaid = createRes_operateArea.insertId;
      addDto_userOperateAreaMx.userflag = 1;
      addDto_userOperateAreaMx.creater = register.username;
      await this.userOperateAreaMxSql.add(addDto_userOperateAreaMx);

      //为用户添加客户公共的操作区域
      const ClientPublicOperateArea = await this.operateareaSql.getClientPublicOperateArea();
      const addDto_PublicClientOperateAreaMx = new AddUserOperateAreaMxDto();
      addDto_PublicClientOperateAreaMx.userid = createRes_user.insertId;
      addDto_PublicClientOperateAreaMx.operateareaid = ClientPublicOperateArea.operateareaid;
      addDto_PublicClientOperateAreaMx.userflag = 0;
      addDto_PublicClientOperateAreaMx.creater = register.username;
      await this.userOperateAreaMxSql.add(addDto_PublicClientOperateAreaMx);

      //为用户添加供应商公共的操作区域
      const BuyPublicOperateArea = await this.operateareaSql.getBuyPublicOperateArea();
      const addDto_PublicBuyOperateAreaMx = new AddUserOperateAreaMxDto();
      addDto_PublicBuyOperateAreaMx.userid = createRes_user.insertId;
      addDto_PublicBuyOperateAreaMx.operateareaid = BuyPublicOperateArea.operateareaid;
      addDto_PublicBuyOperateAreaMx.userflag = 0;
      addDto_PublicBuyOperateAreaMx.creater = register.username;
      await this.userOperateAreaMxSql.add(addDto_PublicBuyOperateAreaMx);

    });

  }


}