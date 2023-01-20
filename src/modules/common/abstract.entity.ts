import { Exclude } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Generated,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    @Exclude()
    public id: number;

    @CreateDateColumn()
    @Exclude()
    public createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    public updatedAt: Date;
}