import DeleteIcon from "@mui/icons-material/Delete";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SaveIcon from "@mui/icons-material/Save";
import { Alert, Box, Button, Card, CardContent, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const roleLabels: Record<string, string> = {
  admin: "مدير النظام",
  project_manager: "مدير مشاريع",
  accountant: "محاسب",
  engineer: "مهندس",
  viewer: "مشاهد"
};

export function AccessControlPage({ users, onRefresh }: { users: any[]; onRefresh: () => Promise<void> | void }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [rolesDraft, setRolesDraft] = useState<Record<number, string>>({});

  const rows = useMemo(() => users || [], [users]);

  const getRole = (user: any) => rolesDraft[user.id] ?? user.role;

  const updateRole = async (userId: number) => {
    try {
      setError("");
      setSuccess("");
      setSavingId(userId);
      await api.patch(`/users/${userId}`, { role: rolesDraft[userId] });
      await onRefresh();
      setSuccess("تم تحديث صلاحية المستخدم");
    } catch {
      setError("تعذر تحديث الصلاحية");
    } finally {
      setSavingId(null);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setDeletingId(userId);
      await api.delete(`/users/${userId}`);
      await onRefresh();
      setSuccess("تم حذف المستخدم");
    } catch {
      setError("تعذر حذف المستخدم");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>الإعدادات / الصلاحيات</Typography>
          <Typography sx={{ color: "#111a6a", fontWeight: 900, fontSize: { xs: 28, md: 40 }, lineHeight: 1.1 }}>إدارة المستخدمين والصلاحيات</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<GroupAddIcon />}
          onClick={() => navigate("/erp/users/new")}
          sx={{ bgcolor: "#000666" }}
        >
          إضافة مستخدم جديد
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card sx={{ borderRadius: 2.3 }}>
        <CardContent>
          <Typography sx={{ color: "#111a6a", fontWeight: 800, mb: 2, fontSize: 20 }}>قائمة المستخدمين</Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>البريد الإلكتروني</TableCell>
                  <TableCell>الدور</TableCell>
                  <TableCell>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={getRole(user)}
                        onChange={(event) =>
                          setRolesDraft((prev) => ({
                            ...prev,
                            [user.id]: event.target.value
                          }))
                        }
                        sx={{ minWidth: 170 }}
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<SaveIcon />}
                          disabled={savingId === user.id || getRole(user) === user.role}
                          onClick={() => updateRole(user.id)}
                        >
                          حفظ
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          disabled={deletingId === user.id}
                          onClick={() => deleteUser(user.id)}
                        >
                          حذف
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
