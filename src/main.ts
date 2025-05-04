// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as session from 'express-session';
// import * as passport from 'passport';
// import { config } from 'dotenv';
// import MongoStore from 'connect-mongo';

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
//       secure: true, // Set to true if using https
//       maxAge: 1000 * 60 * 60 * 24,
//       sameSite: 'none',
//     },
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//     }),
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
import connectMongo from 'connect-mongo';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const {
    SESSION_SECRET,
    FRONTEND_URL,
    MONGODB_URI,
    NODE_ENV,
    PORT,
  } = process.env;

  if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not defined');
  }

  if (!FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is not defined');
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  const isProduction = NODE_ENV === 'production';

  // Initialize MongoStore with session
  const MongoStore = connectMongo;

  app.use(
    session({
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: isProduction, // True if using HTTPS in production
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'none',
      },
      store: new MongoStore({
        mongoUrl: MONGODB_URI,
      }),
    }),
  );

  app.enableCors({
    origin: FRONTEND_URL,
    credentials: true,
  });

  app.use(passport.initialize());
  app.use(passport.session());

  const port = PORT ? Number(PORT) : 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
