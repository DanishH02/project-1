import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NetworkingService } from '../../../../common/services/networking.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, NetworkingService],
})
export class AuthModule {}

