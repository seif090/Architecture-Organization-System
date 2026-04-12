import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { api } from "../api";

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>القوى العاملة / المقاولين</Typography>
          <Typography sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 900, color: "#000666", lineHeight: 1.1 }}>إدارة المقاولين والقوى العاملة</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666" }} onClick={openCreate}>إضافة عامل</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <GroupsIcon sx={{ color: "#000666" }} />
            <Typography sx={{ fontSize: 38, color: "#000666", fontWeight: 900 }}>{data.length}</Typography>
            <Typography sx={{ color: "#6f7587" }}>إجمالي العمال</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <PaymentsIcon sx={{ color: "#964900" }} />
            <Typography sx={{ fontSize: 38, color: "#000666", fontWeight: 900 }}>{totalDue.toLocaleString()}</Typography>
            <Typography sx={{ color: "#6f7587" }}>إجمالي المستحقات</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ color: "#6f7587" }}>متوسط التقييم</Typography>
            <Typography sx={{ fontSize: 38, color: "#000666", fontWeight: 900 }}>
              {data.length ? (data.reduce((sum, row) => sum + Number(row.rating || 0), 0) / data.length).toFixed(1) : "0.0"}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Stack spacing={1.2} sx={{ width: "100%" }}>
            {rows.map((row) => (
              <Box key={row.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Box>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{row.name}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{row.worker_type} · {row.specialization} · تقييم {row.rating}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>مستحقات: {Number(row.payment_due || 0).toLocaleString()}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(row)}>تعديل</Button>
                  <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => deleteWorker(row.id)}>حذف</Button>
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
