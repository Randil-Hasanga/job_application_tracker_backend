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
    resave: true,
    cookie: {
      secure: isProduction, // Set to true if using https
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 *60 *24
      // sameSite: 'none',
      // secure: true,
    },
  }));

  app.enableCors({
    origin: 'https://job-application-tracker-react-6c3b73992b04.herokuapp.com',
    credentials: true,
  });
  

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
