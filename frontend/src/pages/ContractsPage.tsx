import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import GavelIcon from "@mui/icons-material/Gavel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const contractItems = [
  { id: "CT-8821", title: "عقد توريد مواد السباكة - المرحلة الثانية", status: "موقع", type: "PDF", date: "12 أكتوبر 2023", vendor: "شركة النيل للمقاولات", amount: "450,000 ج.م" },
  { id: "CT-8822", title: "عقد مقاولات دهانات وديكور - فيلا التجمع", status: "تحت المراجعة", type: "DOCX", date: "05 أكتوبر 2023", vendor: "مكتب الاستشارات الهندسية", amount: "120,000 ج.م" },
  { id: "CT-8823", title: "اتفاقية صيانة دورية - مول تجاري", status: "معتمد", type: "PDF", date: "28 سبتمبر 2023", vendor: "شركة الصيانة المتخصصة", amount: "75,000 ج.م" }
];

const tasks = [
  { title: "تحديث بنود العقد النهائي", meta: "المراجعة القانونية · خلال ساعتين", status: "عاجل" },
  { title: "مطابقة التوقيعات الرقمية", meta: "التحقق من الأطراف · اليوم", status: "جديد" },
  { title: "إرسال نسخة للطرف الثالث", meta: "بعد الاعتماد النهائي", status: "مكتمل" }
];

const docs = [
  "خطة الموقع - PDF",
  "محضر اجتماع - PDF",
  "عرض سعر - XLSX",
  "تصاميم أولية - DWG"
];

export function ContractsPage() {
  const navigate = useNavigate();

  const exportContracts = () => {
    const csv = [
      "id,title,status,type,date,vendor,amount",
      ...contractItems.map((c) => `${c.id},${c.title},${c.status},${c.type},${c.date},${c.vendor},${c.amount}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contracts.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>الرئيسية / إدارة العقود القانونية</Typography>
          <Typography sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 900, lineHeight: 1.1, color: "#000666" }}>
            إدارة العقود والمستندات
          </Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>تحكم في دورة حياة العقود والمستندات القانونية للمشاريع.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" startIcon={<UploadFileIcon />} sx={{ minWidth: 180 }} onClick={() => window.alert("سيتم فتح نموذج رفع عقد خارجي داخل صفحة العقود لاحقًا")}>رفع عقد خارجي</Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000666", minWidth: 180 }} onClick={() => window.alert("سيتم فتح نموذج إنشاء عقد جديد داخل صفحة العقود لاحقًا")}>إنشاء عقد جديد</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ minWidth: 160 }} onClick={exportContracts}>تصدير التقرير</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 1.6, gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(180px, 1fr))" } }}>
        <Card sx={{ borderInlineStart: "4px solid #000666" }}><CardContent><Typography color="text.secondary">إجمالي العقود</Typography><Typography sx={{ fontSize: 38, fontWeight: 900, color: "#000666" }}>1,248</Typography></CardContent></Card>
        <Card sx={{ borderInlineStart: "4px solid #fc820c" }}><CardContent><Typography color="text.secondary">بانتظار التوقيع</Typography><Typography sx={{ fontSize: 38, fontWeight: 900, color: "#000666" }}>34</Typography></CardContent></Card>
        <Card sx={{ borderInlineStart: "4px solid #380b00" }}><CardContent><Typography color="text.secondary">تنتهي قريبًا</Typography><Typography sx={{ fontSize: 38, fontWeight: 900, color: "#a55a00" }}>12</Typography></CardContent></Card>
        <Card sx={{ borderInlineStart: "4px solid #1a237e" }}><CardContent><Typography color="text.secondary">القوالب الجاهزة</Typography><Typography sx={{ fontSize: 38, fontWeight: 900, color: "#000666" }}>45</Typography></CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "320px 1fr 300px" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ minHeight: 360 }}>
            <Typography sx={{ color: "#101a6d", fontWeight: 700, mb: 2 }}>ملخص الالتزام القانوني</Typography>
            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography>الالتزام العام</Typography><Typography sx={{ fontWeight: 700 }}>94%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={94} sx={{ height: 8, borderRadius: 999, bgcolor: "#e8eaf5", "& .MuiLinearProgress-bar": { bgcolor: "#0a1589" } }} />
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography>العقود الموقعة</Typography><Typography sx={{ fontWeight: 700 }}>42</Typography>
                </Box>
                <LinearProgress variant="determinate" value={72} sx={{ height: 8, borderRadius: 999, bgcolor: "#e8eaf5", "& .MuiLinearProgress-bar": { bgcolor: "#a55a00" } }} />
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography>المستندات الناقصة</Typography><Typography sx={{ fontWeight: 700 }}>5</Typography>
                </Box>
                <LinearProgress variant="determinate" value={35} sx={{ height: 8, borderRadius: 999, bgcolor: "#e8eaf5", "& .MuiLinearProgress-bar": { bgcolor: "#d32f2f" } }} />
              </Box>
            </Stack>

            <Card sx={{ mt: 2.5, bgcolor: "#101a6d", color: "white", borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ mb: 1, opacity: 0.85 }}>مؤشر جاهزية المستندات</Typography>
                <Typography sx={{ fontSize: 42, fontWeight: 800 }}>78%</Typography>
                <Typography sx={{ opacity: 0.85 }}>جاهزية الملفات مع الربط القانوني</Typography>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ color: "#101a6d", fontWeight: 700, fontSize: 18 }}>قائمة العقود</Typography>
              <Chip icon={<DescriptionIcon />} label="عرض الكل" variant="outlined" />
            </Box>

            <Stack spacing={1.4}>
              {contractItems.map((item) => (
                <Box key={item.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafbff", borderRight: "4px solid #e2e6f6" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ color: "#101a6d", fontWeight: 700 }}>{item.title}</Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: 13, mt: 0.4 }}>{item.vendor}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Chip size="small" label={item.status} sx={{ bgcolor: item.status === "موقع" ? "#e8f8ef" : item.status === "تحت المراجعة" ? "#fff1e2" : "#e7ecff" }} />
                      <Typography sx={{ color: "#101a6d", fontWeight: 700 }}>{item.amount}</Typography>
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", alignItems: "center" }}>
                    <Chip size="small" label={item.type} variant="outlined" />
                    <Chip size="small" label={item.date} variant="outlined" />
                    <Typography sx={{ color: "#a2abc4", fontSize: 12 }}>{item.id}</Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 2.4, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.3 }}>
              {docs.map((doc) => (
                <Box key={doc} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#f6f7fc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><FolderIcon sx={{ color: "#0a1589" }} /><Typography>{doc}</Typography></Box>
                  <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#101a6d", fontWeight: 700, mb: 2 }}>تنبيهات مهمة</Typography>
              <Stack spacing={1.2}>
                <Box sx={{ p: 1.3, bgcolor: "#fff5f2", borderRadius: 2, borderRight: "3px solid #c73e1d" }}>
                  <Typography sx={{ fontWeight: 700 }}>تأخر تجديد رخصة فرعية</Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>الفريق القانوني ينتظر اعتمادًا نهائيًا اليوم.</Typography>
                </Box>
                <Box sx={{ p: 1.3, bgcolor: "#fff8eb", borderRadius: 2, borderRight: "3px solid #a55a00" }}>
                  <Typography sx={{ fontWeight: 700 }}>مطلوب مراجعة بند جزائي</Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>البند مرتبط بعقد توريد مواد المرحلة الحالية.</Typography>
                </Box>
                <Box sx={{ p: 1.3, bgcolor: "#eef7ff", borderRadius: 2, borderRight: "3px solid #0a58ca" }}>
                  <Typography sx={{ fontWeight: 700 }}>تم التوقيع بنجاح</Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>عقد مشروع شقة 3 غرف في مدينة نصر.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "#101a6d", color: "white" }}>
            <CardContent>
              <Typography sx={{ opacity: 0.85, mb: 1 }}>مساحة توجيه سريعة</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 1 }}>ابدأ التوقيع الآن</Typography>
              <Typography sx={{ opacity: 0.82, mb: 2 }}>أرسل المستندات للأطراف المعنية وراقب الموافقات من مكان واحد.</Typography>
              <Button variant="contained" sx={{ bgcolor: "#fc820c", color: "white" }} onClick={() => window.alert("تم إرسال العقد للتوقيع بشكل مبدئي")}>إرسال للتوقيع</Button>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ color: "#101a6d", fontWeight: 700, fontSize: 18 }}>سجل الموافقات</Typography>
            <Button variant="outlined" startIcon={<GavelIcon />} onClick={() => navigate("/erp/reports")}>عرض السجل الكامل</Button>
          </Box>
          <Stack spacing={1.2}>
            {tasks.map((task) => (
              <Box key={task.title} sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{task.title}</Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{task.meta}</Typography>
                </Box>
                <Chip label={task.status} size="small" />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ position: "fixed", bottom: 22, right: 28 }}>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ minWidth: 230, py: 1.5, borderRadius: 2, bgcolor: "#a55a00" }} onClick={() => window.alert("سيتم فتح مرفق جديد داخل العقود لاحقًا") }>
          إضافة ملف جديد
        </Button>
      </Box>
    </Stack>
  );
}
