import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { SelfController, UserController } from './users.controller';

@Module({
  providers: [UserService],
  controllers: [UserController, SelfController]
})
export class UserModule {}
