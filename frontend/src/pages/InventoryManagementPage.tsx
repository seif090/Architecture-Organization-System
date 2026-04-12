import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { api } from "../api";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { FormDialogShell } from "../components/FormDialogShell";
import { PageHero } from "../components/PageHero";
import { StatCard } from "../components/StatCard";

type InventoryForm = {
  name: string;
  unit: string;
  quantity: string;
  minQuantity: string;
  supplier: string;
};

const emptyForm: InventoryForm = {
  name: "",
  unit: "وحدة",
  quantity: "0",
  minQuantity: "0",
  supplier: ""
};

export function InventoryManagementPage({ items, onRefresh }: { items: any[]; onRefresh: () => Promise<void> | void }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<InventoryForm>(emptyForm);

  const totalQuantity = useMemo(() => items.reduce((sum, row) => sum + Number(row.quantity || 0), 0), [items]);
  const lowStockCount = useMemo(() => items.filter((row) => Number(row.quantity || 0) <= Number(row.min_quantity || 0)).length, [items]);
  const suppliersCount = useMemo(() => new Set(items.map((item) => item.supplier).filter(Boolean)).size, [items]);

  const setField = (key: keyof InventoryForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      unit: item.unit || "وحدة",
      quantity: String(item.quantity || 0),
      minQuantity: String(item.min_quantity || 0),
      supplier: item.supplier || ""
    });
    setOpen(true);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name,
      unit: form.unit,
      quantity: Number(form.quantity),
      minQuantity: Number(form.minQuantity),
      supplier: form.supplier
    };

    try {
      if (editingId) {
        await api.patch(`/inventory/${editingId}`, payload);
        setSuccess("تم تحديث الخامة");
      } else {
        await api.post("/inventory", payload);
        setSuccess("تمت إضافة الخامة");
      }
      await onRefresh();
      setOpen(false);
    } catch {
      setError("تعذر حفظ بيانات الخامة");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("هل تريد حذف هذه الخامة؟")) {
      return;
    }

    try {
      await api.delete(`/inventory/${id}`);
      await onRefresh();
      setSuccess("تم حذف الخامة");
    } catch {
      setError("تعذر حذف الخامة");
    }
  };

  return (
    <Stack spacing={3.2}>
      <PageHero
        eyebrow="المخازن / الإمداد"
        title="إدارة المخازن والمستودعات"
        subtitle="راقب الكميات، حد التنبيه، والموردين من شاشة واحدة."
        actions={<Button type="button" variant="contained" startIcon={<AddIcon />} onClick={openCreate}>إضافة خامة</Button>}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        <StatCard title="إجمالي الخامات" value={String(items.length)} icon={<Inventory2Icon />} accent="#123b5d" />
        <StatCard title="إجمالي الكميات" value={totalQuantity.toLocaleString()} accent="#cc7a24" />
        <StatCard title="تنبيهات مخزون منخفض" value={String(lowStockCount)} icon={<WarningIcon />} accent="#c0342b" />
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 24, mb: 2 }}>سجل الخامات</Typography>
          <Stack spacing={1.2}>
            {items.length === 0 ? <EmptyStateCard title="لا توجد خامات في المخزون" description="أضف أول خامة لبدء إدارة مستويات المخزون." /> : items.map((item) => {
              const low = Number(item.quantity || 0) <= Number(item.min_quantity || 0);
              return (
                <Box key={item.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={{ color: "#000666", fontWeight: 800 }}>{item.name}</Typography>
                    <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{item.quantity} {item.unit} · حد أدنى {item.min_quantity} · {item.supplier || "بدون مورد"}</Typography>
                    <Typography sx={{ color: low ? "#ba1a1a" : "#16a34a", fontSize: 13 }}>{low ? "مخزون منخفض" : "متوفر"}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(item)}>تعديل</Button>
                    <Button type="button" size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => remove(item.id)}>حذف</Button>
                  </Stack>
                </Box>
              );
            })}
          </Stack>

          <Typography sx={{ color: "#7f8597", mt: 2, fontSize: 13 }}>عدد الموردين المسجلين: {suppliersCount}</Typography>
        </CardContent>
      </Card>

      <FormDialogShell
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={submit}
        title={editingId ? "تعديل خامة" : "إضافة خامة"}
        loading={loading}
      >
        <Stack spacing={1.3} sx={{ mt: 1 }}>
          <TextField label="اسم الخامة" value={form.name} onChange={(e) => setField("name", e.target.value)} fullWidth />
          <TextField label="الوحدة" value={form.unit} onChange={(e) => setField("unit", e.target.value)} fullWidth />
          <TextField label="الكمية" value={form.quantity} onChange={(e) => setField("quantity", e.target.value)} fullWidth />
          <TextField label="الحد الأدنى" value={form.minQuantity} onChange={(e) => setField("minQuantity", e.target.value)} fullWidth />
          <TextField label="المورد" value={form.supplier} onChange={(e) => setField("supplier", e.target.value)} fullWidth />
        </Stack>
      </FormDialogShell>
    </Stack>
  );
}
