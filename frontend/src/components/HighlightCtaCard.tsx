import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

type HighlightCtaCardProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
};

export function HighlightCtaCard({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon
}: HighlightCtaCardProps) {
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
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{title}</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.84)", mt: 0.6 }}>{description}</Typography>
        </Box>
        {actionLabel ? (
          <Button
            variant="contained"
            startIcon={actionIcon}
            sx={{
              bgcolor: "#fc820c",
              color: "white",
              boxShadow: "0 10px 20px rgba(252,130,12,0.35)",
              "&:hover": { bgcolor: "#e97408" }
            }}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
