import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // le header vaut "Bearer eyJhbGci..." → on coupe sur l'espace
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('token manquant');
    }

    try {
      // vérifie la signature + l'expiration, et décode le payload
      request.user = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('token invalide ou expiré');
    }

    return true;   // true = la requête peut continuer vers le controller
  }
}