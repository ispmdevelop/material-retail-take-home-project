import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; organizationId: string }) {
    return { id: payload.sub, email: payload.email, organizationId: payload.organizationId };
  }
}

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {}
