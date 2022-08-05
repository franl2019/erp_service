import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/module/user/user';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(
      private readonly authService: AuthService
  ) {
    super({
      usernameField:'usercode',
      passwordField:'password'
    });
  }

  public async validate(usercode: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(usercode, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
