import { Module } from '@nestjs/common';
import { TextGeneratorController } from './text-generator.controller';
import { TextGeneratorService } from './text-generator.service';

@Module({
  controllers: [TextGeneratorController],
  providers: [TextGeneratorService]
})
export class TextGeneratorModule {}
