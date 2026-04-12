import BuildIcon from "@mui/icons-material/Build";
import ConstructionIcon from "@mui/icons-material/Construction";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StatusChip } from "../components/StatusChip";
import { QuickActionsCard } from "../components/QuickActionsCard";

const requests = [
  { title: "بلاغ صيانة مضخة الخرسانة", location: "مشروع برج المجد", priority: "عاجل", status: "قيد التنفيذ", progress: 82 },
  { title: "فحص مولد احتياطي", location: "ورشة الصيانة المركزية", priority: "متوسط", status: "مجدول", progress: 45 },
  { title: "إصلاح تسريب خط مياه", location: "مجمع النخيل", priority: "عاجل", status: "بانتظار الفني", progress: 18 },
  { title: "صيانة رافعة تحميل", location: "موقع القدية", priority: "منخفض", status: "مكتمل", progress: 100 }
];

const maintenanceStats = [
  { title: "طلبات الصيانة", value: 18, color: "#000666" },
  { title: "عاجلة", value: 5, color: "#ba1a1a" },
  { title: "مجدوَلة", value: 9, color: "#964900" },
  { title: "مكتملة", value: 27, color: "#16a34a" }
];

export function MaintenancePage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>الصيانة / البلاغات التشغيلية</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>مركز الصيانة والتشغيل</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>متابعة البلاغات، جداول الصيانة، وحالة تنفيذ الأعمال الفنية بالمواقع.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" startIcon={<NotificationsActiveIcon />} onClick={() => navigate("/erp/incidents")}>البلاغات</Button>
          <Button variant="contained" startIcon={<ConstructionIcon />} sx={{ bgcolor: "#000666" }} onClick={() => navigate("/erp/maintenance-detail")}>إضافة طلب صيانة</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {maintenanceStats.map((item) => (
          <Card key={item.title} sx={{ borderRadius: 3, borderInlineStart: `4px solid ${item.color}` }}>
            <CardContent>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{item.title}</Typography>
              <Typography sx={{ color: item.color, fontWeight: 900, fontSize: 38, lineHeight: 1, mt: 1 }}>{item.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.2, gap: 1, flexWrap: "wrap" }}>
              <Box>
                <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22 }}>طلبات الصيانة النشطة</Typography>
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>تابع حالة كل بلاغ والتقدم الفعلي على أرض الموقع</Typography>
              </Box>
              <Chip label="تحديث لحظي" sx={{ bgcolor: "#eef0f6", fontWeight: 800 }} />
            </Box>

            <Stack spacing={1.4}>
              {requests.map((request) => (
                <Box key={request.title} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ color: "#000666", fontWeight: 800 }}>{request.title}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>{request.location}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <StatusChip label={request.priority} size="small" />
                      <StatusChip label={request.status} size="small" sx={{ mt: 0.8 }} />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1.2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>الإنجاز</Typography>
                      <Typography sx={{ fontSize: 13, color: "#000666", fontWeight: 800 }}>{request.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={request.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: request.priority === "عاجل" ? "#ba1a1a" : "#000666" } }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>جدول الصيانة القادم</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.4 }}>
                {[
                  ["24 أبريل", "فحص هيدروليكي - رافعة T-01"],
                  ["28 أبريل", "تغيير زيوت - شاحنات النقل"],
                  ["02 مايو", "صيانة دورية - مولدات الموقع"]
                ].map(([date, label]) => (
                  <Box key={String(date)} sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
                    <Typography sx={{ fontWeight: 800, color: "#fc820c" }}>{date}</Typography>
                    <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.88)", mt: 0.4 }}>{label}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <QuickActionsCard title="إجراء سريع">
            <Button variant="outlined" startIcon={<BuildIcon />} onClick={() => navigate("/erp/maintenance-detail")}>إحالة لفني</Button>
            <Button variant="outlined" startIcon={<EventAvailableIcon />} onClick={() => navigate("/erp/maintenance-detail")}>جدولة صيانة</Button>
            <Button variant="outlined" startIcon={<ReportProblemIcon />} onClick={() => navigate("/erp/incidents")}>تسجيل بلاغ عاجل</Button>
          </QuickActionsCard>
        </Stack>
      </Box>
    </Stack>
  );
}
