import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
  async handleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    // Set the cookie with the session ID
    res.cookie('connect.sid', req.sessionID, { httpOnly: true });

    // Redirect to the frontend URL
    const frontendUrl = process.env.FRONTEND_URL; // Replace with your frontend URL
    if(!frontendUrl){
      throw new Error('frontend url not found')
    }
    res.redirect(frontendUrl);
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
    const user = await this.authService.validateUserByEmail(email, password);

    // Destroy old session and regenerate new one
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration failed:', err);
        return res.status(500).send({ message: 'Login failed' });
      }

      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).send({ message: 'Login failed' });
        }

        console.log('Session ID:', req.sessionID);
        console.log('Session User:', req.user);

        res.cookie('connect.sid', req.sessionID, { httpOnly: true });
        res.send({ message: 'Login successful', user });
      });
    });
  }


  @Get('user')
  async getUser(@Req() req: Request) {
    if (req.isAuthenticated()) {
      console.log(req.user)
      return req.user;
    } else {
      return { message: 'User not authenticated' };
    }
  }

}
