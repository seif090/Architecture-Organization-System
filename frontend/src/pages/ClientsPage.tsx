import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { Alert, Avatar, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { api } from "../api";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { FormDialogShell } from "../components/FormDialogShell";
import { PageHero } from "../components/PageHero";
import { StatCard } from "../components/StatCard";

type ClientForm = {
  name: string;
  phone: string;
  address: string;
  notes: string;
  interactions: string;
};

const emptyForm: ClientForm = {
  name: "",
  phone: "",
  address: "",
  notes: "",
  interactions: ""
};

export function ClientsPage({ clients, onRefresh }: { clients: any[]; onRefresh: () => Promise<void> | void }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);

  const rows = useMemo(() => clients.slice(0, 20), [clients]);

  const setField = (key: keyof ClientForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreateDialog = () => {
    setError("");
    setSuccess("");
    setEditingId(null);
    setForm(emptyForm);
    setOpenCreate(true);
  };

  const openEditDialog = (client: any) => {
    setError("");
    setSuccess("");
    setEditingId(client.id);
    setForm({
      name: client.name || "",
      phone: client.phone || "",
      address: client.address || "",
      notes: client.notes || "",
      interactions: client.interactions || ""
    });
    setOpenCreate(true);
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (editingId) {
        await api.patch(`/clients/${editingId}`, form);
        setSuccess("تم تحديث العميل بنجاح");
      } else {
        await api.post("/clients", form);
        setSuccess("تم إنشاء العميل بنجاح");
      }
      await onRefresh();
      setOpenCreate(false);
    } catch {
      setError("تعذر حفظ بيانات العميل");
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف العميل؟")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await api.delete(`/clients/${id}`);
      await onRefresh();
      setSuccess("تم حذف العميل");
    } catch {
      setError("تعذر حذف العميل");
    }
  };

  return (
    <Stack spacing={3}>
      <PageHero
        eyebrow="الرئيسية / إدارة العملاء"
        title="إدارة العملاء"
        subtitle="إنشاء وتعديل وحذف العملاء وربطهم بالمشاريع بشكل مباشر."
        actions={<Button type="button" variant="contained" startIcon={<PersonAddAlt1Icon />} onClick={openCreateDialog}>إضافة عميل جديد</Button>}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        <StatCard title="إجمالي العملاء" value={String(clients.length)} icon={<GroupsIcon />} accent="#123b5d" />
        <StatCard title="عملاء لديهم مشاريع" value={String(clients.filter((c) => Number(c.projects_count) > 0).length)} accent="#1f8a4c" />
        <StatCard title="بدون مشاريع" value={String(clients.filter((c) => Number(c.projects_count) === 0).length)} icon={<PersonOffIcon />} accent="#cc7a24" />
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: "grid", gap: 1.2 }}>
            {rows.length === 0 ? (
              <EmptyStateCard title="لا يوجد عملاء حتى الآن" description="ابدأ بإضافة أول عميل لربطه بالمشاريع والعقود." />
            ) : rows.map((client) => (
              <Box key={client.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Avatar sx={{ bgcolor: "#e7ecff", color: "#000666" }}>{String(client.name || "ع").slice(0, 1)}</Avatar>
                  <Box>
                    <Typography sx={{ color: "#000666", fontWeight: 800 }}>{client.name}</Typography>
                    <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{client.phone} · {client.address}</Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEditDialog(client)}>تعديل</Button>
                  <Button type="button" size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => deleteClient(client.id)}>حذف</Button>
                </Stack>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <FormDialogShell
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onConfirm={submit}
        title={editingId ? "تعديل العميل" : "إضافة عميل جديد"}
        loading={loading}
      >
        <Stack spacing={1.4} sx={{ mt: 1 }}>
          <TextField label="الاسم" value={form.name} onChange={(e) => setField("name", e.target.value)} fullWidth required />
          <TextField label="الهاتف" value={form.phone} onChange={(e) => setField("phone", e.target.value)} fullWidth required />
          <TextField label="العنوان" value={form.address} onChange={(e) => setField("address", e.target.value)} fullWidth required />
          <TextField label="ملاحظات" value={form.notes} onChange={(e) => setField("notes", e.target.value)} fullWidth multiline minRows={2} />
          <TextField label="تفاعلات" value={form.interactions} onChange={(e) => setField("interactions", e.target.value)} fullWidth multiline minRows={2} />
        </Stack>
      </FormDialogShell>
    </Stack>
  );
}
