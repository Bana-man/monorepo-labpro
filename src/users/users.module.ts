import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { SelfController, UserController } from './users.controller';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  providers: [UserService, RolesGuard],
  controllers: [UserController, SelfController]
})
export class UserModule {}
