import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type QuickActionsCardProps = {
  title?: string;
  showDivider?: boolean;
  children: ReactNode;
};

export function QuickActionsCard({ title = "إجراءات سريعة", showDivider = false, children }: QuickActionsCardProps) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 20 }}>{title}</Typography>
        {showDivider ? <Divider sx={{ my: 1.5 }} /> : null}
        <Stack spacing={1.2} sx={{ mt: showDivider ? 0 : 1.4 }}>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
