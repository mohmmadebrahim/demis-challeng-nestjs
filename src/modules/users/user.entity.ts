import { BaseEntity, Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength, isEAN } from 'class-validator';
import { AbstractEntity } from '../common/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationsCodeEntity } from '../verificationCods/verificationsCode.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity extends AbstractEntity {

  @Column()
  @Generated("uuid")
  public uuid: string;

  @Column()
  @MinLength(1)
  @IsString()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @MinLength(1)
  @IsStrongPassword()
  @Exclude()
  password: string;

  @Column({ length: 150 })
  @MinLength(1)
  fullname: string;

  @ApiProperty()
  @OneToOne(type => VerificationsCodeEntity, verificationsCodeEntity => verificationsCodeEntity)
  verificationCodes: VerificationsCodeEntity;

  @Column({ default: false })
  isEmailVerified: Boolean;

  @Column({ default: false })
  isPhoneVerified: Boolean;

  @Column({ default: false })
  isAdmin: Boolean;

  @Column({ unique: true, nullable: true })
  accessToken: string;

}
