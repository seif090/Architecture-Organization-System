import WarehouseIcon from "@mui/icons-material/Warehouse";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StatusChip } from "../components/StatusChip";

const warehouseZones = [
  { name: "مخزن الأسمنت", location: "المنطقة A", total: "1,200", used: "850", status: "مستقر", color: "#000666" },
  { name: "مخزن الحديد", location: "المنطقة B", total: "180 طن", used: "142 طن", status: "مزدحم", color: "#964900" },
  { name: "مخزن التشطيبات", location: "المنطقة C", total: "640", used: "298", status: "منخفض", color: "#16a34a" },
  { name: "مخزن الكهرباء", location: "المنطقة D", total: "410", used: "325", status: "مستقر", color: "#380b00" }
];

const stockAlerts = [
  { item: "سيراميك 60x60", project: "مجمع النخيل", remaining: "12%", severity: "إعادة طلب" },
  { item: "دهانات خارجية", project: "فيلا الربيع", remaining: "18%", severity: "مراجعة" },
  { item: "أسلاك نحاسية", project: "برج الجوهرة", remaining: "41%", severity: "مستقر" }
];

const movements = [
  ["صرف", "150 كيس أسمنت", "برج الجوهرة", "منذ 25 دقيقة"],
  ["استلام", "30 بليت سيراميك", "مجمع النخيل", "منذ ساعتين"],
  ["تحويل", "5 طن حديد", "من المنطقة B إلى A", "أمس"],
  ["صرف", "20 جالون دهان", "فيلا الربيع", "أمس"],
  ["استلام", "12 لفّة كابلات", "مخزن الكهرباء", "قبل يومين"]
];

export function InventoryDetailPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>المخازن / التفاصيل التشغيلية</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>المخازن التفصيلية</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>مراجعة حالة المناطق التخزينية، نسب الامتلاء، وحركات الصرف والاستلام اليومية.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" startIcon={<SwapHorizIcon />} onClick={() => navigate("/erp/inventory")}>نقل بين المخازن</Button>
          <Button variant="contained" startIcon={<WarehouseIcon />} sx={{ bgcolor: "#000666" }} onClick={() => navigate("/erp/inventory")}>إضافة مخزن فرعي</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {[
          ["الإشغال الكلي", "72%", "#000666"],
          ["المخازن النشطة", "18", "#964900"],
          ["تنبيهات منخفض", "6", "#ba1a1a"],
          ["حركات اليوم", "42", "#16a34a"]
        ].map(([label, value, color]) => (
          <Card key={String(label)} sx={{ borderRadius: 3, borderInlineStart: `4px solid ${color}` }}>
            <CardContent>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{label}</Typography>
              <Typography sx={{ color, fontWeight: 900, fontSize: 38, lineHeight: 1, mt: 1 }}>{value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.35fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 2.2 }}>
              <Box>
                <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22 }}>المنطقة التخزينية</Typography>
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>الحجم المستخدم لكل مخزن مع نسبة الامتلاء</Typography>
              </Box>
              <Chip icon={<FactCheckIcon />} label="مراجعة يومية" sx={{ bgcolor: "#eef0f6", fontWeight: 800 }} />
            </Box>

            <Stack spacing={1.4}>
              {warehouseZones.map((zone) => {
                const occupancy = Math.round((Number(zone.used.split(" ")[0].replace(/[^0-9.]/g, "")) / Number(zone.total.split(" ")[0].replace(/[^0-9.]/g, ""))) * 100);
                return (
                  <Box key={zone.name} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Box>
                        <Typography sx={{ color: "#000666", fontWeight: 800 }}>{zone.name}</Typography>
                        <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>{zone.location} · المستخدم {zone.used} من {zone.total}</Typography>
                      </Box>
                      <StatusChip label={zone.status} size="small" />
                    </Box>
                    <Box sx={{ mt: 1.2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                        <Typography sx={{ fontSize: 13, color: "#7f8597" }}>نسبة الامتلاء</Typography>
                        <Typography sx={{ fontSize: 13, color: "#000666", fontWeight: 800 }}>{occupancy}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={occupancy} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: zone.color } }} />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>تنبيهات مخزون</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.4 }}>
                {stockAlerts.map((alert) => (
                  <Box key={alert.item} sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
                    <Typography sx={{ fontWeight: 800, color: "#fc820c" }}>{alert.item}</Typography>
                    <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.88)", mt: 0.4 }}>{alert.project}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.6 }}>
                      <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.72)" }}>المتبقي {alert.remaining}</Typography>
                      <StatusChip label={alert.severity} size="small" sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", borderColor: "rgba(255,255,255,0.28)" }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20 }}>إجراءات سريعة</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.4 }}>
                <Button variant="outlined" startIcon={<WarningAmberIcon />} onClick={() => navigate("/erp/notifications")}>فتح تنبيه منخفض</Button>
                <Button variant="outlined" startIcon={<SwapHorizIcon />} onClick={() => navigate("/erp/projects")}>تحويل بين المشاريع</Button>
                <Button variant="outlined" startIcon={<WarehouseIcon />} onClick={() => navigate("/erp/inventory")}>جرد مخزن فرعي</Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 34, mb: 2 }}>سجل الحركات التفصيلية</Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" className="erp-table" sx={{ minWidth: 720 }}>
              <Box component="thead" sx={{ bgcolor: "#f3f4f8", color: "#7f8597", fontSize: 13 }}>
                <Box component="tr">
                  {["النوع", "الوصف", "الوجهة", "الوقت"].map((head) => (
                    <Box key={head} component="th" sx={{ p: 2, textAlign: "right", fontWeight: 800 }}>{head}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {movements.map((row, index) => (
                  <Box key={`${row[0]}-${row[1]}`} component="tr" sx={{ borderBottom: "1px solid #f1f3f8", "&:hover": { bgcolor: "#fafbff" } }}>
                    <Box component="td" sx={{ p: 2, color: index === 0 ? "#16a34a" : "#000666", fontWeight: 800 }}>{row[0]}</Box>
                    <Box component="td" sx={{ p: 2, color: "#000666", fontWeight: 700 }}>{row[1]}</Box>
                    <Box component="td" sx={{ p: 2 }}>{row[2]}</Box>
                    <Box component="td" sx={{ p: 2, color: "#7f8597" }}>{row[3]}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
