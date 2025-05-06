import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request); // establishes a session
    return activate;
  }
}

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const req = context.switchToHttp().getRequest();
//     return req.isAuthenticated();
//   }
// }


@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();

    if (req.isAuthenticated()) {
      return true;
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
      return false;
    }
  }
}