import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { api } from "../api";
import { FormDialogShell } from "../components/FormDialogShell";
import { PageHero } from "../components/PageHero";
import { StatusChip } from "../components/StatusChip";

type RecordForm = {
  recordType: string;
  projectId: string;
  description: string;
  amount: string;
  recordDate: string;
};

type InvoiceForm = {
  invoiceNo: string;
  clientId: string;
  projectId: string;
  total: string;
  paid: string;
  status: string;
  dueDate: string;
};

const today = new Date().toISOString().slice(0, 10);

const emptyRecord: RecordForm = {
  recordType: "expense",
  projectId: "",
  description: "",
  amount: "0",
  recordDate: today
};

const emptyInvoice: InvoiceForm = {
  invoiceNo: "",
  clientId: "",
  projectId: "",
  total: "0",
  paid: "0",
  status: "مستحقة",
  dueDate: today
};

export function FinancePage({
  records,
  invoices,
  isViewer,
  onRefresh
}: {
  records: any[];
  invoices: any[];
  isViewer: boolean;
  onRefresh: () => Promise<void> | void;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openRecord, setOpenRecord] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [recordForm, setRecordForm] = useState<RecordForm>(emptyRecord);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>(emptyInvoice);

  const exportFinanceReport = () => {
    const headerRecords = "type,project,description,amount,date";
    const recordsRows = records.map((r) => [
      r.record_type,
      r.project_name || "",
      r.description || "",
      Number(r.amount || 0),
      String(r.record_date || "").slice(0, 10)
    ].join(","));

    const headerInvoices = "invoice_no,client,project,total,paid,status,due_date";
    const invoicesRows = invoices.map((i) => [
      i.invoice_no || "",
      i.client_name || "",
      i.project_name || "",
      Number(i.total || 0),
      Number(i.paid || 0),
      i.status || "",
      String(i.due_date || "").slice(0, 10)
    ].join(","));

    const csv = [headerRecords, ...recordsRows, "", headerInvoices, ...invoicesRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finance-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (isViewer) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontSize: 26, fontWeight: 900 }}>لا توجد صلاحية للحسابات</Typography>
        </CardContent>
      </Card>
    );
  }

  const expenses = records.filter((r) => r.record_type === "expense").reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const revenues = records.filter((r) => r.record_type === "revenue").reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const dueInvoices = invoices.filter((i) => i.status === "مستحقة").length;
  const net = revenues - expenses;
  const chartPoints = [48, 58, 72, 66, 84, 74];

  const openCreateRecord = () => {
    setEditingRecordId(null);
    setRecordForm(emptyRecord);
    setOpenRecord(true);
  };

  const openEditRecord = (row: any) => {
    setEditingRecordId(row.id);
    setRecordForm({
      recordType: row.record_type || "expense",
      projectId: row.project_id ? String(row.project_id) : "",
      description: row.description || "",
      amount: String(row.amount || 0),
      recordDate: String(row.record_date || today).slice(0, 10)
    });
    setOpenRecord(true);
  };

  const openCreateInvoice = () => {
    setEditingInvoiceId(null);
    setInvoiceForm(emptyInvoice);
    setOpenInvoice(true);
  };

  const openEditInvoice = (row: any) => {
    setEditingInvoiceId(row.id);
    setInvoiceForm({
      invoiceNo: row.invoice_no || "",
      clientId: row.client_id ? String(row.client_id) : "",
      projectId: row.project_id ? String(row.project_id) : "",
      total: String(row.total || 0),
      paid: String(row.paid || 0),
      status: row.status || "مستحقة",
      dueDate: String(row.due_date || today).slice(0, 10)
    });
    setOpenInvoice(true);
  };

  const submitRecord = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      recordType: recordForm.recordType,
      projectId: recordForm.projectId ? Number(recordForm.projectId) : null,
      description: recordForm.description,
      amount: Number(recordForm.amount),
      recordDate: recordForm.recordDate
    };

    try {
      if (editingRecordId) {
        await api.patch(`/finance/records/${editingRecordId}`, payload);
        setSuccess("تم تحديث القيد المالي");
      } else {
        await api.post("/finance/records", payload);
        setSuccess("تمت إضافة القيد المالي");
      }
      await onRefresh();
      setOpenRecord(false);
    } catch {
      setError("تعذر حفظ القيد المالي");
    } finally {
      setLoading(false);
    }
  };

  const submitInvoice = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      invoiceNo: invoiceForm.invoiceNo,
      clientId: invoiceForm.clientId ? Number(invoiceForm.clientId) : null,
      projectId: invoiceForm.projectId ? Number(invoiceForm.projectId) : null,
      total: Number(invoiceForm.total),
      paid: Number(invoiceForm.paid),
      status: invoiceForm.status,
      dueDate: invoiceForm.dueDate
    };

    try {
      if (editingInvoiceId) {
        await api.patch(`/finance/invoices/${editingInvoiceId}`, payload);
        setSuccess("تم تحديث الفاتورة");
      } else {
        await api.post("/finance/invoices", payload);
        setSuccess("تمت إضافة الفاتورة");
      }
      await onRefresh();
      setOpenInvoice(false);
    } catch {
      setError("تعذر حفظ الفاتورة");
    } finally {
      setLoading(false);
    }
  };

  const removeRecord = async (id: number) => {
    if (!window.confirm("هل تريد حذف القيد المالي؟")) {
      return;
    }
    try {
      await api.delete(`/finance/records/${id}`);
      await onRefresh();
      setSuccess("تم حذف القيد المالي");
    } catch {
      setError("تعذر حذف القيد المالي");
    }
  };

  const removeInvoice = async (id: number) => {
    if (!window.confirm("هل تريد حذف الفاتورة؟")) {
      return;
    }
    try {
      await api.delete(`/finance/invoices/${id}`);
      await onRefresh();
      setSuccess("تم حذف الفاتورة");
    } catch {
      setError("تعذر حذف الفاتورة");
    }
  };

  return (
    <Stack spacing={3.2}>
      <PageHero
        eyebrow="المالية / الحسابات"
        title="إدارة الحسابات والمصروفات"
        subtitle="نظرة شاملة على التدفقات المالية والمصروفات الإنشائية."
        actions={(
          <>
            <Button type="button" variant="outlined" startIcon={<DownloadIcon />} onClick={exportFinanceReport}>تصدير التقرير</Button>
            <Button type="button" variant="contained" startIcon={<AttachMoneyIcon />} onClick={openCreateRecord}>إضافة قيد مالي</Button>
            <Button type="button" variant="contained" color="secondary" startIcon={<ReceiptLongIcon />} onClick={openCreateInvoice}>إضافة فاتورة</Button>
          </>
        )}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><TrendingUpIcon sx={{ color: "#16a34a" }} /><Typography sx={{ color: "#7f8597" }}>الإيرادات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{revenues.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><TrendingDownIcon sx={{ color: "#ba1a1a" }} /><Typography sx={{ color: "#7f8597" }}>المصروفات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{expenses.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><ReceiptLongIcon sx={{ color: "#964900" }} /><Typography sx={{ color: "#7f8597" }}>فواتير مستحقة</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{dueInvoices}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}><CardContent><LocalAtmIcon /><Typography sx={{ color: "rgba(255,255,255,0.8)" }}>صافي الربح</Typography><Typography sx={{ fontSize: 34, fontWeight: 900 }}>{net.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.65fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 2 }}>التدفق النقدي (Cash Flow)</Typography>
            <Box sx={{ height: 220, display: "flex", alignItems: "end", gap: 1.2, px: 1.2, borderBottom: "1px solid #edf0f6", pb: 3, mb: 2.4 }}>
              {chartPoints.map((point, idx) => (
                <Box key={point} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.7 }}>
                  <Box sx={{ width: "100%", maxWidth: 40, height: `${point * 1.6}px`, bgcolor: "rgba(0,6,102,0.16)", borderRadius: "8px 8px 0 0", position: "relative" }}>
                    <Box sx={{ width: "100%", height: `${Math.max(20, point - 16)}px`, bgcolor: "rgba(252,130,12,0.55)", borderRadius: "8px 8px 0 0", position: "absolute", bottom: 0 }} />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: idx === 5 ? "#000666" : "#a0a7bc", fontWeight: idx === 5 ? 800 : 500 }}>
                    {idx === 0 ? "يناير" : idx === 1 ? "فبراير" : idx === 2 ? "مارس" : idx === 3 ? "أبريل" : idx === 4 ? "مايو" : "يونيو"}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 1.4 }}>آخر المعاملات المالية</Typography>
            <Stack spacing={1.2}>
              {records.slice(0, 6).map((record) => (
                <Box key={record.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={{ color: "#000666", fontWeight: 800 }}>{record.project_name || "بدون مشروع"}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{record.description} · {record.record_date}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <StatusChip label={record.record_type === "revenue" ? "إيراد" : "مصروف"} size="small" />
                    <Typography sx={{ mt: 0.6, color: "#000666", fontWeight: 900 }}>{Number(record.amount).toLocaleString("ar-EG")} ج.م</Typography>
                    <Stack direction="row" spacing={0.7} sx={{ mt: 0.8 }}>
                      <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEditRecord(record)}>تعديل</Button>
                      <Button type="button" size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => removeRecord(record.id)}>حذف</Button>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900, mb: 1.8 }}>توزيع المصروفات حسب الفئة</Typography>
              {["رواتب وأجور", "مواد بناء وتوريد", "مقاولين باطن"].map((label, idx) => {
                const value = idx === 0 ? 45 : idx === 1 ? 35 : 20;
                return (
                  <Box key={label} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6, fontSize: 12 }}>
                      <Typography sx={{ color: "rgba(255,255,255,0.86)", fontSize: 12 }}>{label}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.86)", fontSize: 12 }}>{value}%</Typography>
                    </Box>
                    <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", height: 8, borderRadius: 999, overflow: "hidden" }}>
                      <Box sx={{ width: `${value}%`, height: "100%", bgcolor: idx === 0 ? "#fc820c" : idx === 1 ? "#fff" : "#60a5fa" }} />
                    </Box>
                  </Box>
                );
              })}
              <Box sx={{ mt: 2, p: 1.2, borderRadius: 1.8, bgcolor: "rgba(255,255,255,0.08)" }}>
                <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>إجمالي المصروفات الشهرية</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 24 }}>{expenses.toLocaleString("ar-EG")} ج.م</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20, mb: 1.8 }}>الفواتير</Typography>
              <Stack spacing={1.2}>
                {invoices.slice(0, 8).map((invoice) => (
                  <Box key={invoice.id} sx={{ p: 1.3, borderRadius: 2, bgcolor: "#fafbff" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{invoice.invoice_no}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{invoice.client_name || "غير محدد"} · {invoice.project_name || "-"}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ color: "#000666", fontWeight: 900 }}>{Number(invoice.total).toLocaleString("ar-EG")} ج.م</Typography>
                        <StatusChip size="small" label={invoice.status} sx={{ mt: 0.5 }} />
                        <Stack direction="row" spacing={0.7} sx={{ mt: 0.8 }}>
                          <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEditInvoice(invoice)}>تعديل</Button>
                          <Button type="button" size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => removeInvoice(invoice.id)}>حذف</Button>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <FormDialogShell
        open={openRecord}
        onClose={() => setOpenRecord(false)}
        onConfirm={submitRecord}
        title={editingRecordId ? "تعديل قيد مالي" : "إضافة قيد مالي"}
        loading={loading}
      >
        <Stack spacing={1.4} sx={{ mt: 1 }}>
          <TextField label="النوع (expense/revenue)" value={recordForm.recordType} onChange={(e) => setRecordForm((p) => ({ ...p, recordType: e.target.value }))} fullWidth />
          <TextField label="رقم المشروع (اختياري)" value={recordForm.projectId} onChange={(e) => setRecordForm((p) => ({ ...p, projectId: e.target.value }))} fullWidth />
          <TextField label="الوصف" value={recordForm.description} onChange={(e) => setRecordForm((p) => ({ ...p, description: e.target.value }))} fullWidth />
          <TextField label="المبلغ" value={recordForm.amount} onChange={(e) => setRecordForm((p) => ({ ...p, amount: e.target.value }))} fullWidth />
          <TextField label="تاريخ القيد" type="date" value={recordForm.recordDate} onChange={(e) => setRecordForm((p) => ({ ...p, recordDate: e.target.value }))} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
        </Stack>
      </FormDialogShell>

      <FormDialogShell
        open={openInvoice}
        onClose={() => setOpenInvoice(false)}
        onConfirm={submitInvoice}
        title={editingInvoiceId ? "تعديل فاتورة" : "إضافة فاتورة"}
        loading={loading}
      >
        <Stack spacing={1.4} sx={{ mt: 1 }}>
          <TextField label="رقم الفاتورة" value={invoiceForm.invoiceNo} onChange={(e) => setInvoiceForm((p) => ({ ...p, invoiceNo: e.target.value }))} fullWidth />
          <TextField label="رقم العميل (اختياري)" value={invoiceForm.clientId} onChange={(e) => setInvoiceForm((p) => ({ ...p, clientId: e.target.value }))} fullWidth />
          <TextField label="رقم المشروع (اختياري)" value={invoiceForm.projectId} onChange={(e) => setInvoiceForm((p) => ({ ...p, projectId: e.target.value }))} fullWidth />
          <TextField label="الإجمالي" value={invoiceForm.total} onChange={(e) => setInvoiceForm((p) => ({ ...p, total: e.target.value }))} fullWidth />
          <TextField label="المدفوع" value={invoiceForm.paid} onChange={(e) => setInvoiceForm((p) => ({ ...p, paid: e.target.value }))} fullWidth />
          <TextField label="الحالة" value={invoiceForm.status} onChange={(e) => setInvoiceForm((p) => ({ ...p, status: e.target.value }))} fullWidth />
          <TextField label="تاريخ الاستحقاق" type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm((p) => ({ ...p, dueDate: e.target.value }))} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
        </Stack>
      </FormDialogShell>
    </Stack>
  );
}
