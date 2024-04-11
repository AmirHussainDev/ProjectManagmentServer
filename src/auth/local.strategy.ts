// local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }
    _passReqToCallback = true;
    async validate(organization_id: number, username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(organization_id, username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
