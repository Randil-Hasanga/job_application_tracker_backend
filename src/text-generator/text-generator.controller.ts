import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TextGeneratorService } from './text-generator.service';
import { AuthenticatedGuard } from 'src/auth/utils/auth.guard';

@Controller('text-generator')
export class TextGeneratorController {

    constructor(private readonly textGenService: TextGeneratorService) { }

    @Post()
    @UseGuards(AuthenticatedGuard)
    async parse(@Body('description') rawDesc: string) {

        const desc = this.preprocessDescription(rawDesc);

        const company = await this.textGenService.extractField('company', desc);
        const role = await this.textGenService.extractField('role', desc);
        return {
            company,
            role,
            dateApplied: new Date().toISOString().slice(0, 10),
            status: 'Applied',
        };
    }

    private preprocessDescription(text: string): string {
        return text
            .replace(/\s{2,}/g, ' ')          // Collapse multiple spaces
            .replace(/•/g, '-')               // Normalize bullet points
            .replace(/\n+/g, '. ')            // Convert line breaks to sentence ends
            .replace(/(https?:\/\/[^\s]+)/g, '') // Remove URLs (optional)
            .trim();
    }
}
