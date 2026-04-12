import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

type ProcessFlowItem = {
  title: string;
  description: string;
};

type ProcessFlowCardProps = {
  title: string;
  items: ProcessFlowItem[];
};

export function ProcessFlowCard({ title, items }: ProcessFlowCardProps) {
  return (
    <Card sx={{ borderRadius: 3, bgcolor: "#000666", color: "white" }}>
      <CardContent>
        <Typography sx={{ fontSize: 20, fontWeight: 900 }}>{title}</Typography>
        <Stack spacing={1.2} sx={{ mt: 1.4 }}>
          {items.map((item) => (
            <Box key={item.title} sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
              <Typography sx={{ fontWeight: 800, color: "#fc820c" }}>{item.title}</Typography>
              <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.88)", mt: 0.4 }}>{item.description}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
