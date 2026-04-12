# Arabic ERP for Construction Finishing & Real Estate

منصة ERP عربية متكاملة لشركات التشطيبات والعقارات، تشمل:

- إدارة المشاريع
- إدارة العملاء CRM
- إدارة المقاولين والعمال
- إدارة المخازن
- إدارة الحسابات
- إدارة العقارات
- Dashboard احترافية مع رسوم بيانية

## التقنية المستخدمة

- Frontend: React + MUI + Recharts
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Deployment: Docker Compose

## تشغيل المشروع عبر Docker

```bash
docker compose up --build
```

بعد التشغيل:

- Frontend: <http://localhost:8080>
- Backend API: <http://localhost:4000/api>

## نشر الواجهة على Vercel

1. ادخل Vercel وأنشئ Project جديد من نفس الـ repository.
2. اضبط `Root Directory` على `frontend`.
3. أضف متغير البيئة التالي في إعدادات المشروع: `VITE_API_BASE_URL` = رابط الـ backend الكامل مثل `https://api.example.com/api`.
4. نفذ Deploy.

ملاحظات مهمة:

- تم إضافة ملف إعداد [frontend/vercel.json](frontend/vercel.json) لمعالجة React Router وإعادة التوجيه إلى `index.html`.
- تم إضافة ملف [frontend/.env.example](frontend/.env.example) كمرجع للمتغيرات المطلوبة.
- Vercel هنا مهيأ لنشر الواجهة الأمامية. الـ backend يحتاج استضافة API خارجية (مثل Render أو Railway أو VPS) ثم ربط رابطه في `VITE_API_BASE_URL`.

## بيانات الدخول

- مدير النظام: `admin@erp.local` / `Admin@123`
- مدير المشاريع: `pm@erp.local` / `Admin@123`
- المحاسب: `accountant@erp.local` / `Account@123`
- المهندس: `engineer@erp.local` / `Engineer@123`
- المشاهد فقط: `viewer@erp.local` / `Viewer@123`

## إدارة Demo Data

من الواجهة العلوية:

- زر إعادة تحميل بيانات التجربة
- زر حذف بيانات التجربة
- فلترة عرض البيانات: Demo Data / Real Data / الكل

## أمثلة البيانات التجريبية

- المشاريع: مشروع فيلا التجمع الخامس، مشروع شقة 3 غرف في مدينة نصر، مشروع محل تجاري في وسط البلد
- العملاء: أحمد محمد، محمد علي، سارة أحمد، كريم حسن، ندى إبراهيم
- الخامات: أسمنت، طوب، دهانات، سيراميك، مواسير
- العمال والمقاولين: 5 مقاولين + 10 عمال
- بيانات مالية وفواتير وأرباح لكل مشروع
