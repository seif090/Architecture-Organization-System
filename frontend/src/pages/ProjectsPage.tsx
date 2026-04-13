import AddIcon from "@mui/icons-material/Add";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WorkIcon from "@mui/icons-material/Work";
import axios from "axios";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { api } from "../api";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { FormDialogShell } from "../components/FormDialogShell";
import { PageHero } from "../components/PageHero";
import { StatCard } from "../components/StatCard";

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

export function ProjectsPage({
  data,
  onRefresh,
  canManageProjects = true
}: {
  data: any[];
  onRefresh: () => Promise<void> | void;
  canManageProjects?: boolean;
}) {
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

  const parseNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
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

    if (!form.name.trim() || !form.type.trim()) {
      setError("اسم المشروع والنوع مطلوبان");
      return;
    }

    const durationDays = parseNumber(form.durationDays);
    const expectedCost = parseNumber(form.expectedCost);
    const actualCost = parseNumber(form.actualCost) ?? 0;
    const clientId = parseNumber(form.clientId);

    if (durationDays === null || durationDays <= 0) {
      setError("أدخل مدة مشروع صحيحة بالأيام");
      return;
    }

    if (expectedCost === null || expectedCost <= 0) {
      setError("أدخل تكلفة متوقعة صحيحة");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      type: form.type,
      clientId: clientId ?? null,
      durationDays,
      expectedCost,
      actualCost: actualCost < 0 ? 0 : actualCost,
      status: form.status
    };

    if (!canManageProjects) {
      setError("ليس لديك صلاحية حفظ أو تعديل المشاريع");
      setLoading(false);
      return;
    }

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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseMessage = err.response?.data?.message;
        const responseError = err.response?.data?.error;

        if (typeof responseMessage === "string" && responseMessage.trim()) {
          setError(responseMessage);
        } else if (typeof responseError === "string" && responseError.trim()) {
          setError(responseError);
        } else if (!err.response) {
          setError("تعذر الاتصال بالخادم. تحقق من عنوان API أو من تسجيل الدخول.");
        } else {
          setError(`تعذر حفظ بيانات المشروع (${err.response.status})`);
        }
      } else {
        setError("تعذر حفظ بيانات المشروع");
      }
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
      {!canManageProjects && (
        <Alert severity="info">الحفظ والتعديل والحذف متاحون فقط لمدير النظام أو مدير المشروع أو المهندس.</Alert>
      )}

      <PageHero
        eyebrow="المشاريع"
        title="إدارة المشاريع"
        subtitle="متابعة حالة كل مشروع وتكاليفه وربطه بالعميل والفريق."
        actions={<Button type="button" variant="contained" startIcon={<AddIcon />} onClick={openCreate} disabled={!canManageProjects}>إضافة مشروع</Button>}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        <StatCard title="إجمالي المشاريع" value={String(data.length)} icon={<WorkIcon />} accent="#123b5d" />
        <StatCard title="المشاريع النشطة" value={String(data.filter((d) => d.status === "نشط").length)} accent="#cc7a24" />
        <StatCard title="المكتملة" value={String(data.filter((d) => d.status !== "نشط").length)} icon={<DoneAllIcon />} accent="#1f8a4c" />
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={1.2}>
            {rows.length === 0 ? (
              <EmptyStateCard title="لا توجد مشاريع" description="أنشئ مشروعًا جديدًا لبدء تتبع المراحل والتكلفة." />
            ) : rows.map((row) => (
              <Box key={row.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{row.name}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{row.type} · {row.status} · {row.expected_cost} </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(row)} disabled={!canManageProjects}>تعديل</Button>
                  <Button type="button" size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => deleteProject(row.id)} disabled={!canManageProjects}>حذف</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <FormDialogShell
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={submit}
        title={editingId ? "تعديل مشروع" : "إضافة مشروع"}
        loading={loading}
        confirmDisabled={!canManageProjects}
      >
        <Stack spacing={1.4} sx={{ mt: 1 }}>
          <TextField label="اسم المشروع" value={form.name} onChange={(e) => setField("name", e.target.value)} fullWidth />
          <TextField label="النوع" value={form.type} onChange={(e) => setField("type", e.target.value)} fullWidth />
          <TextField label="رقم العميل (اختياري)" value={form.clientId} onChange={(e) => setField("clientId", e.target.value)} fullWidth />
          <TextField type="number" label="مدة المشروع بالأيام" value={form.durationDays} onChange={(e) => setField("durationDays", e.target.value)} fullWidth slotProps={{ htmlInput: { min: 1 } }} />
          <TextField type="number" label="التكلفة المتوقعة" value={form.expectedCost} onChange={(e) => setField("expectedCost", e.target.value)} fullWidth slotProps={{ htmlInput: { min: 1 } }} />
          <TextField type="number" label="التكلفة الفعلية" value={form.actualCost} onChange={(e) => setField("actualCost", e.target.value)} fullWidth slotProps={{ htmlInput: { min: 0 } }} />
          <TextField label="الحالة" value={form.status} onChange={(e) => setField("status", e.target.value)} fullWidth />
        </Stack>
      </FormDialogShell>
    </Stack>
  );
}
