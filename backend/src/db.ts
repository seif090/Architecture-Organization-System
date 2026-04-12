import { Pool } from "pg";
import type { QueryResultRow } from "pg";
import { config } from "./config";
import { seedDemoData } from "./seed";

export const pool = new Pool({
  connectionString: config.databaseUrl
});

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await pool.query<T>(text, params);
  return result;
}

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      notes TEXT DEFAULT '',
      interactions TEXT DEFAULT '',
      is_demo BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      duration_days INTEGER NOT NULL,
      expected_cost NUMERIC(14,2) NOT NULL,
      actual_cost NUMERIC(14,2) NOT NULL,
      start_date DATE,
      end_date DATE,
      status TEXT DEFAULT 'نشط',
      is_demo BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS project_stages (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      progress INTEGER NOT NULL,
      is_demo BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS workforce (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      worker_type TEXT NOT NULL,
      specialization TEXT NOT NULL,
      rating NUMERIC(3,2) DEFAULT 0,
      payment_due NUMERIC(12,2) DEFAULT 0,
      phone TEXT,
      is_demo BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS project_assignments (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      workforce_id INTEGER NOT NULL REFERENCES workforce(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      is_demo BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      quantity NUMERIC(12,2) NOT NULL,
      min_quantity NUMERIC(12,2) NOT NULL,
      supplier TEXT NOT NULL,
      is_demo BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS inventory_movements (
      id SERIAL PRIMARY KEY,
      item_id INTEGER NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
      movement_type TEXT NOT NULL,
      quantity NUMERIC(12,2) NOT NULL,
      note TEXT,
      movement_date TIMESTAMP DEFAULT NOW(),
      is_demo BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS financial_records (
      id SERIAL PRIMARY KEY,
      record_type TEXT NOT NULL,
      project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
      description TEXT NOT NULL,
      amount NUMERIC(14,2) NOT NULL,
      record_date DATE NOT NULL,
      is_demo BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_no TEXT NOT NULL,
      client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
      total NUMERIC(14,2) NOT NULL,
      paid NUMERIC(14,2) DEFAULT 0,
      status TEXT NOT NULL,
      due_date DATE,
      is_demo BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      property_type TEXT NOT NULL,
      status TEXT NOT NULL,
      location TEXT NOT NULL,
      price NUMERIC(14,2) NOT NULL,
      is_demo BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS installments (
      id SERIAL PRIMARY KEY,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      amount NUMERIC(14,2) NOT NULL,
      due_date DATE NOT NULL,
      is_paid BOOLEAN DEFAULT FALSE,
      is_demo BOOLEAN DEFAULT FALSE
    );
  `);

  await seedDemoData();
}
