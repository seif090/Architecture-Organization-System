import { Box, CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";
import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { fetchByScope } from "./api";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import { appTheme } from "./theme";
import type { DataScope } from "./types";

const AppLayout = lazy(() => import("./layout/AppLayout").then((m) => ({ default: m.AppLayout })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const BusinessIntelligencePage = lazy(() => import("./pages/BusinessIntelligencePage").then((m) => ({ default: m.BusinessIntelligencePage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })));
const ProcurementPage = lazy(() => import("./pages/ProcurementPage").then((m) => ({ default: m.ProcurementPage })));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage").then((m) => ({ default: m.SuppliersPage })));
const WorkforcePage = lazy(() => import("./pages/WorkforcePage").then((m) => ({ default: m.WorkforcePage })));
const AddUserPage = lazy(() => import("./pages/AddUserPage").then((m) => ({ default: m.AddUserPage })));
const AssetsPage = lazy(() => import("./pages/AssetsPage").then((m) => ({ default: m.AssetsPage })));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage").then((m) => ({ default: m.NotificationsPage })));
const AccessControlPage = lazy(() => import("./pages/AccessControlPage").then((m) => ({ default: m.AccessControlPage })));
const ContractsPage = lazy(() => import("./pages/ContractsPage").then((m) => ({ default: m.ContractsPage })));
const ClientsPage = lazy(() => import("./pages/ClientsPage").then((m) => ({ default: m.ClientsPage })));
const InventoryManagementPage = lazy(() => import("./pages/InventoryManagementPage").then((m) => ({ default: m.InventoryManagementPage })));
const InventoryDetailPage = lazy(() => import("./pages/InventoryDetailPage").then((m) => ({ default: m.InventoryDetailPage })));
const FinancePage = lazy(() => import("./pages/FinancePage").then((m) => ({ default: m.FinancePage })));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage").then((m) => ({ default: m.PropertiesPage })));
const ReportsPage = lazy(() => import("./pages/ReportsPage").then((m) => ({ default: m.ReportsPage })));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage").then((m) => ({ default: m.MaintenancePage })));
const MaintenanceDetailPage = lazy(() => import("./pages/MaintenanceDetailPage").then((m) => ({ default: m.MaintenanceDetailPage })));
const EquipmentFaultsPage = lazy(() => import("./pages/EquipmentFaultsPage").then((m) => ({ default: m.EquipmentFaultsPage })));
const IncidentsPage = lazy(() => import("./pages/IncidentsPage").then((m) => ({ default: m.IncidentsPage })));
const SlaDashboardPage = lazy(() => import("./pages/SlaDashboardPage").then((m) => ({ default: m.SlaDashboardPage })));

function ERPApp() {
  const [scope, setScope] = useState<DataScope>("all");
  const [dashboard, setDashboard] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [finance, setFinance] = useState<{ records: any[]; invoices: any[] }>({ records: [], invoices: [] });
  const [properties, setProperties] = useState<{ properties: any[]; installments: any[] }>({ properties: [], installments: [] });
  const { user } = useAuth();

  const loadAll = async () => {
    const [dashData, projectsData, clientsData, financeData, propertiesData] = await Promise.all([
      fetchByScope<any>("/dashboard", scope),
      fetchByScope<any[]>("/projects", scope),
      fetchByScope<any[]>("/clients", scope),
      fetchByScope<{ records: any[]; invoices: any[] }>("/finance", scope).catch(() => ({ records: [], invoices: [] })),
      fetchByScope<{ properties: any[]; installments: any[] }>("/properties", scope)
    ]);

    setDashboard(dashData);
    setProjects(projectsData);
    setClients(clientsData);
    setFinance(financeData);
    setProperties(propertiesData);
  };

  useEffect(() => {
    loadAll().catch(() => undefined);
  }, [scope]);

  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "55vh", display: "grid", placeItems: "center" }}>
          <CircularProgress sx={{ color: "#000666" }} />
        </Box>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <BusinessIntelligencePage />
            </RequireAuth>
          }
        />
        <Route
          path="/erp"
          element={
            <RequireAuth>
              <AppLayout scope={scope} onScopeChange={setScope} onDataRefresh={loadAll} />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage data={dashboard} />} />
          <Route path="dashboard" element={<DashboardPage data={dashboard} />} />
          <Route path="projects" element={<ProjectsPage data={projects} onRefresh={loadAll} />} />
          <Route path="procurement" element={<ProcurementPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="workforce" element={<WorkforcePage />} />
          <Route path="users/new" element={<AddUserPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="maintenance-detail" element={<MaintenanceDetailPage />} />
          <Route path="equipment-faults" element={<EquipmentFaultsPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="sla" element={<SlaDashboardPage />} />
          <Route path="access-control" element={<AccessControlPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="clients" element={<ClientsPage clients={clients} />} />
          <Route path="inventory" element={<InventoryManagementPage />} />
          <Route path="inventory-detail" element={<InventoryDetailPage />} />
          <Route
            path="finance"
            element={<FinancePage isViewer={user?.role === "viewer"} records={finance.records} invoices={finance.invoices} />}
          />
          <Route path="properties" element={<PropertiesPage properties={properties.properties} installments={properties.installments} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <ERPApp />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
