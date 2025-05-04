// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as session from 'express-session';
// import * as passport from 'passport';
// import { config } from 'dotenv';

// config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const sessionSecret = process.env.SESSION_SECRET;
//   const frontendURL = process.env.FRONTEND_URL;

//   if (!frontendURL) {
//     throw new Error('FRONTEND_URL environment variable is not defined');
//   }

//   if (!sessionSecret) {
//     throw new Error('SESSION_SECRET environment variable is not defined');
//   }

//   const isProduction = process.env.NODE_ENV === 'production';

//   app.use(session({
//     secret: sessionSecret,
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//       secure: false, // Set to true if using https
//       maxAge: 1000 * 60 *60 *24,
//       // sameSite: 'none',
//     },
//   }));

//   app.enableCors({
//     origin: frontendURL,
//     credentials: true,
//   });
  

//   app.use(passport.initialize());
//   app.use(passport.session());

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { config } from 'dotenv';
import * as mongoose from 'mongoose';
import * as MongoDBStore from 'connect-mongodb-session';
import * as cookieParser from 'cookie-parser';

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

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI; // Ensure you have this in your .env
  if (!MONGODB_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }
  await mongoose.connect(MONGODB_URI);

  const MongoDBStoreInstance = MongoDBStore(session);

  // MongoDB session store
  const store = new MongoDBStoreInstance({
    uri: MONGODB_URI,
    collection: 'sessions',
  });

  store.on('error', (error) => {
    console.error('Session store error:', error);
  });

  
  // Use session with MongoDB store
  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
      store: store, // Use MongoDB session store
      cookie: {
        secure: isProduction, // Set to true in production if using https
        maxAge: 1000 * 60 * 60 * 24, // Session max age: 1 day
        sameSite : isProduction ? 'none' : 'lax'
      },
    })
  );

  app.enableCors({
    origin: frontendURL,
    credentials: true,
  });
  
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
