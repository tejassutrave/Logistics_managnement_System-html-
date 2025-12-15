const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    password: '12345',
    port: 5432,
};

async function setup() {
    const client = new Client({ ...dbConfig, database: 'postgres' });
    try {
        await client.connect();
        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'logistics_db'");
        if (res.rowCount === 0) {
            console.log('Creating database logistics_db...');
            await client.query('CREATE DATABASE logistics_db');
        } else {
            console.log('Database logistics_db already exists.');
        }
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }

    // Now connect to the new database and run schema
    const dbClient = new Client({ ...dbConfig, database: 'logistics_db' });
    try {
        await dbClient.connect();
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Running schema.sql...');
        await dbClient.query(schemaSql);
        console.log('Schema applied successfully.');
    } catch (err) {
        console.error('Error applying schema:', err);
        process.exit(1);
    } finally {
        await dbClient.end();
    }
}

setup();
