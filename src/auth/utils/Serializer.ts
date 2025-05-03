import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User, UserDocument } from "../entities/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: UserDocument, done: Function) {
    done(null, { _id: user._id, email: user.email, picture: user.picture, displayName: user.displayName });
  }

  async deserializeUser(payload: any, done: Function) {
    console.log('Deserializing user', payload); // Debug log
    const user = await this.authService.findUser(payload._id);
    if (!user) {
      console.error('User not found during deserialization');
      return done(null, null);
    }
    return done(null, user);
  }
}