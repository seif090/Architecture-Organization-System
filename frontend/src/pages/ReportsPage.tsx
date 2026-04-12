import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DownloadIcon from "@mui/icons-material/Download";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const reportCards = [
  { title: "تقرير الإيرادات الشهرية", value: "42.8M", delta: "+12.4%", color: "#000666" },
  { title: "تقرير المصروفات", value: "18.2M", delta: "+4.1%", color: "#964900" },
  { title: "تقرير المخزون", value: "12.8M", delta: "-3.8%", color: "#380b00" },
  { title: "تقرير الأداء التشغيلي", value: "91%", delta: "+2.2%", color: "#1a237e" }
];

const reportList = [
  { name: "تقرير المشاريع النشطة", scope: "مراجعة أسبوعية", progress: 88, status: "جاهز" },
  { name: "تقرير التوريد والمشتريات", scope: "ملخص شهري", progress: 74, status: "قيد التجميع" },
  { name: "تقرير الرواتب والتكليفات", scope: "مجموعة العمالة", progress: 65, status: "مكتمل جزئيًا" },
  { name: "تقرير العقود القانونية", scope: "الاعتمادات والتوقيع", progress: 92, status: "جاهز" }
];

const quickInsights = [
  "مشروع برج المجد هو الأعلى ربحية هذا الشهر.",
  "المخزون النقدي يغطي 3.8 أسابيع تشغيلية.",
  "العقود القريبة من الانتهاء تحتاج مراجعة هذا الأسبوع."
];

export function ReportsPage() {
  const navigate = useNavigate();

  const exportReportSummary = () => {
    const csv = [
      "title,value,delta",
      ...reportCards.map((card) => `${card.title},${card.value},${card.delta}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reports-summary.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>التقارير / التحليلات</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>مركز التقارير التنفيذية</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>لوحة مختصرة تجمع أهم مؤشرات المشاريع والمالية والمخزون والتشغيل.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" startIcon={<AssessmentIcon />} onClick={() => navigate("/erp/dashboard")}>عرض الملخص</Button>
          <Button variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: "#000666" }} onClick={exportReportSummary}>تصدير التقرير</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {reportCards.map((card, index) => (
          <Card key={card.title} sx={{ borderRadius: 3, borderInlineStart: `4px solid ${card.color}` }}>
            <CardContent>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>{card.title}</Typography>
              <Typography sx={{ color: card.color, fontWeight: 900, fontSize: 38, mt: 1, lineHeight: 1 }}>{card.value}</Typography>
              <Typography sx={{ color: index === 2 ? "#16a34a" : "#7f8597", mt: 0.8, fontSize: 12 }}>{card.delta}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.45fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.2, gap: 1, flexWrap: "wrap" }}>
              <Box>
                <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22 }}>حالة التقارير الجاهزة</Typography>
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>تقارير دورية مع نسب الإنجاز والتحديثات الآلية</Typography>
              </Box>
              <Chip icon={<InsertChartIcon />} label="تحديث مباشر" sx={{ bgcolor: "#eef0f6", fontWeight: 800 }} />
            </Box>

            <Stack spacing={1.4}>
              {reportList.map((report) => (
                <Box key={report.name} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ color: "#000666", fontWeight: 800 }}>{report.name}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>{report.scope}</Typography>
                    </Box>
                    <Chip label={report.status} size="small" sx={{ bgcolor: report.status === "جاهز" ? "#e8f8ef" : "#fff1e2" }} />
                  </Box>
                  <Box sx={{ mt: 1.2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>الاكتمال</Typography>
                      <Typography sx={{ fontSize: 13, color: "#000666", fontWeight: 800 }}>{report.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={report.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: "#000666" } }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>Insights سريعة</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                {quickInsights.map((item) => (
                  <Box key={item} sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
                    <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.88)" }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20, mb: 1.5 }}>سجل التنزيلات</Typography>
              <Stack spacing={1.1}>
                {[
                  ["ملخص الإدارة", "قبل 12 دقيقة"],
                  ["تقرير المصروفات", "أمس 4:20 مساءً"],
                  ["لوحة المخزون", "أمس 1:15 مساءً"]
                ].map(([label, time]) => (
                  <Box key={String(label)} sx={{ p: 1.2, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#000666" }}>{label}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{time}</Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ color: "#a2abc4" }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
