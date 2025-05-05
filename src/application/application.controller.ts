import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { AuthenticatedGuard } from 'src/auth/utils/auth.guard';
import { Request } from 'express';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @Post()
  @UseGuards(AuthenticatedGuard)
  async create(@Body() createApplicationDto: CreateApplicationDto, @Req() req: Request) {
    try {
      const user = req.user as any; // Cast to any to access user properties
      const userId = user._id;

      const application = await this.applicationService.create({
        ...createApplicationDto,
        user_id: userId,
      });
      return application;
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application. Please try again later.');
    }
  }

  // @Get()
  // @UseGuards(AuthenticatedGuard)
  // async findAll(@Req() req: Request) {
  //   try {
  //     console.log("getting applications")
  //     // Correctly access the user ID from the session object
  //     const user = req.user as any; // Cast to any to access user properties
  //     const userId = user._id;

  //     if (!userId) {
  //       throw new Error('User ID not found in session');
  //     }

  //     console.log('Session:', req.session);
  //     console.log('User:', user);  // Logs the user object from session
  //     console.log('User id :', userId);

  //     // Fetch applications for the user based on the userId
  //     const applications = await this.applicationService.findAll(userId);
  //     return applications;
  //   } catch (error) {
  //     console.error('Error fetching applications:', error);
  //     throw new Error('Failed to fetch applications. Please try again later.');
  //   }
  // }

  @Get()
  async findAll(@Req() req: Request) {
    try {
      console.log("getting applications");

      if (!req.isAuthenticated()) {
        throw new Error('User not authenticated');
      }      

      const userId = (req.session as any).passport.user._id;

      if (!userId) {
        throw new Error('User ID not found in session');
      }

      console.log('Session:', req.session);
      console.log('User ID:', userId);

      // Fetch applications for the user based on the userId
      const applications = await this.applicationService.findAll(userId);
      return applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications. Please try again later.');
    }
  }




  @Get(':id')
  findApplicationById(@Param('id') id: string) {
    try {
      const application = this.applicationService.findOne(id);
      return application;
    } catch (error) {
      console.error('Error fetching application by ID:', error);
      throw new Error('Failed to fetch application. Please try again later.');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const response = this.applicationService.remove(id);
      if (!response) {
        throw new Error('Application not found');
      }
      return { message: 'Application deleted successfully' };
    } catch (error) {
      console.error('Error deleting application:', error);
      throw new Error('Failed to delete application. Please try again later.');
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateApplicationDto: CreateApplicationDto) {
    try {
      const response = await this.applicationService.update(id, updateApplicationDto);
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
