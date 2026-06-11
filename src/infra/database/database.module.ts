import { Global, Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

export const MONGO_DB = 'MONGO_DB';

@Global()
@Module({
  providers: [
    {
      provide: MONGO_DB,
      useFactory: async (): Promise<Db> => {
        const uri =
          process.env.MONGODB_URI ?? 'mongodb://mongodb:27017/library';
        const client = new MongoClient(uri, {
          connectTimeoutMS: 50000,
          serverSelectionTimeoutMS: 30000,
          retryWrites: true,
          retryReads: true,
        });
        await client.connect();
        const dbName = new URL(uri).pathname.replace('/', '');
        return client.db(dbName);
      },
    },
  ],
  exports: [MONGO_DB],
})
export class DatabaseModule {}
