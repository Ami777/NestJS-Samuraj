import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {Reflector} from "@nestjs/core";

@Injectable()
export class PasswordProtectGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const goodPass = this.reflector.get<string>('passwordProtectGoodPassword', context.getHandler());

        return request.headers['x-password'] === goodPass;
    }
}
