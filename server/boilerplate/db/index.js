import pg from 'pg';
import 'dotenv/config';

// workaround for dates
// https://github.com/brianc/node-postgres/issues/1844
const DATE_OID = 1082;
const parseDate = (value) => value;

pg.types.setTypeParser(DATE_OID, parseDate); // map timestamps

// create pool and query object
export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

export const query = (text, params) => pool.query(text, params);

// add close function for vitests
export const close = () => pool.end();
