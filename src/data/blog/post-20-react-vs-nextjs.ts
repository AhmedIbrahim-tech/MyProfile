import type { BlogPost } from '@/modules/blog/types';
import reactVsNextImage from '@/assets/blog/react-vs-nextjs.jpg';

export const post: BlogPost = {
  id: 9,
  title: 'React vs Next.js: Which to Choose?',
  excerpt:
    'مش منافسة. Next.js مبني فوق React. React بتبني الـ UI بحرية، وNext.js بيضيف Routing وRendering وSEO. الاختيار حسب المشروع مش حسب الترند.',
  content: `# React vs Next.js — الفرق الحقيقي ومتى تختار كل واحد؟

من أكثر الأسئلة المنتشرة عند Frontend Developers: أتعلم React فقط؟ أم أبدأ مباشرة بـ Next.js؟

والإجابة ليست "واحد أفضل من الآخر." لأن React وNext.js ليسا منافسين بالمعنى التقليدي.

الحقيقة: **Next.js مبني فوق React.** React هي الأساس. وNext.js يضيف حولها Routing وRendering Strategies وServer Features وPerformance Optimizations وProject Structure.

Same foundation. Different goals. React gives you the tools to build UI. Next.js gives you a complete framework.

---

## ما هي React؟

React هي **JavaScript Library لبناء User Interfaces**. فكرتها الأساسية: تقسيم الواجهة إلى Components.

\`\`\`jsx
function Button() {
  return <button>Save</button>;
}
\`\`\`

كل Component مسؤول عن جزء من الـ UI. React تهتم بـ Components وState Management وUI Updates.

لكنها لا تفرض عليك طريقة Routing ولا Fetching Data ولا Folder Structure ولا Backend Architecture.

في React أنت قد تحتاج تختار:

- Routing: React Router
- State: Redux أو Zustand أو Context API
- Data Fetching: Axios أو React Query أو Fetch

وهذا يعطيك مرونة كبيرة. لكن يحتاج قرارات أكثر.

---

## ما هو Next.js؟

Next.js هو **React Framework**. يأخذ React ويضيف طبقة كاملة حولها: File-based Routing وServer Rendering وAPI Routes وServer Components وImage Optimization وMetadata Handling.

بدل أن تبدأ مشروع React وتختار كل شيء، Next.js يعطيك Structure جاهز. Convention over Configuration.

Routing في React:

\`\`\`jsx
<Route path="/products" />
\`\`\`

في Next.js تنشئ \`app/products/page.tsx\` والصفحة تصبح \`/products\` تلقائيًا.

---

## الفرق الأكبر: أين يتم تنفيذ الكود؟

### React التقليدية غالبًا Client-Side Rendering

\`\`\`text
Browser
    ↓
HTML بسيط (<div id="root"></div>)
    ↓
Download JavaScript
    ↓
React builds UI
    ↓
Display Page
\`\`\`

ممتاز لـ Dashboards وAdmin Panels وInternal Tools. لكن التحميل الأولي أكبر، وJavaScript أكتر، وSEO أصعب في بعض الحالات.

---

## Next.js يقدم أكثر من طريقة Rendering

**SSR — Server-Side Rendering:** الصفحة تُبنى على السيرفر مع كل Request. المستخدم يستلم HTML جاهز. مفيد لـ E-commerce وNews وMarketing.

**SSG — Static Site Generation:** الصفحات تُبنى وقت الـ Build. سريعة جدًا، وضغط أقل على السيرفر. مثالية للـ Blogs والمحتوى الثابت.

**ISR — Incremental Static Regeneration:** الصفحات Static، لكن تقدر تتحدث بعد فترة من غير إعادة بناء الموقع كله. مثال: سعر منتج اتغيّر.

**Server Components:** بعض الـ Components تشتغل على السيرفر مش في المتصفح. JavaScript أقل في الـ Browser، ووصول مباشر للبيانات، وPerformance أفضل في حالات كتير.

---

## SEO: هل React سيئة؟

ليس بالضرورة. React يمكن استخدامها مع SEO جيد باستخدام حلول مختلفة.

لكن في التطبيقات التي تعتمد على CSR فقط، محركات البحث تحتاج تنفيذ JavaScript لرؤية المحتوى. أما Next.js فيسهل إرسال HTML جاهز. لذلك Next.js غالبًا أسهل للمواقع التي تعتمد على SEO.

---

## Data Fetching

في React الطلب غالبًا يحدث في المتصفح:

\`\`\`javascript
useEffect(() => {
  fetch('/api/products');
}, []);
\`\`\`

في Next.js تقدر تجيب البيانات على السيرفر:

\`\`\`javascript
async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
\`\`\`

السؤال: هل البيانات تحتاج أن تصل للمستخدم جاهزة؟ أم يمكن جلبها بعد تحميل الصفحة؟

---

## Architecture Difference

**React Application** — أنت تصمم الـ Architecture. حرية أكبر، وقرارات أكتر:

\`\`\`text
src/
├── components/
├── pages/
├── hooks/
├── services/
├── store/
└── utils/
\`\`\`

**Next.js (App Router)** — Structure مقترح. File-based routing، Setup أقل، إنتاجية أعلى:

\`\`\`text
app/
├── layout.tsx
├── products/
│   └── page.tsx
├── api/
└── components/
\`\`\`

---

## أمثلة واقعية

**Admin Dashboard:** جدول مستخدمين وCharts وForms ونظام داخلي. هل تحتاج SEO؟ لا. غالبًا React كافية جدًا.

**متجر إلكتروني:** صفحات منتجات وGoogle Search ومشاركة روابط. هنا Next.js غالبًا مناسب لأن SEO وPerformance مهمان.

**SaaS Application:** CRM أو Project Management. ممكن React جوّه التطبيق، أو Next.js لو عايز Marketing Website وDashboard وAPI وAuthentication في مشروع واحد.

---

## هل Next.js يغني عن Backend؟

ليس تمامًا. نعم يوجد API Routes، لكن هذا لا يعني أنه بديل دائمًا عن Backend كامل.

في الأنظمة الكبيرة قد يكون لديك:

\`\`\`text
Next.js → ASP.NET Core API → Database
\`\`\`

أو:

\`\`\`text
Next.js → Node API → Database
\`\`\`

حسب الـ Architecture.

---

## أخطاء شائعة

- **Next.js أفضل دائمًا.** لا. لو عندك Dashboard بسيطة، ممكن تضيف تعقيدًا بدون فائدة.
- **React انتهت بسبب Next.js.** غير صحيح. Next.js مبني على React. فهم React أساس مهم.
- **SSR يحل كل مشاكل الأداء.** ليس دائمًا. الأداء يعتمد على Database وAPI وNetwork وImages وCaching.

---

## ماذا أتعلم أولًا؟

أفضل طريق:

\`\`\`text
JavaScript
    ↓
React Fundamentals
    ↓
Components / State / Hooks
    ↓
Routing
    ↓
Next.js
\`\`\`

لأن Next.js يخفي تفاصيل كثيرة لو لم تفهم React جيدًا. Learn React to understand the foundation. Use Next.js when you need the full power.

---

## مقارنة سريعة

- **النوع:** React Library. Next.js Framework.
- **Routing:** في React تحتاج إضافة. في Next.js Built-in.
- **Rendering:** React غالبًا CSR. Next.js: CSR + SSR + SSG + ISR + Server Components.
- **SEO:** React يحتاج اهتمام. Next.js أسهل.
- **Structure:** React حرية أكبر. Next.js Convention.
- **Flexibility:** React أعلى. Next.js أقل لكن منظم.
- **Server Features:** في React محدودة. في Next.js موجودة.

---

## الخلاصة

React وNext.js ليسا اختيارين متنافسين.

React تعطيك **حرية بناء الواجهة بالطريقة التي تريدها.** Next.js يعطيك **نظام كامل حول React مع حلول جاهزة للأداء والتنظيم والـ SEO.**

اختيارك يعتمد على نوع المشروع:

- Dashboard / Internal App → React غالبًا كافية.
- E-commerce / Content / SEO → Next.js غالبًا مناسب.
- Large SaaS → الاثنين ممكن حسب الـ Architecture.

الأهم: لا تتعلم Next.js كبديل عن React. تعلم React كقاعدة… ثم استخدم Next.js عندما تحتاج القوة الإضافية.

Right tool. Right project. Better results.`,
  author: 'Ahmed Ibrahim',
  date: '2025-03-09',
  category: 'Frontend',
  readTime: '10 min read',
  image: reactVsNextImage,
};
