import { Pool } from 'pg';
import { Database } from '@/lib/database/types'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
  pool: new Pool({
    max: 10,
    connectionString: process.env.POSTGRES_URL
  })
})


export const db = new Kysely<Database>({
  dialect,
})