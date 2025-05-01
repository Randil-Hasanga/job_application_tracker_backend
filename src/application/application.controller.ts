import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    try {
      const application = this.applicationService.create(createApplicationDto);
      return application;
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application. Please try again later.');
    }

  }

  @Get()
  findAll() {
    try {
      const applications = this.applicationService.findAll();
      return applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications. Please try again later.');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
