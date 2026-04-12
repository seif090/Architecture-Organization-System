import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ color: "#a1a8c9", fontSize: 13, mb: 0.5 }}>المالية والتقارير</Typography>
        <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>الحسابات وإدارة التدفقات</Typography>
        <Typography sx={{ color: "#6f7587", mt: 1 }}>مراقبة المصروفات والإيرادات والفواتير وربحية المشاريع.</Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><TrendingUpIcon sx={{ color: "#16a34a" }} /><Typography sx={{ color: "#7f8597" }}>الإيرادات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{revenues.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><TrendingDownIcon sx={{ color: "#ba1a1a" }} /><Typography sx={{ color: "#7f8597" }}>المصروفات</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{expenses.toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><ReceiptLongIcon sx={{ color: "#964900" }} /><Typography sx={{ color: "#7f8597" }}>فواتير مستحقة</Typography><Typography sx={{ color: "#000666", fontSize: 34, fontWeight: 900 }}>{dueInvoices}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}><CardContent><AttachMoneyIcon /><Typography sx={{ color: "rgba(255,255,255,0.8)" }}>صافي الربح</Typography><Typography sx={{ fontSize: 34, fontWeight: 900 }}>{(revenues - expenses).toLocaleString("ar-EG")} ج.م</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 18, mb: 2 }}>القيود المالية الأخيرة</Typography>
            <Stack spacing={1.2}>
              {records.slice(0, 8).map((record) => (
                <Box key={record.id} sx={{ p: 1.3, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>{record.description}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{record.project_name || "بدون مشروع"} · {record.record_date}</Typography>
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

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 18, mb: 2 }}>الفواتير</Typography>
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
      </Box>
    </Stack>
  );
}
