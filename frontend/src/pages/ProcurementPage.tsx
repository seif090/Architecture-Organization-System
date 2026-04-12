import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Avatar, Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const purchaseOrders = [
  {
    code: "PO-4421",
    vendor: "شركة النيل لتوريد مواد البناء",
    item: "حديد تسليح 12 مم",
    amount: "185,000 ج.م",
    status: "قيد الاعتماد",
    progress: 68,
    date: "12 أبريل 2026",
    type: "مشتريات مواد",
    priority: "عاجل"
  },
  {
    code: "PO-4422",
    vendor: "دلتا للتجهيزات الكهربائية",
    item: "لوحات توزيع وكابلات",
    amount: "74,500 ج.م",
    status: "موافق عليه",
    progress: 100,
    date: "11 أبريل 2026",
    type: "مشتريات تشغيل",
    priority: "متوسط"
  },
  {
    code: "PO-4423",
    vendor: "الشرق للسيراميك",
    item: "سيراميك حمامات أرضي",
    amount: "96,200 ج.م",
    status: "تم الإرسال",
    progress: 44,
    date: "10 أبريل 2026",
    type: "مشتريات تشطيب",
    priority: "عاجل"
  }
];

const suppliers = [
  { name: "شركة النيل لتوريد مواد البناء", category: "حديد وأسمنت", score: 94, delay: "2 يوم" },
  { name: "دلتا للتجهيزات الكهربائية", category: "كهرباء ومولدات", score: 89, delay: "0 يوم" },
  { name: "الشرق للسيراميك", category: "تشطيبات", score: 96, delay: "1 يوم" },
  { name: "المتحدة للمواسير", category: "سباكة", score: 91, delay: "3 أيام" }
];

const requestedMaterials = [
  { name: "حديد تسليح", qty: "24 طن", critical: true },
  { name: "أسمنت مقاوم", qty: "80 طن", critical: false },
  { name: "سيراميك مطفي", qty: "1,200 م²", critical: false },
  { name: "مواسير PPR", qty: "1,000 متر", critical: true }
];

export function ProcurementPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>المشتريات الاستراتيجية</Typography>
          <Typography sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 900, color: "#000666", lineHeight: 1.1 }}>إدارة المشتريات</Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>متابعة أوامر الشراء، أداء الموردين، واحتياجات المواد الحرجة للمواقع النشطة.</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
          <Button variant="outlined" startIcon={<LocalShippingIcon />} onClick={() => navigate("/erp/inventory-detail")}>تتبع الشحنات</Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666" }} onClick={() => navigate("/erp/suppliers")}>طلب شراء جديد</Button>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        <Card sx={{ borderInlineStart: "4px solid #000666" }}><CardContent><Typography sx={{ color: "#7f8597" }}>إجمالي المشتريات (الشهر)</Typography><Typography sx={{ fontSize: 34, fontWeight: 900, color: "#000666" }}>450,230 ر.س</Typography></CardContent></Card>
        <Card sx={{ borderInlineStart: "4px solid #964900" }}><CardContent><Typography sx={{ color: "#7f8597" }}>في انتظار الاعتماد</Typography><Typography sx={{ fontSize: 34, fontWeight: 900, color: "#964900" }}>12,400 ر.س</Typography></CardContent></Card>
        <Card sx={{ borderInlineStart: "4px solid #380b00" }}><CardContent><Typography sx={{ color: "#7f8597" }}>طلبات قيد التوريد</Typography><Typography sx={{ fontSize: 34, fontWeight: 900, color: "#380b00" }}>15 شحنة</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.3 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#000666" }}>أوامر الشراء الأخيرة</Typography>
              <Chip label="تحديث مباشر" size="small" />
            </Box>
            <Stack spacing={1.4}>
              {purchaseOrders.map((order) => (
                <Box key={order.code} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff", borderRight: "4px solid #eef0f6" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#000666" }}>{order.item}</Typography>
                      <Typography sx={{ color: "#7f8597", fontSize: 13, mt: 0.4 }}>{order.vendor}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <Typography sx={{ fontWeight: 900, color: "#000666" }}>{order.amount}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#9aa1b6" }}>{order.date}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.3, gap: 1, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip label={order.code} size="small" variant="outlined" />
                      <Chip label={order.status} size="small" sx={{ bgcolor: order.status === "موافق عليه" ? "#e8f8ef" : order.status === "قيد الاعتماد" ? "#fff1e2" : "#eef0f6" }} />
                      <Chip label={order.priority} size="small" sx={{ bgcolor: order.priority === "عاجل" ? "#ffebee" : "#eef0f6" }} />
                    </Box>
                    <Box sx={{ minWidth: 160 }}>
                      <LinearProgress variant="determinate" value={order.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: "#000666" } }} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 2 }}>احتياجات المواد الحرجة</Typography>
              <Stack spacing={1.2}>
                {requestedMaterials.map((material) => (
                  <Box key={material.name} sx={{ p: 1.4, borderRadius: 2, bgcolor: material.critical ? "#fff8f2" : "#f7f8fd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{material.name}</Typography>
                      <Typography sx={{ fontSize: 13, color: "#7f8597" }}>{material.qty}</Typography>
                    </Box>
                    {material.critical ? <WarningAmberIcon sx={{ color: "#c46a00" }} /> : <StorefrontIcon sx={{ color: "#000666" }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 18, mb: 2 }}>الموردون الأفضل أداءً</Typography>
              <Stack spacing={1.2}>
                {suppliers.map((supplier) => (
                  <Box key={supplier.name} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{supplier.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: "#7f8597" }}>{supplier.category}</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 900, color: "#000666" }}>{supplier.score}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={supplier.score} sx={{ height: 6, mt: 1.2, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: "#964900" } }} />
                    <Typography sx={{ fontSize: 12, color: "#9aa1b6", mt: 1 }}>متوسط التأخير: {supplier.delay}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 18 }}>لوحة الموردين</Typography>
            <Button variant="outlined" startIcon={<ArrowForwardIcon />} onClick={() => navigate("/erp/suppliers")}>عرض الكل</Button>
          </Box>
          <Box sx={{ display: "grid", gap: 1.4, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
            {suppliers.map((supplier) => (
              <Card key={supplier.name} sx={{ borderRadius: 2.5, bgcolor: "#f8f9fd" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Avatar sx={{ bgcolor: "#000666" }}><AssignmentIndIcon /></Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{supplier.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{supplier.category}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.8 }}>
                    <Typography sx={{ color: "#9aa1b6", fontSize: 12 }}>معدل الالتزام</Typography>
                    <Typography sx={{ color: "#000666", fontWeight: 800 }}>{supplier.score}%</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800 }}>إشعارات الموردين</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 0.7 }}>هناك 3 أوامر شراء تحتاج اعتمادًا اليوم ومواد حرجة لمواقع نشطة.</Typography>
          </Box>
          <Button variant="contained" startIcon={<LocalShippingIcon />} sx={{ bgcolor: "#fc820c", color: "white" }} onClick={() => navigate("/erp/inventory-detail")}>متابعة الطلبات</Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
