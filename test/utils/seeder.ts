import { Pool, PoolClient } from 'pg';
import {
  author_book,
  authors,
  books,
  librarians,
  tenants,
  users,
  loans,
  returns,
  admins,
} from '../seeds';

export class DatabaseConnector {
  private static pool: Pool;

  static getInstance(): Pool {
    if (!this.pool) {
      const connectionString =
        process.env.POSTGRES_URI ??
        'postgresql://postgres:postgres@localhost:5432/library';

      this.pool = new Pool({ connectionString });
    }

    return this.pool;
  }

  static async close(): Promise<void> {
    await this.pool?.end();
  }
}

export class DatabaseSeeder {
  constructor(private readonly pool: Pool) {}

  async seedAll(): Promise<void> {
    const client = await this.pool.connect();

    try {
      await this.seedUsers(client);
      await this.seedLibrarians(client);
      await this.seedTenants(client);
      await this.seedAdmins(client);
      await this.seedBooks(client);
      await this.seedAuthors(client);
      await this.seedAuthorBook(client);
      await this.seedLoans(client);
      await this.seedReturns(client);
    } finally {
      client.release();
    }
  }

  async clearAll(): Promise<void> {
    const client = await this.pool.connect();
    const tablesToDelete = [
      'returns',
      'loans',
      'librarians',
      'tenants',
      'admins',
      'users',
      'author_book',
      'books',
      'authors',
    ];

    try {
      for (const table of tablesToDelete) {
        await client.query(`DELETE FROM ${table}`);
      }
    } finally {
      client.release();
    }
  }

  async reset(): Promise<void> {
    await this.clearAll();
    await this.seedAll();
  }

  private async seedUsers(client: PoolClient): Promise<void> {
    for (const user of users) {
      await client.query(
        `INSERT INTO users (id, name, last_name, email, password, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          user.id,
          user.name,
          user.last_name,
          user.email,
          user.password,
          user.createdAt,
        ],
      );
    }
  }

  private async seedLibrarians(client: PoolClient): Promise<void> {
    for (const user of librarians) {
      await client.query(
        `INSERT INTO librarians (user_id, approved, disabled, approved_at, disabled_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO NOTHING`,
        [
          user.user_id,
          user.approved,
          user.disabled,
          user?.approvedAt,
          user?.disabledAt,
        ],
      );
    }
  }

  private async seedTenants(client: PoolClient): Promise<void> {
    for (const user of tenants) {
      await client.query(
        `INSERT INTO tenants (user_id, birth_date)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO NOTHING`,
        [user.user_id, user.birth_date],
      );
    }
  }

  private async seedAdmins(client: PoolClient): Promise<void> {
    for (const user of admins) {
      await client.query(
        `INSERT INTO admins (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO NOTHING`,
        [user.user_id],
      );
    }
  }

  private async seedBooks(client: PoolClient): Promise<void> {
    for (const book of books) {
      await client.query(
        `INSERT INTO books (id, title, description, release_date)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [book.id, book.title, book.description, book.release_date],
      );
    }
  }

  private async seedAuthors(client: PoolClient): Promise<void> {
    for (const author of authors) {
      await client.query(
        `INSERT INTO authors (id, name)
         VALUES ($1, $2)
         ON CONFLICT (id) DO NOTHING`,
        [author.id, author.name],
      );
    }
  }

  private async seedAuthorBook(client: PoolClient): Promise<void> {
    for (const entity of author_book) {
      await client.query(
        `INSERT INTO author_book (book_id, author_id)
         VALUES ($1, $2)
         ON CONFLICT (book_id, author_id) DO NOTHING`,
        [entity.book_id, entity.author_id],
      );
    }
  }

  private async seedLoans(client: PoolClient): Promise<void> {
    for (const loan of loans) {
      await client.query(
        `INSERT INTO loans (id, book_id, user_id, due_date, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [loan.id, loan.book_id, loan.user_id, loan.due_date, loan.created_at],
      );
    }
  }

  private async seedReturns(client: PoolClient): Promise<void> {
    for (const entity of returns) {
      await client.query(
        `INSERT INTO returns (id, loan_id, created_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO NOTHING`,
        [entity.id, entity.loan_id, entity.created_at],
      );
    }
  }
}
