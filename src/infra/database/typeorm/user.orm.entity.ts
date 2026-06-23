import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import {
  AdminEntity,
  EntityId,
  LibrarianEntity,
  TenantEntity,
} from '@/domain/entities';
import { TenantOrmEntity } from './tenant.orm.entity';
import { LibrarianOrmEntity } from './librarian.orm.entity';
import { LoanOrmEntity } from './loan.orm.entity';
import { AdminOrmEntity } from './admin.orm.entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: EntityId;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 40 })
  lastName: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @OneToOne(() => TenantOrmEntity, (tenant) => tenant.user)
  tenant?: TenantOrmEntity;

  @OneToOne(() => LibrarianOrmEntity, (librarian) => librarian.user)
  librarian?: LibrarianOrmEntity;

  @OneToOne(() => AdminOrmEntity, (admin) => admin.user)
  admin?: AdminOrmEntity;

  @OneToMany(() => LoanOrmEntity, (loan) => loan.user)
  loans: LoanOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  toDomain() {
    if (this.tenant) {
      return new TenantEntity({
        id: this.id,
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        birthDate: this.tenant.birthDate,
        createdAt: this.createdAt,
      });
    } else if (this.librarian) {
      return new LibrarianEntity({
        id: this.id,
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        approved: this.librarian.approved,
        disabled: this.librarian.disabled,
        approvedAt: this.librarian.approvedAt,
        disabledAt: this.librarian.disabledAt,
        createdAt: this.createdAt,
      });
    }

    return new AdminEntity({
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
    });
  }
}
