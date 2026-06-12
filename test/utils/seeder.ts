import { Db, MongoClient } from 'mongodb';
import { users, books } from '../seeds';

export class DatabaseConnector {
  private static db: Db;
  private static client: MongoClient;

  static async getInstance() {
    if (!this.db) {
      const uri = process.env.MONGODB_URI ?? 'mongodb://mongodb:27017/library';
      const client = new MongoClient(uri, {
        connectTimeoutMS: 50000,
        serverSelectionTimeoutMS: 30000,
        retryWrites: true,
        retryReads: true,
      });

      await client.connect();
      const dbName = new URL(uri).pathname.replace('/', '');
      this.client = client;
      this.db = client.db(dbName);

      return this.db;
    }
  }

  static async close() {
    await this.client.close();
  }
}

export class DatabaseSeeder {
  constructor(private readonly db: Db) {}

  async seedAll(): Promise<void> {
    await Promise.allSettled([
      this.db.collection('users').insertMany(users),
      this.db.collection('books').insertMany(books),
    ]);
  }

  async clearAll(): Promise<void> {
    await Promise.allSettled([
      this.db.collection('users').deleteMany(),
      this.db.collection('books').deleteMany(),
    ]);
  }

  async reset(): Promise<void> {
    await this.clearAll();
    await this.seedAll();
  }
}
