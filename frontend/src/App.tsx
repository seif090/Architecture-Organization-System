import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { fetchByScope } from "./api";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import { AppLayout } from "./layout/AppLayout";
import { ContractsPage } from "./pages/ContractsPage";
import { AccessControlPage } from "./pages/AccessControlPage";
import { AddUserPage } from "./pages/AddUserPage";
import { AssetsPage } from "./pages/AssetsPage";
import { BusinessIntelligencePage } from "./pages/BusinessIntelligencePage";
import { ClientsPage } from "./pages/ClientsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FinancePage } from "./pages/FinancePage";
import { InventoryManagementPage } from "./pages/InventoryManagementPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProcurementPage } from "./pages/ProcurementPage";
import { LoginPage } from "./pages/LoginPage";
import { PropertiesPage } from "./pages/PropertiesPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SuppliersPage } from "./pages/SuppliersPage";
import { WorkforcePage } from "./pages/WorkforcePage";
import { appTheme } from "./theme";
import type { DataScope } from "./types";

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
        <Route path="access-control" element={<AccessControlPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="clients" element={<ClientsPage clients={clients} />} />
        <Route path="inventory" element={<InventoryManagementPage />} />
        <Route
          path="finance"
          element={
            <FinancePage
              isViewer={user?.role === "viewer"}
              records={finance.records}
              invoices={finance.invoices}
            />
          }
        />
        <Route path="properties" element={<PropertiesPage properties={properties.properties} installments={properties.installments} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
