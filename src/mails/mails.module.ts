import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailsProcessor } from './mails.processor';
import { Mail, MailSchema } from './schemas/mail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mail.name, schema: MailSchema }]),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [MailsController],
  providers: [MailsService, MailsProcessor],
})
export class MailsModule {}
