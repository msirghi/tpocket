import { User } from './User';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Expense } from "./Expense";

@Entity('categories')
@ObjectType()
export class Category extends BaseEntity {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @ManyToOne(() => User, user => user.categories, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Expense, expense => expense.category, { onDelete: 'CASCADE' })
  expenses: Array<Expense>;
}
