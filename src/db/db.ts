import { Pool } from "pg";

export const pool = new Pool({
 user: "postgres",
 host: "localhost",
 database: "Clinicaldb",
 password: "root",
 port: 5432,
});