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

@Injectable()
export class AuthService {
  constructor(private userService: UserService,private jwtService : JwtService) {}

  async login(login: Login) : Promise<{access_token : string}>  {
    const user = await this.userService.findOneByEmail(login.email);

    if (!user) {
      throw new NotFoundException(`user ${login.email} introuvable`);
    }

    if (user.password != login.password) {
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

    const user = await this.userService.create(register);

    const payload = { sub: user.id, email: user.email ,role : user.role};
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
