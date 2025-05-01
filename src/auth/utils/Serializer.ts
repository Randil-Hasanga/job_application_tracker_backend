import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "../entities/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    
    constructor(@Inject('AUTH_SERVICE') private readonly authService : AuthService) {
        super();
    }

    serializeUser(user: User, done: Function) {
        console.log('Serializing user', user);
        done(null, user); // Serialize the user object into the session
    }
    async deserializeUser(payload: any, done: Function) {
        console.log('Deserializing user', payload);
        const user = await this.authService.findUser(payload._id);
        return user ? done(null, user) : done(null, null); // Deserialize the user object from the session
    }
}