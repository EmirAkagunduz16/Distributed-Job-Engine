import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          // 1. gRPC üzerinden gelen ham token (Jobs servisinden gelen istekler)
          if (request?.token) {
            return request.token;
          }
          // 2. HTTP Çerezinden (Cookie) gelen token
          if (request?.cookies?.Authentication) {
            return request.cookies.Authentication;
          }
          // 3. HTTP Headers'dan (Bearer) gelen token (Çökmemesi için güvenli kontrol)
          if (request?.headers?.authorization) {
            return request.headers.authorization.split(' ')[1];
          }
          return null;
        }
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
