import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Category } from "./Category";

@Entity('expenses')
@ObjectType()
export class Expense extends BaseEntity {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column()
  amount: number;

  @ManyToOne(() => Category, category => category.expenses, {
    onDelete: 'CASCADE',
    eager: true
  })
  category: Category;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
