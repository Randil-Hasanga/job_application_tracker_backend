import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sessionSecret = process.env.SESSION_SECRET;
  const frontendURL = process.env.FRONTEND_URL;

  if (!frontendURL) {
    throw new Error('FRONTEND_URL environment variable is not defined');
  }

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is not defined');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  app.use(session({
    secret: sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: true, // Set to true if using https
      maxAge: 1000 * 60 *60 *24,
      sameSite: 'none',
    },
  }));

  app.enableCors({
    origin: frontendURL,
    credentials: true,
  });
  

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
