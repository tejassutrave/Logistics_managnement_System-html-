const views = {
    dashboard: { render: renderDashboard },
    suppliers: { endpoint: 'suppliers', columns: ['id', 'name', 'contact_person', 'phone', 'email'], title: 'Suppliers' },
    warehouses: { endpoint: 'warehouses', columns: ['id', 'name', 'location', 'capacity', 'manager_name'], title: 'Warehouses' },
    customers: { endpoint: 'customers', columns: ['id', 'name', 'email', 'phone', 'address'], title: 'Customers' },
    items: { endpoint: 'items-joined', columns: ['id', 'name', 'weight_kg', 'price', 'quantity', 'warehouse_name', 'supplier_name'], title: 'Items', deleteEndpoint: 'items' },
    vehicles: { endpoint: 'vehicles', columns: ['id', 'license_plate', 'model', 'type', 'capacity_kg'], title: 'Vehicles' },
    drivers: { endpoint: 'drivers', columns: ['id', 'name', 'license_number', 'phone', 'status'], title: 'Drivers' },
    shipments: { endpoint: 'shipments', columns: ['id', 'tracking_number', 'status', 'shipment_date'], title: 'Shipments' },
    'sql-queries': { render: renderSqlPlayground }
};

let currentView = 'dashboard';

async function loadView(viewName) {
    currentView = viewName;
    const content = document.getElementById('mainContent');
    content.innerHTML = '<div class="text-muted">Loading...</div>';

    // Update Sidebar Active State
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    // Find the link that calls this view (approximate match)
    const links = document.querySelectorAll('.nav-link');
    for (let l of links) {
        if (l.getAttribute('onclick')?.includes(viewName)) l.classList.add('active');
    }

    const config = views[viewName];
    if (config.render) {
        await config.render(content);
    } else {
        await renderTable(content, config);
    }
    if (window.lucide) lucide.createIcons();
}

async function renderDashboard(container) {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">Dashboard Analytics</h2>
                    <div class="breadcrumb">Overview of your logistics operations</div>
                </div>
                <button class="btn btn-primary" onclick="loadView('dashboard')">
                    <i data-lucide="refresh-cw" width="16"></i> Refresh
                </button>
            </div>

            <div class="stats-grid">
                ${createStatCard('Total Suppliers', stats.suppliers, 'package', '+12% this month', 'trend-up')}
                ${createStatCard('Warehouses', stats.warehouses, 'factory', '+5% this month', 'trend-up')}
                ${createStatCard('Customers', stats.customers, 'users', '+18% this month', 'trend-up')}
                ${createStatCard('Items in Stock', stats.items, 'clipboard-list', '+8% this month', 'trend-up')}
                ${createStatCard('Active Vehicles', stats.vehicles, 'truck', '+3% this month', 'trend-up')}
                ${createStatCard('Drivers', stats.drivers, 'user', '+7% this month', 'trend-up')}
            </div>

            <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div class="stat-card" style="padding: 1.5rem; border: 1px solid var(--border-color);">
                    <h3 style="margin-bottom: 1rem;">System Health</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--text-muted);">Database Status</div>
                                <div style="color: #34d399; font-weight: 500;">Connected</div>
                            </div>
                            <i data-lucide="check-circle" color="#34d399"></i>
                        </div>
                         <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--text-muted);">API Status</div>
                                <div style="color: #34d399; font-weight: 500;">Operational</div>
                            </div>
                            <i data-lucide="check-circle" color="#34d399"></i>
                        </div>
                    </div>
                </div>
                 <div class="stat-card" style="padding: 1.5rem; border: 1px solid var(--border-color);">
                    <h3 style="margin-bottom: 1rem;">Inventory Status</h3>
                      <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            <span>Warehouse Capacity</span>
                            <span>75%</span>
                        </div>
                        <div style="height: 6px; background: #334155; border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; background: #6366f1; width: 75%;"></div>
                        </div>
                    </div>
                     <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            <span>Fleet Utilization</span>
                            <span>45%</span>
                        </div>
                        <div style="height: 6px; background: #334155; border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; background: #34d399; width: 45%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Error loading stats: ${e.message}</div>`;
    }
}

function createStatCard(title, value, icon, trend, trendClass) {
    return `
        <div class="stat-card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <div class="stat-title">${title}</div>
                    <div class="stat-value">${value}</div>
                    <div class="stat-trend ${trendClass}">${trend}</div>
                </div>
                <div style="background: rgba(99, 102, 241, 0.1); padding: 0.75rem; border-radius: 0.5rem;">
                    <i data-lucide="${icon}" color="#6366f1"></i>
                </div>
            </div>
        </div>
    `;
}

async function renderTable(container, config) {
    try {
        const res = await fetch(`/api/${config.endpoint}`);
        const data = await res.json();

        const deleteEndpoint = config.deleteEndpoint || config.endpoint;

        let rows = '';
        data.forEach(item => {
            rows += `
                <tr>
                    ${config.columns.map(col => `<td>${item[col] !== undefined && item[col] !== null ? item[col] : '-'}</td>`).join('')}
                    <td>
                        <div class="table-actions">
                             <button class="btn btn-sm btn-primary" onclick="alert('Edit functionality pending implementation of dynamic forms.')">Edit</button>
                             <button class="btn btn-sm btn-danger" onclick="deleteItem('${deleteEndpoint}', ${item.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">${config.title}</h2>
                    <div class="breadcrumb">Manage ${config.title.toLowerCase()}</div>
                </div>
                <button class="btn btn-primary" onclick="openAddModal('${config.endpoint}')">
                    <i data-lucide="plus" width="16"></i> Add Item
                </button>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <input type="text" class="form-control" placeholder="Search..." style="max-width: 300px;" onkeyup="filterTable(this)">
            </div>

            <div class="table-container">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                ${config.columns.map(col => `<th>${col.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Error loading data: ${e.message}</div>`;
    }
}

function filterTable(input) {
    const filter = input.value.toLowerCase();
    const rows = document.getElementById('tableBody').getElementsByTagName('tr');
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    }
}

async function deleteItem(endpoint, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
        const res = await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Item deleted successfully');
            loadView(currentView);
        } else {
            const err = await res.json();
            alert('Failed: ' + err.error);
        }
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');

function closeModal() {
    modalOverlay.classList.remove('open');
}

function openAddModal(endpoint) {
    const config = Object.values(views).find(v => v.endpoint === endpoint || v.endpoint === endpoint.replace('-joined', ''));
    if (!config) return;

    // Fallback to base endpoint for writing
    const baseEndpoint = (config.deleteEndpoint || config.endpoint);

    modalTitle.textContent = `Add to ${config.title}`;

    let formFields = config.columns.filter(c => c !== 'id' && !c.includes('_name'));

    // Manual overrides for complex tables to be useful
    if (endpoint === 'items-joined') {
        formFields = ['name', 'description', 'weight_kg', 'price', 'quantity', 'supplier_id', 'warehouse_id'];
    }

    const inputs = formFields.map(col => `
        <div class="form-group">
            <label class="form-label">${col.replace(/_/g, ' ').toUpperCase()}</label>
            <input type="text" class="form-control" name="${col}" placeholder="Enter ${col}">
        </div>
    `).join('');

    modalBody.innerHTML = `
        <form onsubmit="handleFormSubmit(event, '${baseEndpoint}', 'POST')">
            ${inputs}
            <div class="flex gap-4" style="margin-top: 1.5rem;">
                <button type="button" class="btn" style="background:var(--card-bg); border:1px solid var(--border-color); color:white;" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" style="flex:1">Save</button>
            </div>
        </form>
    `;
    modalOverlay.classList.add('open');
}

async function handleFormSubmit(e, endpoint, method) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Filter out empty strings if necessary or let DB handle defaults

    try {
        const res = await fetch(`/api/${endpoint}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            closeModal();
            showToast('Saved successfully');
            loadView(currentView);
        } else {
            const err = await res.json();
            alert('Error: ' + err.error);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

const QUERIES = [
    { label: '1. All Suppliers', sql: 'SELECT * FROM suppliers' },
    { label: '2. All Warehouses', sql: 'SELECT * FROM warehouses' },
    { label: '3. All Customers', sql: 'SELECT * FROM customers' },
    { label: '4. All Items', sql: 'SELECT * FROM items' },
    { label: '5. All Vehicles', sql: 'SELECT * FROM vehicles' },
    { label: '6. All Drivers', sql: 'SELECT * FROM drivers' },
    { label: '7. Items with Supplier Details', sql: 'SELECT i.name, i.price, s.name as supplier, s.contact_person FROM items i JOIN suppliers s ON i.supplier_id = s.id' },
    { label: '8. Customers with Warehouse', sql: 'SELECT DISTINCT c.name as customer, w.name as warehouse FROM customers c JOIN shipments sh ON c.id = sh.customer_id JOIN items i ON sh.item_id = i.id JOIN warehouses w ON i.warehouse_id = w.id' },
    { label: '9. Drivers with Vehicle Info', sql: 'SELECT d.name as driver, v.license_plate, v.model FROM drivers d JOIN vehicles v ON v.driver_id = d.id' },
    { label: '10. Count Items per Warehouse', sql: 'SELECT w.name, COUNT(i.id) as item_count FROM warehouses w LEFT JOIN items i ON w.id = i.warehouse_id GROUP BY w.name' },
    { label: '11. Total Inventory Value', sql: 'SELECT SUM(price * quantity) as total_value FROM items' },
    { label: '12. High Capacity Vehicles (>1000)', sql: 'SELECT * FROM vehicles WHERE capacity_kg > 1000' },
    { label: '13. Expensive Items (>500)', sql: 'SELECT * FROM items WHERE price > 500' },
    { label: '14. Items Sorted by Weight', sql: 'SELECT * FROM items ORDER BY weight_kg DESC' },
    { label: '15. Count Items per Supplier', sql: 'SELECT s.name, COUNT(i.id) as item_count FROM suppliers s LEFT JOIN items i ON s.id = i.supplier_id GROUP BY s.name' },
    { label: '16. Drivers with Phone Numbers', sql: 'SELECT name, phone FROM drivers WHERE phone IS NOT NULL' },
    { label: '17. Warehouses in New York (Ex)', sql: "SELECT * FROM warehouses WHERE location LIKE '%New York%' OR location LIKE '%NY%'" },
    { label: '18. Total Customers Count', sql: 'SELECT COUNT(*) as total_customers FROM customers' },
    { label: '19. Average Item Price', sql: 'SELECT AVG(price) as average_price FROM items' },
    { label: '20. Vehicles with Model Truck', sql: "SELECT * FROM vehicles WHERE type = 'Truck'" }
];

function renderSqlPlayground(container) {
    container.innerHTML = `
        <div class="page-header">
            <div>
                <h2 class="page-title">SQL Queries Playground</h2>
                <div class="breadcrumb">Execute custom queries</div>
            </div>
        </div>

        <div class="stat-card" style="padding: 1.5rem; border: 1px solid var(--border-color); margin-bottom: 2rem;">
            <div class="form-group">
                <label class="form-label">Custom SQL Query</label>
                <div class="flex gap-4">
                    <input type="text" id="sqlInput" class="form-control" placeholder="SELECT * FROM item WHERE price > 500" value="SELECT * FROM items WHERE price > 500">
                    <button class="btn btn-primary" onclick="runQuery()">Run Query</button>
                </div>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
             ${QUERIES.map(q => `
                <button class="btn" style="background: var(--card-bg); border: 1px solid var(--border-color); height: 100%; text-align:left; justify-content:flex-start; font-size: 0.8rem;" onclick="fillAndRun('${q.label}')">${q.label}</button>
             `).join('')}
        </div>

        <div id="queryResults" style="margin-top: 2rem;"></div>
    `;
}

function fillAndRun(label) {
    const queryObj = QUERIES.find(q => q.label === label);
    if (queryObj) {
        document.getElementById('sqlInput').value = queryObj.sql;
        runQuery();
    }
}

async function runQuery() {
    const query = document.getElementById('sqlInput').value;
    const resultContainer = document.getElementById('queryResults');
    resultContainer.innerHTML = '<div class="text-muted">Executing...</div>';

    try {
        const res = await fetch('/api/run-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();

        if (data.error) {
            resultContainer.innerHTML = `<div class="text-danger">Error: ${data.error}</div>`;
            return;
        }

        if (!data.rows || data.rows.length === 0) {
            resultContainer.innerHTML = `<div class="text-muted">No results found.</div>`;
            return;
        }

        const headers = Object.keys(data.rows[0]);
        const headerHtml = headers.map(h => `<th>${h.toUpperCase()}</th>`).join('');
        const bodyHtml = data.rows.map(row => `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`).join('');

        resultContainer.innerHTML = `
            <div class="table-container">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead><tr>${headerHtml}</tr></thead>
                        <tbody>${bodyHtml}</tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        resultContainer.innerHTML = `<div class="text-danger">Error: ${err.message}</div>`;
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
