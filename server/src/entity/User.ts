import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Field, Int, ObjectType } from 'type-graphql';
import { Category } from "./Category";

@Entity('users')
@ObjectType()
export class User extends BaseEntity {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @OneToMany(() => Category, category => category.user, { onDelete: 'CASCADE' })
  categories: Array<Category>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
