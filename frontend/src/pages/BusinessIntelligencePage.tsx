import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ImageIcon from "@mui/icons-material/Image";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GavelIcon from "@mui/icons-material/Gavel";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageHero } from "../components/PageHero";

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

function FlexRow(props: { children: React.ReactNode; gap?: number; justifyContent?: string; alignItems?: string; sx?: any }) {
  return <Box sx={{ display: "flex", gap: props.gap ?? 1, justifyContent: props.justifyContent, alignItems: props.alignItems, ...props.sx }}>{props.children}</Box>;
}

export function BusinessIntelligencePage() {
  const navigate = useNavigate();

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
    <Box sx={{ bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 64,
          bgcolor: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(18px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          boxShadow: "0 8px 32px rgba(0, 6, 102, 0.06)"
        }}
      >
        <FlexRow gap={2.5} alignItems="center">
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#000666", letterSpacing: 0.2 }}>Keystone Structural ERP</Typography>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            <Typography sx={{ fontWeight: 700, color: "#000666", borderBottom: "2px solid #000666", pb: 0.5 }}>لوحة استخبارات الأعمال</Typography>
            <Typography sx={{ color: "#6e7286" }}>المشاريع الجارية</Typography>
            <Typography sx={{ color: "#6e7286" }}>التقارير المالية</Typography>
          </Box>
        </FlexRow>

        <FlexRow gap={1.4} alignItems="center">
          <FlexRow gap={1} alignItems="center" sx={{ display: { xs: "none", sm: "flex" }, bgcolor: "#f3f4f9", px: 1.6, py: 0.8, borderRadius: 2 }}>
            <SearchIcon sx={{ color: "#98a0b6" }} />
            <Typography sx={{ color: "#98a0b6", minWidth: 160 }}>بحث سريع...</Typography>
          </FlexRow>
          <NotificationsIcon sx={{ color: "#000666" }} />
          <HelpIcon sx={{ color: "#000666" }} />
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#d7dbea", border: "2px solid rgba(0,6,102,0.1)" }} />
        </FlexRow>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" } }}>
        <Box sx={{ display: { xs: "none", lg: "block" }, position: "sticky", top: 64, height: "calc(100vh - 64px)", bgcolor: "white", borderLeft: "1px solid #eef0f6", px: 2, py: 3 }}>
          <Stack spacing={2.2} sx={{ height: "100%" }}>
            <FlexRow gap={1.5} alignItems="center" sx={{ px: 1 }}>
              <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: "#000666", display: "grid", placeItems: "center", color: "white", fontWeight: 900 }}>K</Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#000666" }}>مركز كيستون</Typography>
                <Typography sx={{ fontSize: 11, color: "#8c92ab" }}>مدير العمليات</Typography>
              </Box>
            </FlexRow>

            <Stack spacing={0.8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, px: 1.5, py: 1.1, borderRadius: 1.5, bgcolor: "#1a237e", color: "white" }}><DashboardIcon sx={{ fontSize: 20 }} /><Typography sx={{ fontWeight: 700, fontSize: 14 }}>لوحة القيادة</Typography></Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, px: 1.5, py: 1.1, borderRadius: 1.5, color: "#5f6476" }}><TrendingUpIcon sx={{ fontSize: 20 }} /><Typography sx={{ fontWeight: 700, fontSize: 14 }}>المبيعات</Typography></Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, px: 1.5, py: 1.1, borderRadius: 1.5, color: "#5f6476" }}><GavelIcon sx={{ fontSize: 20 }} /><Typography sx={{ fontWeight: 700, fontSize: 14 }}>مركز القيادة</Typography></Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, px: 1.5, py: 1.1, borderRadius: 1.5, color: "#5f6476" }}><DashboardIcon sx={{ fontSize: 20 }} /><Typography sx={{ fontWeight: 700, fontSize: 14 }}>الشؤون القانونية</Typography></Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, px: 1.5, py: 1.1, borderRadius: 1.5, color: "#5f6476" }}><DashboardIcon sx={{ fontSize: 20 }} /><Typography sx={{ fontWeight: 700, fontSize: 14 }}>الإعدادات</Typography></Box>
            </Stack>

            <Box sx={{ mt: "auto", pt: 2, borderTop: "1px solid #eef0f6" }}>
              <Button fullWidth variant="contained" sx={{ bgcolor: "#964900", py: 1.2, mb: 2 }} onClick={() => navigate("/erp/projects")}>إضافة مشروع جديد</Button>
              <Stack spacing={0.4}>
                <FlexRow gap={1.2} alignItems="center" sx={{ color: "#6e7286" }}><HelpIcon fontSize="small" /><Typography sx={{ fontSize: 14 }}>مساعدة</Typography></FlexRow>
                <FlexRow gap={1.2} alignItems="center" sx={{ color: "#d32f2f" }}><LogoutIcon fontSize="small" /><Typography sx={{ fontSize: 14 }}>خروج</Typography></FlexRow>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 }, minWidth: 0 }}>
          <Box sx={{ mb: 5 }}>
            <PageHero
              eyebrow="استخبارات الأعمال"
              title="لوحة استخبارات الأعمال"
              subtitle="نظرة عامة تحليلية على الأداء المالي والإنشائي للمجموعة."
              actions={(
                <>
                  <Button type="button" variant="outlined" startIcon={<CalendarMonthIcon />} onClick={() => navigate("/erp/reports")}>الربع الأخير 2023</Button>
                  <Button type="button" variant="contained" startIcon={<DownloadIcon />} onClick={exportBiReport}>تصدير التقرير</Button>
                </>
              )}
            />
          </Box>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, mb: 5 }}>
            <Card sx={{ borderRadius: 3, borderRight: "4px solid #000666" }}>
              <CardContent sx={{ p: 3.3 }}>
                <Typography sx={{ color: "#7f8597", letterSpacing: 2, fontSize: 11, fontWeight: 800, mb: 2 }}>إجمالي الإيرادات</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: 58, color: "#000666", lineHeight: 1 }}>42.8</Typography>
                  <Typography sx={{ color: "#1a237e", fontWeight: 700, fontSize: 20 }}>مليون ريال</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                  <TrendingUpIcon sx={{ color: "#16a34a", fontSize: 18 }} />
                  <Typography sx={{ color: "#16a34a", fontWeight: 800 }}>+12.4%</Typography>
                  <Typography sx={{ color: "#a1a7ba", fontSize: 12 }}>منذ العام الماضي</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, borderRight: "4px solid #964900" }}>
              <CardContent sx={{ p: 3.3 }}>
                <Typography sx={{ color: "#7f8597", letterSpacing: 2, fontSize: 11, fontWeight: 800, mb: 2 }}>صافي الأرباح</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: 58, color: "#964900", lineHeight: 1 }}>18.2</Typography>
                  <Typography sx={{ color: "#fc820c", fontWeight: 700, fontSize: 20 }}>مليون ريال</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                  <TrendingUpIcon sx={{ color: "#16a34a", fontSize: 18 }} />
                  <Typography sx={{ color: "#16a34a", fontWeight: 800 }}>+8.1%</Typography>
                  <Typography sx={{ color: "#a1a7ba", fontSize: 12 }}>مقابل الميزانية التقديرية</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, borderRight: "4px solid #380b00" }}>
              <CardContent sx={{ p: 3.3 }}>
                <Typography sx={{ color: "#7f8597", letterSpacing: 2, fontSize: 11, fontWeight: 800, mb: 2 }}>العائد على الاستثمار (ROI)</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: 58, color: "#380b00", lineHeight: 1 }}>24.5</Typography>
                  <Typography sx={{ color: "#5c1800", fontWeight: 700, fontSize: 20 }}>%</Typography>
                </Box>
                <Box sx={{ mt: 3, height: 6, borderRadius: 999, bgcolor: "#eceef5" }}>
                  <Box sx={{ width: "75%", height: "100%", borderRadius: 999, bgcolor: "#380b00" }} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, mb: 5 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20 }}>تحليل اتجاهات الإيرادات</Typography>
                    <Typography sx={{ color: "#8990a5", fontSize: 13 }}>المقارنة بين النصف الأول والثاني من السنة المالية</Typography>
                  </Box>
                  <FlexRow gap={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#000666" }} /><Typography sx={{ fontSize: 12, fontWeight: 700 }}>العقارات</Typography></Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#964900" }} /><Typography sx={{ fontSize: 12, fontWeight: 700 }}>التشطيبات</Typography></Box>
                  </FlexRow>
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

            <Card sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "#fff" }}>
              <CardContent sx={{ p: 3, position: "relative" }}>
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

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.2, flexWrap: "wrap", gap: 1 }}>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20 }}>خارطة حالة المشاريع (Heat Map)</Typography>
              <Box sx={{ display: "flex", gap: 2, fontSize: 12, fontWeight: 700, color: "#364152" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}><Box sx={{ width: 12, height: 12, bgcolor: "#16a34a" }} /> مستقر</Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}><Box sx={{ width: 12, height: 12, bgcolor: "#f59e0b" }} /> متابعة</Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}><Box sx={{ width: 12, height: 12, bgcolor: "#ef4444" }} /> حرج</Box>
              </Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }, gap: 1.8 }}>
              {heatMapProjects.map((project) => (
                <Card key={project.id} sx={{ borderRadius: 2.2, borderBottom: `4px solid ${project.color}` }}>
                  <CardContent sx={{ p: 2.1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                      <Typography sx={{ fontSize: 10, color: "#8a90a6", fontWeight: 800 }}>{project.id}</Typography>
                      <Box sx={{ color: project.color, fontSize: 16, lineHeight: 1 }}>{project.icon}</Box>
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: "#000666" }}>{project.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#8a90a6", mt: 0.5 }}>{project.progress}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2.5, borderBottom: "1px solid #eef0f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18 }}>سجل العمليات المالية الحديثة</Typography>
                <Button variant="text" sx={{ color: "#964900", fontWeight: 800 }} onClick={() => navigate("/erp/finance")}>عرض الكل</Button>
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
                          <FlexRow gap={1.4} alignItems="center">
                            <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: "rgba(0,6,102,0.08)", display: "grid", placeItems: "center", color: "#000666" }}>{row.icon}</Box>
                            <Typography sx={{ color: "#000666", fontWeight: 800 }}>{row.project}</Typography>
                          </FlexRow>
                        </Box>
                        <Box component="td" sx={{ p: 2.2, color: "#6e7286", fontSize: 13 }}>{row.date}</Box>
                        <Box component="td" sx={{ p: 2.2 }}><Chip label={row.type} size="small" sx={{ bgcolor: "#eef0f6", fontWeight: 700 }} /></Box>
                        <Box component="td" sx={{ p: 2.2, color: "#000666", fontWeight: 900 }}>{row.amount}</Box>
                        <Box component="td" sx={{ p: 2.2 }}><Chip label={row.status} size="small" sx={{ bgcolor: row.status === "تم الدفع" ? "#e8f8ef" : "#fff1e2", color: row.status === "تم الدفع" ? "#0d8a43" : "#c46a00", fontWeight: 800 }} /></Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Button
        variant="contained"
        sx={{ position: "fixed", bottom: 24, left: 24, bgcolor: "#fc820c", color: "white", borderRadius: 999, boxShadow: "0 16px 30px rgba(252, 130, 12, 0.28)", width: 58, height: 58, minWidth: 58 }}
        onClick={() => navigate("/erp/projects")}
      >
        +
      </Button>
    </Box>
  );
}
