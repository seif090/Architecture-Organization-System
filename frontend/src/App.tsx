import { CssBaseline, ThemeProvider } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
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
import { DashboardPage } from "./pages/DashboardPage";
import { InventoryManagementPage } from "./pages/InventoryManagementPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProcurementPage } from "./pages/ProcurementPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SuppliersPage } from "./pages/SuppliersPage";
import { WorkforcePage } from "./pages/WorkforcePage";
import { SimpleTablePage } from "./pages/SimpleTablePage";
import { appTheme } from "./theme";
import type { DataScope } from "./types";

function ERPApp() {
  const [scope, setScope] = useState<DataScope>("all");
  const [dashboard, setDashboard] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [finance, setFinance] = useState<{ records: any[]; invoices: any[] }>({ records: [], invoices: [] });
  const [properties, setProperties] = useState<{ properties: any[]; installments: any[] }>({ properties: [], installments: [] });
  const { user } = useAuth();

  const loadAll = async () => {
    const [dashData, projectsData, clientsData, inventoryData, financeData, propertiesData] = await Promise.all([
      fetchByScope<any>("/dashboard", scope),
      fetchByScope<any[]>("/projects", scope),
      fetchByScope<any[]>("/clients", scope),
      fetchByScope<any[]>("/inventory", scope),
      fetchByScope<{ records: any[]; invoices: any[] }>("/finance", scope).catch(() => ({ records: [], invoices: [] })),
      fetchByScope<{ properties: any[]; installments: any[] }>("/properties", scope)
    ]);

    setDashboard(dashData);
    setProjects(projectsData);
    setClients(clientsData);
    setInventory(inventoryData);
    setFinance(financeData);
    setProperties(propertiesData);
  };

  useEffect(() => {
    loadAll().catch(() => undefined);
  }, [scope]);

  const clientColumns = useMemo<GridColDef[]>(
    () => [
      { field: "name", headerName: "الاسم", flex: 1 },
      { field: "phone", headerName: "الهاتف", flex: 0.8 },
      { field: "address", headerName: "العنوان", flex: 1.2 },
      { field: "projects_count", headerName: "المشاريع", flex: 0.6 },
      { field: "notes", headerName: "ملاحظات", flex: 1.1 }
    ],
    []
  );

  const inventoryColumns = useMemo<GridColDef[]>(
    () => [
      { field: "name", headerName: "الخامة", flex: 1 },
      { field: "unit", headerName: "الوحدة", flex: 0.5 },
      { field: "quantity", headerName: "الكمية", flex: 0.7 },
      { field: "min_quantity", headerName: "الحد الأدنى", flex: 0.7 },
      { field: "supplier", headerName: "المورد", flex: 1 },
      {
        field: "alert",
        headerName: "تنبيه",
        flex: 0.6,
        valueGetter: (_value, row) => (Number(row.quantity) <= Number(row.min_quantity) ? "نقص" : "آمن")
      }
    ],
    []
  );

  const financeColumns = useMemo<GridColDef[]>(
    () => [
      { field: "record_type", headerName: "النوع", flex: 0.7 },
      { field: "project_name", headerName: "المشروع", flex: 1 },
      { field: "description", headerName: "الوصف", flex: 1.3 },
      { field: "amount", headerName: "القيمة", flex: 0.8 },
      { field: "record_date", headerName: "التاريخ", flex: 0.8 }
    ],
    []
  );

  const propertiesColumns = useMemo<GridColDef[]>(
    () => [
      { field: "name", headerName: "العقار", flex: 1 },
      { field: "property_type", headerName: "النوع", flex: 0.8 },
      { field: "status", headerName: "الحالة", flex: 0.7 },
      { field: "location", headerName: "الموقع", flex: 1 },
      { field: "price", headerName: "السعر", flex: 0.9 }
    ],
    []
  );

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
        <Route path="clients" element={<SimpleTablePage title="إدارة العملاء" rows={clients} columns={clientColumns} />} />
        <Route path="inventory" element={<InventoryManagementPage />} />
        <Route
          path="finance"
          element={
            <SimpleTablePage
              title={user?.role === "viewer" ? "لا توجد صلاحية للحسابات" : "الحسابات والتقارير المالية"}
              rows={user?.role === "viewer" ? [] : finance.records}
              columns={financeColumns}
            />
          }
        />
        <Route path="properties" element={<SimpleTablePage title="إدارة العقارات" rows={properties.properties} columns={propertiesColumns} />} />
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
