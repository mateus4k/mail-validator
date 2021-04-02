import { CACHE_MANAGER, Controller, Get, Inject, Query } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(
    @InjectQueue('mail') readonly queue: Queue,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly mailsService: MailsService,
  ) {}

  @Get('all')
  async findAll() {
    return this.mailsService.findAll();
  }

  @Get('validate')
  async validate(@Query('mail') mail: string) {
    const key = `mail-${mail}`;
    const cachedValue = await this.cache.get(key);

    if (cachedValue) {
      return { validation: cachedValue };
    }

    const validation = this.mailsService.validate(mail);

    if (validation) {
      await this.queue.add({ mail });
      await this.cache.set(key, validation);
    }

    return { validation };
  }
}
