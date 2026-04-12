import AddIcon from "@mui/icons-material/Add";
import BuildIcon from "@mui/icons-material/Build";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import DevicesIcon from "@mui/icons-material/Devices";
import HandymanIcon from "@mui/icons-material/Handyman";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";

const assets = [
  { name: "ونش برج 30 طن", code: "AST-1001", branch: "مشروع فيلا التجمع الخامس", status: "تشغيل", condition: 92, value: "850,000 ج.م", icon: <CarRepairIcon /> },
  { name: "خلاطة خرسانة", code: "AST-1002", branch: "مخزن أكتوبر", status: "صيانة دورية", condition: 76, value: "220,000 ج.م", icon: <BuildIcon /> },
  { name: "مولد احتياطي 200 KVA", code: "AST-1003", branch: "مشروع وسط البلد", status: "تشغيل", condition: 88, value: "640,000 ج.م", icon: <DevicesIcon /> },
  { name: "معدات نجارة ميدانية", code: "AST-1004", branch: "موقع مدينة نصر", status: "جاهز", condition: 95, value: "140,000 ج.م", icon: <HandymanIcon /> }
];

const categories = [
  { title: "الأصول المسجلة", value: 42, color: "#000666" },
  { title: "معدات قيد التشغيل", value: 31, color: "#964900" },
  { title: "صيانة مطلوبة", value: 6, color: "#c62828" },
  { title: "القيمة الدفترية", value: "12.8M", color: "#380b00" }
];

export function AssetsPage() {
  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>الأصول / التشغيل</Typography>
          <Typography sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 900, color: "#000666", lineHeight: 1.1 }}>إدارة الأصول والمعدات</Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>تتبع، صيانة، وتوزيع الأصول عبر جميع المواقع الإنشائية.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666" }}>إضافة أصل جديد</Button>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {categories.map((category, idx) => (
          <Card key={category.title} sx={{ borderRadius: 3, borderInlineStart: idx === 0 ? "4px solid #000666" : idx === 1 ? "4px solid #964900" : idx === 2 ? "4px solid #380b00" : "4px solid #1a237e" }}>
            <CardContent>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{category.title}</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 38, color: category.color, lineHeight: 1.1, mt: 1 }}>{category.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 2.5 }}>سجل الأصول والمعدات</Typography>
            <Stack spacing={1.4}>
              {assets.map((asset) => (
                <Box key={asset.code} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#000666" }}>{asset.name}</Typography>
                      <Typography sx={{ fontSize: 13, color: "#7f8597", mt: 0.4 }}>{asset.branch}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <Typography sx={{ fontWeight: 900, color: "#000666" }}>{asset.value}</Typography>
                      <Chip label={asset.status} size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, mt: 1.4 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#eef0f6", display: "grid", placeItems: "center", color: "#000666" }}>{asset.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                        <Typography sx={{ fontSize: 13, color: "#7f8597" }}>كفاءة التشغيل</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#000666" }}>{asset.condition}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={asset.condition} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: "#000666" } }} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>لوحة الصيانة</Typography>
              <Typography sx={{ opacity: 0.85, mt: 0.6 }}>يوجد 6 أصول تحتاج صيانة دورية هذا الأسبوع، وطلبان في انتظار الاعتماد.</Typography>
              <Button variant="contained" sx={{ mt: 2, bgcolor: "#fc820c", color: "white" }}>جدولة الصيانة</Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 2 }}>تصنيف الأصول</Typography>
              <Stack spacing={1.2}>
                {[
                  ["معدات ثقيلة", 14],
                  ["معدات كهربائية", 11],
                  ["أدوات يدوية", 9],
                  ["مركبات نقل", 8]
                ].map(([label, value]) => (
                  <Box key={String(label)} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "#7f8597" }}>{label}</Typography>
                    <Typography sx={{ fontWeight: 800, color: "#000666" }}>{String(value)}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 1.5 }}>توزيع المواقع</Typography>
              <Box sx={{ height: 180, borderRadius: 2.5, bgcolor: "#dfe2ea", position: "relative", overflow: "hidden", backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.75) 1px, transparent 0)", backgroundSize: "22px 22px" }}>
                <Box sx={{ position: "absolute", left: "35%", top: "32%", width: 14, height: 14, borderRadius: "50%", bgcolor: "#000666", boxShadow: "0 0 0 8px rgba(0,6,102,0.08)" }} />
                <Box sx={{ position: "absolute", left: "18%", top: "58%", width: 14, height: 14, borderRadius: "50%", bgcolor: "#964900", boxShadow: "0 0 0 8px rgba(150,73,0,0.08)" }} />
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
