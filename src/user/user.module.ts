import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UserController],
  providers : [UserService],
  exports : [UserService],
  imports : [TypeOrmModule.forFeature([User])]
})
export class UserModule {}