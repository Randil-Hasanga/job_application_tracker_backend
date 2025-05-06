import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { config } from 'dotenv';
import * as mongoose from 'mongoose';
import * as MongoDBStore from 'connect-mongodb-session';
import { INestApplication } from '@nestjs/common';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  (app as INestApplication & { set: Function }).set('trust proxy', 1);

  const sessionSecret = process.env.SESSION_SECRET;
  const frontendURL = process.env.FRONTEND_URL;

  if (!frontendURL) {
    throw new Error('FRONTEND_URL environment variable is not defined');
  }

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is not defined');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }
  await mongoose.connect(MONGODB_URI);

  // MongoDB session store
  const store = new MongoDBStore(session)({
    uri: MONGODB_URI,
    collection: 'sessions',
  });

  store.on('error', (error) => {
    console.error('Session store error:', error);
  });

  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
      store: store,
      cookie: {
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: isProduction ? 'none' : 'lax'
      },
    })
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
