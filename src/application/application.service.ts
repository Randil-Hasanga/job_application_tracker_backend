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

  async findAll(userId) {
    try {
      const response = await this.applicationModel.find({ user_id: userId }).exec();
      return response;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications. Please try again later.');
    }
  }

  async findOne(id: string) {
    try {
      const response = await this.applicationModel.findById(id).exec();
      if (!response) {
        throw new Error('Application not found');
      }
      return response;
    } catch (error) {
      console.error('Error fetching application by ID:', error);
      throw new Error('Failed to fetch application. Please try again later.');
    }
  }

  remove(id: string) {
    try {
      const response = this.applicationModel.findByIdAndDelete(id).exec();
      if (!response) {
        throw new Error('Application not found');
      }
      return response;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw new Error('Failed to delete application. Please try again later.');
    }
  }

  async update(id: string, updateApplicationDto: CreateApplicationDto) {
    try {
      const response = await this.applicationModel.findByIdAndUpdate(id, updateApplicationDto, { new: true }).exec();
      if (!response) {
        throw new Error('Application not found');
      }
      return response;
    } catch (error) {
      console.error('Error updating application:', error);
      throw new Error('Failed to update application. Please try again later.');

    }
  }
}
