import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const { password_hash } = user;

    const isMatch = await bcrypt.compare(password, password_hash);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.user_id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
