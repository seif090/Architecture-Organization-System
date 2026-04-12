import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Avatar, Box, Button, Card, CardContent, Chip, LinearProgress, MenuItem, Stack, TextField, Typography } from "@mui/material";

export function ClientsPage({ clients }: { clients: any[] }) {
  const rows = clients.slice(0, 8);
  const linkedProjects = clients.reduce((sum, c) => sum + Number(c.projects_count || 0), 0);
  const paymentsExpected = linkedProjects * 2400;

  const followUps = [
    { time: "10:30 ص", title: rows[0]?.name || "أحمد منصور", note: "تأكيد موعد استلام الدفعة الثالثة.", tone: "#000666" },
    { time: "01:15 م", title: rows[1]?.name || "سارة العتيبي", note: "إرسال العرض المالي المعدل للعميل.", tone: "#964900" },
    { time: "04:00 م", title: "اجتماع لجنة المبيعات", note: "مراجعة تقارير العملاء الجدد لهذا الأسبوع.", tone: "#7f8597" }
  ];

  return (
    <Stack spacing={3.2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#a1a8c9", fontSize: 12, mb: 0.5 }}>الرئيسية / إدارة العملاء</Typography>
          <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1 }}>إدارة العملاء والتعاقدات</Typography>
          <Typography sx={{ color: "#6f7587", mt: 1 }}>تتبع رحلة العملاء والعقود والمهام التشغيلية في مكان واحد.</Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button variant="outlined" sx={{ borderColor: "#d6d9e6", color: "#000666" }}>تصدير البيانات</Button>
          <Button variant="contained" startIcon={<PersonAddAlt1Icon />} sx={{ bgcolor: "#000666" }}>إضافة عميل جديد</Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Card sx={{ borderRadius: 3, borderInlineStart: "4px solid #000666" }}><CardContent><Typography sx={{ color: "#7f8597" }}>إجمالي العملاء</Typography><Typography sx={{ color: "#000666", fontSize: 38, fontWeight: 900 }}>{clients.length}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, borderInlineStart: "4px solid #964900" }}><CardContent><Typography sx={{ color: "#7f8597" }}>العقود النشطة</Typography><Typography sx={{ color: "#000666", fontSize: 38, fontWeight: 900 }}>{rows.length}</Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, borderInlineStart: "4px solid #5c1800" }}><CardContent><Typography sx={{ color: "#7f8597" }}>دفعات منتظرة</Typography><Typography sx={{ color: "#000666", fontSize: 38, fontWeight: 900 }}>{paymentsExpected.toLocaleString("ar-EG")} <Typography component="span" sx={{ fontSize: 14, fontWeight: 600 }}>ج.م</Typography></Typography></CardContent></Card>
        <Card sx={{ borderRadius: 3, borderInlineStart: "4px solid #1a237e" }}><CardContent><Typography sx={{ color: "#7f8597" }}>متابعة اليوم</Typography><Typography sx={{ color: "#000666", fontSize: 38, fontWeight: 900 }}>{followUps.length}</Typography></CardContent></Card>
      </Box>

      <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#f3f3f7", display: "grid", gap: 1.2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <TextField select size="small" defaultValue="all" label="حالة العميل">
          <MenuItem value="all">الكل</MenuItem>
          <MenuItem value="active">نشط</MenuItem>
          <MenuItem value="negotiation">مفاوضات</MenuItem>
        </TextField>
        <TextField select size="small" defaultValue="all" label="نوع العقد">
          <MenuItem value="all">الكل</MenuItem>
          <MenuItem value="residential">سكني</MenuItem>
          <MenuItem value="commercial">تجاري</MenuItem>
        </TextField>
        <TextField select size="small" defaultValue="all" label="المشروع">
          <MenuItem value="all">جميع المشاريع</MenuItem>
          <MenuItem value="a">برج الجوهرة</MenuItem>
          <MenuItem value="b">مجمع الروابي</MenuItem>
        </TextField>
        <Button startIcon={<FilterListIcon />} sx={{ bgcolor: "#eef0f6", color: "#000666", fontWeight: 800 }}>تصفية</Button>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", xl: "1.8fr 1fr" } }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ overflowX: "auto" }}>
              <Box component="table" sx={{ width: "100%", minWidth: 760, borderCollapse: "collapse", textAlign: "right" }}>
                <Box component="thead" sx={{ bgcolor: "#f8f9fc", color: "#7f8597", fontSize: 12 }}>
                  <Box component="tr">
                    {["العميل", "المشروع / الحالة", "التعاقد", "المسدد", ""].map((head) => (
                      <Box key={head} component="th" sx={{ p: 2, textAlign: "right", fontWeight: 800 }}>{head}</Box>
                    ))}
                  </Box>
                </Box>
                <Box component="tbody">
                  {rows.map((client, idx) => {
                    const contract = 120000 + idx * 45000;
                    const paidPct = Math.min(100, 18 + idx * 13);
                    return (
                      <Box key={client.id || `${client.name}-${idx}`} component="tr" sx={{ borderBottom: "1px solid #f1f3f8" }}>
                        <Box component="td" sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Avatar sx={{ bgcolor: idx % 2 === 0 ? "#e7ecff" : "#ffe8d7", color: "#000666", fontWeight: 900 }}>{String(client.name || "ع").slice(0, 1)}</Avatar>
                            <Box>
                              <Typography sx={{ color: "#000666", fontWeight: 800 }}>{client.name}</Typography>
                              <Typography sx={{ fontSize: 12, color: "#9aa1b6" }}>{client.phone}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box component="td" sx={{ p: 2 }}>
                          <Typography sx={{ color: "#000666", fontWeight: 700 }}>{client.address || "-"}</Typography>
                          <Chip size="small" label={idx % 3 === 0 ? "نشط" : idx % 3 === 1 ? "مفاوضات" : "متأخر"} sx={{ mt: 0.5, bgcolor: idx % 3 === 0 ? "#e8f8ef" : idx % 3 === 1 ? "#fff1e2" : "#ffebee" }} />
                        </Box>
                        <Box component="td" sx={{ p: 2, fontWeight: 900, color: "#000666" }}>{contract.toLocaleString("ar-EG")} ج.م</Box>
                        <Box component="td" sx={{ p: 2, minWidth: 180 }}>
                          <LinearProgress variant="determinate" value={paidPct} sx={{ height: 6, borderRadius: 999, bgcolor: "#ebedf4", "& .MuiLinearProgress-bar": { bgcolor: "#000666" } }} />
                          <Typography sx={{ mt: 0.8, fontSize: 11, color: "#000666", fontWeight: 800 }}>{paidPct}%</Typography>
                        </Box>
                        <Box component="td" sx={{ p: 2, textAlign: "left" }}><Button size="small"><MoreVertIcon /></Button></Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: "#000666", fontWeight: 900, fontSize: 22, mb: 1.6, display: "flex", alignItems: "center", gap: 1 }}><TimelineIcon sx={{ color: "#964900" }} />سجل المتابعة القادمة</Typography>
              <Stack spacing={1.4}>
                {followUps.map((item) => (
                  <Box key={`${item.title}-${item.time}`} sx={{ p: 1.6, borderRadius: 2, bgcolor: "#fafbff", borderInlineStart: `3px solid ${item.tone}` }}>
                    <Typography sx={{ fontSize: 11, color: item.tone, fontWeight: 800 }}>{item.time}</Typography>
                    <Typography sx={{ color: "#000666", fontWeight: 800, mt: 0.5 }}>{item.title}</Typography>
                    <Typography sx={{ color: "#7f8597", fontSize: 12, mt: 0.5 }}>{item.note}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "#1a237e", color: "white" }}>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>تحليل أداء المبيعات</Typography>
              <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.85)", fontSize: 13 }}>تم تحقيق 85% من المستهدف الشهري. تحتاج إلى 3 تعاقدات إضافية لإغلاق الهدف.</Typography>
              <Box sx={{ mt: 1.8, bgcolor: "rgba(255,255,255,0.2)", height: 8, borderRadius: 999, overflow: "hidden" }}>
                <Box sx={{ width: "85%", height: "100%", bgcolor: "#fc820c" }} />
              </Box>
              <Button sx={{ mt: 1.4, color: "white", p: 0, fontWeight: 800 }}>عرض التقرير التفصيلي</Button>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
