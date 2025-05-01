import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/auth.guard';
import { Request, Response } from 'express'; // Explicitly import Response from express

@Controller('auth')
export class AuthController {

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: "Login with Google" };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Req() req: Request, @Res() res: Response) {
    return res.redirect('http://localhost:3000/'); // Now TypeScript recognizes redirect
  }
}
