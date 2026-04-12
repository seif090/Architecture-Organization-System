import ApartmentIcon from "@mui/icons-material/Apartment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkIcon from "@mui/icons-material/Work";
import { AppBar, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { api } from "../api";
import type { DataScope } from "../types";
import { useAuth } from "../auth/AuthContext";

const navItems = [
  { to: "/erp", label: "لوحة التحكم", icon: <DashboardIcon fontSize="small" /> },
  { to: "/erp/projects", label: "المشاريع", icon: <WorkIcon fontSize="small" /> },
  { to: "/erp/procurement", label: "المشتريات", icon: <DescriptionIcon fontSize="small" /> },
  { to: "/erp/suppliers", label: "الموردين", icon: <DescriptionIcon fontSize="small" /> },
  { to: "/erp/workforce", label: "الموظفين", icon: <EngineeringIcon fontSize="small" /> },
  { to: "/erp/assets", label: "الأصول", icon: <Inventory2Icon fontSize="small" /> },
  { to: "/erp/clients", label: "العملاء", icon: <AssignmentIndIcon fontSize="small" /> },
  { to: "/erp/inventory", label: "المخازن", icon: <Inventory2Icon fontSize="small" /> },
  { to: "/erp/notifications", label: "التنبيهات", icon: <NotificationsIcon fontSize="small" /> },
  { to: "/erp/finance", label: "الحسابات", icon: <MonetizationOnIcon fontSize="small" /> },
  { to: "/erp/properties", label: "العقارات", icon: <ApartmentIcon fontSize="small" /> },
  { to: "/erp/access-control", label: "إدارة المستخدمين", icon: <SecurityIcon fontSize="small" /> },
  { to: "/erp/contracts", label: "العقود", icon: <DescriptionIcon fontSize="small" /> }
];

export function AppLayout({
  scope,
  onScopeChange,
  onDataRefresh
}: {
  scope: DataScope;
  onScopeChange: (scope: DataScope) => void;
  onDataRefresh: () => void;
}) {
  const { user, logout } = useAuth();

  const loadDemo = async () => {
    await api.post("/demo/load");
    onDataRefresh();
  };

  const clearDemo = async () => {
    await api.delete("/demo/clear");
    onDataRefresh();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          width: 270,
          bgcolor: "#000666",
          color: "white",
          p: 2,
          display: { xs: "none", md: "block" }
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>ERP التشطيبات والعقارات</Typography>
        <Stack spacing={1.2}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: "white",
                background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
                borderRadius: 10,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </Stack>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent", color: "text.primary", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <Toolbar sx={{ justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6">مرحبًا، {user?.name}</Typography>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>نوع البيانات</InputLabel>
                <Select
                  label="نوع البيانات"
                  value={scope}
                  onChange={(event) => onScopeChange(event.target.value as DataScope)}
                >
                  <MenuItem value="all">الكل</MenuItem>
                  <MenuItem value="demo">Demo Data</MenuItem>
                  <MenuItem value="real">Real Data</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="secondary" onClick={loadDemo}>إعادة تحميل بيانات التجربة</Button>
              <Button variant="outlined" color="error" onClick={clearDemo}>حذف بيانات التجربة</Button>
              <Button variant="text" onClick={logout}>تسجيل الخروج</Button>
            </Stack>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
