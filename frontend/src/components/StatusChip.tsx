import { Chip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type StatusChipProps = {
  label: string;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
};

function getTone(label: string) {
  const text = String(label || "").trim();

  const success = ["مدفوع", "جاهز", "مكتمل", "موقع", "نشط", "متاح", "جيد", "إيراد", "تم الدفع", "معتمد"];
  const warning = ["مستحق", "قيد المراجعة", "تحت المعالجة", "قيد العمل", "متوسط", "مزدحم", "محجوز", "قيد الاعتماد", "بانتظار التوقيع"];
  const danger = ["عاجل", "حرج", "خطر", "مصروف", "متأخر", "تجاوز الميزانية"];

  if (success.includes(text)) {
    return { bg: "#e7f6ec", fg: "#1f8a4c", border: "#bce6cb" };
  }

  if (warning.includes(text)) {
    return { bg: "#fff3e5", fg: "#b76a16", border: "#ffd9b0" };
  }

  if (danger.includes(text)) {
    return { bg: "#fdecec", fg: "#c0342b", border: "#f5c2be" };
  }

  return { bg: "#edf1f5", fg: "#566877", border: "#d7e0e8" };
}

export function StatusChip({ label, size = "small", sx }: StatusChipProps) {
  const tone = getTone(label);

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        fontWeight: 800,
        ...sx
      }}
    />
  );
}
