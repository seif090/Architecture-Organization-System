import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { StatCard } from "../components/StatCard";

const colors = ["#000666", "#964900", "#1a237e", "#fc820c", "#4455aa"];

export function DashboardPage({ data }: { data: any }) {
  const totals = data?.totals || { projects: 0, activeProjects: 0, clients: 0, expenses: 0, revenues: 0, totalProfit: 0 };
  const pipeline = data?.pipeline || [];
  const profitByProject = data?.profitByProject || [];

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" } }}>
        <StatCard title="إجمالي المشاريع" value={String(totals.projects)} />
        <StatCard title="المشاريع النشطة" value={String(totals.activeProjects)} />
        <StatCard title="إجمالي العملاء" value={String(totals.clients)} />
        <StatCard title="صافي الربح" value={`${Number(totals.totalProfit).toLocaleString("ar-EG")} ج.م`} />
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" } }}>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>متوسط إنجاز مراحل المشاريع</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avg_progress" fill="#964900" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>ربحية المشاريع</Typography>
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
        </Box>
      </Box>
    </Stack>
  );
}
