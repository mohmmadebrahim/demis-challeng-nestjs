import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { mysqplDBConfigService } from './configs/database/typeorm.config.service';
import { UsersModule } from './modules/users/users.module';
import { VerificationsCodeModule } from './modules/verificationCods/verificationsCode.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: mysqplDBConfigService,
      imports: [ConfigModule]
    }),
    UsersModule,
    VerificationsCodeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
