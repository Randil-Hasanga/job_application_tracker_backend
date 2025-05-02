import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document

@Schema({collection: 'users', timestamps: true})
export class User {
    
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;
    
    @Prop()
    displayName: string;

    @Prop()
    email: string;

    @Prop()
    picture: string;

    @Prop()
    password: string; // Add this field
}

export const UserSchema = SchemaFactory.createForClass(User);
