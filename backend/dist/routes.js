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
    const payload = zod_1.z.object({
        name: zod_1.z.string().min(3),
        type: zod_1.z.string().min(2),
        clientId: zod_1.z.number().int(),
        durationDays: zod_1.z.number().int().positive(),
        expectedCost: zod_1.z.number().positive(),
        actualCost: zod_1.z.number().nonnegative().default(0)
    }).safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ message: "بيانات المشروع غير مكتملة" });
    }
    const body = payload.data;
    const inserted = await (0, db_1.query)(`INSERT INTO projects (name, type, client_id, duration_days, expected_cost, actual_cost, status, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,'نشط',false)
     RETURNING *`, [body.name, body.type, body.clientId, body.durationDays, body.expectedCost, body.actualCost]);
    return res.status(201).json(inserted.rows[0]);
});
exports.router.post("/demo/load", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (_req, res) => {
    await (0, seed_1.seedDemoData)();
    return res.json({ message: "تم تحميل بيانات التجربة بنجاح" });
});
exports.router.delete("/demo/clear", auth_1.authenticate, (0, auth_1.allowRoles)("admin"), async (_req, res) => {
    await (0, seed_1.clearDemoData)();
    return res.json({ message: "تم حذف بيانات التجربة" });
});
