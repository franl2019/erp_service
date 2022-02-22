import { Body, Controller, Post } from "@nestjs/common";
import { SelectDto } from "./dto/select.dto";
import { UserService } from "./user.service";


@Controller("erp/users")
export class UserController {
  constructor(private readonly userService:UserService) {
  }

  @Post("select")
  async select() {
    const data = await this.userService.findAll();
    return {
      code:200,
      msg:"查询成功",
      data
    }
  }

  @Post("select_by_id")
  async selectById(@Body() select: SelectDto) {
    const user = await this.userService.findById(select.userid)
    return {
      code:200,
      msg:"查询成功",
      data:[user]
    }
  }
}
