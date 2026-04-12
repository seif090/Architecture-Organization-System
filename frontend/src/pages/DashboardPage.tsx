import InsightsIcon from "@mui/icons-material/Insights";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { PageHero } from "../components/PageHero";

const colors = ["#000666", "#964900", "#1a237e", "#fc820c", "#4455aa"];

export function DashboardPage({ data }: { data: any }) {
  const navigate = useNavigate();
  const totals = data?.totals || { projects: 0, activeProjects: 0, clients: 0, expenses: 0, revenues: 0, totalProfit: 0 };
  const pipeline = data?.pipeline || [];
  const profitByProject = data?.profitByProject || [];
  const profitRate = totals.revenues > 0 ? Math.round((Number(totals.totalProfit) / Number(totals.revenues)) * 100) : 0;
  const alerts = [
    "تنبيه: 4 فواتير اقتربت من تاريخ الاستحقاق",
    "تحديث: مشروع برج الجوهرة وصل إلى 82%",
    "تنبيه: حد إعادة الطلب منخفض في 3 خامات"
  ];

  return (
    <Stack spacing={3.2}>
      <PageHero
        eyebrow="لوحة التحكم الرئيسية"
        title="نظرة تنفيذية مباشرة"
        subtitle="ملخص الأداء التشغيلي والمالي والميداني عبر النظام بالكامل."
        actions={(
          <>
            <Button type="button" variant="outlined" startIcon={<InsightsIcon />} onClick={() => navigate("/erp/reports")}>تقرير فوري</Button>
            <Button type="button" variant="contained" startIcon={<TrendingUpIcon />} onClick={() => navigate("/erp/bi")}>عرض الأداء</Button>
          </>
        )}
      />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3, borderInlineStart: "4px solid #000666" }}><CardContent><Typography sx={{ color: "#7f8597" }}>إجمالي المشاريع</Typography><Typography sx={{ color: "#000666", fontSize: 40, fontWeight: 900 }}>{totals.projects}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, borderInlineStart: "4px solid #964900" }}><CardContent><Typography sx={{ color: "#7f8597" }}>المشاريع النشطة</Typography><Typography sx={{ color: "#000666", fontSize: 40, fontWeight: 900 }}>{totals.activeProjects}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, borderInlineStart: "4px solid #1a237e" }}><CardContent><Typography sx={{ color: "#7f8597" }}>إجمالي العملاء</Typography><Typography sx={{ color: "#000666", fontSize: 40, fontWeight: 900 }}>{totals.clients}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}><CardContent><Typography sx={{ color: "rgba(255,255,255,0.86)" }}>صافي الربح</Typography><Typography sx={{ fontSize: 35, fontWeight: 900 }}>{Number(totals.totalProfit).toLocaleString("ar-EG")} ج.م</Typography><Typography sx={{ fontSize: 12, color: "#d6dbff" }}>هامش ربح {profitRate}%</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.55fr 1fr" } }}>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 2 }}>متوسط إنجاز مراحل المشاريع</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#edf0f6" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avg_progress" fill="#964900" radius={[9, 9, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 1.8 }}>تنبيهات اليوم</Typography>
              <Stack spacing={1.2}>
                {alerts.map((item, index) => (
                  <Box key={item} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafbff", borderInlineStart: `3px solid ${index === 0 ? "#ba1a1a" : index === 1 ? "#964900" : "#000666"}` }}>
                    <Typography sx={{ color: "#000666", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.9 }}><NotificationsActiveIcon sx={{ fontSize: 18, color: "#964900" }} />{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 2 }}>ربحية المشاريع</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={profitByProject} dataKey="profit" nameKey="project" outerRadius={100}>
                    {profitByProject.map((_: any, index: number) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "#1a237e", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>ملخص التدفق النقدي</Typography>
              <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.82)", fontSize: 13 }}>الإيرادات: {Number(totals.revenues).toLocaleString("ar-EG")} ج.م</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: 13 }}>المصروفات: {Number(totals.expenses).toLocaleString("ar-EG")} ج.م</Typography>
              <Box sx={{ mt: 1.6, bgcolor: "rgba(255,255,255,0.2)", height: 8, borderRadius: 999, overflow: "hidden" }}>
                <Box sx={{ width: `${Math.max(8, Math.min(100, profitRate))}%`, height: "100%", bgcolor: "#fc820c" }} />
              </Box>
              <Chip label={`هامش الربح ${profitRate}%`} sx={{ mt: 1.4, bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 800 }} />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
