import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { EntityId, LibrarianEntity, TenantEntity } from '@/domain/entities';
import { TenantOrmEntity } from './tenant.orm.entity';
import { LibrarianOrmEntity } from './librarian.orm.entity';

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

  @Column({ type: 'text' })
  password: string;

  @OneToOne(() => TenantOrmEntity, (tenant) => tenant.user)
  tenant?: TenantOrmEntity;

  @OneToOne(() => LibrarianOrmEntity, (librarian) => librarian.user)
  librarian?: LibrarianOrmEntity;

  toDomain() {
    if (this.tenant) {
      return new TenantEntity({
        id: this.id,
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        birthDate: this.tenant.birthDate,
      });
    } else {
      return new LibrarianEntity({
        id: this.id,
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      });
    }
  }
}
