import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ImageIcon from "@mui/icons-material/Image";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsightsIcon from "@mui/icons-material/Insights";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PercentIcon from "@mui/icons-material/Percent";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { PageHero } from "../components/PageHero";
import { StatCard } from "../components/StatCard";
import { StatusChip } from "../components/StatusChip";

const heatMapProjects = [
  { id: "#K-201", name: "برج المجد", progress: "85%", color: "#16a34a", icon: "verified" },
  { id: "#K-204", name: "مجمع النخيل", progress: "تأخير في التوريد", color: "#f59e0b", icon: "warning" },
  { id: "#K-208", name: "فندق واحة دبي", progress: "42%", color: "#16a34a", icon: "verified" },
  { id: "#K-210", name: "سكني الرياض 4", progress: "تجاوز الميزانية", color: "#ef4444", icon: "error" },
  { id: "#K-215", name: "فيلا النسيم", progress: "مكتمل جزئيًا", color: "#16a34a", icon: "verified" },
  { id: "#K-219", name: "بوابات المستقبل", progress: "مرحلة الأساسات", color: "#16a34a", icon: "verified" }
];

const transactions = [
  { project: "برج المجد الإداري", date: "14 أكتوبر 2023", type: "تطوير عقاري", amount: "420,000", status: "تم الدفع", icon: <ApartmentIcon /> },
  { project: "فيلا الشروق - تشطيب", date: "12 أكتوبر 2023", type: "تشطيبات داخلية", amount: "85,200", status: "قيد المراجعة", icon: <ImageIcon /> },
  { project: "فندق بلو فيو", date: "10 أكتوبر 2023", type: "تطوير عقاري", amount: "1,150,000", status: "تم الدفع", icon: <CorporateFareIcon /> }
];

const pipeline = [
  { month: "يناير", primary: 40, secondary: 20 },
  { month: "فبراير", primary: 35, secondary: 25 },
  { month: "مارس", primary: 50, secondary: 22 },
  { month: "أبريل", primary: 30, secondary: 15 },
  { month: "مايو", primary: 45, secondary: 30 },
  { month: "يونيو", primary: 60, secondary: 35 },
  { month: "يوليو", primary: 33, secondary: 17 }
];

export function BusinessIntelligencePage() {
  const navigate = useNavigate();

  const formatMoney = (amount: string) => {
    const numeric = Number(String(amount).replace(/,/g, ""));
    if (!Number.isFinite(numeric)) {
      return amount;
    }

    return numeric.toLocaleString("ar-EG");
  };

  const exportBiReport = () => {
    const csv = [
      "project,date,type,amount,status",
      ...transactions.map((t) => `${t.project},${t.date},${t.type},${t.amount},${t.status}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bi-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Stack spacing={3.2}>
      <PageHero
        eyebrow="الرئيسية / استخبارات الأعمال"
        title="لوحة استخبارات الأعمال"
        subtitle="نظرة تحليلية على الأداء المالي والتشغيلي مع مؤشرات اتجاه واتساق التنفيذ."
        actions={(
          <>
            <Button type="button" variant="outlined" startIcon={<CalendarMonthIcon />} onClick={() => navigate("/erp/reports")}>الربع الأخير 2023</Button>
            <Button type="button" variant="contained" startIcon={<DownloadIcon />} onClick={exportBiReport}>تصدير التقرير</Button>
          </>
        )}
      />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <StatCard title="إجمالي الإيرادات" value="42.8 مليون ريال" icon={<AccountBalanceWalletIcon />} accent="#000666" />
        <StatCard title="صافي الأرباح" value="18.2 مليون ريال" icon={<TrendingUpIcon />} accent="#964900" />
        <StatCard title="العائد على الاستثمار" value="24.5%" icon={<PercentIcon />} accent="#380b00" />
        <StatCard title="المشاريع تحت المتابعة" value={String(heatMapProjects.length)} icon={<InsightsIcon />} accent="#1a237e" />
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20 }}>تحليل اتجاهات الإيرادات</Typography>
                <Typography sx={{ color: "#8990a5", fontSize: 13 }}>المقارنة بين النصف الأول والثاني من السنة المالية</Typography>
              </Box>
              <Chip label="مقارنة نصف سنوية" size="small" />
            </Box>
            <Box sx={{ height: 320, display: "flex", alignItems: "flex-end", gap: 1.6, position: "relative" }}>
              <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                {[1, 2, 3, 4].map((item) => <Box key={item} sx={{ borderBottom: "1px solid rgba(198,197,212,0.35)", height: 0 }} />)}
              </Box>
              {pipeline.map((bar) => (
                <Box key={bar.month} sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 0.6, minWidth: 0 }}>
                  <Box sx={{ height: `${bar.primary}%`, bgcolor: "rgba(0,6,102,0.85)", borderRadius: "4px 4px 0 0" }} />
                  <Box sx={{ height: `${bar.secondary}%`, bgcolor: "#fc820c", borderRadius: "4px 4px 0 0" }} />
                  <Typography sx={{ textAlign: "center", fontSize: 10, color: "#8b91a5", mt: 0.4 }}>{bar.month}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20, mb: 1.5 }}>الربحية حسب القطاع</Typography>
            <Box sx={{ display: "grid", gap: 2.2 }}>
              <Box sx={{ p: 2.2, borderRadius: 2, bgcolor: "#1a237e", color: "white" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, opacity: 0.85 }}>التطوير العقاري</Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: 20 }}>62%</Typography>
                </Box>
                <Box sx={{ height: 6, borderRadius: 999, bgcolor: "rgba(255,255,255,0.2)" }}><Box sx={{ width: "62%", height: "100%", borderRadius: 999, bgcolor: "white" }} /></Box>
                <Typography sx={{ mt: 2, opacity: 0.7, fontSize: 12 }}>الهامش الإجمالي: 12.4 مليون ريال</Typography>
              </Box>
              <Box sx={{ p: 2.2, borderRadius: 2, bgcolor: "#fc820c", color: "white" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, opacity: 0.85 }}>أعمال التشطيبات</Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: 20 }}>38%</Typography>
                </Box>
                <Box sx={{ height: 6, borderRadius: 999, bgcolor: "rgba(255,255,255,0.2)" }}><Box sx={{ width: "38%", height: "100%", borderRadius: 999, bgcolor: "white" }} /></Box>
                <Typography sx={{ mt: 2, opacity: 0.7, fontSize: 12 }}>الهامش الإجمالي: 5.8 مليون ريال</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2.5, pt: 2.2, borderTop: "1px solid #eef0f6" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 14 }}>إجمالي الكفاءة التشغيلية</Typography>
                <Chip label="نظام آلي" size="small" />
              </Box>
              <Box sx={{ display: "flex", gap: 0.8, mt: 1.8 }}>
                {[0, 1, 2, 3, 4].map((index) => <Box key={index} sx={{ flex: 1, height: 6, bgcolor: index < 3 ? "#16a34a" : "rgba(22,163,74,0.3)", borderRadius: 999 }} />)}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.2, flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20 }}>خارطة حالة المشاريع</Typography>
            <Button type="button" size="small" variant="outlined" startIcon={<TimelineIcon />} onClick={() => navigate("/erp/projects")}>فتح المشاريع</Button>
          </Box>
          {heatMapProjects.length === 0 ? (
            <EmptyStateCard title="لا توجد بيانات حالة" description="أضف مشاريع أو حدّث بيانات الحالة لعرض الخريطة." />
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 1.4 }}>
              {heatMapProjects.map((project) => (
                <Box key={project.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafbff", borderInlineStart: `4px solid ${project.color}` }}>
                  <Typography sx={{ color: "#8a90a6", fontSize: 11, fontWeight: 800 }}>{project.id}</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{project.name}</Typography>
                  <Typography sx={{ color: "#7f8597", fontSize: 13, mb: 0.8 }}>{project.progress}</Typography>
                  <StatusChip label={project.color === "#ef4444" ? "حرج" : project.color === "#f59e0b" ? "متابعة" : "مستقر"} />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2.5, borderBottom: "1px solid #eef0f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18 }}>سجل العمليات المالية الحديثة</Typography>
            <Button type="button" variant="text" sx={{ color: "#964900", fontWeight: 800 }} onClick={() => navigate("/erp/finance")}>عرض الكل</Button>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" className="erp-table" sx={{ minWidth: 720 }}>
              <Box component="thead" sx={{ bgcolor: "#f3f4f8", color: "#6e7286", fontSize: 12 }}>
                <Box component="tr">
                  {[
                    "المشروع",
                    "تاريخ المعاملة",
                    "نوع الخدمة",
                    "المبلغ (ر.س)",
                    "الحالة"
                  ].map((head) => <Box key={head} component="th" sx={{ p: 2.2, textAlign: "right", fontWeight: 800 }}>{head}</Box>)}
                </Box>
              </Box>
              <Box component="tbody">
                {transactions.map((row) => (
                  <Box key={row.project} component="tr" sx={{ borderBottom: "1px solid #f5f6fb", "&:hover": { bgcolor: "#fafbff" } }}>
                    <Box component="td" sx={{ p: 2.2 }}>
                      <Box sx={{ display: "flex", gap: 1.4, alignItems: "center" }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: "rgba(0,6,102,0.08)", display: "grid", placeItems: "center", color: "#000666" }}>{row.icon}</Box>
                        <Typography sx={{ color: "#000666", fontWeight: 800 }}>{row.project}</Typography>
                      </Box>
                    </Box>
                    <Box component="td" sx={{ p: 2.2, color: "#6e7286", fontSize: 13 }}>{row.date}</Box>
                    <Box component="td" sx={{ p: 2.2 }}><Chip label={row.type} size="small" sx={{ bgcolor: "#eef0f6", fontWeight: 700 }} /></Box>
                    <Box component="td" sx={{ p: 2.2, color: "#000666", fontWeight: 900 }}>{formatMoney(row.amount)}</Box>
                    <Box component="td" sx={{ p: 2.2 }}><StatusChip label={row.status} size="small" /></Box>
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
