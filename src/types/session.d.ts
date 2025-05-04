// src/types/session.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Session {
      passport?: {
        user?: {
          _id: string; // Or use the correct type for your user ID
          email: string;
          picture: string;
          displayName: string;
        };
      };
    }
  }
}
