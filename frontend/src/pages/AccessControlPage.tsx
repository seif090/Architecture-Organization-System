import AddIcon from "@mui/icons-material/Add";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SecurityIcon from "@mui/icons-material/Security";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, Card, CardContent, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type PermissionItem = {
  module: string;
  moduleKey: string;
  actions: { key: string; label: string; enabled: boolean }[];
};

const users = [
  { id: 1, name: "أحمد منصور", email: "ahmed@construction.com", status: "نشط", team: "مشروع" },
  { id: 2, name: "سارة علي", email: "sara.ali@construction.com", status: "نشط", team: "المالية" },
  { id: 3, name: "ياسر خالد", email: "yasser@construction.com", status: "غير نشط", team: "المشتريات" }
];

const activities = [
  "تم إنشاء دور جديد باسم مشرف مالي بواسطة سارة",
  "محاولة دخول فاشلة للمستخدم خالد علي (3 مرات متتالية)",
  "تحديث مصفوفة صلاحيات إدارة المخازن بواسطة المدير"
];

const securitySummary = [
  { title: "تنبيهات أمنية", value: "3", tone: "#d32f2f", icon: <NotificationsActiveIcon /> },
  { title: "دعوات معلقة", value: "28", tone: "#19206f", icon: <MailIcon /> },
  { title: "الأدوار النشطة", value: "14", tone: "#9a5b17", icon: <SecurityIcon /> },
  { title: "المستخدمين", value: "42", tone: "#0f9d58", icon: <GroupAddIcon /> }
];

export function AccessControlPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("محاسب");
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      module: "إدارة المخازن",
      moduleKey: "Inventory",
      actions: [
        { key: "view", label: "عرض", enabled: true },
        { key: "add", label: "إضافة", enabled: false },
        { key: "edit", label: "تعديل", enabled: false },
        { key: "delete", label: "حذف", enabled: false }
      ]
    },
    {
      module: "النظام المالي",
      moduleKey: "Financials",
      actions: [
        { key: "view", label: "عرض", enabled: true },
        { key: "add", label: "إضافة", enabled: true },
        { key: "edit", label: "تعديل", enabled: true },
        { key: "delete", label: "حذف", enabled: false }
      ]
    },
    {
      module: "إدارة المشاريع",
      moduleKey: "Projects",
      actions: [
        { key: "view", label: "عرض", enabled: false },
        { key: "add", label: "إضافة", enabled: false }
      ]
    }
  ]);

  const kpis = useMemo(() => securitySummary, []);

  const togglePermission = (moduleIndex: number, actionKey: string) => {
    setPermissions((prev) =>
      prev.map((module, index) => {
        if (index !== moduleIndex) {
          return module;
        }

        return {
          ...module,
          actions: module.actions.map((action) => (action.key === actionKey ? { ...action, enabled: !action.enabled } : action))
        };
      })
    );
  };

  return (
    <Stack spacing={2.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1.2 }}>
        <Box>
          <Typography sx={{ color: "#a7afd6", fontSize: 14, mb: 0.2 }}>نظام إدارة الموارد</Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: 28, md: 40 }, color: "#111a6a", fontWeight: 800, lineHeight: 1.1 }}>
            إدارة المستخدمين والصلاحيات
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.8 }}>مراقبة دقيقة للصلاحيات، والوصول، والتدقيق عبر النظام.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="contained" startIcon={<GroupAddIcon />} sx={{ bgcolor: "#0a1589", minWidth: 200, boxShadow: "0 12px 28px rgba(10, 21, 137, 0.22)" }}>
            إضافة مستخدم جديد
          </Button>
          <Button variant="outlined" startIcon={<TuneIcon />} sx={{ minWidth: 180 }}>
            تعريف دور جديد
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 1.6, gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(180px, 1fr))" } }}>
        {kpis.map((kpi) => (
          <Card key={kpi.title} sx={{ borderRadius: 2.3, minHeight: 150 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.2, alignItems: "flex-start" }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 1.6, bgcolor: `${kpi.tone}10`, color: kpi.tone, display: "grid", placeItems: "center" }}>{kpi.icon}</Box>
              <Typography color="text.secondary" sx={{ fontWeight: 600 }}>{kpi.title}</Typography>
              <Typography sx={{ fontSize: 42, lineHeight: 1, color: "#111a6a", fontWeight: 800 }}>{kpi.value}</Typography>
              {kpi.title === "دعوات معلقة" && (
                <Typography sx={{ px: 1, py: 0.25, borderRadius: 2, bgcolor: "#e8f8ef", color: "#0d8a43", fontSize: 12 }}>نشط</Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" } }}>
        <Card sx={{ borderRadius: 2.3, overflow: "hidden" }}>
          <Box sx={{ p: 2.2, bgcolor: "#0b1487", color: "white", minHeight: 230 }}>
            <Typography variant="h5" sx={{ mb: 0.8, fontWeight: 700 }}>إدارة مصفوفة الصلاحيات</Typography>
            <Typography sx={{ opacity: 0.86, mb: 1.2 }}>تحكم بدقة في وصول كل دور وظيفي للنظام</Typography>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#e6ebff" }}>الدور المختار</InputLabel>
              <Select
                value={role}
                label="الدور المختار"
                onChange={(event) => setRole(event.target.value)}
                sx={{ color: "white", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.4)" } }}
              >
                <MenuItem value="محاسب">محاسب</MenuItem>
                <MenuItem value="مهندس">مهندس</MenuItem>
                <MenuItem value="مدير مشاريع">مدير مشاريع</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ p: 2 }}>
            {permissions.map((module, moduleIndex) => (
              <Box key={module.moduleKey} sx={{ mb: 2.2 }}>
                <Typography sx={{ fontWeight: 800, color: "#19206f", mb: 1.1, fontSize: 18 }}>{module.module} ({module.moduleKey})</Typography>
                <Stack spacing={1.1}>
                  {module.actions.map((action) => (
                    <Box key={action.key} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.1, borderRadius: 1.3, bgcolor: "#f4f6fb" }}>
                      <Typography sx={{ fontWeight: 600 }}>{action.label}</Typography>
                      <Switch checked={action.enabled} onChange={() => togglePermission(moduleIndex, action.key)} />
                    </Box>
                  ))}
                </Stack>
                <Divider sx={{ mt: 1.6 }} />
              </Box>
            ))}

            <Stack direction="row" spacing={1.2}>
              <Button variant="outlined" color="inherit" fullWidth sx={{ py: 1.2 }}>إلغاء</Button>
              <Button variant="contained" color="secondary" fullWidth sx={{ py: 1.2 }}>حفظ التغييرات</Button>
            </Stack>
          </Box>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 2.3 }}>
            <CardContent sx={{ pb: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.2 }}>
                <Typography sx={{ color: "#111a6a", fontWeight: 700 }}>قائمة المستخدمين</Typography>
                <Typography sx={{ color: "#a7afd6", fontSize: 13 }}>آخر تحديث: منذ 5 دقائق</Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>الاسم</TableCell>
                    <TableCell>البريد الإلكتروني</TableCell>
                    <TableCell>الحالة</TableCell>
                    <TableCell>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Typography sx={{ color: user.status === "نشط" ? "#0b9a4a" : "#8a92a6" }}>
                          {user.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small"><TuneIcon fontSize="small" /></IconButton>
                          <IconButton size="small"><SecurityIcon fontSize="small" /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography sx={{ textAlign: "center", mt: 1.3, color: "#111a6a", fontWeight: 600 }}>عرض جميع المستخدمين</Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2.3, minHeight: 230 }}>
            <CardContent>
              <Typography sx={{ color: "#111a6a", fontWeight: 700, mb: 1 }}>سجل النشاط</Typography>
              <Stack spacing={1.2}>
                {activities.map((entry) => (
                  <Box key={entry} sx={{ borderRight: "3px solid #e9edf7", p: 1.1, borderRadius: 1.2, bgcolor: "#fafbff" }}>
                    <Typography sx={{ fontWeight: 500 }}>{entry}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Box sx={{ position: "fixed", bottom: 22, right: 28 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/erp/users/new")} sx={{ minWidth: 230, py: 1.5, borderRadius: 2, bgcolor: "#0a1589", boxShadow: "0 12px 28px rgba(10, 21, 137, 0.24)" }}>
          إنشاء دور جديد
        </Button>
      </Box>
    </Stack>
  );
}
