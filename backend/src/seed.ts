import bcrypt from "bcryptjs";
import { query } from "./db";

export async function seedDemoData() {
  const existing = await query<{ count: string }>("SELECT COUNT(*)::text AS count FROM clients WHERE is_demo = true");
  if (Number(existing.rows[0].count) > 0) {
    await ensureDefaultUsers();
    return;
  }

  await ensureDefaultUsers();

  const clients = [
    ["أحمد محمد", "01012345678", "القاهرة الجديدة - التجمع الخامس", "عميل مميز", "اتصال أولي ومراجعة التصميم"],
    ["محمد علي", "01122334455", "مدينة نصر - الحي السابع", "متابعة أسبوعية", "زيارة الموقع مرتين"],
    ["سارة أحمد", "01299887766", "المعادي - زهراء المعادي", "مهتمة بالتشطيب الفاخر", "اعتماد عرض الأسعار"],
    ["كريم حسن", "01044556677", "الشيخ زايد - الحي الأول", "يركز على الالتزام بالوقت", "توقيع عقد التنفيذ"],
    ["ندى إبراهيم", "01566778899", "6 أكتوبر - الحي المتميز", "عميل استثماري", "طلب خطة أقساط مرنة"]
  ];

  const clientIds: number[] = [];
  for (const client of clients) {
    const inserted = await query<{ id: number }>(
      "INSERT INTO clients (name, phone, address, notes, interactions, is_demo) VALUES ($1,$2,$3,$4,$5,true) RETURNING id",
      client
    );
    clientIds.push(inserted.rows[0].id);
  }

  const projects = [
    ["مشروع فيلا التجمع الخامس", "فيلا", clientIds[0], 120, 1850000, 1695000, "2026-01-10", "2026-05-10", "نشط"],
    ["مشروع شقة 3 غرف في مدينة نصر", "شقة", clientIds[1], 75, 620000, 590000, "2026-02-01", "2026-04-16", "نشط"],
    ["مشروع محل تجاري في وسط البلد", "محل", clientIds[2], 60, 410000, 428000, "2026-01-20", "2026-03-20", "مكتمل"]
  ];

  const projectIds: number[] = [];
  for (const project of projects) {
    const inserted = await query<{ id: number }>(
      "INSERT INTO projects (name, type, client_id, duration_days, expected_cost, actual_cost, start_date, end_date, status, is_demo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true) RETURNING id",
      project
    );
    projectIds.push(inserted.rows[0].id);
  }

  const stageNames = ["كهرباء", "سباكة", "محارة", "دهانات", "تشطيبات نهائية"];
  for (const projectId of projectIds) {
    for (const stageName of stageNames) {
      await query(
        "INSERT INTO project_stages (project_id, name, progress, is_demo) VALUES ($1,$2,$3,true)",
        [projectId, stageName, Math.floor(Math.random() * 55) + 45]
      );
    }
  }

  const contractors = [
    ["مقاول أحمد الشريف", "مقاول", "أعمال كهرباء", 4.6, 85000, "01000010001"],
    ["مقاول سامح فؤاد", "مقاول", "أعمال سباكة", 4.4, 74000, "01000010002"],
    ["مقاول رامي سعد", "مقاول", "محارة وتشطيب", 4.7, 91000, "01000010003"],
    ["مقاول مينا عادل", "مقاول", "دهانات", 4.2, 56000, "01000010004"],
    ["مقاول ياسر فتحي", "مقاول", "تشطيبات نهائية", 4.8, 97000, "01000010005"]
  ];

  const workers = [
    ["محمد السيد", "عامل", "كهربائي", 4.3, 9000, "01010000001"],
    ["محمود حسن", "عامل", "سباك", 4.1, 8700, "01010000002"],
    ["إبراهيم علي", "عامل", "عامل محارة", 4.0, 7600, "01010000003"],
    ["حسين أحمد", "عامل", "دهان", 4.5, 9400, "01010000004"],
    ["خالد فاروق", "عامل", "فني سيراميك", 4.2, 8100, "01010000005"],
    ["مصطفى طارق", "عامل", "عامل تركيب", 4.1, 7900, "01010000006"],
    ["أدهم ربيع", "عامل", "فني جبس", 4.4, 8800, "01010000007"],
    ["عمر سعيد", "عامل", "عامل تشطيب", 4.3, 8600, "01010000008"],
    ["شريف ناصر", "عامل", "عامل نقل", 3.9, 7000, "01010000009"],
    ["وائل عادل", "عامل", "فني مواسير", 4.2, 8400, "01010000010"]
  ];

  for (const person of [...contractors, ...workers]) {
    await query(
      "INSERT INTO workforce (name, worker_type, specialization, rating, payment_due, phone, is_demo) VALUES ($1,$2,$3,$4,$5,$6,true)",
      person
    );
  }

  const inventory = [
    ["أسمنت", "طن", 145, 40, "شركة مصر للأسمنت"],
    ["طوب", "ألف طوبة", 62, 20, "مصنع النيل للطوب"],
    ["دهانات", "عبوة", 230, 80, "دلتا للدهانات"],
    ["سيراميك", "متر مربع", 980, 300, "الشرق للسيراميك"],
    ["مواسير", "متر", 1250, 400, "المتحدة للمواسير"]
  ];

  for (const item of inventory) {
    const inserted = await query<{ id: number }>(
      "INSERT INTO inventory_items (name, unit, quantity, min_quantity, supplier, is_demo) VALUES ($1,$2,$3,$4,$5,true) RETURNING id",
      item
    );

    await query(
      "INSERT INTO inventory_movements (item_id, movement_type, quantity, note, is_demo) VALUES ($1,'إضافة',$2,$3,true)",
      [inserted.rows[0].id, item[2], "رصيد افتتاحي"]
    );
  }

  const financial = [
    ["expense", projectIds[0], "شراء خامات كهرباء وسباكة", 220000, "2026-02-15"],
    ["expense", projectIds[1], "أجور عمال مرحلة المحارة", 68000, "2026-03-01"],
    ["expense", projectIds[2], "توريد سيراميك للمحل", 45000, "2026-02-10"],
    ["revenue", projectIds[0], "دفعة أولى من العميل", 650000, "2026-01-20"],
    ["revenue", projectIds[1], "دفعة منتصف التنفيذ", 280000, "2026-03-10"],
    ["revenue", projectIds[2], "تسوية نهائية", 470000, "2026-03-25"]
  ];

  for (const row of financial) {
    await query(
      "INSERT INTO financial_records (record_type, project_id, description, amount, record_date, is_demo) VALUES ($1,$2,$3,$4,$5,true)",
      row
    );
  }

  await query(
    "INSERT INTO invoices (invoice_no, client_id, project_id, total, paid, status, due_date, is_demo) VALUES ($1,$2,$3,$4,$5,$6,$7,true),($8,$9,$10,$11,$12,$13,$14,true),($15,$16,$17,$18,$19,$20,$21,true)",
    [
      "INV-2026-001", clientIds[0], projectIds[0], 750000, 650000, "مستحقة", "2026-04-30",
      "INV-2026-002", clientIds[1], projectIds[1], 320000, 280000, "مستحقة", "2026-04-20",
      "INV-2026-003", clientIds[2], projectIds[2], 470000, 470000, "مدفوعة", "2026-03-25"
    ]
  );

  const properties = [
    ["شقة A12", "شقة", "متاح", "مدينة نصر", 1950000],
    ["فيلا B7", "فيلا", "محجوز", "التجمع الخامس", 8700000],
    ["محل C3", "محل", "مباع", "وسط البلد", 3250000]
  ];

  const propertyIds: number[] = [];
  for (const property of properties) {
    const inserted = await query<{ id: number }>(
      "INSERT INTO properties (name, property_type, status, location, price, is_demo) VALUES ($1,$2,$3,$4,$5,true) RETURNING id",
      property
    );
    propertyIds.push(inserted.rows[0].id);
  }

  await query(
    "INSERT INTO installments (property_id, customer_name, amount, due_date, is_paid, is_demo) VALUES ($1,$2,$3,$4,$5,true),($6,$7,$8,$9,$10,true),($11,$12,$13,$14,$15,true)",
    [
      propertyIds[0], "محمد علي", 180000, "2026-05-01", false,
      propertyIds[1], "كريم حسن", 520000, "2026-06-15", false,
      propertyIds[2], "سارة أحمد", 300000, "2026-04-01", true
    ]
  );
}

export async function clearDemoData() {
  await query("DELETE FROM installments WHERE is_demo = true");
  await query("DELETE FROM properties WHERE is_demo = true");
  await query("DELETE FROM invoices WHERE is_demo = true");
  await query("DELETE FROM financial_records WHERE is_demo = true");
  await query("DELETE FROM inventory_movements WHERE is_demo = true");
  await query("DELETE FROM inventory_items WHERE is_demo = true");
  await query("DELETE FROM project_assignments WHERE is_demo = true");
  await query("DELETE FROM workforce WHERE is_demo = true");
  await query("DELETE FROM project_stages WHERE is_demo = true");
  await query("DELETE FROM projects WHERE is_demo = true");
  await query("DELETE FROM clients WHERE is_demo = true");
}

async function ensureDefaultUsers() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const accountantPassword = await bcrypt.hash("Account@123", 10);
  const engineerPassword = await bcrypt.hash("Engineer@123", 10);
  const viewerPassword = await bcrypt.hash("Viewer@123", 10);

  const users = [
    ["مدير النظام", "admin@erp.local", adminPassword, "admin"],
    ["مدير المشاريع", "pm@erp.local", adminPassword, "project_manager"],
    ["محاسب الشركة", "accountant@erp.local", accountantPassword, "accountant"],
    ["مهندس الموقع", "engineer@erp.local", engineerPassword, "engineer"],
    ["موظف عرض", "viewer@erp.local", viewerPassword, "viewer"]
  ];

  for (const user of users) {
    await query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING",
      user
    );
  }
}
