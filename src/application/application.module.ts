import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application, ApplicationSchema } from './entities/application.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
