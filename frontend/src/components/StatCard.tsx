import { Card, CardContent, Typography } from "@mui/material";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Card sx={{ background: "linear-gradient(135deg, #000666 0%, #1a237e 100%)", color: "white", minHeight: 145 }}>
      <CardContent>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>{title}</Typography>
        <Typography variant="h5" sx={{ mt: 1.5, mb: 1 }}>{value}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.85 }}>{subtitle || "آخر تحديث اليوم"}</Typography>
      </CardContent>
    </Card>
  );
}
