import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentsIcon from "@mui/icons-material/Payments";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, Stack, Typography } from "@mui/material";

const summary = [
  { title: "المالية المستحقة", count: 4, label: "مطالبات اليوم", color: "#964900", progress: 75 },
  { title: "تأخير المشاريع", count: 2, label: "مواقع متأخرة", color: "#ba1a1a", progress: 25 },
  { title: "طلبات الاعتماد", count: 6, label: "قيد الانتظار", color: "#000666", progress: 50 },
  { title: "المخزون", count: 9, label: "تحت الحد الأدنى", color: "#380b00", progress: 80 }
];

const filters = [
  { label: "الكل", active: true },
  { label: "مالي", icon: <PaymentsIcon /> },
  { label: "فني", icon: <BuildIcon /> },
  { label: "مخازن", icon: <InventoryIcon /> },
  { label: "موظفين", icon: <AssignmentIndIcon /> }
];

const notifications = [
  {
    severity: "حرج",
    color: "#ba1a1a",
    title: "تأخر موعد صب الخرسانة - مشروع أبراج التحلية",
    body: "تجاوز الجدول الزمني المخطط له بمقدار 48 ساعة. يتطلب التدخل الفوري لتجنب غرامات التأخير.",
    time: "منذ 15 دقيقة",
    actions: ["عرض التفاصيل الفنية", "إعادة جدولة"]
  },
  {
    severity: "مالي",
    color: "#964900",
    title: "فاتورة مورد غير معتمدة - شركة النيل للبناء",
    body: "هناك فاتورة شراء مواد بقيمة 185,000 ج.م بانتظار الاعتماد النهائي من الإدارة المالية.",
    time: "منذ 32 دقيقة",
    actions: ["مراجعة الفاتورة", "رفض"]
  },
  {
    severity: "مخزون",
    color: "#380b00",
    title: "انخفاض مستوى الأسمنت في المخزن الرئيسي",
    body: "الرصيد الحالي أقل من الحد الأدنى المسموح به، ويوصى بإصدار أمر توريد فوري خلال اليوم.",
    time: "منذ ساعة واحدة",
    actions: ["إصدار طلب شراء", "تجاهل"]
  },
  {
    severity: "موظفين",
    color: "#000666",
    title: "تحديث حضور فريق الموقع - مشروع مدينة نصر",
    body: "تم تسجيل غياب عاملين وتأخير وصول فريق النجارة لمدة 25 دقيقة صباح اليوم.",
    time: "منذ ساعتين",
    actions: ["فتح سجل الحضور", "تأكيد الاستلام"]
  }
];

export function NotificationsPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb" }}>
      <Box sx={{ height: 64, bgcolor: "#000666", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, position: "sticky", top: 0, zIndex: 20, boxShadow: "0 8px 32px rgba(0,6,102,0.12)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 22 }}>مركز التنبيهات</Typography>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Typography sx={{ color: "#fc820c", fontWeight: 800, borderBottom: "2px solid #fc820c", pb: 0.5 }}>الرئيسية</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>الأرشيف</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>الجدولة</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1, bgcolor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.08)", px: 1.5, py: 0.8, borderRadius: 999 }}>
            <SearchIcon />
            <Typography sx={{ color: "rgba(255,255,255,0.55)", minWidth: 180 }}>بحث في التنبيهات...</Typography>
          </Box>
          <NotificationsIcon />
          <SettingsIcon />
          <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#d9ddef" }} />
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 900, color: "#000666" }}>مرحباً بك في مركز التحكم</Typography>
            <Typography sx={{ color: "#6f7587", mt: 1 }}>لديك اليوم 12 تنبيهاً يتطلب إجراءً فورياً</Typography>
          </Box>
          <Button variant="contained" startIcon={<DoneAllIcon />} sx={{ bgcolor: "#000666" }}>تحديد الكل كمقروء</Button>
        </Box>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, mb: 4 }}>
          {summary.map((item) => (
            <Card key={item.title} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: item.color, fontWeight: 800, fontSize: 13 }}>{item.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1 }}>
                  <Typography sx={{ fontSize: 40, fontWeight: 900, color: "#000666", lineHeight: 1 }}>{item.count}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#8a90a6" }}>{item.label}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={item.progress} sx={{ mt: 2, height: 6, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: item.color } }} />
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap", mb: 3, alignItems: "center" }}>
          {filters.map((filter) => (
            <Chip key={filter.label} label={filter.label} icon={filter.icon} sx={{ bgcolor: filter.active ? "#000666" : "#e7e8eb", color: filter.active ? "white" : "#6f7587", fontWeight: 700 }} />
          ))}
          <Box sx={{ mr: "auto", color: "#6f7587", display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 13 }}>ترتيب حسب:</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#000666" }}>الأحدث أولاً</Typography>
          </Box>
        </Box>

        <Stack spacing={2.2}>
          {notifications.map((notification) => (
            <Card key={notification.title} sx={{ borderRadius: 3, borderRight: `4px solid ${notification.color}`, boxShadow: "0 8px 32px rgba(0,6,102,0.06)" }}>
              <CardContent sx={{ p: 2.4 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box sx={{ width: 54, height: 54, borderRadius: 2, bgcolor: `${notification.color}16`, color: notification.color, display: "grid", placeItems: "center" }}>
                    <WarningAmberIcon />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#000666" }}>{notification.title}</Typography>
                      <Typography sx={{ color: "#8a90a6", fontSize: 12 }}>{notification.time}</Typography>
                    </Box>
                    <Typography sx={{ mt: 0.8, color: "#6f7587", lineHeight: 1.9 }}>{notification.body}</Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 1.2, flexWrap: "wrap" }}>
                      {notification.actions.map((action, index) => (
                        <Button key={action} variant={index === 0 ? "contained" : "text"} sx={{ bgcolor: index === 0 ? notification.color : "transparent", color: index === 0 ? "white" : "#6f7587" }}>
                          {action}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                  <IconButton><DeleteIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Card sx={{ borderRadius: 3, mt: 4, bgcolor: "#000666", color: "white" }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>حالة التنبيهات اللحظية</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>المتابعة الفورية لمخاطر المشروع والمالية والمخزون.</Typography>
            </Box>
            <Button variant="contained" sx={{ bgcolor: "#fc820c", color: "white" }}>الانتقال إلى الجدولة</Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
