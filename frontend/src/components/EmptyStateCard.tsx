import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Card, CardContent, Typography } from "@mui/material";

type EmptyStateCardProps = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ py: 4.5, textAlign: "center" }}>
        <Box sx={{ width: 46, height: 46, borderRadius: "50%", mx: "auto", mb: 1.4, bgcolor: "rgba(18,59,93,0.1)", color: "#123b5d", display: "grid", placeItems: "center" }}>
          <InfoOutlinedIcon />
        </Box>
        <Typography sx={{ color: "#123b5d", fontWeight: 800, fontSize: 18 }}>{title}</Typography>
        <Typography sx={{ color: "#677885", mt: 0.7 }}>{description}</Typography>
      </CardContent>
    </Card>
  );
}
