import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ProcessFlowCard } from "../components/ProcessFlowCard";
import { QuickActionsCard } from "../components/QuickActionsCard";
import { StatusChip } from "../components/StatusChip";

const maintenanceJobs = [
  {
    title: "صيانة رافعة T-01",
    site: "مشروع برج المجد",
    status: "قيد العمل",
    progress: 68,
    technician: "فريق المعدات الثقيلة",
    nextStep: "اختبار حمل نهائي"
  },
  {
    title: "مراجعة مولدات الموقع",
    site: "مجمع النخيل",
    status: "مجدولة",
    progress: 34,
    technician: "قسم الطاقة",
    nextStep: "تبديل فلاتر وزيوت"
  },
  {
    title: "صيانة مضخة الخرسانة",
    site: "القدية - المرحلة 2",
    status: "عاجل",
    progress: 86,
    technician: "فريق الصيانة الميداني",
    nextStep: "اعتماد الإغلاق"
  }
];

const spareParts = [
  ["فلاتر زيت", "مخزن الكهرباء", "18 قطعة"],
  ["سيور نقل", "مخزن المعدات", "6 قطع"],
  ["خراطيم هيدروليك", "المخزن الرئيسي", "12 قطعة"],
  ["زيوت تشحيم", "مخزن السوائل", "42 عبوة"]
];

const opsLoop = [
  { title: "البلاغات", description: "استقبال البلاغ وتصنيفه حسب العطل" },
  { title: "المخازن", description: "التحقق من توفر القطع الاستهلاكية" },
  { title: "التنفيذ", description: "تخصيص الفني وبدء أمر العمل" },
  { title: "الإغلاق", description: "تأكيد الإصلاح وتحديث حالة الأصل" }
];

export function MaintenanceDetailPage() {
  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>الصيانة / التفاصيل التشغيلية</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>الصيانة التفصيلية</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>متابعة أوامر العمل وربطها مباشرة بالبلاغات المفتوحة وقطع الغيار في المخازن.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button component={NavLink} to="/erp/incidents" variant="outlined" startIcon={<ReportProblemIcon />}>العودة للبلاغات</Button>
          <Button component={NavLink} to="/erp/inventory-detail" variant="contained" startIcon={<Inventory2Icon />} sx={{ bgcolor: "#000666" }}>عرض المخازن</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {[
          ["أوامر مفتوحة", "9", "#000666"],
          ["عاجلة", "3", "#ba1a1a"],
          ["بانتظار قطع", "5", "#964900"],
          ["مغلقة اليوم", "7", "#16a34a"]
        ].map(([label, value, color]) => (
          <Card key={String(label)} sx={{ borderRadius: 3, borderInlineStart: `4px solid ${color}` }}>
            <CardContent>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{label}</Typography>
              <Typography sx={{ color, fontWeight: 900, fontSize: 38, lineHeight: 1, mt: 1 }}>{value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.45fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 2.2 }}>
              <Box>
                <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22 }}>أوامر العمل الجارية</Typography>
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>ترتيب الأوامر بحسب الأولوية والتقدم الفعلي بالموقع</Typography>
              </Box>
              <Chip icon={<BuildCircleIcon />} label="مرتبطة مباشرة بالبلاغات" sx={{ bgcolor: "#eef0f6", fontWeight: 800 }} />
            </Box>

            <Stack spacing={1.4}>
              {maintenanceJobs.map((job) => (
                <Box key={job.title} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ color: "#000666", fontWeight: 800 }}>{job.title}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>{job.site}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 12, mt: 0.4 }}>الفني المسؤول: {job.technician}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <StatusChip label={job.status} size="small" />
                      <Typography sx={{ mt: 0.8, color: "#000666", fontWeight: 800 }}>{job.nextStep}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1.2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>نسبة الإنجاز</Typography>
                      <Typography sx={{ fontSize: 13, color: "#000666", fontWeight: 800 }}>{job.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={job.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: job.status === "عاجل" ? "#ba1a1a" : "#000666" } }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <ProcessFlowCard title="حلقة الربط التشغيلية" items={opsLoop} />

          <QuickActionsCard>
            <Button component={NavLink} to="/erp/incidents" variant="outlined" startIcon={<ReportProblemIcon />}>فتح البلاغ المرتبط</Button>
            <Button component={NavLink} to="/erp/inventory-detail" variant="outlined" startIcon={<Inventory2Icon />}>حجز قطع غيار</Button>
            <Button variant="outlined" startIcon={<ScheduleIcon />} component={NavLink} to="/erp/maintenance">جدولة زيارة ميدانية</Button>
            <Button variant="outlined" startIcon={<VerifiedIcon />} component={NavLink} to="/erp/sla">اعتماد الإغلاق</Button>
          </QuickActionsCard>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 34, mb: 2 }}>قطع الغيار المطلوبة الآن</Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" className="erp-table" sx={{ minWidth: 720 }}>
              <Box component="thead" sx={{ bgcolor: "#f3f4f8", color: "#7f8597", fontSize: 13 }}>
                <Box component="tr">
                  {['القطعة', 'المخزن', 'الكمية'].map((head) => (
                    <Box key={head} component="th" sx={{ p: 2, textAlign: "right", fontWeight: 800 }}>{head}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {spareParts.map((part) => (
                  <Box key={part[0]} component="tr" sx={{ borderBottom: "1px solid #f1f3f8", "&:hover": { bgcolor: "#fafbff" } }}>
                    <Box component="td" sx={{ p: 2, color: "#000666", fontWeight: 800 }}>{part[0]}</Box>
                    <Box component="td" sx={{ p: 2 }}>{part[1]}</Box>
                    <Box component="td" sx={{ p: 2, color: "#964900", fontWeight: 800 }}>{part[2]}</Box>
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
