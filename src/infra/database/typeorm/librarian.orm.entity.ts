import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm.entity';

@Entity('librarians')
export class LibrarianOrmEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => UserOrmEntity, (user) => user.librarian)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ type: 'bool' })
  approved: boolean;

  @Column({ type: 'bool' })
  disabled: boolean;

  @Column({ type: 'timestamp', name: 'disabled_at', nullable: true })
  disabledAt?: Date;

  @Column({ type: 'timestamp', name: 'approved_at', nullable: true })
  approvedAt?: Date;
}
