import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { databaseConfig } from '../../../common/config/database.config';

@Module({
  imports: [MongooseModule.forRoot(databaseConfig.uri), UsersModule],
})
export class AppModule {}

