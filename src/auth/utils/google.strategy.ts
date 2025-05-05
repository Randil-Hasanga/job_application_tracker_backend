import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService, // Replace 'any' with the actual type of your AuthService
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.redirect_uris,
            scope: ['email', 'profile'],
        } as StrategyOptions);
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log("Inside google strategy : validate func >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log("Google Profile", profile);
        console.log("Access Token", accessToken);

        // Check if emails exist in the profile
        if (!profile.emails || profile.emails.length === 0) {
            throw new Error('No email found in Google profile');
        }

        const email = profile.emails[0].value;
        const displayName = profile.displayName || 'Unknown';
        const picture = profile._json.picture || '';

        const  user = await this.authService.validateUser({ email, displayName, picture });
        console.log(`USer obj in google strategy.validate = ${user}`)
        if(!user){
            throw new Error('User is NULL');
        }
        return user; // Return the user object or null if not found
    }
}