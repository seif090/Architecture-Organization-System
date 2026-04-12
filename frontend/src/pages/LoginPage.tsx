import ArchitectureIcon from "@mui/icons-material/Architecture";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailIcon from "@mui/icons-material/Mail";
import ShieldIcon from "@mui/icons-material/Shield";
import { Alert, Box, Button, Checkbox, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@erp.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/erp/dashboard");
    } catch {
      setError("فشل تسجيل الدخول. تحقق من البريد وكلمة المرور");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, bgcolor: "#f9f9fd" }}>
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          position: "relative",
          overflow: "hidden",
          bgcolor: "#000666",
          color: "white",
          p: 8,
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 8% 15%, rgba(189,194,255,0.2) 0, rgba(189,194,255,0) 48%)" }} />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography sx={{ color: "#ffdcc6", letterSpacing: 2, fontWeight: 700, mb: 2 }}>الجيل القادم من ERP</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 56, lineHeight: 1.08 }}>بناء المستقبل
            <br />بثقة معمارية</Typography>
          <Box sx={{ width: 84, height: 4, bgcolor: "#fc820c", mt: 3 }} />
          <Typography sx={{ mt: 4, fontSize: 20, color: "#d5dbff", maxWidth: 560 }}>
            منصة تشغيل متكاملة لقطاع التشييد والبناء تمنحك تحكمًا دقيقًا في المشاريع، المشتريات، والمخزون.
          </Typography>
          <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 1.2, maxWidth: 520 }}>
            <ShieldIcon sx={{ color: "#ffb786" }} />
            <Box>
              <Typography sx={{ fontWeight: 800 }}>أمان بمستوى مؤسسي</Typography>
              <Typography sx={{ fontSize: 13, color: "#d5dbff" }}>تشفير شامل للبيانات ومراقبة فورية لمحاولات الدخول.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2.4, md: 6 } }}>
        <Box sx={{ width: "min(480px, 96vw)", p: { xs: 2.2, md: 4.2 }, borderRadius: 3.2, bgcolor: "#fff", boxShadow: "0 10px 36px rgba(0,6,102,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2.2 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: 1.5, bgcolor: "#000666", color: "white", display: "grid", placeItems: "center" }}><ArchitectureIcon /></Box>
            <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 30 }}>المنشئ الذكي</Typography>
          </Box>

          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 32 }}>تسجيل الدخول</Typography>
          <Typography sx={{ color: "#6f7587", mt: 0.8, mb: 2.8 }}>مرحبًا بك مجددًا في نظام المعمار الهندسي.</Typography>

          <Stack component="form" spacing={1.8} onSubmit={handleSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="البريد الإلكتروني المهني" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Checkbox size="small" defaultChecked />
                <Typography sx={{ color: "#6f7587", fontSize: 13 }}>تذكرني لمدة 30 يومًا</Typography>
              </Box>
              <Button type="button" variant="text" sx={{ color: "#964900", fontWeight: 800 }} onClick={() => window.alert("برجاء التواصل مع مسؤول النظام لإعادة تعيين كلمة المرور")}>نسيت كلمة المرور؟</Button>
            </Box>

            <Button type="submit" variant="contained" size="large" endIcon={<ArrowBackIcon />} sx={{ bgcolor: "#000666", height: 52, fontWeight: 800 }}>
              الدخول إلى النظام
            </Button>

            <Button type="button" variant="outlined" startIcon={<MailIcon />} sx={{ borderColor: "#d7dceb", color: "#2a324d", height: 52 }} onClick={() => window.alert("تسجيل Google Workspace سيتم تفعيله قريبًا") }>
              Login with Google Workspace
            </Button>

            <Button type="button" variant="text" sx={{ color: "#000666", fontWeight: 800 }} onClick={() => navigate("/register")}>
              إنشاء حساب جديد
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
