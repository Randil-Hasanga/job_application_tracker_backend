import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Application, ApplicationDocument } from './entities/application.entity';
import { Model } from 'mongoose';

@Injectable()
export class ApplicationService {

  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,
  ) { }

  create(createApplicationDto: CreateApplicationDto) {
    try {
      const response = this.applicationModel.create(createApplicationDto);
      return response;
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application. Please try again later.');
    }
  }

  findAll() {
    try {
      const response = this.applicationModel.find().exec();
      return response;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications. Please try again later.');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
