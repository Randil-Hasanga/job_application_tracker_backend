import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextGeneratorModule } from './text-generator/text-generator.module';

@Module({
  imports: [TextGeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
