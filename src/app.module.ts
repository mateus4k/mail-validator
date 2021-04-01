import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest', {
      useCreateIndex: true,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: null,
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
