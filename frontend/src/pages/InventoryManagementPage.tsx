import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import WarningIcon from "@mui/icons-material/Warning";
import { Avatar, Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

const tableRows = [
  { item: "أسمنت بورتلاندي", qty: "850", unit: "كيس (50كجم)", project: "برج الجوهرة", status: "متوفر", icon: "foundation" },
  { item: "سيراميك أرضيات 60x60", qty: "45", unit: "متر مربع", project: "مجمع النخيل", status: "منخفض جداً", icon: "grid_view" },
  { item: "دهانات جوتن - أبيض", qty: "120", unit: "جالون", project: "فيلا الربيع", status: "إعادة طلب", icon: "format_paint" },
  { item: "حديد تسليح 16 ملم", qty: "12.5", unit: "طن", project: "مشروع التوسعة", status: "متوفر", icon: "construction" }
];

const suppliers = [
  { name: "مؤسسة حديد الخليج", type: "توريد حديد ومعدات" },
  { name: "دهانات الجزيرة الحديثة", type: "دهانات ومواد عزل" },
  { name: "شركة الخرسانة الجاهزة", type: "مواد أساسية" }
];

export function InventoryManagementPage() {
  return (
    <Stack spacing={3.1}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 44 }, lineHeight: 1.1 }}>إدارة المخازن والمستودعات</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>مراقبة دقيقة للخامات الإنشائية، إدارة الموردين، وتخصيص الموارد للمشاريع الجارية.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" startIcon={<PersonAddIcon />}>مورد جديد</Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666" }}>إضافة خامة</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3 }}><CardContent><MonetizationOnIcon sx={{ color: "#380b00" }} /><Typography sx={{ fontSize: 44, color: "#000666", fontWeight: 900 }}>1.2M</Typography><Typography sx={{ color: "#6f7587" }}>قيمة المخزون الإجمالية (ر.س)</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><LocalShippingIcon sx={{ color: "#000666" }} /><Typography sx={{ fontSize: 44, color: "#000666", fontWeight: 900 }}>8</Typography><Typography sx={{ color: "#6f7587" }}>توريدات قادمة</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><WarningIcon sx={{ color: "#ba1a1a" }} /><Typography sx={{ fontSize: 44, color: "#ba1a1a", fontWeight: 900 }}>12</Typography><Typography sx={{ color: "#6f7587" }}>تنبيهات مخزون منخفض</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3 }}><CardContent><Inventory2Icon sx={{ color: "#964900" }} /><Typography sx={{ fontSize: 44, color: "#000666", fontWeight: 900 }}>4,280</Typography><Typography sx={{ color: "#6f7587" }}>إجمالي الخامات المسجلة</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" } }}>
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ color: "#000666", fontWeight: 800 }}>الموردون المعتمدون</Typography>
                <Typography sx={{ color: "#000666", fontWeight: 700 }}>عرض الكل</Typography>
              </Box>
              <Stack spacing={1.1}>
                {suppliers.map((supplier, index) => (
                  <Box key={supplier.name} sx={{ p: 1.1, borderRadius: 2, bgcolor: "#f8f9fd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{supplier.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{supplier.type}</Typography>
                    </Box>
                    <Avatar sx={{ width: 42, height: 42, bgcolor: index === 0 ? "#e6f0ff" : index === 1 ? "#f3efe9" : "#ecf0f3", color: "#000666" }}>{index === 0 ? "🌊" : index === 1 ? "👞" : "⚙"}</Avatar>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "#1a237e", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 1 }}>آخر حركات الصرف</Typography>
              <Stack spacing={1.2}>
                {[
                  "صرف 200 كيس أسمنت لمشروع برج الجوهرة",
                  "إضافة 50 جالون دهان لمخزن دهانات الجزيرة",
                  "صرف 5 طن حديد لمشروع التوسعة"
                ].map((move) => (
                  <Typography key={move} sx={{ borderRight: "2px solid rgba(255,255,255,0.35)", pr: 1.2, color: "rgba(255,255,255,0.9)" }}>{move}</Typography>
                ))}
              </Stack>
              <Button fullWidth variant="outlined" sx={{ mt: 2, color: "white", borderColor: "rgba(255,255,255,0.3)" }}>سجل الحركات الكامل</Button>
            </CardContent>
          </Card>
        </Stack>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Typography sx={{ fontSize: 34, fontWeight: 900, color: "#000666" }}>سجل الخامات والمخزون</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f1f3f9", px: 1.5, py: 0.8, borderRadius: 2 }}>
                <SearchIcon sx={{ color: "#8a90a6" }} />
                <Typography sx={{ color: "#8a90a6" }}>بحث عن خامة...</Typography>
              </Box>
            </Box>

            <Box sx={{ overflowX: "auto" }}>
              <Box component="table" sx={{ width: "100%", minWidth: 760, borderCollapse: "collapse", textAlign: "right" }}>
                <Box component="thead" sx={{ bgcolor: "#f3f4f8", color: "#7f8597", fontSize: 13 }}>
                  <Box component="tr">
                    {[
                      "الخامة",
                      "الكمية الحالية",
                      "وحدة القياس",
                      "المشروع المرتبط",
                      "الحالة",
                      "الإجراءات"
                    ].map((head) => <Box key={head} component="th" sx={{ p: 2, textAlign: "right", fontWeight: 800 }}>{head}</Box>)}
                  </Box>
                </Box>
                <Box component="tbody">
                  {tableRows.map((row, index) => (
                    <Box key={row.item} component="tr" sx={{ borderBottom: "1px solid #f1f3f8", "&:hover": { bgcolor: "#fafbff" } }}>
                      <Box component="td" sx={{ p: 2, color: "#000666", fontWeight: 800 }}>{row.item}</Box>
                      <Box component="td" sx={{ p: 2, color: index === 1 ? "#ba1a1a" : "#000666", fontWeight: 900 }}>{row.qty}</Box>
                      <Box component="td" sx={{ p: 2 }}>{row.unit}</Box>
                      <Box component="td" sx={{ p: 2 }}><Chip label={row.project} size="small" sx={{ bgcolor: "#eef0f6" }} /></Box>
                      <Box component="td" sx={{ p: 2 }}>
                        <Chip label={row.status} size="small" sx={{ bgcolor: row.status === "متوفر" ? "#d8f4df" : row.status === "منخفض جداً" ? "#ffebee" : "#fff1e2" }} />
                      </Box>
                      <Box component="td" sx={{ p: 2 }}><EditIcon sx={{ color: "#8a90a6", cursor: "pointer" }} /></Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 34, mb: 2 }}>توزيع الخامات حسب المشاريع</Typography>
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            {[
              ["فيلا الربيع", "90% مكتمل", "95,000 ر.س", "#380b00"],
              ["مجمع النخيل", "30% مكتمل", "18,200 ر.س", "#964900"],
              ["برج الجوهرة", "65% مكتمل", "42,500 ر.س", "#000666"]
            ].map(([project, progress, value, color]) => (
              <Box key={String(project)} sx={{ p: 2, borderRadius: 2.2, bgcolor: "#fafbff", borderBottom: `4px solid ${color}` }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#000666", fontWeight: 800 }}>{project}</Typography>
                  <Typography sx={{ color, fontWeight: 800 }}>{progress}</Typography>
                </Box>
                <Typography sx={{ mt: 1.1, color: "#7f8597", fontSize: 13 }}>الخامات المستهلكة</Typography>
                <Typography sx={{ color: "#000666", fontWeight: 800, mt: 0.4 }}>{value}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
