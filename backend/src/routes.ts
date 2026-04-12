import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { allowRoles, AuthRequest, authenticate } from "./auth";
import { config } from "./config";
import { query } from "./db";
import { clearDemoData, seedDemoData } from "./seed";
import { DataScope, Role } from "./types";

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

function parseId(value: string | string[] | undefined) {
  const source = Array.isArray(value) ? value[0] : value;
  if (!source) {
    return null;
  }

  const id = Number(source);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseOptionalDate(value?: string | null) {
  if (!value) {
    return null;
  }

  return value;
}

function buildPatchData(data: Record<string, unknown>) {
  return Object.entries(data).filter(([, value]) => value !== undefined);
}

function buildUpdateStatement(table: string, idColumn: string, id: number, data: Record<string, unknown>) {
  const entries = buildPatchData(data);
  if (!entries.length) {
    return null;
  }

  const setClause = entries.map(([column], index) => `${column} = $${index + 1}`).join(", ");
  const values = entries.map(([, value]) => value);
  values.push(id);

  return {
    sql: `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = $${entries.length + 1} RETURNING *`,
    values
  };
}

const roleSchema = z.enum(["admin", "project_manager", "accountant", "engineer", "viewer"] satisfies Role[]);

const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: roleSchema
});

const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: roleSchema.optional()
});

const clientCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  address: z.string().min(3),
  notes: z.string().optional().default(""),
  interactions: z.string().optional().default("")
});

const clientUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
  address: z.string().min(3).optional(),
  notes: z.string().optional(),
  interactions: z.string().optional()
});

const projectCreateSchema = z.object({
  name: z.string().min(3),
  type: z.string().min(2),
  clientId: z.number().int().nullable().optional(),
  durationDays: z.number().int().positive(),
  expectedCost: z.number().positive(),
  actualCost: z.number().nonnegative().default(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional().default("نشط")
});

const projectUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  type: z.string().min(2).optional(),
  clientId: z.number().int().nullable().optional(),
  durationDays: z.number().int().positive().optional(),
  expectedCost: z.number().positive().optional(),
  actualCost: z.number().nonnegative().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  status: z.string().optional()
});

const workforceCreateSchema = z.object({
  name: z.string().min(2),
  workerType: z.string().min(2),
  specialization: z.string().min(2),
  rating: z.number().min(0).max(5).optional().default(0),
  paymentDue: z.number().nonnegative().optional().default(0),
  phone: z.string().optional().nullable()
});

const workforceUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  workerType: z.string().min(2).optional(),
  specialization: z.string().min(2).optional(),
  rating: z.number().min(0).max(5).optional(),
  paymentDue: z.number().nonnegative().optional(),
  phone: z.string().nullable().optional()
});

const inventoryItemCreateSchema = z.object({
  name: z.string().min(2),
  unit: z.string().min(1),
  quantity: z.number().nonnegative(),
  minQuantity: z.number().nonnegative(),
  supplier: z.string().min(2)
});

const inventoryItemUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  unit: z.string().min(1).optional(),
  quantity: z.number().nonnegative().optional(),
  minQuantity: z.number().nonnegative().optional(),
  supplier: z.string().min(2).optional()
});

const movementCreateSchema = z.object({
  itemId: z.number().int(),
  movementType: z.string().min(2),
  quantity: z.number().positive(),
  note: z.string().optional().nullable(),
  movementDate: z.string().optional().nullable()
});

const movementUpdateSchema = z.object({
  itemId: z.number().int().optional(),
  movementType: z.string().min(2).optional(),
  quantity: z.number().positive().optional(),
  note: z.string().nullable().optional(),
  movementDate: z.string().nullable().optional()
});

const financialRecordCreateSchema = z.object({
  recordType: z.string().min(3),
  projectId: z.number().int().nullable().optional(),
  description: z.string().min(3),
  amount: z.number().positive(),
  recordDate: z.string()
});

const financialRecordUpdateSchema = z.object({
  recordType: z.string().min(3).optional(),
  projectId: z.number().int().nullable().optional(),
  description: z.string().min(3).optional(),
  amount: z.number().positive().optional(),
  recordDate: z.string().optional()
});

const invoiceCreateSchema = z.object({
  invoiceNo: z.string().min(3),
  clientId: z.number().int().nullable().optional(),
  projectId: z.number().int().nullable().optional(),
  total: z.number().positive(),
  paid: z.number().nonnegative().optional().default(0),
  status: z.string().min(2),
  dueDate: z.string().nullable().optional()
});

const invoiceUpdateSchema = z.object({
  invoiceNo: z.string().min(3).optional(),
  clientId: z.number().int().nullable().optional(),
  projectId: z.number().int().nullable().optional(),
  total: z.number().positive().optional(),
  paid: z.number().nonnegative().optional(),
  status: z.string().min(2).optional(),
  dueDate: z.string().nullable().optional()
});

const propertyCreateSchema = z.object({
  name: z.string().min(2),
  propertyType: z.string().min(2),
  status: z.string().min(2),
  location: z.string().min(2),
  price: z.number().positive()
});

const propertyUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  propertyType: z.string().min(2).optional(),
  status: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  price: z.number().positive().optional()
});

const installmentCreateSchema = z.object({
  propertyId: z.number().int(),
  customerName: z.string().min(2),
  amount: z.number().positive(),
  dueDate: z.string(),
  isPaid: z.boolean().optional().default(false)
});

const installmentUpdateSchema = z.object({
  propertyId: z.number().int().optional(),
  customerName: z.string().min(2).optional(),
  amount: z.number().positive().optional(),
  dueDate: z.string().optional(),
  isPaid: z.boolean().optional()
});

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

router.get("/users", authenticate, allowRoles("admin"), async (_req, res) => {
  const users = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return res.json(users.rows);
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
  const payload = projectCreateSchema.safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ message: "بيانات المشروع غير مكتملة" });
  }

  const body = payload.data;
  const inserted = await query(
    `INSERT INTO projects (name, type, client_id, duration_days, expected_cost, actual_cost, start_date, end_date, status, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)
     RETURNING *`,
    [
      body.name,
      body.type,
      body.clientId ?? null,
      body.durationDays,
      body.expectedCost,
      body.actualCost,
      parseOptionalDate(body.startDate),
      parseOptionalDate(body.endDate),
      body.status
    ]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.post("/users", authenticate, allowRoles("admin"), async (req, res) => {
  const payload = userCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات المستخدم غير مكتملة" });
  }

  const passwordHash = await bcrypt.hash(payload.data.password, 10);
  const inserted = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1,$2,$3,$4)
     RETURNING id, name, email, role, created_at`,
    [payload.data.name, payload.data.email, passwordHash, payload.data.role]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/users/:id", authenticate, allowRoles("admin"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم المستخدم غير صالح" });
  }

  const payload = userUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات المستخدم غير صحيحة" });
  }

  const updates: Record<string, unknown> = {
    name: payload.data.name,
    email: payload.data.email,
    role: payload.data.role
  };

  if (payload.data.password) {
    updates.password_hash = await bcrypt.hash(payload.data.password, 10);
  }

  const update = buildUpdateStatement("users", "id", id, updates);
  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const result = await query(update.sql, update.values);
  if (!result.rows.length) {
    return res.status(404).json({ message: "المستخدم غير موجود" });
  }

  const user = await query(
    `SELECT id, name, email, role, created_at FROM users WHERE id = $1`,
    [id]
  );

  return res.json(user.rows[0]);
});

router.delete("/users/:id", authenticate, allowRoles("admin"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم المستخدم غير صالح" });
  }

  const deleted = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "المستخدم غير موجود" });
  }

  return res.json({ message: "تم حذف المستخدم" });
});

router.post("/clients", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const payload = clientCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات العميل غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO clients (name, phone, address, notes, interactions, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`,
    [payload.data.name, payload.data.phone, payload.data.address, payload.data.notes, payload.data.interactions]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/clients/:id", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم العميل غير صالح" });
  }

  const payload = clientUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات العميل غير صحيحة" });
  }

  const update = buildUpdateStatement("clients", "id", id, {
    name: payload.data.name,
    phone: payload.data.phone,
    address: payload.data.address,
    notes: payload.data.notes,
    interactions: payload.data.interactions
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "العميل غير موجود" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/clients/:id", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم العميل غير صالح" });
  }

  const deleted = await query("DELETE FROM clients WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "العميل غير موجود" });
  }

  return res.json({ message: "تم حذف العميل" });
});

router.patch("/projects/:id", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم المشروع غير صالح" });
  }

  const payload = projectUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات المشروع غير صحيحة" });
  }

  const update = buildUpdateStatement("projects", "id", id, {
    name: payload.data.name,
    type: payload.data.type,
    client_id: payload.data.clientId,
    duration_days: payload.data.durationDays,
    expected_cost: payload.data.expectedCost,
    actual_cost: payload.data.actualCost,
    start_date: parseOptionalDate(payload.data.startDate),
    end_date: parseOptionalDate(payload.data.endDate),
    status: payload.data.status
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "المشروع غير موجود" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/projects/:id", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم المشروع غير صالح" });
  }

  const deleted = await query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "المشروع غير موجود" });
  }

  return res.json({ message: "تم حذف المشروع" });
});

router.post("/workforce", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const payload = workforceCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات العامل غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO workforce (name, worker_type, specialization, rating, payment_due, phone, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,false)
     RETURNING *`,
    [
      payload.data.name,
      payload.data.workerType,
      payload.data.specialization,
      payload.data.rating,
      payload.data.paymentDue,
      payload.data.phone ?? null
    ]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/workforce/:id", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم العامل غير صالح" });
  }

  const payload = workforceUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات العامل غير صحيحة" });
  }

  const update = buildUpdateStatement("workforce", "id", id, {
    name: payload.data.name,
    worker_type: payload.data.workerType,
    specialization: payload.data.specialization,
    rating: payload.data.rating,
    payment_due: payload.data.paymentDue,
    phone: payload.data.phone
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "العامل غير موجود" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/workforce/:id", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم العامل غير صالح" });
  }

  const deleted = await query("DELETE FROM workforce WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "العامل غير موجود" });
  }

  return res.json({ message: "تم حذف العامل" });
});

router.post("/inventory", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const payload = inventoryItemCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات الخامة غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO inventory_items (name, unit, quantity, min_quantity, supplier, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`,
    [payload.data.name, payload.data.unit, payload.data.quantity, payload.data.minQuantity, payload.data.supplier]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/inventory/:id", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم الخامة غير صالح" });
  }

  const payload = inventoryItemUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات الخامة غير صحيحة" });
  }

  const update = buildUpdateStatement("inventory_items", "id", id, {
    name: payload.data.name,
    unit: payload.data.unit,
    quantity: payload.data.quantity,
    min_quantity: payload.data.minQuantity,
    supplier: payload.data.supplier
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "الخامة غير موجودة" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/inventory/:id", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم الخامة غير صالح" });
  }

  const deleted = await query("DELETE FROM inventory_items WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "الخامة غير موجودة" });
  }

  return res.json({ message: "تم حذف الخامة" });
});

router.post("/inventory/movements", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const payload = movementCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات الحركة غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO inventory_movements (item_id, movement_type, quantity, note, movement_date, is_demo)
     VALUES ($1,$2,$3,$4,COALESCE($5,NOW()),false)
     RETURNING *`,
    [
      payload.data.itemId,
      payload.data.movementType,
      payload.data.quantity,
      payload.data.note ?? null,
      parseOptionalDate(payload.data.movementDate)
    ]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/inventory/movements/:id", authenticate, allowRoles("admin", "project_manager", "engineer"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم الحركة غير صالح" });
  }

  const payload = movementUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات الحركة غير صحيحة" });
  }

  const update = buildUpdateStatement("inventory_movements", "id", id, {
    item_id: payload.data.itemId,
    movement_type: payload.data.movementType,
    quantity: payload.data.quantity,
    note: payload.data.note,
    movement_date: parseOptionalDate(payload.data.movementDate)
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "الحركة غير موجودة" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/inventory/movements/:id", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم الحركة غير صالح" });
  }

  const deleted = await query("DELETE FROM inventory_movements WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "الحركة غير موجودة" });
  }

  return res.json({ message: "تم حذف الحركة" });
});

router.post("/finance/records", authenticate, allowRoles("admin", "accountant", "project_manager"), async (req, res) => {
  const payload = financialRecordCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات القيد المالي غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO financial_records (record_type, project_id, description, amount, record_date, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`,
    [
      payload.data.recordType,
      payload.data.projectId ?? null,
      payload.data.description,
      payload.data.amount,
      payload.data.recordDate
    ]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/finance/records/:id", authenticate, allowRoles("admin", "accountant", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم القيد المالي غير صالح" });
  }

  const payload = financialRecordUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات القيد المالي غير صحيحة" });
  }

  const update = buildUpdateStatement("financial_records", "id", id, {
    record_type: payload.data.recordType,
    project_id: payload.data.projectId,
    description: payload.data.description,
    amount: payload.data.amount,
    record_date: payload.data.recordDate
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "القيد المالي غير موجود" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/finance/records/:id", authenticate, allowRoles("admin", "accountant"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم القيد المالي غير صالح" });
  }

  const deleted = await query("DELETE FROM financial_records WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "القيد المالي غير موجود" });
  }

  return res.json({ message: "تم حذف القيد المالي" });
});

router.post("/finance/invoices", authenticate, allowRoles("admin", "accountant", "project_manager"), async (req, res) => {
  const payload = invoiceCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات الفاتورة غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO invoices (invoice_no, client_id, project_id, total, paid, status, due_date, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,false)
     RETURNING *`,
    [
      payload.data.invoiceNo,
      payload.data.clientId ?? null,
      payload.data.projectId ?? null,
      payload.data.total,
      payload.data.paid,
      payload.data.status,
      parseOptionalDate(payload.data.dueDate)
    ]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/finance/invoices/:id", authenticate, allowRoles("admin", "accountant", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم الفاتورة غير صالح" });
  }

  const payload = invoiceUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات الفاتورة غير صحيحة" });
  }

  const update = buildUpdateStatement("invoices", "id", id, {
    invoice_no: payload.data.invoiceNo,
    client_id: payload.data.clientId,
    project_id: payload.data.projectId,
    total: payload.data.total,
    paid: payload.data.paid,
    status: payload.data.status,
    due_date: parseOptionalDate(payload.data.dueDate)
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "الفاتورة غير موجودة" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/finance/invoices/:id", authenticate, allowRoles("admin", "accountant"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم الفاتورة غير صالح" });
  }

  const deleted = await query("DELETE FROM invoices WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "الفاتورة غير موجودة" });
  }

  return res.json({ message: "تم حذف الفاتورة" });
});

router.post("/properties", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const payload = propertyCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات العقار غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO properties (name, property_type, status, location, price, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`,
    [payload.data.name, payload.data.propertyType, payload.data.status, payload.data.location, payload.data.price]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/properties/:id", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم العقار غير صالح" });
  }

  const payload = propertyUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات العقار غير صحيحة" });
  }

  const update = buildUpdateStatement("properties", "id", id, {
    name: payload.data.name,
    property_type: payload.data.propertyType,
    status: payload.data.status,
    location: payload.data.location,
    price: payload.data.price
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "العقار غير موجود" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/properties/:id", authenticate, allowRoles("admin", "project_manager"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم العقار غير صالح" });
  }

  const deleted = await query("DELETE FROM properties WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "العقار غير موجود" });
  }

  return res.json({ message: "تم حذف العقار" });
});

router.post("/properties/installments", authenticate, allowRoles("admin", "project_manager", "accountant"), async (req, res) => {
  const payload = installmentCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات القسط غير مكتملة" });
  }

  const inserted = await query(
    `INSERT INTO installments (property_id, customer_name, amount, due_date, is_paid, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`,
    [payload.data.propertyId, payload.data.customerName, payload.data.amount, payload.data.dueDate, payload.data.isPaid]
  );

  return res.status(201).json(inserted.rows[0]);
});

router.patch("/properties/installments/:id", authenticate, allowRoles("admin", "project_manager", "accountant"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم القسط غير صالح" });
  }

  const payload = installmentUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "بيانات القسط غير صحيحة" });
  }

  const update = buildUpdateStatement("installments", "id", id, {
    property_id: payload.data.propertyId,
    customer_name: payload.data.customerName,
    amount: payload.data.amount,
    due_date: payload.data.dueDate,
    is_paid: payload.data.isPaid
  });

  if (!update) {
    return res.status(400).json({ message: "لا توجد حقول للتحديث" });
  }

  const updated = await query(update.sql, update.values);
  if (!updated.rows.length) {
    return res.status(404).json({ message: "القسط غير موجود" });
  }

  return res.json(updated.rows[0]);
});

router.delete("/properties/installments/:id", authenticate, allowRoles("admin", "project_manager", "accountant"), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "رقم القسط غير صالح" });
  }

  const deleted = await query("DELETE FROM installments WHERE id = $1 RETURNING id", [id]);
  if (!deleted.rows.length) {
    return res.status(404).json({ message: "القسط غير موجود" });
  }

  return res.json({ message: "تم حذف القسط" });
});

router.post("/demo/load", authenticate, allowRoles("admin"), async (_req, res) => {
  await seedDemoData();
  return res.json({ message: "تم تحميل بيانات التجربة بنجاح" });
});

router.delete("/demo/clear", authenticate, allowRoles("admin"), async (_req, res) => {
  await clearDemoData();
  return res.json({ message: "تم حذف بيانات التجربة" });
});
