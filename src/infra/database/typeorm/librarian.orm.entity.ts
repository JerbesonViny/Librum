import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm.entity';

@Entity('librarians')
export class LibrarianOrmEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => UserOrmEntity, (user) => user.tenant)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
