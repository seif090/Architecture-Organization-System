import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SellIcon from "@mui/icons-material/Sell";
import { Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";

export function PropertiesPage({
  properties,
  installments
}: {
  properties: any[];
  installments: any[];
}) {
  const available = properties.filter((p) => p.status === "متاح").length;
  const reserved = properties.filter((p) => p.status === "محجوز").length;
  const sold = properties.filter((p) => p.status === "مباع").length;

  const palette = {
    card: "#ffffff",
    border: "#edf0f6",
    indigo: "#000666"
  };

  const visualRows = properties.slice(0, 6).map((property, idx) => {
    const image = idx % 3 === 0
      ? "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=70"
      : idx % 3 === 1
        ? "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70"
        : "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=70";
    return { ...property, image };
  });

  return (
    <Stack spacing={3.2}>
      <Box>
        <Typography sx={{ color: "#a1a8c9", fontSize: 13, mb: 0.5 }}>إدارة العقارات</Typography>
        <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>إدارة الوحدات العقارية</Typography>
        <Typography sx={{ color: "#6f7587", mt: 1 }}>تصفح المحفظة العقارية، وتتبع حالة البيع والتحصيل وإدارة الحجوزات المباشرة.</Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><CheckCircleIcon sx={{ color: "#16a34a" }} /><Typography sx={{ color: "#7f8597" }}>وحدات متاحة</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{available}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><PendingActionsIcon sx={{ color: "#d97706" }} /><Typography sx={{ color: "#7f8597" }}>محجوزة مؤقتًا</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{reserved}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><SellIcon sx={{ color: "#be123c" }} /><Typography sx={{ color: "#7f8597" }}>إجمالي المبيعات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{sold}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "linear-gradient(135deg, #000666 0%, #1a237e 100%)", background: "linear-gradient(135deg, #000666 0%, #1a237e 100%)", color: "white" }}><CardContent><LocalAtmIcon /><Typography sx={{ color: "rgba(255,255,255,0.8)" }}>إجمالي المحصّل</Typography><Typography sx={{ fontSize: 34, fontWeight: 900 }}>{installments.filter((i) => i.is_paid).reduce((sum, i) => sum + Number(i.amount || 0), 0).toLocaleString("ar-EG")}</Typography></CardContent></Card>
      </Box>

      <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#f3f3f7", display: "grid", gap: 1.2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <TextField select size="small" defaultValue="all" label="المشروع">
          <MenuItem value="all">جميع المشاريع</MenuItem>
          <MenuItem value="a">برج الجوهرة</MenuItem>
          <MenuItem value="b">مجمع الزمرد</MenuItem>
        </TextField>
        <TextField select size="small" defaultValue="all" label="نوع الوحدة">
          <MenuItem value="all">كل الأنواع</MenuItem>
          <MenuItem value="apartment">شقة</MenuItem>
          <MenuItem value="villa">فيلا</MenuItem>
        </TextField>
        <TextField select size="small" defaultValue="all" label="الحالة">
          <MenuItem value="all">الكل</MenuItem>
          <MenuItem value="available">متاح</MenuItem>
          <MenuItem value="reserved">محجوز</MenuItem>
          <MenuItem value="sold">مباع</MenuItem>
        </TextField>
        <Button variant="contained" sx={{ bgcolor: palette.indigo }}>تصفية النتائج</Button>
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
                <Button fullWidth variant={statusLabel === "مباع" ? "outlined" : "contained"} sx={{ bgcolor: statusLabel === "مباع" ? undefined : palette.indigo, color: statusLabel === "مباع" ? "#5e6478" : "white", borderColor: "#d4d8e7" }}>
                  {statusLabel === "مباع" ? "عرض تفاصيل العقد" : "حجز الوحدة الآن"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        {[1, 2, 3].map((n) => (
          <Chip key={n} label={n} sx={{ bgcolor: n === 1 ? "#000666" : "#fff", color: n === 1 ? "#fff" : "#000666", border: "1px solid #d8dceb", fontWeight: 800 }} />
        ))}
      </Box>
    </Stack>
  );
}
