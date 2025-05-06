// import { Inject, Injectable } from "@nestjs/common";
// import { PassportSerializer } from "@nestjs/passport";
// import { AuthService } from "../auth.service";
// import { User, UserDocument } from "../entities/user.entity";

// @Injectable()
// export class SessionSerializer extends PassportSerializer {
//   constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
//     super();
//   }

//   serializeUser(user: UserDocument, done: Function) {
//     console.log("Inside Serialiser : Serializing USER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
//     done(null, { _id: user._id, email: user.email, picture: user.picture, displayName: user.displayName });
//   }

//   async deserializeUser(payload: any, done: (err: any, user: any) => void) {
//     try {
//       console.log("Inside Deserializer : Deserializing USER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
//       console.log('Deserializing user', payload);
//       const user = await this.authService.findUser(payload._id);
//       if (!user) {
//         console.error('User not found during deserialization');
//         return done(null, null); // No user found, log out
//       }
//       console.log('User found during deserialization', user);
//       return done(null, user);
//     } catch (err) {
//       console.error('Error during deserialization', err);
//       return done(err, null); // In case of unexpected errors
//     }
//   }
// }

import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User, UserDocument } from "../entities/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
    super();
  }

  async serializeUser(user: UserDocument, done: Function) {
    await done(null, { _id: user._id, email: user.email, picture: user.picture, displayName: user.displayName });
  }

  deserializeUser(payload: any, done: (err: any, user: any) => void) {
    try {
      const user = this.authService.findUser(payload._id);
      if (!user) {
        return done(null, null);
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
}