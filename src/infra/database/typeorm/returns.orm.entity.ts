import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { EntityId, ReturnsEntity } from '@/domain/entities';
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

  toDomain() {
    return new ReturnsEntity({
      id: this.id,
      loan: this.loan.toDomain(),
      createdAt: this.createdAt,
    });
  }
}
