import ArchitectureIcon from "@mui/icons-material/Architecture";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { Role } from "../types";

type RegisterRole = Exclude<Role, "admin">;

const roleOptions: Array<{ value: RegisterRole; label: string }> = [
  { value: "project_manager", label: "مدير مشروع" },
  { value: "accountant", label: "محاسب" },
  { value: "engineer", label: "مهندس" },
  { value: "viewer", label: "مشاهد" }
];

function getPasswordStrength(value: string): { score: number; label: string; color: string } {
  if (!value) {
    return { score: 0, label: "", color: "#c7ccdd" };
  }

  let score = 0;
  if (value.length >= 8) score += 20;
  if (/[a-z]/.test(value)) score += 20;
  if (/[A-Z]/.test(value)) score += 20;
  if (/\d/.test(value)) score += 20;
  if (/[^A-Za-z0-9]/.test(value)) score += 20;

  if (score < 60) {
    return { score, label: "ضعيف", color: "#d32f2f" };
  }

  if (score < 100) {
    return { score, label: "متوسط", color: "#d97706" };
  }

  return { score, label: "قوي", color: "#16a34a" };
}

export function RegistrationPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>("viewer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!passwordPattern.test(password)) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص");
      return;
    }

    if (password !== confirmPassword) {
      setError("تأكيد كلمة المرور غير مطابق");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, role);
      navigate("/erp/dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 409) {
        setError("البريد الإلكتروني مستخدم بالفعل");
      } else if (status === 400 && message) {
        setError(String(message));
      } else {
        setError("تعذر إنشاء الحساب الآن، حاول مرة أخرى بعد قليل");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2.5, bgcolor: "#f9f9fd" }}>
      <Box sx={{ width: "min(560px, 98vw)", p: { xs: 2.2, md: 4.2 }, borderRadius: 3.2, bgcolor: "#fff", boxShadow: "0 10px 36px rgba(0,6,102,0.08)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2.2 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: 1.5, bgcolor: "#000666", color: "white", display: "grid", placeItems: "center" }}><ArchitectureIcon /></Box>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 30 }}>إنشاء حساب جديد</Typography>
        </Box>

        <Typography sx={{ color: "#6f7587", mt: 0.8, mb: 2.8 }}>املأ البيانات وحدد الدور المناسب من الخيارات التالية.</Typography>

        <Stack component="form" spacing={1.8} onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField label="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField label="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
          <TextField
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            helperText="8+ أحرف، حرف كبير، حرف صغير، رقم، ورمز خاص"
          />

          {password && (
            <Box sx={{ mt: -0.6 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                <Typography sx={{ fontSize: 12, color: "#6f7587" }}>قوة كلمة المرور</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: passwordStrength.color }}>{passwordStrength.label}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passwordStrength.score}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: "#eceef5",
                  "& .MuiLinearProgress-bar": { bgcolor: passwordStrength.color }
                }}
              />
            </Box>
          )}

          <TextField
            label="تأكيد كلمة المرور"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />

          <FormControl>
            <FormLabel sx={{ color: "#000666", fontWeight: 700 }}>اختر الدور</FormLabel>
            <RadioGroup value={role} onChange={(e) => setRole(e.target.value as RegisterRole)}>
              {roleOptions.map((option) => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
              ))}
            </RadioGroup>
          </FormControl>

          <Button type="submit" variant="contained" size="large" endIcon={<PersonAddIcon />} sx={{ bgcolor: "#000666", height: 52, fontWeight: 800 }} disabled={loading}>
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>

          <Button type="button" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderColor: "#d7dceb", color: "#2a324d", height: 52 }} onClick={() => navigate("/login")}>
            العودة لتسجيل الدخول
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
