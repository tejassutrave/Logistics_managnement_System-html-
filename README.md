# LogisticsPro Management System

![LogisticsPro](https://img.shields.io/badge/Status-Active-success) ![Node.js](https://img.shields.io/badge/Node.js-v14+-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-blue)

## 📌 Project Overview
**LogisticsPro** is a comprehensive full-stack web application designed to streamline logistics operations. It provides a centralized dashboard for managing the flow of goods, vehicle fleets, drivers, warehouses, and shipments.

Built with a **Premium Dark UI**, it focuses on user experience and efficiency, replacing chaotic manual processes with a digital solution.

## 🚀 Key Features
*   **Role-Based Access Control:** Secure login for Admins, Managers, and Drivers.
*   **Interactive Dashboard:** Real-time visualization of key metrics (Active Vehicles, Inventory Levels, etc.) with trend indicators.
*   **Complete CRUD Modules:** Manage Suppliers, Customers, Warehouses, Vehicles, Drivers, Items, and Shipments.
*   **SQL Playground:** A built-in feature to execute custom SQL queries directly from the UI with 20+ pre-built templates.
*   **Premium UI/UX:** Custom-designed dark theme with glassmorphism effects, responsive layout, and smooth transitions.

## 🛠️ Technology Stack
*   **Frontend:** HTML5, CSS3 (Custom), Vanilla JavaScript (ES6+).
*   **Backend:** Node.js, Express.js.
*   **Database:** PostgreSQL.
*   **Icons:** Lucide Icons.

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js installed.
*   PostgreSQL installed and running.

### Steps
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd logistics_managment_system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    *   Make sure your PostgreSQL server is running.
    *   Update `backend/db.js` and `database/setup_db.js` with your Postgres credentials (default password is `12345`).
    *   Run the setup script to create the database and seed data:
    ```bash
    npm run db:setup
    ```

4.  **Start the Server:**
    ```bash
    npm start
    ```

5.  **Access the App:**
    Open your browser and navigate to `http://localhost:3000`.

## 📂 Project Structure
```
logistics_managment_system/
├── backend/            # Express server and database connection
│   ├── server.js
│   └── db.js
├── database/           # SQL Schema and Setup scripts
│   ├── schema.sql
│   └── setup_db.js
├── public/             # Frontend Static Files
│   ├── css/            # Custom Styles
│   ├── js/             # Main Frontend Logic
│   ├── dashboard.html
│   └── index.html
├── package.json
└── README.md
```

## 🔐 Default Credentials
| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `12345` |
| **Manager** | `manager` | `12345` |
| **Driver** | `driver` | `12345` |
| **Admin** | `tejas` | `12345` |

## 🤝 Contributing
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
*Created by Tejas.*
