import AddIcon from "@mui/icons-material/Add";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export function ClientsPage({ clients }: { clients: any[] }) {
  const topClients = clients.slice(0, 6);
  const totalInteractions = clients.reduce((sum, client) => sum + (client.interactions ? 1 : 0), 0);

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 13, mb: 0.5 }}>CRM</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>إدارة العملاء</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>ملفات العملاء، المشاريع المرتبطة، وسجل المتابعات.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666" }}>إضافة عميل جديد</Button>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>إجمالي العملاء</Typography><Typography sx={{ color: "#000666", fontSize: 40, fontWeight: 900 }}>{clients.length}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>متابعات نشطة</Typography><Typography sx={{ color: "#964900", fontSize: 40, fontWeight: 900 }}>{totalInteractions}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>مشاريع مرتبطة</Typography><Typography sx={{ color: "#000666", fontSize: 40, fontWeight: 900 }}>{clients.reduce((sum, c) => sum + Number(c.projects_count || 0), 0)}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}><CardContent><Typography sx={{ color: "rgba(255,255,255,0.8)" }}>نسبة رضا العملاء</Typography><Typography sx={{ fontSize: 40, fontWeight: 900 }}>91%</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" } }}>
        {topClients.map((client, index) => (
          <Card key={client.id || `${client.name}-${index}`} sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,6,102,0.06)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 2 }}>
                <Box>
                  <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20 }}>{client.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.7, color: "#7f8597" }}>
                    <CallIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 13 }}>{client.phone}</Typography>
                  </Box>
                </Box>
                <Chip label={`مشاريع: ${client.projects_count || 0}`} size="small" sx={{ bgcolor: "#eef0f6", color: "#000666", fontWeight: 700 }} />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 1.2, color: "#7f8597" }}>
                <LocationOnIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 13 }}>{client.address}</Typography>
              </Box>

              <Box sx={{ mt: 1.6, p: 1.2, borderRadius: 2, bgcolor: "#fafbff" }}>
                <Typography sx={{ color: "#9aa1b6", fontSize: 12, display: "flex", alignItems: "center", gap: 0.6 }}><NotesIcon sx={{ fontSize: 14 }} />ملاحظات</Typography>
                <Typography sx={{ color: "#000666", fontSize: 14, mt: 0.5 }}>{client.notes || "لا توجد ملاحظات"}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.8 }}>
                <Button variant="text" startIcon={<WorkIcon />} sx={{ color: "#000666" }}>عرض المشاريع</Button>
                <Button variant="outlined">سجل التعامل</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
