// import { HttpException, Injectable } from '@nestjs/common';

// @Injectable()
// export class TextGeneratorService {
//     async questionAnswer(parameter: string, context: string): Promise<string> {
//         try {
//             const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": "Bearer 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",
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     "model": "deepseek/deepseek-r1:free",
//                     "messages": [
//                         {
//                             "role": "user",
//                             "content": `Give straight answer ${context} ${parameter}`
//                         }
//                     ]
//                 })
//             });
//             const responseText = await response.json();
//             return responseText;
//         } catch (error) {
//             console.error('HF Inference Error:', error);
//             throw new HttpException('Inference API error', 500);
//         }
//     }
// }


import { HttpException, Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class TextGeneratorService {
  private readonly logger = new Logger(TextGeneratorService.name);
  private readonly endpoint = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey = process.env.OPENROUTER_API_KEY;

  constructor() {
    if (!this.apiKey) {
      this.logger.error('Missing OPENROUTER_API_KEY env variable');
      throw new Error('OPENROUTER_API_KEY must be defined');
    }
  }

  /**
   * Extracts exactly one field (e.g. "role" or "company") from the given context.
   * Returns only the bare string value, with no extra words.
   */
  async extractField(
    field: 'role' | 'company',
    context: string,
  ): Promise<string> {
    try {
      const payload = {
        model: 'deepseek/deepseek-r1:free',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: [
              'You are a super-precise extractor.',
              `When asked for "${field}", your response must be exactly that value,`,
              'with no extra explanation, no punctuation beyond what’s in the value itself,',
              'and no slang or reasoning.',
            ].join(' '),
          },
          {
            role: 'user',
            content: `Context: """${context}"""\n\nExtract only the ${field}.`,
          },
        ],
      };

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        this.logger.error(`API error [${res.status}]: ${errText}`);
        throw new HttpException('Inference API error', res.status);
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content;
      if (typeof content !== 'string') {
        this.logger.error('Unexpected API response format', json);
        throw new HttpException('Invalid API response', 500);
      }

      return content.trim();
    } catch (err) {
      this.logger.error('Extraction error', err as any);
      throw new HttpException('Inference API error', 500);
    }
  }
}

