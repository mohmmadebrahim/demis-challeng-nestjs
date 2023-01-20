import { Column, Entity, OneToOne } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from '../users/user.entity';

@Entity()
export class VerificationsCodeEntity extends AbstractEntity {

  @ApiProperty({ type: "string", nullable: true })
  @Column({ unique: true, nullable: true })
  emailVerificationCode: string;

  @ApiProperty({ type: "string", nullable: true })
  @Column({ unique: true, nullable: true })
  phoneVerificationCode: string;

  @ApiProperty({ type: "uuid" })
  @Column({ type: "uuid", unique: true })
  @OneToOne(type => UserEntity, UserEntity => UserEntity.uuid)
  uuid: any;

}
