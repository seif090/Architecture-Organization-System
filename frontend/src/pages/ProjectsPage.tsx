import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import WorkIcon from "@mui/icons-material/Work";
import { Avatar, Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";

const projectCards = [
  {
    badge: "شقة",
    badgeColor: "#fc820c",
    code: "PRJ-334#",
    title: "شقة بنتهاوس - نخلة جميرا",
    location: "النخلة، دبي",
    area: "350 م²",
    budget: "850k AED",
    startDate: "مارس 2024",
    progress: 92,
    members: 1,
    cover: "linear-gradient(135deg, #11210f 0%, #1b2e1a 45%, #4d6344 100%)",
    plant: true
  },
  {
    badge: "كمباوند",
    badgeColor: "#7b2e12",
    code: "PRJ-105#",
    title: "كمباوند الصفوة السكني",
    location: "الرياض، السعودية",
    area: "45,000 م²",
    budget: "150M SAR",
    startDate: "يناير 2024",
    progress: 15,
    members: 2,
    cover: "linear-gradient(135deg, #080808 0%, #0e0e0e 45%, #3a1d17 100%)",
    shoe: true
  },
  {
    badge: "فيلا",
    badgeColor: "#fc820c",
    code: "PRJ-882#",
    title: "فيلا دي مارينا - المرحلة 4",
    location: "الجبيهة، دبي",
    area: "1,200 م²",
    budget: "2.4M AED",
    startDate: "أكتوبر 2023",
    progress: 65,
    members: 3,
    cover: "linear-gradient(135deg, #c8d0d2 0%, #aeb8bb 50%, #e3e7e9 100%)",
    object: true
  }
];

const filters = ["الكل", "قيد التنفيذ", "مكتمل", "متوقف"];

export function ProjectsPage({ data }: { data: any[]; onRefresh: () => void }) {
  const metrics = [
    { title: "إجمالي المشاريع", value: data?.length || 24, dark: true },
    { title: "قيد التنفيذ", value: 18 },
    { title: "قيد التصدير", value: 0 },
    { title: "كفاءة الإنجاز", value: "82%", accent: "+12.4%" }
  ];

  return (
    <Stack spacing={3.4}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 13, mb: 0.5 }}>صرح البرمجية</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>إدارة المشاريع</Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>مراقبة تقدم العمليات الإنشائية، إدارة الميزانيات، وتتبع الجداول الزمنية لمشاريع المجموعة.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#0a1589", minWidth: 200, py: 1.3, boxShadow: "0 12px 28px rgba(10,21,137,0.22)" }}>
          إضافة مشروع جديد
        </Button>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {metrics.map((metric, index) => (
          <Card key={metric.title} sx={{ borderRadius: 3, minHeight: 144, boxShadow: "0 8px 32px rgba(0,6,102,0.06)", bgcolor: metric.dark ? "#000666" : "white", color: metric.dark ? "white" : "inherit" }}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              <Typography sx={{ color: metric.dark ? "rgba(255,255,255,0.8)" : "#7f8597", fontSize: 12, fontWeight: 700 }}>{metric.title}</Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: metric.dark ? "flex-end" : "flex-start", gap: 1, mt: 2 }}>
                {metric.accent && <Typography sx={{ color: "#fc820c", fontSize: 18, fontWeight: 800 }}>{metric.accent}</Typography>}
                <Typography sx={{ fontWeight: 900, fontSize: metric.dark ? 42 : 38, lineHeight: 1, color: metric.dark ? "white" : index === 1 ? "#964900" : index === 2 ? "#c62828" : "#000666" }}>
                  {metric.value}
                </Typography>
              </Box>
              {index === 3 ? (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={82} sx={{ height: 6, borderRadius: 999, bgcolor: metric.dark ? "rgba(255,255,255,0.15)" : "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: metric.dark ? "#fc820c" : "#000666" } }} />
                </Box>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#eef0f6", display: "grid", placeItems: "center" }}><MapIcon sx={{ color: "#000666" }} /></Box>
          <Typography sx={{ fontSize: 14, color: "#6f7587" }}>عرض: </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {filters.map((filter, index) => (
              <Chip key={filter} label={filter} sx={{ bgcolor: index === 0 ? "#eef0f6" : "#fff", fontWeight: 700 }} />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined">تصفية متقدمة</Button>
          <Button variant="text">عرض</Button>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        {projectCards.map((project) => (
          <Card key={project.code} sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,6,102,0.06)" }}>
            <Box sx={{ height: 260, p: 2, position: "relative", background: project.cover, color: "white" }}>
              <Chip label={project.badge} sx={{ position: "absolute", top: 16, right: 16, bgcolor: project.badgeColor, color: "white", fontWeight: 700 }} />
              {project.plant && (
                <Box sx={{ width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", position: "absolute", insetInlineStart: 18, top: 34, display: "grid", placeItems: "center", backdropFilter: "blur(8px)" }}>
                  <Box sx={{ width: 118, height: 118, borderRadius: "50%", bgcolor: "#20301b", boxShadow: "inset 0 -10px 35px rgba(255,255,255,0.12)" }} />
                  <Box sx={{ position: "absolute", width: 110, height: 42, borderRadius: 4, bgcolor: "#5c6f52", bottom: 24, left: 20 }} />
                </Box>
              )}
              {project.shoe && (
                <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <Box sx={{ width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />
                </Box>
              )}
              {project.object && (
                <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <Box sx={{ width: 160, height: 86, borderRadius: 7, bgcolor: "#596a77", position: "relative" }}>
                    <Box sx={{ position: "absolute", insetInlineStart: 10, top: 18, width: 140, height: 30, bgcolor: "#f5f5f5", borderRadius: 1 }} />
                  </Box>
                </Box>
              )}
              <Chip label={project.code} sx={{ position: "absolute", bottom: 16, left: 16, bgcolor: "white", color: "#000666", fontWeight: 800 }} />
            </Box>

            <CardContent sx={{ p: 2.8 }}>
              <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 19, lineHeight: 1.4, minHeight: 58 }}>{project.title}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "#6f7587", mt: 0.6 }}>
                <LocationOnIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 13 }}>{project.location}</Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mt: 3 }}>
                <Box>
                  <Typography sx={{ color: "#9aa1b6", fontSize: 12 }}>المساحة</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800, mt: 0.5 }}>{project.area}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#9aa1b6", fontSize: 12 }}>الميزانية</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800, mt: 0.5 }}>{project.budget}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#9aa1b6", fontSize: 12 }}>تاريخ البدء</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800, mt: 0.5 }}>{project.startDate}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#9aa1b6", fontSize: 12 }}>الإنجاز</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800, mt: 0.5 }}>{project.progress}%</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                  <Typography sx={{ color: "#6f7587", fontSize: 13 }}>نسبة الإنجاز</Typography>
                  <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 13 }}>{project.progress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={project.progress} sx={{ height: 7, borderRadius: 999, bgcolor: "#eceef5", "& .MuiLinearProgress-bar": { bgcolor: "#000666" } }} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                <Button variant="text" sx={{ color: "#000666", fontWeight: 700 }}>التفاصيل</Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {Array.from({ length: project.members }).map((_, index) => (
                    <Avatar key={index} sx={{ width: 28, height: 28, ml: -0.8, border: "2px solid white", bgcolor: "#d9ddef" }} />
                  ))}
                  {project.members > 2 && (
                    <Box sx={{ width: 28, height: 28, ml: -0.8, borderRadius: "50%", bgcolor: "#eef0f6", display: "grid", placeItems: "center", fontSize: 11, color: "#6f7587", fontWeight: 700 }}>+3</Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ borderRadius: 3, p: 1 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2.5 }}>
            <Button variant="outlined" startIcon={<WorkIcon />}>عرض الخريطة الكاملة</Button>
            <Box>
              <Typography sx={{ color: "#000666", fontWeight: 800, fontSize: 22 }}>توزع المشاريع الجغرافي</Typography>
              <Typography sx={{ color: "#7f8597", fontSize: 13 }}>مواقع الورش والمشاريع النشطة عبر المنطقة</Typography>
            </Box>
          </Box>
          <Box sx={{ position: "relative", height: { xs: 280, md: 420 }, borderRadius: 2.5, overflow: "hidden", bgcolor: "#d9d9df", backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.7) 1px, transparent 0)", backgroundSize: "24px 24px" }}>
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.4))" }} />
            <Box sx={{ position: "absolute", left: "18%", top: "58%", width: 14, height: 14, borderRadius: "50%", bgcolor: "#a55a00", boxShadow: "0 0 0 8px rgba(165,90,0,0.08)" }} />
            <Box sx={{ position: "absolute", right: "28%", top: "38%", width: 14, height: 14, borderRadius: "50%", bgcolor: "#000666", boxShadow: "0 0 0 8px rgba(0,6,102,0.08)" }} />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
