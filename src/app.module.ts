import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest', {
      useCreateIndex: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
