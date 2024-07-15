import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const PG_URL=process.env.PGHOST;
const client = new pg.Client(PG_URL);
client.connect();

export default client;