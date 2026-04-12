import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SellIcon from "@mui/icons-material/Sell";
import { Alert, Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FormDialogShell } from "../components/FormDialogShell";

type PropertyForm = {
  name: string;
  propertyType: string;
  status: string;
  location: string;
  price: string;
};

type InstallmentForm = {
  propertyId: string;
  customerName: string;
  amount: string;
  dueDate: string;
  isPaid: string;
};

const today = new Date().toISOString().slice(0, 10);

const emptyProperty: PropertyForm = {
  name: "",
  propertyType: "شقة",
  status: "متاح",
  location: "",
  price: "0"
};

const emptyInstallment: InstallmentForm = {
  propertyId: "",
  customerName: "",
  amount: "0",
  dueDate: today,
  isPaid: "false"
};

export function PropertiesPage({
  properties,
  installments,
  onRefresh
}: {
  properties: any[];
  installments: any[];
  onRefresh: () => Promise<void> | void;
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ propertyType: "all", status: "all", search: "" });

  const [openProperty, setOpenProperty] = useState(false);
  const [openInstallment, setOpenInstallment] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
  const [editingInstallmentId, setEditingInstallmentId] = useState<number | null>(null);

  const [propertyForm, setPropertyForm] = useState<PropertyForm>(emptyProperty);
  const [installmentForm, setInstallmentForm] = useState<InstallmentForm>(emptyInstallment);

  const available = properties.filter((p) => p.status === "متاح").length;
  const reserved = properties.filter((p) => p.status === "محجوز").length;
  const sold = properties.filter((p) => p.status === "مباع").length;

  const palette = {
    card: "#ffffff",
    border: "#edf0f6",
    indigo: "#000666"
  };

  const filteredProperties = properties.filter((property) => {
    const byType = filters.propertyType === "all" || String(property.property_type || "").toLowerCase() === filters.propertyType.toLowerCase();
    const byStatus = filters.status === "all" || String(property.status || "").toLowerCase() === filters.status.toLowerCase();
    const search = filters.search.trim().toLowerCase();
    const bySearch = !search || String(property.name || "").toLowerCase().includes(search) || String(property.location || "").toLowerCase().includes(search);
    return byType && byStatus && bySearch;
  });

  const visualRows = filteredProperties.slice(0, 6).map((property, idx) => {
    const image = idx % 3 === 0
      ? "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=70"
      : idx % 3 === 1
        ? "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70"
        : "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=70";
    return { ...property, image };
  });

  const reserveProperty = async (propertyId: number) => {
    try {
      setError("");
      await api.patch(`/properties/${propertyId}`, { status: "محجوز" });
      await onRefresh();
      setSuccess("تم حجز الوحدة بنجاح");
    } catch {
      setError("تعذر حجز الوحدة");
    }
  };

  const openCreateProperty = () => {
    setEditingPropertyId(null);
    setPropertyForm(emptyProperty);
    setOpenProperty(true);
  };

  const openEditProperty = (row: any) => {
    setEditingPropertyId(row.id);
    setPropertyForm({
      name: row.name || "",
      propertyType: row.property_type || "شقة",
      status: row.status || "متاح",
      location: row.location || "",
      price: String(row.price || 0)
    });
    setOpenProperty(true);
  };

  const openCreateInstallment = () => {
    setEditingInstallmentId(null);
    setInstallmentForm(emptyInstallment);
    setOpenInstallment(true);
  };

  const openEditInstallment = (row: any) => {
    setEditingInstallmentId(row.id);
    setInstallmentForm({
      propertyId: row.property_id ? String(row.property_id) : "",
      customerName: row.customer_name || "",
      amount: String(row.amount || 0),
      dueDate: String(row.due_date || today).slice(0, 10),
      isPaid: row.is_paid ? "true" : "false"
    });
    setOpenInstallment(true);
  };

  const submitProperty = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      name: propertyForm.name,
      propertyType: propertyForm.propertyType,
      status: propertyForm.status,
      location: propertyForm.location,
      price: Number(propertyForm.price)
    };

    try {
      if (editingPropertyId) {
        await api.patch(`/properties/${editingPropertyId}`, payload);
        setSuccess("تم تحديث العقار");
      } else {
        await api.post("/properties", payload);
        setSuccess("تمت إضافة العقار");
      }
      await onRefresh();
      setOpenProperty(false);
    } catch {
      setError("تعذر حفظ العقار");
    } finally {
      setLoading(false);
    }
  };

  const submitInstallment = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      propertyId: Number(installmentForm.propertyId),
      customerName: installmentForm.customerName,
      amount: Number(installmentForm.amount),
      dueDate: installmentForm.dueDate,
      isPaid: installmentForm.isPaid === "true"
    };

    try {
      if (editingInstallmentId) {
        await api.patch(`/properties/installments/${editingInstallmentId}`, payload);
        setSuccess("تم تحديث القسط");
      } else {
        await api.post("/properties/installments", payload);
        setSuccess("تمت إضافة القسط");
      }
      await onRefresh();
      setOpenInstallment(false);
    } catch {
      setError("تعذر حفظ القسط");
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = async (id: number) => {
    if (!window.confirm("هل تريد حذف العقار؟")) {
      return;
    }
    try {
      await api.delete(`/properties/${id}`);
      await onRefresh();
      setSuccess("تم حذف العقار");
    } catch {
      setError("تعذر حذف العقار");
    }
  };

  const removeInstallment = async (id: number) => {
    if (!window.confirm("هل تريد حذف القسط؟")) {
      return;
    }
    try {
      await api.delete(`/properties/installments/${id}`);
      await onRefresh();
      setSuccess("تم حذف القسط");
    } catch {
      setError("تعذر حذف القسط");
    }
  };

  return (
    <Stack spacing={3.2}>
      <Box>
        <Typography sx={{ color: "#a1a8c9", fontSize: 13, mb: 0.5 }}>إدارة العقارات</Typography>
        <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>إدارة الوحدات العقارية</Typography>
        <Typography sx={{ color: "#6f7587", mt: 1 }}>تصفح المحفظة العقارية، وتتبع حالة البيع والتحصيل وإدارة الحجوزات المباشرة.</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.2}>
        <Button variant="contained" sx={{ bgcolor: "#000666" }} onClick={openCreateProperty}>إضافة عقار</Button>
        <Button variant="contained" sx={{ bgcolor: "#964900" }} onClick={openCreateInstallment}>إضافة قسط</Button>
      </Stack>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><CheckCircleIcon sx={{ color: "#16a34a" }} /><Typography sx={{ color: "#7f8597" }}>وحدات متاحة</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{available}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><PendingActionsIcon sx={{ color: "#d97706" }} /><Typography sx={{ color: "#7f8597" }}>محجوزة مؤقتًا</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{reserved}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><SellIcon sx={{ color: "#be123c" }} /><Typography sx={{ color: "#7f8597" }}>إجمالي المبيعات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{sold}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "linear-gradient(135deg, #000666 0%, #1a237e 100%)", background: "linear-gradient(135deg, #000666 0%, #1a237e 100%)", color: "white" }}><CardContent><LocalAtmIcon /><Typography sx={{ color: "rgba(255,255,255,0.8)" }}>إجمالي المحصّل</Typography><Typography sx={{ fontSize: 34, fontWeight: 900 }}>{installments.filter((i) => i.is_paid).reduce((sum, i) => sum + Number(i.amount || 0), 0).toLocaleString("ar-EG")}</Typography></CardContent></Card>
      </Box>

      <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#f3f3f7", display: "grid", gap: 1.2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <TextField size="small" label="بحث بالاسم/الموقع" value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}>
        </TextField>
        <TextField select size="small" value={filters.propertyType} label="نوع الوحدة" onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}>
          <MenuItem value="all">كل الأنواع</MenuItem>
          <MenuItem value="شقة">شقة</MenuItem>
          <MenuItem value="فيلا">فيلا</MenuItem>
          <MenuItem value="مكتب">مكتب</MenuItem>
        </TextField>
        <TextField select size="small" value={filters.status} label="الحالة" onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
          <MenuItem value="all">الكل</MenuItem>
          <MenuItem value="متاح">متاح</MenuItem>
          <MenuItem value="محجوز">محجوز</MenuItem>
          <MenuItem value="مباع">مباع</MenuItem>
        </TextField>
        <Button variant="contained" sx={{ bgcolor: palette.indigo }} onClick={() => setSuccess(`تم تطبيق التصفية على ${filteredProperties.length} عقار`)}>تصفية النتائج</Button>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" } }}>
        {visualRows.map((property, idx) => {
          const statusLabel = property.status || "متاح";
          const statusBg = statusLabel === "متاح" ? "#16a34a" : statusLabel === "محجوز" ? "#d97706" : "#be123c";
          return (
            <Card key={property.id || `${property.name}-${idx}`} sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${palette.border}` }}>
              <Box sx={{ height: 210, position: "relative", backgroundImage: `url(${property.image})`, backgroundPosition: "center", backgroundSize: "cover" }}>
                <Chip label={statusLabel} size="small" sx={{ position: "absolute", top: 12, right: 12, bgcolor: statusBg, color: "white", fontWeight: 800 }} />
                <Box sx={{ position: "absolute", insetInline: 12, bottom: 12, p: 1.1, borderRadius: 2, bgcolor: "rgba(0,0,0,0.45)", color: "white" }}>
                  <Typography sx={{ fontSize: 12, opacity: 0.82 }}>{property.location || "-"}</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{property.name}</Typography>
                </Box>
              </Box>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.2 }}>
                  <Typography sx={{ color: "#7f8597", fontSize: 12 }}>{property.property_type || "وحدة"}</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 900 }}>{Number(property.price || 0).toLocaleString("ar-EG")} ج.م</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#fafbff", mb: 1.3 }}>
                  <Typography sx={{ fontSize: 12, color: "#7f8597" }}>أقرب قسط</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{installments[idx] ? `${Number(installments[idx].amount || 0).toLocaleString("ar-EG")} ج.م` : "—"}</Typography>
                </Box>
                <Button
                  fullWidth
                  variant={statusLabel === "مباع" ? "outlined" : "contained"}
                  sx={{ bgcolor: statusLabel === "مباع" ? undefined : palette.indigo, color: statusLabel === "مباع" ? "#5e6478" : "white", borderColor: "#d4d8e7" }}
                  onClick={() => {
                    if (statusLabel === "مباع") {
                      navigate("/erp/contracts");
                    } else {
                      reserveProperty(property.id);
                    }
                  }}
                >
                  {statusLabel === "مباع" ? "عرض تفاصيل العقد" : "حجز الوحدة الآن"}
                </Button>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEditProperty(property)}>تعديل</Button>
                  <Button type="button" size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => removeProperty(property.id)}>حذف</Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20, mb: 1.5 }}>الأقساط</Typography>
          <Stack spacing={1.1}>
            {installments.slice(0, 20).map((item) => (
              <Box key={item.id} sx={{ p: 1.3, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                <Box>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{item.customer_name}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>عقار #{item.property_id} · {String(item.due_date).slice(0, 10)}</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{Number(item.amount || 0).toLocaleString("ar-EG")} ج.م</Typography>
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Chip label={item.is_paid ? "مدفوع" : "مستحق"} size="small" sx={{ bgcolor: item.is_paid ? "#e8f8ef" : "#fff1e2" }} />
                  <Stack direction="row" spacing={1} sx={{ mt: 0.8 }}>
                    <Button type="button" size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEditInstallment(item)}>تعديل</Button>
                    <Button type="button" size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => removeInstallment(item.id)}>حذف</Button>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        {[1, 2, 3].map((n) => (
          <Chip key={n} label={n} sx={{ bgcolor: n === 1 ? "#000666" : "#fff", color: n === 1 ? "#fff" : "#000666", border: "1px solid #d8dceb", fontWeight: 800 }} />
        ))}
      </Box>

      <FormDialogShell
        open={openProperty}
        onClose={() => setOpenProperty(false)}
        onConfirm={submitProperty}
        title={editingPropertyId ? "تعديل عقار" : "إضافة عقار"}
        loading={loading}
      >
        <Stack spacing={1.3} sx={{ mt: 1 }}>
          <TextField label="اسم العقار" value={propertyForm.name} onChange={(e) => setPropertyForm((p) => ({ ...p, name: e.target.value }))} fullWidth />
          <TextField label="نوع العقار" value={propertyForm.propertyType} onChange={(e) => setPropertyForm((p) => ({ ...p, propertyType: e.target.value }))} fullWidth />
          <TextField label="الحالة" value={propertyForm.status} onChange={(e) => setPropertyForm((p) => ({ ...p, status: e.target.value }))} fullWidth />
          <TextField label="الموقع" value={propertyForm.location} onChange={(e) => setPropertyForm((p) => ({ ...p, location: e.target.value }))} fullWidth />
          <TextField label="السعر" value={propertyForm.price} onChange={(e) => setPropertyForm((p) => ({ ...p, price: e.target.value }))} fullWidth />
        </Stack>
      </FormDialogShell>

      <FormDialogShell
        open={openInstallment}
        onClose={() => setOpenInstallment(false)}
        onConfirm={submitInstallment}
        title={editingInstallmentId ? "تعديل قسط" : "إضافة قسط"}
        loading={loading}
      >
        <Stack spacing={1.3} sx={{ mt: 1 }}>
          <TextField label="رقم العقار" value={installmentForm.propertyId} onChange={(e) => setInstallmentForm((p) => ({ ...p, propertyId: e.target.value }))} fullWidth />
          <TextField label="اسم العميل" value={installmentForm.customerName} onChange={(e) => setInstallmentForm((p) => ({ ...p, customerName: e.target.value }))} fullWidth />
          <TextField label="المبلغ" value={installmentForm.amount} onChange={(e) => setInstallmentForm((p) => ({ ...p, amount: e.target.value }))} fullWidth />
          <TextField label="تاريخ الاستحقاق" type="date" value={installmentForm.dueDate} onChange={(e) => setInstallmentForm((p) => ({ ...p, dueDate: e.target.value }))} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          <TextField select label="حالة الدفع" value={installmentForm.isPaid} onChange={(e) => setInstallmentForm((p) => ({ ...p, isPaid: e.target.value }))} fullWidth>
            <MenuItem value="false">مستحق</MenuItem>
            <MenuItem value="true">مدفوع</MenuItem>
          </TextField>
        </Stack>
      </FormDialogShell>
    </Stack>
  );
}
