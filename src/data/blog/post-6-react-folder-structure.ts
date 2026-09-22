import type { BlogPost } from '@/modules/blog/types';
import reactFolderStructureImage from '@/assets/blog/react-ts-folder-structure.jpg';

export const post: BlogPost = {
  id: 16,
  title: 'أفضل Folder Structure لمشاريع React + TypeScript',
  excerpt:
    'مش مجرد ترتيب ملفات. الـ Folder Structure جزء من الـ Architecture: بتحافظ على المشروع قابل للصيانة، وبتخلي كل Feature تعرف مكانها.',
  content: `# أفضل Folder Structure لمشاريع React + TypeScript

لما تبدأ مشروع Frontend جديد، أكتر حاجة ممكن تخلي المشروع يتحول لفوضى بعد شهرين أو ثلاثة مش قلة الخبرة في React…

لكن إن كل حاجة تتحط في مكان عشوائي.

في البداية الموضوع يبدو بسيط: "هحط الـ Components هنا، والـ API هناك، وخلاص."

لكن مع زيادة الـ Features والـ Developers يبدأ يظهر السؤال:

- الكود ده مكانه فين؟
- مين مسؤول عن الـ Logic دي؟
- هل الـ Component دي تنفع تتكرر؟
- هل الـ API Call مرتبط بأي Feature؟

عشان كده الـ Folder Structure مش مجرد ترتيب ملفات… هو جزء من **Architecture التصميم**.

---

## Structure بسيطة ومنظمة داخل src

\`\`\`text
src/
├── api/
├── assets/
├── components/
├── config/
├── features/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
├── types/
├── utils/
├── constants/
├── App.tsx
├── main.tsx
└── index.css
\`\`\`

ده Hybrid شائع: فولدرات مشتركة للـ Shared Code، وفولدر \`features\` للـ Business Modules.

خلينا نفهم كل واحد مسؤول عن إيه.

---

## 1. api

المكان المسؤول عن إعداد الاتصال بالـ Backend. مش مكان الـ Business Calls نفسها.

مثلًا:

- Axios أو Fetch instance
- Base URL
- Interceptors
- Authentication Headers
- Error Handling الموحّد

\`\`\`text
api/
├── axios.ts
└── endpoints.ts
\`\`\`

الفكرة: متكررّش إعدادات الاتصال داخل كل Service. الـ HTTP Client يتضبط مرة، والباقي يستهلكه.

---

## 2. services

هنا التعامل المباشر مع الـ API: الدوال اللي بتمثل "هنجيب Users" أو "هنعمل Order"، من غير UI.

\`\`\`text
services/
├── user.service.ts
├── product.service.ts
└── order.service.ts
\`\`\`

بدل ما تعمل \`axios.get(...)\` داخل الـ Component، خلي الـ Component يعرف: **أنا محتاج Users**. مش: أنا لازم أعرف Endpoint اسمه إيه.

لو الـ Service خاص بـ Feature واحدة فقط، الأفضل غالبًا يكون جوّه الـ Feature نفسها، مش في فولدر عام.

---

## 3. components

ده مكان الـ Shared Components اللي تتكرر في أكتر من مكان:

\`\`\`text
components/
├── Button/
├── Modal/
├── Input/
├── Table/
└── Loader/
\`\`\`

قاعدة مهمة: لو الـ Component خاص بـ Feature واحدة فقط… غالبًا مكانه مش هنا. مكانه جوّه \`features/<name>/components\`.

---

## 4. layouts

مسؤول عن الشكل العام للتطبيق: Header وSidebar وFooter وNavigation.

\`\`\`text
layouts/
├── MainLayout/
├── DashboardLayout/
└── AuthLayout/
\`\`\`

الـ Layout بيغلّف الصفحات، مش بيحمل الـ Business Logic بتاع كل صفحة.

---

## 5. pages

الصفحات الرئيسية المرتبطة بالـ Routes:

\`\`\`text
pages/
├── Home/
├── Login/
├── Profile/
└── Products/
\`\`\`

الأفضل إن الصفحة نفسها تكون بسيطة. هي بتجمع Components وFeatures، مش بتكوّن كل الـ Logic جوّه ملف واحد ضخم.

---

## 6. features — أهم جزء في المشاريع الكبيرة

بدل ما تقسم المشروع حسب **نوع الملف**:

\`\`\`text
components/
services/
hooks/
types/
\`\`\`

تقسمه حسب الـ **Business Features**:

\`\`\`text
features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── types/
│   │   └── auth.types.ts
│   ├── slice.ts
│   └── index.ts
├── products/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── slice.ts
│   └── index.ts
└── orders/
    ├── components/
    ├── services/
    ├── hooks/
    ├── types/
    ├── slice.ts
    └── index.ts
\`\`\`

الميزة: كل حاجة تخص الـ Feature موجودة مع بعض. لو عايز تحذف Feature أو تنقلها… الموضوع أسهل بكتير.

---

## 7. store

لو تستخدم Redux Toolkit أو أي Global State Management:

\`\`\`text
store/
├── store.ts
├── hooks.ts
└── slices/
\`\`\`

لكن في المشاريع الكبيرة ممكن تخلي الـ State قريب من الـ Feature:

\`\`\`text
features/auth/slice.ts
\`\`\`

وده يقلل الترابط. الـ \`store\` يبقى تجميع، مش مكان كل الـ Logic.

---

## 8. hooks

لـ Custom Hooks المشتركة:

\`\`\`text
hooks/
├── useDebounce.ts
├── usePagination.ts
└── useMediaQuery.ts
\`\`\`

أي Logic React قابل لإعادة الاستخدام عبر أكتر من Feature. أما \`useAuth\` لو مرتبط بالـ Auth فقط، مكانه الطبيعي \`features/auth/hooks\`.

---

## 9. utils

Helper Functions عامة:

\`\`\`text
utils/
├── formatDate.ts
├── currency.ts
└── validators.ts
\`\`\`

لكن خلي بالك: لو Function مرتبطة بـ Feature معينة… خليها داخل الـ Feature. متخلّيش \`utils\` سلة لكل كود مش عارف مكانه فين.

---

## 10. assets

للملفات الثابتة:

\`\`\`text
assets/
├── images/
├── icons/
├── fonts/
└── styles/
\`\`\`

---

## 11. types

مكان الـ Shared TypeScript Types:

\`\`\`text
types/
├── api.ts
├── common.ts
└── user.ts
\`\`\`

الـ Types الخاصة بـ Feature تفضل جوّه الـ Feature. هنا تحط اللي بيتشارك فعلًا.

---

## 12. routes و config و constants

\`routes\` مسؤول عن Routing:

\`\`\`text
routes/
├── router.tsx
└── protectedRoutes.tsx
\`\`\`

\`config\` لإعدادات التطبيق: env، feature flags، قيم ثابتة للاتصال مش للأعمال.

\`constants\` للـ enums والقيم المشتركة اللي مش Types وليست Helpers.

---

## طيب هل دي أفضل Structure لكل المشاريع؟

لا. وده مهم جدًا.

مشروع صغير ممكن يكون:

\`\`\`text
src/
├── components/
├── pages/
├── services/
└── utils/
\`\`\`

وكفاية جدًا.

لكن لما المشروع يكبر… غالبًا Feature-Based Architecture تكون أسهل في الصيانة.

---

## الفرق بين Folder Structure قديمة وحديثة

### تقسيم حسب النوع (Traditional)

\`\`\`text
components/
pages/
services/
utils/
assets/
\`\`\`

المشكلة:

- الملفات متفرقة
- صعب تلاقي الكود
- صعب التوسع مع الوقت
- يحصل تداخل في المسؤوليات
- كل Feature موزعة في أماكن مختلفة

### تقسيم حسب Feature

\`\`\`text
features/
├── auth/
├── products/
└── orders/
\`\`\`

الميزة:

- كل شيء خاص بالـ Feature مع بعض
- أسهل في الصيانة والتطوير
- سهل الحذف أو النقل
- مناسب للفرق الكبيرة

في الواقع العملي، كتير من المشاريع الناجحة بتخلط الاتنين: Shared folders للكود العام، و\`features\` للـ Modules.

---

## قواعد بسيطة تخلي المشروع يعيش

- اختار الـ Structure المناسبة لحجم مشروعك، مش لأكبر نظام شفت عليه مقال.
- لا تضع كل الـ Components في فولدر واحد.
- افصل الـ Business Logic عن الـ UI.
- استخدم TypeScript Types بوضوح.
- لا تجعل API Calls داخل الـ Components.
- ابدأ ببساطة، ولا تتعقد بدون سبب حقيقي.
- لا تجعل \`utils\` مكانًا لأي كود غير معروف.
- لا تعمل Global State لكل شيء.

---

## الخلاصة

الـ Folder Structure ليست مجرد شكل جميل للفولدرات. هي طريقة تخلي:

- الكود أسهل في القراءة
- الـ Features أسهل في التطوير
- الـ Bugs أسهل في التتبع
- دخول Developer جديد للمشروع أسهل

لكن أهم قاعدة: **لا تبحث عن أكثر Architecture تعقيدًا… ابحث عن أبسط Structure تحافظ على المشروع مع نموه.**

الكود المنظم اليوم يوفّر عليك وقت طويل غدًا. Clean Code يبدأ من Clean Structure.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Frontend',
  readTime: '10 min read',
  image: reactFolderStructureImage,
  featured: true,
};
