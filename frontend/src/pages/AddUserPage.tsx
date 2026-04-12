import SaveIcon from "@mui/icons-material/Save";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

type RoleValue = "admin" | "project_manager" | "accountant" | "engineer" | "viewer";

export function AddUserPage({ onCreated }: { onCreated: () => Promise<void> | void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "project_manager" as RoleValue
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/users", form);
      await onCreated();
      setSuccess("تم إنشاء المستخدم بنجاح");
      setForm({ name: "", email: "", password: "", role: "project_manager" });
      navigate("/erp/access-control");
    } catch {
      setError("تعذر إنشاء المستخدم. تأكد من البيانات وأن البريد غير مستخدم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ color: "#8d94ae", fontSize: 12 }}>الإعدادات &gt; إدارة المستخدمين &gt; إضافة مستخدم جديد</Typography>
        <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1, mt: 0.8 }}>إضافة مستخدم جديد</Typography>
      </Box>

      <Card sx={{ borderRadius: 3, maxWidth: 760 }}>
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
              label="الاسم الكامل"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="البريد الإلكتروني"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="كلمة المرور"
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              select
              label="الدور"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as RoleValue }))}
              fullWidth
            >
              <MenuItem value="admin">مدير النظام</MenuItem>
              <MenuItem value="project_manager">مدير مشاريع</MenuItem>
              <MenuItem value="accountant">محاسب</MenuItem>
              <MenuItem value="engineer">مهندس</MenuItem>
              <MenuItem value="viewer">مشاهد</MenuItem>
            </TextField>

            <Stack direction="row" spacing={1.2}>
              <Button variant="text" onClick={() => navigate("/erp/access-control")}>إلغاء</Button>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={loading} sx={{ bgcolor: "#000666" }}>
                {loading ? "جاري الحفظ..." : "حفظ المستخدم"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
