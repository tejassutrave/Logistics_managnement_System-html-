const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic CRUD helper
const createCrudRoutes = (table) => {
    app.get(`/api/${table}`, async (req, res) => {
        try {
            const result = await pool.query(`SELECT * FROM ${table} ORDER BY id ASC`);
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post(`/api/${table}`, async (req, res) => {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        try {
            const result = await pool.query(query, values);
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    app.put(`/api/${table}/:id`, async (req, res) => {
        const { id } = req.params;
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
        try {
            const result = await pool.query(query, [...values, id]);
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    app.delete(`/api/${table}/:id`, async (req, res) => {
        const { id } = req.params;
        try {
            await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
};

['suppliers', 'warehouses', 'customers', 'drivers', 'vehicles', 'items', 'shipments', 'users'].forEach(createCrudRoutes);

// Specialized Routes for Joins
app.get('/api/items-joined', async (req, res) => {
    const query = `
        SELECT i.*, s.name as supplier_name, w.name as warehouse_name 
        FROM items i
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        LEFT JOIN warehouses w ON i.warehouse_id = w.id
        ORDER BY i.id ASC
    `;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/vehicles-joined', async (req, res) => {
    const query = `
        SELECT v.*, d.name as driver_name
        FROM vehicles v
        LEFT JOIN drivers d ON v.driver_id = d.id
        ORDER BY v.id ASC
    `;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Dashboard Stats
app.get('/api/stats', async (req, res) => {
    try {
        const suppliers = await pool.query('SELECT COUNT(*) FROM suppliers');
        const warehouses = await pool.query('SELECT COUNT(*) FROM warehouses');
        const customers = await pool.query('SELECT COUNT(*) FROM customers');
        const items = await pool.query('SELECT COUNT(*) FROM items');
        const vehicles = await pool.query('SELECT COUNT(*) FROM vehicles');
        const drivers = await pool.query('SELECT COUNT(*) FROM drivers');

        res.json({
            suppliers: suppliers.rows[0].count,
            warehouses: warehouses.rows[0].count,
            customers: customers.rows[0].count,
            items: items.rows[0].count,
            vehicles: vehicles.rows[0].count,
            drivers: drivers.rows[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Custom SQL Query Endpoint (If user had a 'SQL Playground' feature)
app.post('/api/run-query', async (req, res) => {
    const { query } = req.body;
    try {
        // Basic protection: prevent drop/delete for simplicity? No, let user do what they want, it's a playground.
        const result = await pool.query(query);
        res.json({ rows: result.rows, rowCount: result.rowCount, fields: result.fields.map(f => f.name) });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
