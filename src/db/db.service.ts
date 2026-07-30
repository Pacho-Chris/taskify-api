import { Injectable, OnModuleDestroy } from '@nestjs/common';
import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly pool: Pool;
  public readonly db: NodePgDatabase<typeof schema>;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    this.db = drizzle({ client: this.pool });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
