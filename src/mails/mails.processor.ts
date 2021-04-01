import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailsService } from './mails.service';

@Processor('mail')
export class MailsProcessor {
  constructor(private readonly mailsService: MailsService) {}

  @Process()
  async saveMail(job: Job<{ mail: string }>) {
    const { mail } = job.data;
    const alreadyExists = await this.mailsService.exists(mail);

    if (!alreadyExists) {
      await this.mailsService.create({ mail });
    }
  }
}
