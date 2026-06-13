import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { AuthorEntity, EntityId } from '@/domain/entities';
import { BookOrmEntity } from './book.orm.entity';

@Entity('authors')
export class AuthorOrmEntity {
  @PrimaryColumn('uuid')
  id: EntityId;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @ManyToMany(() => BookOrmEntity, (book) => book.authors)
  books?: BookOrmEntity;

  toDomain() {
    return new AuthorEntity({
      id: this.id,
      name: this.name,
    });
  }
}
