import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Column,
} from 'typeorm';
import { EntityId } from '@/domain/entities';
import { BookOrmEntity } from './book.orm.entity';
import { UserOrmEntity } from './user.orm.entity';
import { ReturnsLoanOrmEntity } from './returns.orm.entity';

@Entity('loans')
export class LoanOrmEntity {
  @PrimaryColumn('uuid')
  id: EntityId;

  @ManyToOne(() => BookOrmEntity, (book) => book.loans)
  @JoinColumn({ name: 'book_id' })
  book: BookOrmEntity;

  @ManyToOne(() => UserOrmEntity, (book) => book.loans)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @OneToOne(() => ReturnsLoanOrmEntity, (returns) => returns.loan)
  returns: ReturnsLoanOrmEntity;

  @Column('timestamp', { name: 'due_date' })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
