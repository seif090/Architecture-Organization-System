import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ color: "#a1a8c9", fontSize: 13, mb: 0.5 }}>إدارة العقارات</Typography>
        <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>المحفظة العقارية</Typography>
        <Typography sx={{ color: "#6f7587", mt: 1 }}>متابعة حالة العقارات، الأسعار، والأقساط.</Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><ApartmentIcon sx={{ color: "#000666" }} /><Typography sx={{ color: "#7f8597" }}>إجمالي العقارات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{properties.length}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><HomeWorkIcon sx={{ color: "#16a34a" }} /><Typography sx={{ color: "#7f8597" }}>متاح</Typography><Typography sx={{ color: "#16a34a", fontSize: 34, fontWeight: 900 }}>{available}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><HomeWorkIcon sx={{ color: "#964900" }} /><Typography sx={{ color: "#7f8597" }}>محجوز</Typography><Typography sx={{ color: "#964900", fontSize: 34, fontWeight: 900 }}>{reserved}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}><CardContent><LocalAtmIcon /><Typography sx={{ color: "rgba(255,255,255,0.8)" }}>مباع</Typography><Typography sx={{ fontSize: 34, fontWeight: 900 }}>{sold}</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 18, mb: 2 }}>العقارات</Typography>
            <Stack spacing={1.2}>
              {properties.slice(0, 10).map((property) => (
                <Box key={property.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>{property.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{property.property_type} · {property.location}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography sx={{ color: "#000666", fontWeight: 900 }}>{Number(property.price).toLocaleString("ar-EG")} ج.م</Typography>
                    <Chip size="small" label={property.status} sx={{ mt: 0.5, bgcolor: property.status === "متاح" ? "#e8f8ef" : property.status === "محجوز" ? "#fff1e2" : "#e7ecff" }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 18, mb: 2 }}>جدول الأقساط</Typography>
            <Stack spacing={1.2}>
              {installments.slice(0, 10).map((installment) => (
                <Box key={installment.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Typography sx={{ fontWeight: 800 }}>{installment.property_name}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#7f8597", mt: 0.4 }}>{installment.customer_name} · {installment.due_date}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.8 }}>
                    <Typography sx={{ color: "#000666", fontWeight: 900 }}>{Number(installment.amount).toLocaleString("ar-EG")} ج.م</Typography>
                    <Chip size="small" label={installment.is_paid ? "مدفوع" : "مستحق"} sx={{ bgcolor: installment.is_paid ? "#e8f8ef" : "#fff1e2" }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
