import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DownloadIcon from "@mui/icons-material/Download";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export function FinancePage({
  records,
  invoices,
  isViewer
}: {
  records: any[];
  invoices: any[];
  isViewer: boolean;
}) {
  if (isViewer) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontSize: 26, fontWeight: 900 }}>لا توجد صلاحية للحسابات</Typography>
        </CardContent>
      </Card>
    );
  }

  const expenses = records.filter((r) => r.record_type === "expense").reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const revenues = records.filter((r) => r.record_type === "revenue").reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const dueInvoices = invoices.filter((i) => i.status === "مستحقة").length;
  const net = revenues - expenses;
  const chartPoints = [48, 58, 72, 66, 84, 74];

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>المالية / الحسابات</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>إدارة الحسابات والمصروفات</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>نظرة شاملة على التدفقات المالية والمصروفات الإنشائية.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderColor: "#d8dceb", color: "#000666" }}>تصدير التقرير</Button>
          <Button variant="contained" startIcon={<AttachMoneyIcon />} sx={{ bgcolor: "#000666" }}>إضافة قيد مالي</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><TrendingUpIcon sx={{ color: "#16a34a" }} /><Typography sx={{ color: "#7f8597" }}>الإيرادات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{revenues.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><TrendingDownIcon sx={{ color: "#ba1a1a" }} /><Typography sx={{ color: "#7f8597" }}>المصروفات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{expenses.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><ReceiptLongIcon sx={{ color: "#964900" }} /><Typography sx={{ color: "#7f8597" }}>فواتير مستحقة</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{dueInvoices}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}><CardContent><LocalAtmIcon /><Typography sx={{ color: "rgba(255,255,255,0.8)" }}>صافي الربح</Typography><Typography sx={{ fontSize: 34, fontWeight: 900 }}>{net.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.65fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 2 }}>التدفق النقدي (Cash Flow)</Typography>
            <Box sx={{ height: 220, display: "flex", alignItems: "end", gap: 1.2, px: 1.2, borderBottom: "1px solid #edf0f6", pb: 3, mb: 2.4 }}>
              {chartPoints.map((point, idx) => (
                <Box key={point} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.7 }}>
                  <Box sx={{ width: "100%", maxWidth: 40, height: `${point * 1.6}px`, bgcolor: "rgba(0,6,102,0.16)", borderRadius: "8px 8px 0 0", position: "relative" }}>
                    <Box sx={{ width: "100%", height: `${Math.max(20, point - 16)}px`, bgcolor: "rgba(252,130,12,0.55)", borderRadius: "8px 8px 0 0", position: "absolute", bottom: 0 }} />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: idx === 5 ? "#000666" : "#a0a7bc", fontWeight: idx === 5 ? 800 : 500 }}>
                    {idx === 0 ? "يناير" : idx === 1 ? "فبراير" : idx === 2 ? "مارس" : idx === 3 ? "أبريل" : idx === 4 ? "مايو" : "يونيو"}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 1.4 }}>آخر المعاملات المالية</Typography>
            <Stack spacing={1.2}>
              {records.slice(0, 6).map((record) => (
                <Box key={record.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={{ color: "#000666", fontWeight: 800 }}>{record.project_name || "بدون مشروع"}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{record.description} · {record.record_date}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Chip label={record.record_type === "revenue" ? "إيراد" : "مصروف"} size="small" sx={{ bgcolor: record.record_type === "revenue" ? "#e8f8ef" : "#ffebee" }} />
                    <Typography sx={{ mt: 0.6, color: "#000666", fontWeight: 900 }}>{Number(record.amount).toLocaleString("ar-EG")} ج.م</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900, mb: 1.8 }}>توزيع المصروفات حسب الفئة</Typography>
              {["رواتب وأجور", "مواد بناء وتوريد", "مقاولين باطن"].map((label, idx) => {
                const value = idx === 0 ? 45 : idx === 1 ? 35 : 20;
                return (
                  <Box key={label} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6, fontSize: 12 }}>
                      <Typography sx={{ color: "rgba(255,255,255,0.86)", fontSize: 12 }}>{label}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.86)", fontSize: 12 }}>{value}%</Typography>
                    </Box>
                    <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", height: 8, borderRadius: 999, overflow: "hidden" }}>
                      <Box sx={{ width: `${value}%`, height: "100%", bgcolor: idx === 0 ? "#fc820c" : idx === 1 ? "#fff" : "#60a5fa" }} />
                    </Box>
                  </Box>
                );
              })}
              <Box sx={{ mt: 2, p: 1.2, borderRadius: 1.8, bgcolor: "rgba(255,255,255,0.08)" }}>
                <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>إجمالي المصروفات الشهرية</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 24 }}>{expenses.toLocaleString("ar-EG")} ج.م</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20, mb: 1.8 }}>الفواتير</Typography>
              <Stack spacing={1.2}>
                {invoices.slice(0, 8).map((invoice) => (
                  <Box key={invoice.id} sx={{ p: 1.3, borderRadius: 2, bgcolor: "#fafbff" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{invoice.invoice_no}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{invoice.client_name || "غير محدد"} · {invoice.project_name || "-"}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ color: "#000666", fontWeight: 900 }}>{Number(invoice.total).toLocaleString("ar-EG")} ج.م</Typography>
                        <Chip size="small" label={invoice.status} sx={{ mt: 0.5, bgcolor: invoice.status === "مدفوعة" ? "#e8f8ef" : "#fff1e2" }} />
                      </Box>
                    </Box>
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
