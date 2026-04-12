import ApartmentIcon from "@mui/icons-material/Apartment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpIcon from "@mui/icons-material/Help";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SearchIcon from "@mui/icons-material/Search";
import BuildIcon from "@mui/icons-material/Build";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import WorkIcon from "@mui/icons-material/Work";
import { AppBar, Avatar, Badge, Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
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
  { to: "/erp/inventory-detail", label: "مخازن تفصيلية", icon: <WarehouseIcon fontSize="small" /> },
  { to: "/erp/notifications", label: "التنبيهات", icon: <NotificationsIcon fontSize="small" /> },
  { to: "/erp/incidents", label: "البلاغات", icon: <ReportProblemIcon fontSize="small" /> },
  { to: "/erp/sla", label: "SLA المتابعة", icon: <QueryStatsIcon fontSize="small" /> },
  { to: "/erp/reports", label: "التقارير", icon: <AssessmentIcon fontSize="small" /> },
  { to: "/erp/maintenance", label: "الصيانة", icon: <BuildIcon fontSize="small" /> },
  { to: "/erp/maintenance-detail", label: "صيانة تفصيلية", icon: <BuildIcon fontSize="small" /> },
  { to: "/erp/equipment-faults", label: "أعطال المعدات", icon: <PrecisionManufacturingIcon fontSize="small" /> },
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9f9fd" }}>
      <Box
        sx={{
          width: 272,
          bgcolor: "#000666",
          color: "white",
          p: 2.2,
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: { xs: "none", md: "block" }
        }}
      >
        <Box sx={{ mb: 3.2, p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
          <Typography sx={{ fontWeight: 900, fontSize: 20, lineHeight: 1.2 }}>صرح البرمجية</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 12, mt: 0.5 }}>ERP إدارة المشاريع المتكامل</Typography>
        </Box>

        <Stack spacing={0.7}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: "white",
                background: isActive ? "rgba(255,255,255,0.13)" : "transparent",
                borderRight: isActive ? "3px solid #fc820c" : "3px solid transparent",
                borderRadius: 12,
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

        <Divider sx={{ my: 2.4, borderColor: "rgba(255,255,255,0.15)" }} />
        <Button variant="contained" sx={{ width: "100%", bgcolor: "#fc820c", color: "white", fontWeight: 800 }}>إضافة مشروع</Button>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", color: "text.primary", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <Toolbar sx={{ justifyContent: "space-between", gap: 2, minHeight: "72px !important", px: { xs: 2, md: 3 } }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.9, bgcolor: "#f3f4f8", px: 1.3, py: 0.7, borderRadius: 2, minWidth: { xs: 150, md: 220 } }}>
                <SearchIcon sx={{ color: "#98a0b6", fontSize: 19 }} />
                <Typography sx={{ color: "#98a0b6", fontSize: 13 }}>بحث سريع...</Typography>
              </Box>

              <FormControl size="small" sx={{ minWidth: 136 }}>
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
              <Button variant="contained" color="secondary" onClick={loadDemo}>إعادة تحميل التجربة</Button>
              <Button variant="outlined" color="error" onClick={clearDemo}>حذف التجربة</Button>
            </Stack>

            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <IconButton><HelpIcon /></IconButton>
              <IconButton>
                <Badge color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Box sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}>
                <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 14 }}>{user?.name}</Typography>
                <Typography sx={{ color: "#8b91a5", fontSize: 11 }}>{user?.role}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#e7ecff", color: "#000666", width: 36, height: 36 }}>{user?.name?.[0] || "م"}</Avatar>
              <Button variant="text" onClick={logout}>خروج</Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, width: "100%", mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
