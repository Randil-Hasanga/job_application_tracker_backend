import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextGeneratorModule } from './text-generator/text-generator.module';
import { ApplicationModule } from './application/application.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://randilhasanga33:33hasangarandil@cluster0.i7wzzby.mongodb.net/JOT?retryWrites=true&w=majority&appName=Cluster0'), TextGeneratorModule, ApplicationModule, AuthModule, PassportModule.register({ session: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
