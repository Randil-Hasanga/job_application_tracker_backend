import { IsDate, IsString } from "class-validator";

export class CreateApplicationDto {

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

}

