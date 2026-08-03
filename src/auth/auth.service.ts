import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/users.service';
import { Login } from './dtos/login.dto';
import { Register } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';



@Injectable()
export class AuthService {
  constructor(private userService: UserService,private jwtService : JwtService) {}

  async login(login: Login) : Promise<{access_token : string}>  {
    const user = await this.userService.findOneByEmail(login.email);

    if (!user) {
      throw new NotFoundException(`user ${login.email} introuvable`);
    }

    const passwordOk = await argon2.verify(user.password, login.password);

    if (!passwordOk) {
      throw new UnauthorizedException('informations incorrectes');
    }

    const payload = { sub: user.id, email: user.email ,role : user.role};
    return { access_token: await this.jwtService.signAsync(payload) };

  }

  async register(register: Register): Promise<{access_token : string}> {
    const existing = await this.userService.findOneByEmail(register.email);

    if (existing) {
      throw new ConflictException(`user ${register.email} est indisponible`);
    }

    const hash = await argon2.hash(register.password);

    register.password = hash;

    const user = await this.userService.create(register);

    const payload = { sub: user.id, email: user.email ,role : user.role};
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
