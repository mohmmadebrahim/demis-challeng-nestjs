import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { VerificationsCodeModule } from '../verificationCods/verificationsCode.module';
import { ConfigModule } from '@nestjs/config';
import { LocalMailerModule } from 'src/utils/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { VerificationsCodeEntity } from '../verificationCods/verificationsCode.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      VerificationsCodeEntity
    ]),
    VerificationsCodeModule,
    ConfigModule,
    LocalMailerModule,
    JwtModule.register(({
      // secret: process.env.JWT_SECRET,
      secret: "process.env.JWT_SECRET",
      signOptions: { expiresIn: '42000' },
    }))
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
