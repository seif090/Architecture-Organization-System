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
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const loadDemo = async () => {
    await api.post("/demo/load");
    onDataRefresh();
  };

  const clearDemo = async () => {
    await api.delete("/demo/clear");
    onDataRefresh();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "transparent" }}>
      <Box
        sx={{
          width: 296,
          background: "linear-gradient(180deg, #10283f 0%, #183d5d 62%, #1f567f 100%)",
          color: "white",
          p: 2,
          borderLeft: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "0 24px 60px rgba(16, 34, 52, 0.24)",
          display: { xs: "none", md: "block" }
        }}
      >
        <Box sx={{ mb: 2.4, p: 1.6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}>
          <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1.2, letterSpacing: 0.1 }}>صرح البرمجية</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.86)", fontSize: 12, mt: 0.5 }}>ERP تشغيل وإدارة هندسية متكاملة</Typography>
        </Box>

        <Stack spacing={0.8} sx={{ maxHeight: "calc(100vh - 240px)", overflowY: "auto", pr: 0.4 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: "white",
                background: isActive ? "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)" : "transparent",
                borderRight: isActive ? "3px solid #ffbf74" : "3px solid transparent",
                borderRadius: 14,
                padding: "11px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: isActive ? 800 : 600,
                boxShadow: isActive ? "inset 0 1px 0 rgba(255,255,255,0.2)" : "none"
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </Stack>

        <Divider sx={{ my: 2.2, borderColor: "rgba(255,255,255,0.22)" }} />
        <Button
          type="button"
          variant="contained"
          sx={{ width: "100%", bgcolor: "#e39b44", color: "#1f1102", fontWeight: 800, py: 1.1 }}
          onClick={() => navigate("/erp/projects")}
        >
          إضافة مشروع
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.72)", backdropFilter: "blur(18px)", color: "text.primary", borderBottom: "1px solid rgba(16,34,52,0.12)" }}>
          <Toolbar sx={{ justifyContent: "space-between", gap: 2, minHeight: "72px !important", px: { xs: 2, md: 3 } }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.9, bgcolor: "rgba(16,34,52,0.06)", px: 1.3, py: 0.75, borderRadius: 999, border: "1px solid rgba(16,34,52,0.1)", minWidth: { xs: 150, md: 240 } }}>
                <SearchIcon sx={{ color: "#6f7f8e", fontSize: 19 }} />
                <Typography sx={{ color: "#6f7f8e", fontSize: 13 }}>بحث سريع...</Typography>
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
              <IconButton type="button"><HelpIcon /></IconButton>
              <IconButton type="button">
                <Badge color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Box sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}>
                <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 14 }}>{user?.name}</Typography>
                <Typography sx={{ color: "#8b91a5", fontSize: 11 }}>{user?.role}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#e7ecff", color: "#000666", width: 36, height: 36 }}>{user?.name?.[0] || "م"}</Avatar>
              <Button type="button" variant="text" onClick={logout}>خروج</Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: { xs: "block", md: "none" }, px: 1.2, py: 1, borderBottom: "1px solid rgba(16,34,52,0.08)", bgcolor: "rgba(255,255,255,0.78)", backdropFilter: "blur(8px)" }}>
          <Box sx={{ display: "flex", gap: 0.8, overflowX: "auto", pb: 0.4 }}>
            {navItems.map((item) => (
              <NavLink
                key={`mobile-${item.to}`}
                to={item.to}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  borderRadius: "999px",
                  padding: "7px 12px",
                  fontSize: "13px",
                  color: isActive ? "#ffffff" : "#123b5d",
                  background: isActive ? "linear-gradient(135deg, #123b5d 0%, #1d5d8f 100%)" : "rgba(18,59,93,0.08)",
                  border: isActive ? "1px solid transparent" : "1px solid rgba(18,59,93,0.14)",
                  fontWeight: isActive ? 800 : 700
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1.6, md: 3 }, maxWidth: 1460, width: "100%", mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
