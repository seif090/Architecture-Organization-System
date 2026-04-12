import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
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
      navigate("/");
    } catch {
      setError("فشل تسجيل الدخول. تحقق من البريد وكلمة المرور");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at 20% 20%, #d8e0ff 0%, #eef2f9 45%, #f7f9fc 100%)"
      }}
    >
      <Card sx={{ width: "min(420px, 92vw)", backdropFilter: "blur(12px)", bgcolor: "rgba(255,255,255,0.9)" }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>نظام ERP للتشطيبات والعقارات</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            منصة تشغيل احترافية لإدارة المشاريع والعملاء والحسابات
          </Typography>

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Button type="submit" variant="contained" size="large">دخول</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
