"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const auth_1 = require("./auth");
const config_1 = require("./config");
const db_1 = require("./db");
const seed_1 = require("./seed");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const selfRegisterRoleSchema = zod_1.z.enum(["project_manager", "accountant", "engineer", "viewer"]);
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: selfRegisterRoleSchema
});
const scopeToClause = (scope) => {
    if (scope === "demo") {
        return "is_demo = true";
    }
    if (scope === "real") {
        return "is_demo = false";
    }
    return "1=1";
};
function getScope(value) {
    if (value === "demo" || value === "real" || value === "all") {
        return value;
    }
    return "all";
}
function parseId(value) {
    const source = Array.isArray(value) ? value[0] : value;
    if (!source) {
        return null;
    }
    const id = Number(source);
    return Number.isInteger(id) && id > 0 ? id : null;
}
function parseOptionalDate(value) {
    if (!value) {
        return null;
    }
    return value;
}
function buildPatchData(data) {
    return Object.entries(data).filter(([, value]) => value !== undefined);
}
function buildUpdateStatement(table, idColumn, id, data) {
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
const roleSchema = zod_1.z.enum(["admin", "project_manager", "accountant", "engineer", "viewer"]);
const userCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: roleSchema
});
const userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    role: roleSchema.optional()
});
const clientCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(5),
    address: zod_1.z.string().min(3),
    notes: zod_1.z.string().optional().default(""),
    interactions: zod_1.z.string().optional().default("")
});
const clientUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().min(5).optional(),
    address: zod_1.z.string().min(3).optional(),
    notes: zod_1.z.string().optional(),
    interactions: zod_1.z.string().optional()
});
const projectCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    type: zod_1.z.string().min(2),
    clientId: zod_1.z.number().int().nullable().optional(),
    durationDays: zod_1.z.number().int().positive(),
    expectedCost: zod_1.z.number().positive(),
    actualCost: zod_1.z.number().nonnegative().default(0),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    status: zod_1.z.string().optional().default("نشط")
});
const projectUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    type: zod_1.z.string().min(2).optional(),
    clientId: zod_1.z.number().int().nullable().optional(),
    durationDays: zod_1.z.number().int().positive().optional(),
    expectedCost: zod_1.z.number().positive().optional(),
    actualCost: zod_1.z.number().nonnegative().optional(),
    startDate: zod_1.z.string().nullable().optional(),
    endDate: zod_1.z.string().nullable().optional(),
    status: zod_1.z.string().optional()
});
const workforceCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    workerType: zod_1.z.string().min(2),
    specialization: zod_1.z.string().min(2),
    rating: zod_1.z.number().min(0).max(5).optional().default(0),
    paymentDue: zod_1.z.number().nonnegative().optional().default(0),
    phone: zod_1.z.string().optional().nullable()
});
const workforceUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    workerType: zod_1.z.string().min(2).optional(),
    specialization: zod_1.z.string().min(2).optional(),
    rating: zod_1.z.number().min(0).max(5).optional(),
    paymentDue: zod_1.z.number().nonnegative().optional(),
    phone: zod_1.z.string().nullable().optional()
});
const inventoryItemCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    unit: zod_1.z.string().min(1),
    quantity: zod_1.z.number().nonnegative(),
    minQuantity: zod_1.z.number().nonnegative(),
    supplier: zod_1.z.string().min(2)
});
const inventoryItemUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    unit: zod_1.z.string().min(1).optional(),
    quantity: zod_1.z.number().nonnegative().optional(),
    minQuantity: zod_1.z.number().nonnegative().optional(),
    supplier: zod_1.z.string().min(2).optional()
});
const movementCreateSchema = zod_1.z.object({
    itemId: zod_1.z.number().int(),
    movementType: zod_1.z.string().min(2),
    quantity: zod_1.z.number().positive(),
    note: zod_1.z.string().optional().nullable(),
    movementDate: zod_1.z.string().optional().nullable()
});
const movementUpdateSchema = zod_1.z.object({
    itemId: zod_1.z.number().int().optional(),
    movementType: zod_1.z.string().min(2).optional(),
    quantity: zod_1.z.number().positive().optional(),
    note: zod_1.z.string().nullable().optional(),
    movementDate: zod_1.z.string().nullable().optional()
});
const financialRecordCreateSchema = zod_1.z.object({
    recordType: zod_1.z.string().min(3),
    projectId: zod_1.z.number().int().nullable().optional(),
    description: zod_1.z.string().min(3),
    amount: zod_1.z.number().positive(),
    recordDate: zod_1.z.string()
});
const financialRecordUpdateSchema = zod_1.z.object({
    recordType: zod_1.z.string().min(3).optional(),
    projectId: zod_1.z.number().int().nullable().optional(),
    description: zod_1.z.string().min(3).optional(),
    amount: zod_1.z.number().positive().optional(),
    recordDate: zod_1.z.string().optional()
});
const invoiceCreateSchema = zod_1.z.object({
    invoiceNo: zod_1.z.string().min(3),
    clientId: zod_1.z.number().int().nullable().optional(),
    projectId: zod_1.z.number().int().nullable().optional(),
    total: zod_1.z.number().positive(),
    paid: zod_1.z.number().nonnegative().optional().default(0),
    status: zod_1.z.string().min(2),
    dueDate: zod_1.z.string().nullable().optional()
});
const invoiceUpdateSchema = zod_1.z.object({
    invoiceNo: zod_1.z.string().min(3).optional(),
    clientId: zod_1.z.number().int().nullable().optional(),
    projectId: zod_1.z.number().int().nullable().optional(),
    total: zod_1.z.number().positive().optional(),
    paid: zod_1.z.number().nonnegative().optional(),
    status: zod_1.z.string().min(2).optional(),
    dueDate: zod_1.z.string().nullable().optional()
});
const propertyCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    propertyType: zod_1.z.string().min(2),
    status: zod_1.z.string().min(2),
    location: zod_1.z.string().min(2),
    price: zod_1.z.number().positive()
});
const propertyUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    propertyType: zod_1.z.string().min(2).optional(),
    status: zod_1.z.string().min(2).optional(),
    location: zod_1.z.string().min(2).optional(),
    price: zod_1.z.number().positive().optional()
});
const installmentCreateSchema = zod_1.z.object({
    propertyId: zod_1.z.number().int(),
    customerName: zod_1.z.string().min(2),
    amount: zod_1.z.number().positive(),
    dueDate: zod_1.z.string(),
    isPaid: zod_1.z.boolean().optional().default(false)
});
const installmentUpdateSchema = zod_1.z.object({
    propertyId: zod_1.z.number().int().optional(),
    customerName: zod_1.z.string().min(2).optional(),
    amount: zod_1.z.number().positive().optional(),
    dueDate: zod_1.z.string().optional(),
    isPaid: zod_1.z.boolean().optional()
});
exports.router = (0, express_1.Router)();
exports.router.post("/auth/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "بيانات تسجيل الدخول غير صحيحة" });
    }
    const { email, password } = parsed.data;
    const user = await (0, db_1.query)("SELECT id, name, email, role, password_hash FROM users WHERE email = $1", [email]);
    if (!user.rows.length) {
        return res.status(401).json({ message: "البريد أو كلمة المرور غير صحيحة" });
    }
    const found = user.rows[0];
    const valid = await bcryptjs_1.default.compare(password, found.password_hash);
    if (!valid) {
        return res.status(401).json({ message: "البريد أو كلمة المرور غير صحيحة" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: found.id, role: found.role, name: found.name }, config_1.config.jwtSecret, {
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
exports.router.post("/auth/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "بيانات التسجيل غير صحيحة" });
    }
    const { name, email, password, role } = parsed.data;
    const existing = await (0, db_1.query)("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) {
        return res.status(409).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const inserted = await (0, db_1.query)(`INSERT INTO users (name, email, password_hash, role, is_demo)
     VALUES ($1,$2,$3,$4,false)
     RETURNING id, name, email, role`, [name, email, passwordHash, role]);
    const created = inserted.rows[0];
    const token = jsonwebtoken_1.default.sign({ userId: created.id, role: created.role, name: created.name }, config_1.config.jwtSecret, {
        expiresIn: "8h"
    });
    return res.status(201).json({
        token,
        user: {
            id: created.id,
            name: created.name,
            email: created.email,
            role: created.role
        }
    });
});
exports.router.get("/dashboard", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const totals = await (0, db_1.query)(`
      SELECT
        (SELECT COUNT(*)::text FROM projects WHERE ${clause}) AS projects,
        (SELECT COUNT(*)::text FROM projects WHERE status = 'نشط' AND ${clause}) AS active_projects,
        (SELECT COUNT(*)::text FROM clients WHERE ${clause}) AS clients,
        (SELECT COALESCE(SUM(amount),0)::text FROM financial_records WHERE record_type = 'expense' AND ${clause}) AS expenses,
        (SELECT COALESCE(SUM(amount),0)::text FROM financial_records WHERE record_type = 'revenue' AND ${clause}) AS revenues
    `);
    const pipeline = await (0, db_1.query)(`SELECT name AS stage, ROUND(AVG(progress),2)::float AS avg_progress
     FROM project_stages
     WHERE ${clause}
     GROUP BY name
     ORDER BY name`);
    const profitByProject = await (0, db_1.query)(`
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
    `);
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
exports.router.get("/projects", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const result = await (0, db_1.query)(`SELECT p.*, c.name AS client_name
     FROM projects p
     LEFT JOIN clients c ON c.id = p.client_id
     WHERE p.${clause}
     ORDER BY p.created_at DESC`);
    return res.json(result.rows);
});
exports.router.get("/projects/stages", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const result = await (0, db_1.query)(`SELECT ps.*, p.name AS project_name
     FROM project_stages ps
     JOIN projects p ON p.id = ps.project_id
     WHERE ps.${clause}
     ORDER BY p.name, ps.id`);
    return res.json(result.rows);
});
exports.router.get("/clients", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const result = await (0, db_1.query)(`SELECT c.*,
      COALESCE((SELECT COUNT(*) FROM projects p WHERE p.client_id = c.id),0) AS projects_count
      FROM clients c
      WHERE c.${clause}
      ORDER BY c.created_at DESC`);
    return res.json(result.rows);
});
exports.router.get("/users", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (_req, res) => {
    const users = await (0, db_1.query)(`SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`);
    return res.json(users.rows);
});
exports.router.get("/workforce", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const result = await (0, db_1.query)(`SELECT w.*,
      COALESCE((SELECT COUNT(*) FROM project_assignments pa WHERE pa.workforce_id = w.id),0) AS assignments_count
      FROM workforce w
      WHERE w.${clause}
      ORDER BY w.worker_type DESC, w.created_at DESC`);
    return res.json(result.rows);
});
exports.router.get("/inventory", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const result = await (0, db_1.query)(`SELECT *
      FROM inventory_items
      WHERE ${clause}
      ORDER BY created_at DESC`);
    return res.json(result.rows);
});
exports.router.get("/inventory/movements", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const result = await (0, db_1.query)(`SELECT m.*, i.name AS item_name
     FROM inventory_movements m
     JOIN inventory_items i ON i.id = m.item_id
     WHERE m.${clause}
     ORDER BY m.movement_date DESC`);
    return res.json(result.rows);
});
exports.router.get("/finance", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "accountant", "project_manager"), async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const records = await (0, db_1.query)(`SELECT fr.*, p.name AS project_name
     FROM financial_records fr
     LEFT JOIN projects p ON p.id = fr.project_id
     WHERE fr.${clause}
     ORDER BY fr.record_date DESC`);
    const invoices = await (0, db_1.query)(`SELECT i.*, c.name AS client_name, p.name AS project_name
     FROM invoices i
     LEFT JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.${clause}
     ORDER BY i.created_at DESC`);
    return res.json({ records: records.rows, invoices: invoices.rows });
});
exports.router.get("/properties", auth_1.authenticate, async (req, res) => {
    const scope = getScope(req.query.scope);
    const clause = scopeToClause(scope);
    const properties = await (0, db_1.query)(`SELECT * FROM properties WHERE ${clause} ORDER BY created_at DESC`);
    const installments = await (0, db_1.query)(`SELECT ins.*, p.name AS property_name
     FROM installments ins
     JOIN properties p ON p.id = ins.property_id
     WHERE ins.${clause}
     ORDER BY ins.due_date ASC`);
    return res.json({ properties: properties.rows, installments: installments.rows });
});
exports.router.post("/projects", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
    const payload = projectCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات المشروع غير مكتملة" });
    }
    const body = payload.data;
    const inserted = await (0, db_1.query)(`INSERT INTO projects (name, type, client_id, duration_days, expected_cost, actual_cost, start_date, end_date, status, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)
     RETURNING *`, [
        body.name,
        body.type,
        body.clientId ?? null,
        body.durationDays,
        body.expectedCost,
        body.actualCost,
        parseOptionalDate(body.startDate),
        parseOptionalDate(body.endDate),
        body.status
    ]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.post("/users", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (req, res) => {
    const payload = userCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات المستخدم غير مكتملة" });
    }
    const passwordHash = await bcryptjs_1.default.hash(payload.data.password, 10);
    const inserted = await (0, db_1.query)(`INSERT INTO users (name, email, password_hash, role)
     VALUES ($1,$2,$3,$4)
     RETURNING id, name, email, role, created_at`, [payload.data.name, payload.data.email, passwordHash, payload.data.role]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/users/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم المستخدم غير صالح" });
    }
    const payload = userUpdateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات المستخدم غير صحيحة" });
    }
    const updates = {
        name: payload.data.name,
        email: payload.data.email,
        role: payload.data.role
    };
    if (payload.data.password) {
        updates.password_hash = await bcryptjs_1.default.hash(payload.data.password, 10);
    }
    const update = buildUpdateStatement("users", "id", id, updates);
    if (!update) {
        return res.status(400).json({ message: "لا توجد حقول للتحديث" });
    }
    const result = await (0, db_1.query)(update.sql, update.values);
    if (!result.rows.length) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    const user = await (0, db_1.query)(`SELECT id, name, email, role, created_at FROM users WHERE id = $1`, [id]);
    return res.json(user.rows[0]);
});
exports.router.delete("/users/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم المستخدم غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    return res.json({ message: "تم حذف المستخدم" });
});
exports.router.post("/clients", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
    const payload = clientCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات العميل غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO clients (name, phone, address, notes, interactions, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`, [payload.data.name, payload.data.phone, payload.data.address, payload.data.notes, payload.data.interactions]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/clients/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "العميل غير موجود" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/clients/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم العميل غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM clients WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "العميل غير موجود" });
    }
    return res.json({ message: "تم حذف العميل" });
});
exports.router.patch("/projects/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "المشروع غير موجود" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/projects/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم المشروع غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "المشروع غير موجود" });
    }
    return res.json({ message: "تم حذف المشروع" });
});
exports.router.post("/workforce", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
    const payload = workforceCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات العامل غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO workforce (name, worker_type, specialization, rating, payment_due, phone, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,false)
     RETURNING *`, [
        payload.data.name,
        payload.data.workerType,
        payload.data.specialization,
        payload.data.rating,
        payload.data.paymentDue,
        payload.data.phone ?? null
    ]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/workforce/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "العامل غير موجود" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/workforce/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم العامل غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM workforce WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "العامل غير موجود" });
    }
    return res.json({ message: "تم حذف العامل" });
});
exports.router.post("/inventory", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
    const payload = inventoryItemCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات الخامة غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO inventory_items (name, unit, quantity, min_quantity, supplier, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`, [payload.data.name, payload.data.unit, payload.data.quantity, payload.data.minQuantity, payload.data.supplier]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/inventory/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "الخامة غير موجودة" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/inventory/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم الخامة غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM inventory_items WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "الخامة غير موجودة" });
    }
    return res.json({ message: "تم حذف الخامة" });
});
exports.router.post("/inventory/movements", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
    const payload = movementCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات الحركة غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO inventory_movements (item_id, movement_type, quantity, note, movement_date, is_demo)
     VALUES ($1,$2,$3,$4,COALESCE($5,NOW()),false)
     RETURNING *`, [
        payload.data.itemId,
        payload.data.movementType,
        payload.data.quantity,
        payload.data.note ?? null,
        parseOptionalDate(payload.data.movementDate)
    ]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/inventory/movements/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "engineer"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "الحركة غير موجودة" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/inventory/movements/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم الحركة غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM inventory_movements WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "الحركة غير موجودة" });
    }
    return res.json({ message: "تم حذف الحركة" });
});
exports.router.post("/finance/records", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "accountant", "project_manager"), async (req, res) => {
    const payload = financialRecordCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات القيد المالي غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO financial_records (record_type, project_id, description, amount, record_date, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`, [
        payload.data.recordType,
        payload.data.projectId ?? null,
        payload.data.description,
        payload.data.amount,
        payload.data.recordDate
    ]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/finance/records/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "accountant", "project_manager"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "القيد المالي غير موجود" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/finance/records/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "accountant"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم القيد المالي غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM financial_records WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "القيد المالي غير موجود" });
    }
    return res.json({ message: "تم حذف القيد المالي" });
});
exports.router.post("/finance/invoices", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "accountant", "project_manager"), async (req, res) => {
    const payload = invoiceCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات الفاتورة غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO invoices (invoice_no, client_id, project_id, total, paid, status, due_date, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,false)
     RETURNING *`, [
        payload.data.invoiceNo,
        payload.data.clientId ?? null,
        payload.data.projectId ?? null,
        payload.data.total,
        payload.data.paid,
        payload.data.status,
        parseOptionalDate(payload.data.dueDate)
    ]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/finance/invoices/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "accountant", "project_manager"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "الفاتورة غير موجودة" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/finance/invoices/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "accountant"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم الفاتورة غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM invoices WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "الفاتورة غير موجودة" });
    }
    return res.json({ message: "تم حذف الفاتورة" });
});
exports.router.post("/properties", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
    const payload = propertyCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات العقار غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO properties (name, property_type, status, location, price, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`, [payload.data.name, payload.data.propertyType, payload.data.status, payload.data.location, payload.data.price]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/properties/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "العقار غير موجود" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/properties/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم العقار غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM properties WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "العقار غير موجود" });
    }
    return res.json({ message: "تم حذف العقار" });
});
exports.router.post("/properties/installments", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "accountant"), async (req, res) => {
    const payload = installmentCreateSchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات القسط غير مكتملة" });
    }
    const inserted = await (0, db_1.query)(`INSERT INTO installments (property_id, customer_name, amount, due_date, is_paid, is_demo)
     VALUES ($1,$2,$3,$4,$5,false)
     RETURNING *`, [payload.data.propertyId, payload.data.customerName, payload.data.amount, payload.data.dueDate, payload.data.isPaid]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.patch("/properties/installments/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "accountant"), async (req, res) => {
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
    const updated = await (0, db_1.query)(update.sql, update.values);
    if (!updated.rows.length) {
        return res.status(404).json({ message: "القسط غير موجود" });
    }
    return res.json(updated.rows[0]);
});
exports.router.delete("/properties/installments/:id", auth_1.authenticate, (0, auth_1.allowRoles)("admin", "project_manager", "accountant"), async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "رقم القسط غير صالح" });
    }
    const deleted = await (0, db_1.query)("DELETE FROM installments WHERE id = $1 RETURNING id", [id]);
    if (!deleted.rows.length) {
        return res.status(404).json({ message: "القسط غير موجود" });
    }
    return res.json({ message: "تم حذف القسط" });
});
exports.router.post("/demo/load", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (_req, res) => {
    await (0, seed_1.seedDemoData)();
    return res.json({ message: "تم تحميل بيانات التجربة بنجاح" });
});
exports.router.delete("/demo/clear", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (_req, res) => {
    await (0, seed_1.clearDemoData)();
    return res.json({ message: "تم حذف بيانات التجربة" });
});
