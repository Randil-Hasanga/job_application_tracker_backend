import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is not defined');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  app.use(session({
    secret: sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false, // Set to true if using https
      maxAge: 60000, // 1 hour
      // httpOnly: true,
      // sameSite: 'none',
      // secure: true,
    },
  }));

  // app.enableCors({
  //   origin: 'https://www.frontend.com',
  //   credentials: true, // <--- important to allow cookies
  // });
  

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
