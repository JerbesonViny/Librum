import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { EntityId } from '@/domain/entities';
import { LoanOrmEntity } from './loan.orm.entity';

@Entity('returns')
export class ReturnsLoanOrmEntity {
  @PrimaryColumn('uuid')
  id: EntityId;

  @OneToOne(() => LoanOrmEntity, (loan) => loan.returns)
  @JoinColumn({ name: 'loan_id' })
  loan: LoanOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
