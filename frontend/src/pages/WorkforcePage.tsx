import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { api } from "../api";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { PageHero } from "../components/PageHero";
import { StatCard } from "../components/StatCard";

type WorkforceForm = {
  name: string;
  workerType: string;
  specialization: string;
  rating: string;
  paymentDue: string;
  phone: string;
};

const emptyForm: WorkforceForm = {
  name: "",
  workerType: "مقاول",
  specialization: "",
  rating: "5",
  paymentDue: "0",
  phone: ""
};

export function WorkforcePage({ data, onRefresh }: { data: any[]; onRefresh: () => Promise<void> | void }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<WorkforceForm>(emptyForm);

  const rows = useMemo(() => data.slice(0, 40), [data]);
  const totalDue = useMemo(() => data.reduce((sum, row) => sum + Number(row.payment_due || 0), 0), [data]);

  const setField = (key: keyof WorkforceForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row: any) => {
    setEditingId(row.id);
    setForm({
      name: row.name || "",
      workerType: row.worker_type || "مقاول",
      specialization: row.specialization || "",
      rating: String(row.rating ?? 5),
      paymentDue: String(row.payment_due ?? 0),
      phone: row.phone || ""
    });
    setOpen(true);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name,
      workerType: form.workerType,
      specialization: form.specialization,
      rating: Number(form.rating),
      paymentDue: Number(form.paymentDue),
      phone: form.phone || null
    };

    try {
      if (editingId) {
        await api.patch(`/workforce/${editingId}`, payload);
        setSuccess("تم تحديث بيانات العامل");
      } else {
        await api.post("/workforce", payload);
        setSuccess("تمت إضافة العامل");
      }
      await onRefresh();
      setOpen(false);
    } catch {
      setError("تعذر حفظ بيانات العامل");
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (id: number) => {
    if (!window.confirm("هل تريد حذف هذا العامل؟")) {
      return;
    }

    try {
      await api.delete(`/workforce/${id}`);
      await onRefresh();
      setSuccess("تم حذف العامل");
    } catch {
      setError("تعذر حذف العامل");
    }
  };

  return (
    <Stack spacing={3.2}>
      <PageHero
        eyebrow="القوى العاملة / المقاولين"
        title="إدارة المقاولين والقوى العاملة"
        subtitle="تتبع التقييمات والمستحقات وسجل فرق التنفيذ في المشاريع."
        actions={<Button type="button" variant="contained" startIcon={<AddIcon />} onClick={openCreate}>إضافة عامل</Button>}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        <StatCard title="إجمالي العمال" value={String(data.length)} icon={<GroupsIcon />} accent="#123b5d" />
        <StatCard title="إجمالي المستحقات" value={totalDue.toLocaleString()} icon={<PaymentsIcon />} accent="#cc7a24" />
        <StatCard title="متوسط التقييم" value={data.length ? (data.reduce((sum, row) => sum + Number(row.rating || 0), 0) / data.length).toFixed(1) : "0.0"} accent="#1f8a4c" />
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Stack spacing={1.2} sx={{ width: "100%" }}>
            {rows.length === 0 ? <EmptyStateCard title="لا توجد بيانات عمالة" description="ابدأ بإضافة أفراد الفريق والمقاولين لإدارة العمليات." /> : rows.map((row) => (
              <Box key={row.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Box>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{row.name}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{row.worker_type} · {row.specialization} · تقييم {row.rating}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>مستحقات: {Number(row.payment_due || 0).toLocaleString()}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(row)}>تعديل</Button>
                  <Button type="button" size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => deleteWorker(row.id)}>حذف</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "تعديل عامل" : "إضافة عامل"}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.3} sx={{ mt: 1 }}>
            <TextField label="الاسم" value={form.name} onChange={(e) => setField("name", e.target.value)} fullWidth />
            <TextField label="النوع" value={form.workerType} onChange={(e) => setField("workerType", e.target.value)} fullWidth />
            <TextField label="التخصص" value={form.specialization} onChange={(e) => setField("specialization", e.target.value)} fullWidth />
            <TextField label="التقييم" value={form.rating} onChange={(e) => setField("rating", e.target.value)} fullWidth />
            <TextField label="المستحقات" value={form.paymentDue} onChange={(e) => setField("paymentDue", e.target.value)} fullWidth />
            <TextField label="الهاتف" value={form.phone} onChange={(e) => setField("phone", e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button type="button" variant="contained" onClick={submit} disabled={loading} sx={{ bgcolor: "#000666" }}>{loading ? "جاري الحفظ..." : "حفظ"}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
