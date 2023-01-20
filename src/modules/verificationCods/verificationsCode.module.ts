import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationsCodeEntityService } from './verificationsCode.service';
import { UsersModule } from '../users/users.module';
import { VerificationsCodeEntity } from './verificationsCode.entity';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VerificationsCodeEntity,
      UserEntity
    ])
  ],
  providers: [VerificationsCodeEntityService],
  exports: [VerificationsCodeEntityService],
})
export class VerificationsCodeModule { }
