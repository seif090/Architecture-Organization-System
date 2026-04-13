import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ForumIcon from "@mui/icons-material/Forum";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { ProcessFlowCard } from "../components/ProcessFlowCard";
import { QuickActionsCard } from "../components/QuickActionsCard";
import { PageHero } from "../components/PageHero";
import { StatusChip } from "../components/StatusChip";

const incidentItems = [
  {
    title: "بلاغ رقم 1284",
    subject: "تسريب في منطقة التشطيب بالدور الثالث",
    site: "مشروع الميناء التجاري",
    priority: "عاجل",
    status: "قيد المعالجة",
    assignee: "فريق السباكة",
    progress: 76
  },
  {
    title: "بلاغ رقم 1268",
    subject: "توقف مؤقت في الرافعة الرئيسية",
    site: "برج النخبة",
    priority: "متوسط",
    status: "بانتظار اعتماد",
    assignee: "قسم المعدات",
    progress: 41
  },
  {
    title: "بلاغ رقم 1239",
    subject: "طلب مراجعة فاتورة صيانة",
    site: "الإدارة المركزية",
    priority: "منخفض",
    status: "مغلق",
    assignee: "الشؤون المالية",
    progress: 100
  }
];

const slaCards = [
  { title: "بلاغات مفتوحة", value: "14", color: "#000666" },
  { title: "تحت SLA", value: "11", color: "#16a34a" },
  { title: "متأخرة", value: "3", color: "#ba1a1a" },
  { title: "مغلقة اليوم", value: "8", color: "#964900" }
];

const serviceFlow = [
  { title: "استقبال", description: "تم توثيق البلاغ من المشرف" },
  { title: "التعيين", description: "أُحيل إلى الفريق المختص" },
  { title: "المتابعة", description: "جاري تنفيذ الإجراء بالموقع" },
  { title: "الإغلاق", description: "تمت المراجعة واعتماد الحل" }
];

export function IncidentsPage() {
  return (
    <Stack spacing={3.2}>
      <PageHero
        eyebrow="التشغيل / مركز البلاغات"
        title="مركز البلاغات والمتابعة"
        subtitle="متابعة البلاغات من الاستقبال حتى الإغلاق مع مؤشرات SLA والتعيين."
        actions={(
          <>
            <Button variant="outlined" startIcon={<LocalPhoneIcon />} onClick={() => { window.location.href = "tel:+201000000000"; }}>اتصال سريع</Button>
            <Button variant="contained" startIcon={<ReportProblemIcon />} sx={{ bgcolor: "#000666" }} onClick={() => window.alert("سيتم فتح نموذج تسجيل بلاغ جديد داخل مركز البلاغات لاحقًا")}>تسجيل بلاغ جديد</Button>
          </>
        )}
      />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {slaCards.map((card) => (
          <Card key={card.title} sx={{ borderRadius: 3, borderInlineStart: `4px solid ${card.color}` }}>
            <CardContent>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{card.title}</Typography>
              <Typography sx={{ color: card.color, fontWeight: 900, fontSize: 38, lineHeight: 1, mt: 1 }}>{card.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.45fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.2, gap: 1, flexWrap: "wrap" }}>
              <Box>
                <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22 }}>البلاغات النشطة</Typography>
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>قائمة البلاغات الأخيرة مع حالة التنفيذ ونسبة التقدم</Typography>
              </Box>
              <Chip icon={<ForumIcon />} label="قنوات متعددة" sx={{ bgcolor: "#eef0f6", fontWeight: 800 }} />
            </Box>

            <Stack spacing={1.4}>
              {incidentItems.map((incident) => (
                <Box key={incident.title} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ color: "#000666", fontWeight: 800 }}>{incident.title}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>{incident.subject}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 12, mt: 0.4 }}>{incident.site} · {incident.assignee}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <StatusChip label={incident.priority} size="small" />
                      <StatusChip label={incident.status} size="small" sx={{ mt: 0.8 }} />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1.2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>الإنجاز</Typography>
                      <Typography sx={{ fontSize: 13, color: "#000666", fontWeight: 800 }}>{incident.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={incident.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: incident.priority === "عاجل" ? "#ba1a1a" : "#000666" } }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <ProcessFlowCard title="مسار الخدمة" items={serviceFlow} />

          <QuickActionsCard showDivider>
            <Button variant="outlined" startIcon={<SupportAgentIcon />} onClick={() => window.alert("تم إسناد البلاغ لفريق الدعم مبدئيًا")}>إسناد لفريق الدعم</Button>
            <Button variant="outlined" startIcon={<AssignmentTurnedInIcon />} onClick={() => window.alert("تم إغلاق البلاغ مبدئيًا")}>إغلاق بلاغ</Button>
            <Button variant="outlined" startIcon={<ReportProblemIcon />} onClick={() => window.alert("تم تصعيد البلاغ للإدارة مبدئيًا")}>تصعيد للإدارة</Button>
          </QuickActionsCard>
        </Stack>
      </Box>
    </Stack>
  );
}
