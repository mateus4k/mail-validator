import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMailDto } from './dto/create-mail.dto';
import { validateMail } from './mails.utils';
import { Mail, MailDocument } from './schemas/mail.schema';

@Injectable()
export class MailsService {
  constructor(@InjectModel(Mail.name) private mailModel: Model<MailDocument>) {}

  async create(createMailDto: CreateMailDto): Promise<Mail> {
    const createdMail = new this.mailModel(createMailDto);
    return createdMail.save();
  }

  async findAll(): Promise<MailDocument[]> {
    return this.mailModel.find().exec();
  }

  async exists(mail: string): Promise<boolean> {
    return this.mailModel.exists({ mail });
  }

  validate(mail: string) {
    if (!mail) {
      throw new BadRequestException('Mail is required');
    }

    return validateMail.test(mail);
  }
}
