import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document

@Schema({collection: 'users', timestamps: true})
export class User {
    
    @Prop()
    displayName: string;

    @Prop()
    email: string;

    @Prop()
    picture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
