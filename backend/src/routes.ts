import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { allowRoles, AuthRequest, authenticate } from "./auth";
import { config } from "./config";
import { query } from "./db";
import { clearDemoData, seedDemoData } from "./seed";
import { DataScope } from "./types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const scopeToClause = (scope: DataScope) => {
  if (scope === "demo") {
    return "is_demo = true";
  }

  if (scope === "real") {
    return "is_demo = false";
  }

  return "1=1";
};

function getScope(value: unknown): DataScope {
  if (value === "demo" || value === "real" || value === "all") {
    return value;
  }

  return "all";
}

export const router = Router();

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "بيانات تسجيل الدخول غير صحيحة" });
  }

  const { email, password } = parsed.data;
  const user = await query<{
    id: number;
    name: string;
    email: string;
    role: string;
    password_hash: string;
  }>("SELECT id, name, email, role, password_hash FROM users WHERE email = $1", [email]);

  if (!user.rows.length) {
    return res.status(401).json({ message: "البريد أو كلمة المرور غير صحيحة" });
  }

  const found = user.rows[0];
  const valid = await bcrypt.compare(password, found.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "البريد أو كلمة المرور غير صحيحة" });
  }

  const token = jwt.sign({ userId: found.id, role: found.role, name: found.name }, config.jwtSecret, {
    expiresIn: "8h"
  });

  return res.json({
    token,
    user: {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role
    }
  });
});

router.get("/dashboard", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);

  const totals = await query<{
    projects: string;
    active_projects: string;
    clients: string;
    expenses: string;
    revenues: string;
  }>(
    `
      SELECT
        (SELECT COUNT(*)::text FROM projects WHERE ${clause}) AS projects,
        (SELECT COUNT(*)::text FROM projects WHERE status = 'نشط' AND ${clause}) AS active_projects,
        (SELECT COUNT(*)::text FROM clients WHERE ${clause}) AS clients,
        (SELECT COALESCE(SUM(amount),0)::text FROM financial_records WHERE record_type = 'expense' AND ${clause}) AS expenses,
        (SELECT COALESCE(SUM(amount),0)::text FROM financial_records WHERE record_type = 'revenue' AND ${clause}) AS revenues
    `
  );

  const pipeline = await query<{
    stage: string;
    avg_progress: number;
  }>(
    `SELECT name AS stage, ROUND(AVG(progress),2)::float AS avg_progress
     FROM project_stages
     WHERE ${clause}
     GROUP BY name
     ORDER BY name`
  );

  const profitByProject = await query<{
    project: string;
    expected_cost: string;
    actual_cost: string;
    profit: string;
  }>(
    `
      SELECT p.name AS project,
             p.expected_cost::text,
             p.actual_cost::text,
             (COALESCE(SUM(CASE WHEN fr.record_type='revenue' THEN fr.amount ELSE 0 END),0) -
              COALESCE(SUM(CASE WHEN fr.record_type='expense' THEN fr.amount ELSE 0 END),0))::text AS profit
      FROM projects p
      LEFT JOIN financial_records fr ON fr.project_id = p.id
      WHERE p.${clause}
      GROUP BY p.id
      ORDER BY p.name
    `
  );

  const row = totals.rows[0];
  const revenues = Number(row.revenues);
  const expenses = Number(row.expenses);

  return res.json({
    totals: {
      projects: Number(row.projects),
      activeProjects: Number(row.active_projects),
      clients: Number(row.clients),
      expenses,
      revenues,
      totalProfit: revenues - expenses
    },
    pipeline: pipeline.rows,
    profitByProject: profitByProject.rows
  });
});

router.get("/projects", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);
  const result = await query(
    `SELECT p.*, c.name AS client_name
     FROM projects p
     LEFT JOIN clients c ON c.id = p.client_id
     WHERE p.${clause}
     ORDER BY p.created_at DESC`
  );
  return res.json(result.rows);
});

router.get("/projects/stages", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);
  const result = await query(
    `SELECT ps.*, p.name AS project_name
     FROM project_stages ps
     JOIN projects p ON p.id = ps.project_id
     WHERE ps.${clause}
     ORDER BY p.name, ps.id`
  );
  return res.json(result.rows);
});

router.get("/clients", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);

  const result = await query(
    `SELECT c.*,
      COALESCE((SELECT COUNT(*) FROM projects p WHERE p.client_id = c.id),0) AS projects_count
      FROM clients c
      WHERE c.${clause}
      ORDER BY c.created_at DESC`
  );
  return res.json(result.rows);
});

router.get("/workforce", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);
  const result = await query(
    `SELECT w.*,
      COALESCE((SELECT COUNT(*) FROM project_assignments pa WHERE pa.workforce_id = w.id),0) AS assignments_count
      FROM workforce w
      WHERE w.${clause}
      ORDER BY w.worker_type DESC, w.created_at DESC`
  );
  return res.json(result.rows);
});

router.get("/inventory", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);
  const result = await query(
    `SELECT *
      FROM inventory_items
      WHERE ${clause}
      ORDER BY created_at DESC`
  );
  return res.json(result.rows);
});

router.get("/inventory/movements", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);
  const result = await query(
    `SELECT m.*, i.name AS item_name
     FROM inventory_movements m
     JOIN inventory_items i ON i.id = m.item_id
     WHERE m.${clause}
     ORDER BY m.movement_date DESC`
  );
  return res.json(result.rows);
});

router.get("/finance", authenticate, allowRoles("admin", "accountant", "project_manager"), async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);
  const records = await query(
    `SELECT fr.*, p.name AS project_name
     FROM financial_records fr
     LEFT JOIN projects p ON p.id = fr.project_id
     WHERE fr.${clause}
     ORDER BY fr.record_date DESC`
  );

  const invoices = await query(
    `SELECT i.*, c.name AS client_name, p.name AS project_name
     FROM invoices i
     LEFT JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.${clause}
     ORDER BY i.created_at DESC`
  );

  return res.json({ records: records.rows, invoices: invoices.rows });
});

router.get("/properties", authenticate, async (req, res) => {
  const scope = getScope(req.query.scope);
  const clause = scopeToClause(scope);

  const properties = await query(
    `SELECT * FROM properties WHERE ${clause} ORDER BY created_at DESC`
  );
  const installments = await query(
    `SELECT ins.*, p.name AS property_name
     FROM installments ins
     JOIN properties p ON p.id = ins.property_id
     WHERE ins.${clause}
     ORDER BY ins.due_date ASC`
  );

  return res.json({ properties: properties.rows, installments: installments.rows });
});

router.post("/projects", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req: AuthRequest, res) => {
  const payload = z.object({
    name: z.string().min(3),
    type: z.string().min(2),
    clientId: z.number().int(),
    durationDays: z.number().int().positive(),
    expectedCost: z.number().positive(),
    actualCost: z.number().nonnegative().default(0)
  }).safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ message: "بيانات المشروع غير مكتملة" });
  }

  const body = payload.data;
  const inserted = await query(
    `INSERT INTO projects (name, type, client_id, duration_days, expected_cost, actual_cost, status, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,'نشط',false)
     RETURNING *`,
    [body.name, body.type, body.clientId, body.durationDays, body.expectedCost, body.actualCost]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.post("/demo/load", authenticate, allowRoles("admin"), async (_req, res) => {
  await seedDemoData();
  return res.json({ message: "تم تحميل بيانات التجربة بنجاح" });
});

router.delete("/demo/clear", authenticate, allowRoles("admin"), async (_req, res) => {
  await clearDemoData();
  return res.json({ message: "تم حذف بيانات التجربة" });
});
