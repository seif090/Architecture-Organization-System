import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, Button, Card, CardContent, Checkbox, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";

export function AddUserPage() {
  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#8d94ae", fontSize: 12 }}>الإعدادات &gt; إدارة المستخدمين &gt; إضافة مستخدم جديد</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1, mt: 0.8 }}>إضافة مستخدم جديد</Typography>
          <Typography sx={{ color: "#6f7587", mt: 0.8 }}>قم بملء البيانات التالية لإنشاء حساب موظف جديد في النظام.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="text">إلغاء</Button>
          <Button variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: "#000666" }}>حفظ البيانات</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.8fr 0.9fr" } }}>
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20, mb: 2, display: "flex", alignItems: "center", gap: 1 }}><PersonIcon /> البيانات الأساسية</Typography>
              <Box sx={{ display: "grid", gap: 1.6, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                <TextField label="الاسم الكامل" placeholder="مثال: أحمد محمد علي" fullWidth />
                <TextField label="الرقم الوظيفي" placeholder="EMP-2024-001" fullWidth />
                <TextField label="البريد الإلكتروني" placeholder="name@company.com" fullWidth />
                <TextField label="رقم الهاتف" placeholder="+966 50 000 0000" fullWidth />
                <TextField label="الجنسية" placeholder="مثال: سعودي" fullWidth />
                <TextField type="date" label="تاريخ الانضمام" fullWidth />
                <TextField label="العنوان السكني" placeholder="الشارع، الحي، المدينة" fullWidth sx={{ gridColumn: { md: "1 / span 2" } }} />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20, mb: 2, display: "flex", alignItems: "center", gap: 1 }}><WorkHistoryIcon /> الخبرات السابقة</Typography>
              <Box sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff" }}>
                <Stack spacing={1.4}>
                  <Box sx={{ display: "grid", gap: 1.4, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                    <TextField label="اسم الشركة" placeholder="أدخل اسم الشركة السابقة" />
                    <TextField label="المسمى الوظيفي" placeholder="مثال: مهندس موقع" />
                    <TextField type="date" label="فترة العمل من" />
                    <TextField type="date" label="فترة العمل إلى" />
                    <TextField label="وصف المهام" multiline minRows={3} sx={{ gridColumn: { md: "1 / span 2" } }} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button startIcon={<AddIcon />} variant="outlined">إضافة خبرة أخرى</Button>
                    <Button startIcon={<DeleteIcon />} color="error">حذف</Button>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20, mb: 2, display: "flex", alignItems: "center", gap: 1 }}><WorkspacePremiumIcon /> المهارات والدورات التدريبية</Typography>
              <Box sx={{ p: 1.4, borderRadius: 2, bgcolor: "#fafbff" }}>
                <Box sx={{ display: "grid", gap: 1.4, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                  <TextField label="اسم المهارة/الدورة" placeholder="مثال: إدارة مشاريع PMP" />
                  <TextField label="جهة الإصدار" placeholder="مثال: معهد إدارة المشاريع PMI" />
                  <TextField type="date" label="تاريخ الحصول عليها" sx={{ gridColumn: { md: "1 / span 2" } }} />
                  <TextField label="وصف مختصر" multiline minRows={3} sx={{ gridColumn: { md: "1 / span 2" } }} />
                </Box>
                <Button startIcon={<AddIcon />} variant="outlined" sx={{ mt: 1.6 }}>إضافة مهارة/دورة أخرى</Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20, mb: 2 }}>تعيين المشاريع النشطة</Typography>
              <Box sx={{ display: "grid", gap: 1.2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                {[
                  ["مجمع الياسمين", "الرياض، السعودية", true],
                  ["برج النيل السكني", "القاهرة، مصر", false],
                  ["المركز المالي العالمي", "دبي، الإمارات", false],
                  ["منطقة الصناعات الثقيلة", "أبو ظبي", false]
                ].map(([name, location, checked]) => (
                  <Box key={String(name)} sx={{ p: 1.2, borderRadius: 2, bgcolor: "#f5f6fb", display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Checkbox defaultChecked={Boolean(checked)} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#000666" }}>{name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#7f8597" }}>{location}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, color: "#000666", fontSize: 20, mb: 2 }}>المرفقات</Typography>
              <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                <Box sx={{ p: 2.2, borderRadius: 2, border: "1px dashed #c6c5d4", bgcolor: "#fafbff", textAlign: "center" }}>
                  <UploadFileIcon sx={{ color: "#7f8597" }} />
                  <Typography sx={{ color: "#000666", fontWeight: 700, mt: 0.8 }}>صورة الهوية / الجواز</Typography>
                  <Typography sx={{ fontSize: 12, color: "#7f8597", mt: 0.5 }}>JPG, PNG, PDF حتى 5MB</Typography>
                </Box>
                <Box sx={{ p: 2.2, borderRadius: 2, border: "1px dashed #c6c5d4", bgcolor: "#fafbff", textAlign: "center" }}>
                  <UploadFileIcon sx={{ color: "#7f8597" }} />
                  <Typography sx={{ color: "#000666", fontWeight: 700, mt: 0.8 }}>عقد العمل</Typography>
                  <Typography sx={{ fontSize: 12, color: "#7f8597", mt: 0.5 }}>PDF, JPG, PNG حتى 5MB</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography sx={{ color: "#000666", fontWeight: 800, mb: 1.6 }}>صورة المستخدم</Typography>
              <Box sx={{ width: 120, height: 120, borderRadius: 2.5, bgcolor: "#1f2736", mx: "auto", display: "grid", placeItems: "center", color: "#8fd9ff", boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.08)" }}>
                <PersonIcon sx={{ fontSize: 52 }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: "#7f8597", mt: 1.2 }}>اسحب الصورة أو اضغط للتحميل<br/>(2MB كحد أقصى، PNG, JPG)</Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 800, mb: 1.4 }}>الدور والصلاحيات</Typography>
              <TextField select fullWidth label="نوع الحساب" defaultValue="" sx={{ mb: 1.2 }}>
                <MenuItem value="">اختر الدور المناسب</MenuItem>
                <MenuItem value="pm">مدير مشروع</MenuItem>
                <MenuItem value="site-engineer">مهندس موقع</MenuItem>
                <MenuItem value="accountant">محاسب تكاليف</MenuItem>
                <MenuItem value="field-supervisor">مشرف ميداني</MenuItem>
              </TextField>
              <Box sx={{ p: 1.3, borderRadius: 1.6, bgcolor: "#fff3e6", color: "#9a5a0b", fontSize: 12 }}>
                سيحصل هذا المستخدم على صلاحيات الوصول بناءً على الدور المختار، ويمكنك تعديل الصلاحيات لاحقاً.
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>اختصار الإجراء</Typography>
              <Typography sx={{ mt: 0.8, color: "rgba(255,255,255,0.8)", fontSize: 13 }}>بعد الحفظ سيتم إرسال دعوة البريد الإلكتروني للمستخدم الجديد مع تفعيل الحساب.</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.4, flexWrap: "wrap" }}>
                <Chip label="دعوة تلقائية" sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white" }} />
                <Chip label="تفعيل خلال 24 ساعة" sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white" }} />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
