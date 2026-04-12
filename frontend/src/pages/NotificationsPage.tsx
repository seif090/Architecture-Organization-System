import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentsIcon from "@mui/icons-material/Payments";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(notifications);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return items;
    }
    return items.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.severity.toLowerCase().includes(q));
  }, [items, search]);

  const removeNotification = (title: string) => {
    if (!window.confirm("هل تريد حذف هذا التنبيه؟")) {
      return;
    }
    setItems((prev) => prev.filter((n) => n.title !== title));
  };

  const markAllAsRead = () => {
    window.alert("تم تعليم جميع الإشعارات كمقروءة");
  };

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>مركز التنبيهات والتحديثات</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>مركز التنبيهات</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>متابعة فورية للتنبيهات الحرجة والمالية والتشغيلية.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button type="button" variant="outlined" startIcon={<SearchIcon />} onClick={() => setSearch(window.prompt("ابحث في التنبيهات:", search) ?? search)}>بحث</Button>
          <Button type="button" variant="contained" startIcon={<DoneAllIcon />} sx={{ bgcolor: "#000666" }} onClick={markAllAsRead}>تحديد الكل كمقروء</Button>
        </Stack>
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 900, color: "#000666" }}>مرحباً بك في مركز التحكم</Typography>
            <Typography sx={{ color: "#6f7587", mt: 1 }}>لديك اليوم 12 تنبيهاً يتطلب إجراءً فورياً</Typography>
          </Box>
          <Button type="button" variant="contained" startIcon={<NotificationsIcon />} sx={{ bgcolor: "#1a237e" }} onClick={() => window.alert("تم فتح لوحة إدارة الإشعارات")}>إدارة الإشعارات</Button>
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
          {filteredItems.map((notification) => (
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
                        <Button
                          type="button"
                          key={action}
                          variant={index === 0 ? "contained" : "text"}
                          sx={{ bgcolor: index === 0 ? notification.color : "transparent", color: index === 0 ? "white" : "#6f7587" }}
                          onClick={() => {
                            if (action.includes("شراء")) navigate("/erp/procurement");
                            else if (action.includes("الحضور")) navigate("/erp/workforce");
                            else if (action.includes("الفاتورة")) navigate("/erp/finance");
                            else if (action.includes("الجدولة")) navigate("/erp/maintenance");
                            else window.alert(`تم تنفيذ الإجراء: ${action}`);
                          }}
                        >
                          {action}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                  <IconButton aria-label="حذف التنبيه" onClick={() => removeNotification(notification.title)}><DeleteIcon /></IconButton>
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
            <Button type="button" variant="contained" sx={{ bgcolor: "#fc820c", color: "white" }} onClick={() => navigate("/erp/maintenance")}>الانتقال إلى الجدولة</Button>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
