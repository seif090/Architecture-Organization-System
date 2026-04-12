import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StarIcon from "@mui/icons-material/Star";
import { Avatar, Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";

const supplierRows = [
  { name: "مجموعة حديد الجزيرة", code: "V-9041", tags: ["حديد", "تسليح"], debt: "450,000 ر.س", rating: 4.9, status: "نشط" },
  { name: "أسمنت المملكة", code: "V-8822", tags: ["أسمنت", "خرسانة"], debt: "1,200,000 ر.س", rating: 4.2, status: "قيد المراجعة" },
  { name: "جوتن للدهانات", code: "V-7011", tags: ["دهانات", "ديكور"], debt: "85,000 ر.س", rating: 4.7, status: "نشط" }
];

const activeContracts = [
  { title: "مشروع برج المجد", subtitle: "توريد حديد سابك", progress: 75, severity: "عاجل" },
  { title: "كمباوند الواحة", subtitle: "توريد خرسانة جاهزة", progress: 40, severity: "منتظم" }
];

export function SuppliersPage() {
  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 44 }, lineHeight: 1.1 }}>إدارة الموردين والشركاء</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>نظام مراقبة الأداء المالي والتشغيلي لسلسلة التوريد الخاصة بالمشاريع الإنشائية.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666", minWidth: 210 }}>إضافة مورد جديد</Button>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "260px 1fr" } }}>
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>متوسط جودة التوريد</Typography>
              <Typography sx={{ fontSize: 52, fontWeight: 900, lineHeight: 1, mt: 1 }}>5 / 4.8</Typography>
              <Stack direction="row" spacing={0.3} sx={{ mt: 1.3 }}>
                {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ color: "#fc820c" }} />)}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "#1a237e", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 32, fontWeight: 900, mb: 1 }}>عقود توريد نشطة</Typography>
              <Stack spacing={1.3}>
                {activeContracts.map((contract) => (
                  <Box key={contract.title} sx={{ p: 1.4, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 800 }}>{contract.title}</Typography>
                      <Chip size="small" label={contract.severity} sx={{ bgcolor: contract.severity === "عاجل" ? "#fc820c" : "#8b94c9", color: "white" }} />
                    </Box>
                    <Typography sx={{ opacity: 0.85, fontSize: 13, mt: 0.5 }}>{contract.subtitle}</Typography>
                    <LinearProgress variant="determinate" value={contract.progress} sx={{ mt: 1.4, height: 6, borderRadius: 999, bgcolor: "rgba(255,255,255,0.2)", "& .MuiLinearProgress-bar": { bgcolor: "#fc820c" } }} />
                  </Box>
                ))}
              </Stack>
              <Button fullWidth variant="outlined" sx={{ mt: 2, color: "white", borderColor: "rgba(255,255,255,0.35)" }}>عرض كافة العقود (14)</Button>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2}>
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>إجمالي الموردين</Typography><Typography sx={{ fontSize: 50, color: "#000666", fontWeight: 900 }}>124</Typography><Typography sx={{ color: "#16a34a", fontSize: 12 }}>+12 مورد هذا الشهر</Typography></CardContent></Card>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>المديونيات القائمة</Typography><Typography sx={{ fontSize: 50, color: "#000666", fontWeight: 900 }}>2.4M</Typography><Typography sx={{ color: "#d32f2f", fontSize: 12 }}>استحقاق علي الأسبوع القادم</Typography></CardContent></Card>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography sx={{ color: "#7f8597" }}>عقود نشطة</Typography><Typography sx={{ fontSize: 50, color: "#000666", fontWeight: 900 }}>48</Typography><Typography sx={{ color: "#6f7587", fontSize: 12 }}>85% نسبة الإنجاز</Typography></CardContent></Card>
          </Box>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.8, flexWrap: "wrap", gap: 1 }}>
                <Typography sx={{ color: "#000666", fontSize: 36, fontWeight: 900 }}>قائمة الموردين المعتمدين</Typography>
                <Stack direction="row" spacing={1.1}>
                  <Button variant="outlined" startIcon={<ReceiptLongIcon />}>تصفية</Button>
                  <Button variant="outlined">تصدير</Button>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                {[
                  "الكل",
                  "أسمنت",
                  "حديد",
                  "دهانات",
                  "أدوات صحية"
                ].map((tag, index) => <Chip key={tag} label={tag} sx={{ bgcolor: index === 0 ? "#000666" : "#eef0f6", color: index === 0 ? "white" : "#6f7587", fontWeight: 700 }} />)}
              </Stack>

              <Box sx={{ overflowX: "auto" }}>
                <Box component="table" sx={{ width: "100%", minWidth: 760, borderCollapse: "collapse", textAlign: "right" }}>
                  <Box component="thead" sx={{ bgcolor: "#f3f4f8", color: "#7f8597", fontSize: 13 }}>
                    <Box component="tr">
                      {[
                        "المورد",
                        "التخصص",
                        "المديونية",
                        "التقييم",
                        "الحالة"
                      ].map((head) => <Box key={head} component="th" sx={{ p: 2, textAlign: "right", fontWeight: 800 }}>{head}</Box>)}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {supplierRows.map((supplier, idx) => (
                      <Box key={supplier.code} component="tr" sx={{ borderBottom: "1px solid #f1f3f8" }}>
                        <Box component="td" sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Avatar sx={{ bgcolor: "#eef0f6", color: "#000666" }}>{idx === 0 ? "ج" : idx === 1 ? "س" : "ج"}</Avatar>
                            <Box>
                              <Typography sx={{ color: "#000666", fontWeight: 800 }}>{supplier.name}</Typography>
                              <Typography sx={{ fontSize: 12, color: "#9aa1b6" }}>الرمز: {supplier.code}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box component="td" sx={{ p: 2 }}>
                          <Stack direction="row" spacing={0.7} sx={{ flexWrap: "wrap" }}>
                            {supplier.tags.map((tag) => <Chip key={tag} label={tag} size="small" sx={{ bgcolor: "#eef0f6" }} />)}
                          </Stack>
                        </Box>
                        <Box component="td" sx={{ p: 2, color: "#000666", fontWeight: 800 }}>{supplier.debt}</Box>
                        <Box component="td" sx={{ p: 2 }}><Typography sx={{ color: "#000666", fontWeight: 900 }}><StarIcon sx={{ color: "#fc820c", fontSize: 16, verticalAlign: "middle", ml: 0.4 }} />{supplier.rating}</Typography></Box>
                        <Box component="td" sx={{ p: 2 }}><Chip label={supplier.status} size="small" sx={{ bgcolor: supplier.status === "نشط" ? "#d8f4df" : "#fff1e2" }} /></Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
          {[
            ["فيلا الربيع", "90% مكتمل", "95,000 ر.س", "كهرباء", "صحي"],
            ["مجمع النخيل", "30% مكتمل", "18,200 ر.س", "سيراميك", "دهانات"],
            ["برج الجوهرة", "65% مكتمل", "42,500 ر.س", "حديد", "+4 خامات"]
          ].map(([project, completion, value, t1, t2], idx) => (
            <Box key={String(project)} sx={{ p: 2, borderRadius: 2.2, bgcolor: "#fafbff", borderBottom: `4px solid ${idx === 2 ? "#000666" : "#964900"}` }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "#000666", fontWeight: 900 }}>{project}</Typography>
                <Typography sx={{ color: idx === 2 ? "#000666" : "#964900", fontWeight: 800 }}>{completion}</Typography>
              </Box>
              <Typography sx={{ mt: 1.2, color: "#6f7587", fontSize: 13 }}>الخامات المستهلكة</Typography>
              <Typography sx={{ color: "#000666", fontWeight: 800, mt: 0.4 }}>{value}</Typography>
              <LinearProgress variant="determinate" value={idx === 0 ? 90 : idx === 1 ? 30 : 65} sx={{ mt: 1.2, height: 6, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: idx === 2 ? "#000666" : "#964900" } }} />
              <Stack direction="row" spacing={0.8} sx={{ mt: 1.2 }}>
                <Chip size="small" label={t1} sx={{ bgcolor: "#eef0f6" }} />
                <Chip size="small" label={t2} sx={{ bgcolor: "#eef0f6" }} />
              </Stack>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
}
