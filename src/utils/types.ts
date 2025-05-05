import { User } from "../auth/entities/user.entity";

export type UserDetails = {
    email: string;
    displayName: string;
    picture: string;
}


export interface UserInterface {
    _id: string; // or ObjectId if you're using MongoDB
    email: string;
    displayName: string;
    picture?: string; // optional
    // Add any other properties you have in your user model
}



