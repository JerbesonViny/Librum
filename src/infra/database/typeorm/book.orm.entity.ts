import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AuthorOrmEntity } from './author.orm.entity';
import { LoanOrmEntity } from './loan.orm.entity';
import { BookEntity, EntityId } from '@/domain/entities';

@Entity('books')
export class BookOrmEntity {
  @PrimaryColumn('uuid')
  id: EntityId;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'release_date', type: 'varchar', length: 20 })
  releaseDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => AuthorOrmEntity, (author) => author.books)
  @JoinTable({
    name: 'author_book',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'author_id', referencedColumnName: 'id' },
  })
  authors: AuthorOrmEntity[];

  @OneToMany(() => LoanOrmEntity, (loan) => loan.book)
  loans: LoanOrmEntity[];

  toDomain() {
    const authors = this.authors.map((author) => author.toDomain());

    return new BookEntity({
      id: this.id,
      title: this.title,
      description: this.description,
      releaseDate: this.releaseDate,
      authors,
    });
  }
}
