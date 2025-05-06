import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/auth.guard';
import { Request, Response } from 'express'; // Explicitly import Response from express

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: "Login with Google" };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Req() req: Request, @Res() res: Response) {   
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('displayName') displayName: string,
  ) {
    const user = await this.authService.registerUser(email, password, displayName);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (password == "") throw new UnauthorizedException("Provide Password");
    const user = await this.authService.validateUserByEmail(email, password);
    req.login(user, (err) => {
      if (err) {
        throw new Error('Login failed');
      }
      res.cookie('connect.sid', req.sessionID, { httpOnly: true });
      res.send({ message: 'Login successful', user });
    });
  }

  @Get('user')
  async getUser(@Req() req: Request) {
    if (req.isAuthenticated()) {
      return req.user;
    } else {
      return { message: 'User not authenticated' };
    }
  }
}
