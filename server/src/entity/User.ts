import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Category } from './Category';
import { Notification } from './Notification';

@Entity('users')
@ObjectType()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Column()
  password: string;

  // TODO: remove optional after db change
  @Column({ nullable: true, default: false })
  @Field()
  confirmed: boolean;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @OneToMany(() => Category, (category) => category.user, { onDelete: 'CASCADE' })
  categories: Array<Category>;

  @OneToMany(() => Notification, (notification) => notification.user, { onDelete: 'CASCADE' })
  notifications: Array<Notification>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
