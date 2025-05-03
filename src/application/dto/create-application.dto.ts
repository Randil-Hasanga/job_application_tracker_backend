import { Type } from "@nestjs/common";
import { IsDate, IsString } from "class-validator";
import { ObjectId, Types } from "mongoose";

export class CreateApplicationDto {

    user_id: string | Types.ObjectId;

    @IsString()
    company: string;

    @IsString()
    role: string;

    @IsDate()
    dateApplied: Date;

    @IsString()
    status: string;

    @IsString()
    notes: string;

    @IsString()
    vacancy_link: string;
  updateApplicationDto: import("mongoose").Types.ObjectId;
}

