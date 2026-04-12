import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { api } from "../api";

type ProjectForm = {
  name: string;
  type: string;
  clientId: string;
  durationDays: string;
  expectedCost: string;
  actualCost: string;
  status: string;
};

const emptyForm: ProjectForm = {
  name: "",
  type: "",
  clientId: "",
  durationDays: "",
  expectedCost: "",
  actualCost: "0",
  status: "نشط"
};

export function ProjectsPage({ data, onRefresh }: { data: any[]; onRefresh: () => Promise<void> | void }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const rows = useMemo(() => data.slice(0, 30), [data]);

  const setField = (key: keyof ProjectForm, value: string) => {
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
      type: row.type || "",
      clientId: row.client_id ? String(row.client_id) : "",
      durationDays: String(row.duration_days || ""),
      expectedCost: String(row.expected_cost || ""),
      actualCost: String(row.actual_cost || 0),
      status: row.status || "نشط"
    });
    setOpen(true);
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      name: form.name,
      type: form.type,
      clientId: form.clientId ? Number(form.clientId) : null,
      durationDays: Number(form.durationDays),
      expectedCost: Number(form.expectedCost),
      actualCost: Number(form.actualCost || 0),
      status: form.status
    };

    try {
      if (editingId) {
        await api.patch(`/projects/${editingId}`, payload);
        setSuccess("تم تحديث المشروع");
      } else {
        await api.post("/projects", payload);
        setSuccess("تم إنشاء المشروع");
      }
      await onRefresh();
      setOpen(false);
    } catch {
      setError("تعذر حفظ بيانات المشروع");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف المشروع؟")) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      await onRefresh();
      setSuccess("تم حذف المشروع");
    } catch {
      setError("تعذر حذف المشروع");
    }
  };

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>المشاريع</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>إدارة المشاريع</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666" }} onClick={openCreate}>
          إضافة مشروع
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>إجمالي المشاريع</Typography><Typography sx={{ color: "#000666", fontSize: 38, fontWeight: 900 }}>{data.length}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>المشاريع النشطة</Typography><Typography sx={{ color: "#964900", fontSize: 38, fontWeight: 900 }}>{data.filter((d) => d.status === "نشط").length}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>المكتملة</Typography><Typography sx={{ color: "#16a34a", fontSize: 38, fontWeight: 900 }}>{data.filter((d) => d.status !== "نشط").length}</Typography></CardContent></Card>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={1.2}>
            {rows.map((row) => (
              <Box key={row.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{row.name}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{row.type} · {row.status} · {row.expected_cost} </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(row)}>تعديل</Button>
                  <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => deleteProject(row.id)}>حذف</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "تعديل مشروع" : "إضافة مشروع"}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.4} sx={{ mt: 1 }}>
            <TextField label="اسم المشروع" value={form.name} onChange={(e) => setField("name", e.target.value)} fullWidth />
            <TextField label="النوع" value={form.type} onChange={(e) => setField("type", e.target.value)} fullWidth />
            <TextField label="رقم العميل (اختياري)" value={form.clientId} onChange={(e) => setField("clientId", e.target.value)} fullWidth />
            <TextField label="مدة المشروع بالأيام" value={form.durationDays} onChange={(e) => setField("durationDays", e.target.value)} fullWidth />
            <TextField label="التكلفة المتوقعة" value={form.expectedCost} onChange={(e) => setField("expectedCost", e.target.value)} fullWidth />
            <TextField label="التكلفة الفعلية" value={form.actualCost} onChange={(e) => setField("actualCost", e.target.value)} fullWidth />
            <TextField label="الحالة" value={form.status} onChange={(e) => setField("status", e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={submit} disabled={loading} sx={{ bgcolor: "#000666" }}>{loading ? "جاري الحفظ..." : "حفظ"}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
