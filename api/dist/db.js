import pg from "pg";
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}
export const db = new Pool({
    connectionString,
});
export async function connectDb() {
    const client = await db.connect();
    try {
        await client.query("SELECT 1");
    }
    finally {
        client.release();
    }
}
