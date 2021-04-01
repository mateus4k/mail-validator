import { Controller, Get, Query } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(
    @InjectQueue('mail') readonly queue: Queue,
    private readonly mailsService: MailsService,
  ) {}

  @Get('get')
  async find() {
    return this.mailsService.findAll();
  }

  @Get('validate')
  async validate(@Query('mail') mail: string) {
    const validation = this.mailsService.validate(mail);

    if (validation) {
      await this.queue.add({ mail });
    }

    return { validation };
  }
}
