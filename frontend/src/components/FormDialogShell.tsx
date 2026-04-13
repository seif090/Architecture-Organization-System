import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { ReactNode } from "react";

type FormDialogShellProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  loading?: boolean;
  confirmDisabled?: boolean;
  confirmText?: string;
  loadingText?: string;
  cancelText?: string;
};

export function FormDialogShell({
  open,
  title,
  onClose,
  onConfirm,
  children,
  loading = false,
  confirmDisabled = false,
  confirmText = "حفظ",
  loadingText = "جاري الحفظ...",
  cancelText = "إلغاء"
}: FormDialogShellProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, color: "#123b5d" }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button type="button" onClick={onClose}>{cancelText}</Button>
        <Button type="button" variant="contained" onClick={onConfirm} disabled={loading || confirmDisabled}>
          {loading ? loadingText : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
