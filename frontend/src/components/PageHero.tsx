import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHero({ eyebrow, title, subtitle, actions }: PageHeroProps) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        px: { xs: 2, md: 3 },
        py: { xs: 2.3, md: 2.8 },
        minHeight: { xs: "auto", md: 172 },
        border: "1px solid rgba(16,34,52,0.12)",
        background:
          "radial-gradient(120% 120% at 95% -15%, rgba(227,155,68,0.24) 0%, transparent 45%), radial-gradient(120% 120% at -10% 120%, rgba(29,93,143,0.2) 0%, transparent 45%), linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.86) 100%)",
        boxShadow: "0 20px 46px rgba(16,34,52,0.08)"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(16,34,52,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,34,52,0.03) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          opacity: 0.5
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "stretch"
        }}
      >
        <Box sx={{ maxWidth: 760 }}>
          {eyebrow && <Typography sx={{ color: "#6f7f8e", fontSize: 12, mb: 0.6, fontWeight: 700 }}>{eyebrow}</Typography>}
          <Typography sx={{ color: "#123b5d", fontWeight: 900, fontSize: { xs: 28, md: 40 }, lineHeight: 1.1 }}>{title}</Typography>
          {subtitle && <Typography sx={{ color: "#5f6b76", mt: 1 }}>{subtitle}</Typography>}
        </Box>
        {actions ? <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap", justifyContent: "flex-start" }}>{actions}</Box> : null}
      </Box>
    </Box>
  );
}
