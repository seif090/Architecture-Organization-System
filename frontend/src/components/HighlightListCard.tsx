import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

type HighlightListCardProps = {
  title: string;
  items: string[];
};

export function HighlightListCard({ title, items }: HighlightListCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        color: "white",
        background:
          "radial-gradient(120% 120% at 100% 0%, rgba(252,130,12,0.18) 0%, transparent 44%), linear-gradient(145deg, #000666 0%, #1a237e 100%)",
        boxShadow: "0 18px 35px rgba(0, 6, 102, 0.26)"
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 20, fontWeight: 900 }}>{title}</Typography>
        <Stack spacing={1.2} sx={{ mt: 1.5 }}>
          {items.map((item) => (
            <Box key={item} sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)" }}>
              <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>{item}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
