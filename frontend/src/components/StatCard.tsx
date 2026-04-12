import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: string;
};

export function StatCard({ title, value, subtitle, icon, accent = "#123b5d" }: StatCardProps) {
  return (
    <Card sx={{ minHeight: 144, borderRadius: 3.2, borderInlineStart: `4px solid ${accent}` }}>
      <CardContent sx={{ position: "relative" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 1 }}>
          <Typography sx={{ color: "#6f7f8e", fontSize: 13, fontWeight: 700 }}>{title}</Typography>
          <Box sx={{ width: 34, height: 34, borderRadius: 1.7, bgcolor: `${accent}1A`, color: accent, display: "grid", placeItems: "center" }}>
            {icon || <TrendingUpIcon sx={{ fontSize: 19 }} />}
          </Box>
        </Box>
        <Typography sx={{ mt: 1.2, color: "#123b5d", fontWeight: 900, fontSize: 38, lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ color: "#6f7f8e", mt: 0.8, fontSize: 12 }}>{subtitle || "آخر تحديث اليوم"}</Typography>
      </CardContent>
    </Card>
  );
}
