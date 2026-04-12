import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const slaSummary = [
  { title: "ضمن SLA", value: "86%", delta: "+4%", color: "#16a34a" },
  { title: "متأخر", value: "14%", delta: "-2%", color: "#ba1a1a" },
  { title: "متوسط الاستجابة", value: "18m", delta: "-3m", color: "#000666" },
  { title: "متوسط الإغلاق", value: "2.4h", delta: "-0.6h", color: "#964900" }
];

const slaRows = [
  { name: "بلاغات السلامة", target: "30m", actual: "21m", progress: 72, status: "جيد" },
  { name: "بلاغات المعدات", target: "45m", actual: "38m", progress: 84, status: "مستقر" },
  { name: "بلاغات الموقع", target: "60m", actual: "64m", progress: 96, status: "خطر" },
  { name: "بلاغات مالية", target: "4h", actual: "1.8h", progress: 45, status: "جيد" }
];

const escalationRules = [
  "بعد 20 دقيقة: تنبيه للمشرف المباشر",
  "بعد 45 دقيقة: تصعيد لرئيس القسم",
  "بعد 60 دقيقة: إشعار للإدارة العليا",
  "بعد 2 ساعة: فتح مسار مراجعة إلزامي"
];

export function SlaDashboardPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>البلاغات / SLA</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>لوحة متابعة SLA للبلاغات</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>متابعة زمن الاستجابة والإغلاق والتنبيهات التصعيدية على مستوى الإدارة.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" startIcon={<TimelineIcon />} onClick={() => navigate("/erp/reports")}>التحليل الزمني</Button>
          <Button variant="contained" startIcon={<FlashOnIcon />} sx={{ bgcolor: "#000666" }} onClick={() => navigate("/erp/incidents")}>فتح البلاغات الحرجة</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {slaSummary.map((item) => (
          <Card key={item.title} sx={{ borderRadius: 3, borderInlineStart: `4px solid ${item.color}` }}>
            <CardContent>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{item.title}</Typography>
              <Typography sx={{ color: item.color, fontWeight: 900, fontSize: 38, lineHeight: 1, mt: 1 }}>{item.value}</Typography>
              <Typography sx={{ color: item.color, fontSize: 12, mt: 0.7 }}>{item.delta}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.45fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.2, gap: 1, flexWrap: "wrap" }}>
              <Box>
                <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22 }}>مؤشرات الالتزام</Typography>
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>قياس الأداء مقابل الهدف لكل نوع من البلاغات</Typography>
              </Box>
              <Chip icon={<QueryStatsIcon />} label="مراجعة يومية" sx={{ bgcolor: "#eef0f6", fontWeight: 800 }} />
            </Box>

            <Stack spacing={1.4}>
              {slaRows.map((row) => (
                <Box key={row.name} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ color: "#000666", fontWeight: 800 }}>{row.name}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>الهدف: {row.target} · الفعلي: {row.actual}</Typography>
                    </Box>
                    <Chip label={row.status} size="small" sx={{ bgcolor: row.status === "خطر" ? "#ffebee" : row.status === "جيد" ? "#e8f8ef" : "#fff1e2" }} />
                  </Box>
                  <Box sx={{ mt: 1.2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>نسبة الالتزام</Typography>
                      <Typography sx={{ fontSize: 13, color: "#000666", fontWeight: 800 }}>{row.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={row.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: row.status === "خطر" ? "#ba1a1a" : "#000666" } }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>قواعد التصعيد</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.4 }}>
                {escalationRules.map((rule) => (
                  <Box key={rule} sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
                    <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.92)" }}>{rule}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20 }}>حالات حرجة الآن</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.4 }}>
                {[
                  ["3 بلاغات", "تجاوزت زمن الاستجابة"],
                  ["2 بلاغات", "تحتاج تصعيد فوري"],
                  ["1 بلاغ", "بانتظار اعتماد الإغلاق"]
                ].map(([count, text]) => (
                  <Box key={String(count)} sx={{ p: 1.2, borderRadius: 2, bgcolor: "#fafbff" }}>
                    <Typography sx={{ color: "#000666", fontWeight: 900 }}>{count}</Typography>
                    <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.3 }}>{text}</Typography>
                  </Box>
                ))}
              </Stack>
              <Button fullWidth variant="outlined" startIcon={<AlarmOnIcon />} sx={{ mt: 2 }} onClick={() => navigate("/erp/notifications")}>فتح التنبيهات الحرجة</Button>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
