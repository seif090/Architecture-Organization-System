import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";

const employees = [
  { name: "محمد السيد", role: "مشرف موقع", task: "مشروع فيلا التجمع الخامس", salary: "12,500 ج.م", progress: 88, status: "نشط" },
  { name: "محمود حسن", role: "محاسب مواقع", task: "مشروع شقة مدينة نصر", salary: "11,200 ج.م", progress: 74, status: "نشط" },
  { name: "إبراهيم علي", role: "فني سباكة", task: "مرحلة التشطيبات", salary: "9,600 ج.م", progress: 63, status: "متاح" },
  { name: "حسين أحمد", role: "فني دهانات", task: "مشروع محل وسط البلد", salary: "10,400 ج.م", progress: 95, status: "نشط" }
];

const payroll = [
  { month: "أبريل", total: "284,000 ج.م", paid: "210,000 ج.م" },
  { month: "مارس", total: "273,500 ج.م", paid: "273,500 ج.م" },
  { month: "فبراير", total: "251,900 ج.م", paid: "240,000 ج.م" }
];

const cards = [
  { title: "إجمالي الموظفين", value: 42, icon: <GroupsIcon /> },
  { title: "المتواجدون في المواقع", value: 31, icon: <BadgeIcon /> },
  { title: "دفعات اليوم", value: "18", icon: <PaymentsIcon /> },
  { title: "المهام المفتوحة", value: 7, icon: <AssignmentIndIcon /> }
];

export function WorkforcePage() {
  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>القوى العاملة / المقاولين</Typography>
          <Typography sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 900, color: "#000666", lineHeight: 1.1 }}>إدارة المقاولين والقوى العاملة</Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>متابعة بيانات المقاولين، سجلات الحضور، وتوزيع العمالة على المشاريع.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666" }}>إضافة مقاول جديد</Button>
          <Button variant="contained" startIcon={<BadgeIcon />} sx={{ bgcolor: "#fc820c", color: "#311300" }}>تسجيل حضور</Button>
          <Button variant="outlined" startIcon={<PaymentsIcon />}>تصدير كشف الأجور</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {cards.map((card) => (
          <Card key={card.title} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", gap: 1.3, alignItems: "center" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#eef0f6", display: "grid", placeItems: "center", color: "#000666" }}>{card.icon}</Box>
                <Box>
                  <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{card.title}</Typography>
                  <Typography sx={{ fontSize: 34, fontWeight: 900, color: "#000666", lineHeight: 1 }}>{card.value}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 2 }}>فريق العمل النشط</Typography>
            <Stack spacing={1.4}>
              {employees.map((employee) => (
                <Box key={employee.name} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#000666" }}>{employee.name}</Typography>
                      <Typography sx={{ fontSize: 13, color: "#7f8597", mt: 0.4 }}>{employee.role} · {employee.task}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <Typography sx={{ fontWeight: 900, color: "#000666" }}>{employee.salary}</Typography>
                      <Chip label={employee.status} size="small" sx={{ mt: 0.5, bgcolor: employee.status === "نشط" ? "#e8f8ef" : "#eef0f6" }} />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1.3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>نسبة الإنجاز</Typography>
                      <Typography sx={{ fontSize: 13, color: "#000666", fontWeight: 800 }}>{employee.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={employee.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: "#000666" } }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 2 }}>جدول الرواتب</Typography>
              <Stack spacing={1.2}>
                {payroll.map((item) => (
                  <Box key={item.month} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#f8f9fd", display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{item.month}</Typography>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>المدفوع: {item.paid}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, color: "#000666" }}>{item.total}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 18, fontWeight: 800, mb: 1 }}>إشعارات التشغيل</Typography>
              <Typography sx={{ opacity: 0.85, fontSize: 14 }}>يوجد 4 عمال جاهزون للنقل إلى الموقع غدًا، وطلب صرف مستلزمات لمشروع الفيلا قيد التحديث.</Typography>
              <Button variant="contained" sx={{ mt: 2, bgcolor: "#fc820c", color: "white" }}>فتح لوحة التكاليف</Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 2 }}>ملخص التواجد</Typography>
              <Stack spacing={1.1}>
                {[
                  ["في الموقع", 31],
                  ["متاح", 9],
                  ["إجازة", 2]
                ].map(([label, value]) => (
                  <Box key={String(label)} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ color: "#7f8597" }}>{label}</Typography>
                    <Typography sx={{ fontWeight: 800, color: "#000666" }}>{String(value)}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800 }}>إدارة الرواتب والتحكم</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 0.7 }}>تجهيز الدفعات، مراجعة ساعات العمل، وربط التكليفات بالمواقع النشطة.</Typography>
          </Box>
          <Button variant="contained" sx={{ bgcolor: "#964900", color: "white" }}>تصدير كشوف الرواتب</Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
