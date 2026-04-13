import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SpeedIcon from "@mui/icons-material/Speed";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { ProcessFlowCard } from "../components/ProcessFlowCard";
import { QuickActionsCard } from "../components/QuickActionsCard";
import { StatusChip } from "../components/StatusChip";

const faultCards = [
  { title: "أعطال نشطة", value: "12", color: "#000666" },
  { title: "حرجة", value: "4", color: "#ba1a1a" },
  { title: "تحت الإصلاح", value: "6", color: "#964900" },
  { title: "مغلقة اليوم", value: "9", color: "#16a34a" }
];

const faultRows = [
  { machine: "رافعة T-01", site: "برج المجد", type: "هيدروليك", status: "حرج", progress: 28, owner: "الصيانة الثقيلة" },
  { machine: "مولد G-04", site: "مجمع النخيل", type: "طاقة", status: "تحت المعالجة", progress: 64, owner: "قسم الطاقة" },
  { machine: "مضخة الخرسانة P-11", site: "القدية - المرحلة 2", type: "ضخ", status: "بانتظار قطع", progress: 46, owner: "فريق المعدات" },
  { machine: "خلاطة M-07", site: "ورشة المركز", type: "ميكانيكي", status: "مكتمل", progress: 100, owner: "الصيانة المركزية" }
];

const partsNeeded = [
  ["خرطوم هيدروليك", "3 قطع", "مخزن المعدات"],
  ["فلتر زيت", "8 قطع", "مخزن الكهرباء"],
  ["بطارية تشغيل", "2 قطعة", "مخزن الطاقة"],
  ["حساس حرارة", "4 قطع", "المخزن الرئيسي"]
];

const operationFlow = [
  { title: "البلاغات", description: "تلقّي العطل من مركز البلاغات واعتماد الأولوية" },
  { title: "الصيانة", description: "تحويل العطل إلى أمر عمل مباشر" },
  { title: "المخازن", description: "تأكيد توفر قطع الغيار قبل التنفيذ" },
  { title: "الإغلاق", description: "اعتماد الإصلاح وتحديث الحالة" }
];

export function EquipmentFaultsPage() {
  return (
    <Stack spacing={3.2}>
      <PageHero
        eyebrow="الصيانة / أعطال المعدات"
        title="لوحة أعطال المعدات"
        subtitle="متابعة الأعطال الحرجة، حالة المعالجة، والقطع المطلوبة من المخازن المرتبطة مباشرة."
        actions={(
          <>
            <Button component={NavLink} to="/erp/incidents" variant="outlined" startIcon={<ReportProblemIcon />}>البلاغات</Button>
            <Button component={NavLink} to="/erp/maintenance-detail" variant="contained" startIcon={<BuildCircleIcon />} sx={{ bgcolor: "#000666" }}>أوامر الصيانة</Button>
          </>
        )}
      />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {faultCards.map((card) => (
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 2.2 }}>
              <Box>
                <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22 }}>الأعطال الجارية</Typography>
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>ترتيب الأعطال حسب الأولوية، الموقع، والتقدم الفعلي</Typography>
              </Box>
              <Chip icon={<PrecisionManufacturingIcon />} label="متصل بالصيانة" sx={{ bgcolor: "#eef0f6", fontWeight: 800 }} />
            </Box>

            <Stack spacing={1.4}>
              {faultRows.map((fault) => (
                <Box key={fault.machine} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ color: "#000666", fontWeight: 800 }}>{fault.machine}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>{fault.site} · {fault.type} · {fault.owner}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <StatusChip label={fault.status} size="small" />
                      <Typography sx={{ mt: 0.8, color: "#000666", fontWeight: 800 }}>{fault.progress}%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1.2 }}>
                    <LinearProgress variant="determinate" value={fault.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: fault.status === "حرج" ? "#ba1a1a" : "#000666" } }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <ProcessFlowCard title="الربط التشغيلي" items={operationFlow} />

          <QuickActionsCard>
            <Button component={NavLink} to="/erp/incidents" variant="outlined" startIcon={<ReportProblemIcon />}>فتح بلاغ مرتبط</Button>
            <Button component={NavLink} to="/erp/inventory-detail" variant="outlined" startIcon={<Inventory2Icon />}>حجز قطع الغيار</Button>
            <Button component={NavLink} to="/erp/maintenance-detail" variant="outlined" startIcon={<BuildCircleIcon />}>فتح أمر صيانة</Button>
            <Button variant="outlined" startIcon={<SpeedIcon />} component={NavLink} to="/erp/sla">تحديث KPI الأعطال</Button>
          </QuickActionsCard>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 34, mb: 2 }}>القطع المطلوبة الآن</Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" className="erp-table" sx={{ minWidth: 720 }}>
              <Box component="thead" sx={{ bgcolor: "#f3f4f8", color: "#7f8597", fontSize: 13 }}>
                <Box component="tr">
                  {['القطعة', 'الكمية', 'المخزن'].map((head) => (
                    <Box key={head} component="th" sx={{ p: 2, textAlign: "right", fontWeight: 800 }}>{head}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {partsNeeded.map((part) => (
                  <Box key={part[0]} component="tr" sx={{ borderBottom: "1px solid #f1f3f8", "&:hover": { bgcolor: "#fafbff" } }}>
                    <Box component="td" sx={{ p: 2, color: "#000666", fontWeight: 800 }}>{part[0]}</Box>
                    <Box component="td" sx={{ p: 2, color: "#964900", fontWeight: 800 }}>{part[1]}</Box>
                    <Box component="td" sx={{ p: 2 }}>{part[2]}</Box>
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
