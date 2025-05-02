import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ApplicationDocument = Application & Document

@Schema({collection: 'applications', timestamps: true})
export class Application {

    @Prop({type: Types.ObjectId, ref: 'User'})
    user_id: Types.ObjectId;

    @Prop()
    company : string;

    @Prop()
    role: string;

    @Prop()
    dateApplied: Date;

    @Prop()
    status: string;

    @Prop()
    notes: string;

    @Prop()
    vacancy_link: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);