import type { BlogPost } from '@/types/blog';
import angularArchitectureImage from '@/assets/blog/angular-architecture.jpg';

export const post: BlogPost = {
  id: 17,
  title: 'أشهر Angular Architectural Styles لتنظيم المشاريع الكبيرة',
  excerpt:
    'Core وShared وFeatures مش فولدرات عشوائية. كل نمط Angular بيحل مشكلة مختلفة — والمهم تختار الأبسط اللي يفضل قابل للنمو.',
  content: `# أشهر Angular Architectural Styles لتنظيم المشاريع الكبيرة

لو بتشتغل بـ Angular، أكيد قابلتك فولدرات ومفاهيم زي:

\`Core\` و\`Shared\` و\`Features\` و\`Services\` و\`Guards\` و\`Interceptors\` و\`RxJS\` وState Management.

لكن السؤال الحقيقي: **ليه بنقسم المشروع بالشكل ده؟** وهل أي Angular Project لازم يكون له نفس الـ Structure؟

الإجابة: **لا.**

لكن المشاريع الكبيرة تحتاج Architecture واضحة عشان تفضل سهلة التطوير والاختبار والتوسع… وأي Developer جديد يفهمها بسرعة.

خلينا نشوف أشهر الأنماط المستخدمة في Angular.

---

## Traditional Layered Architecture

من أبسط الطرق لتنظيم مشاريع Angular. الفكرة: تقسيم المشروع حسب نوع الملفات.

\`\`\`text
src/app/
├── components/
├── services/
├── models/
├── pipes/
├── directives/
├── pages/
└── shared/
\`\`\`

يعني كل الـ Components في مكان، كل الـ Services في مكان، كل الـ Models في مكان.

**المميزات:** سهلة للبداية، مناسبة للمشاريع الصغيرة، واضحة للمطورين الجدد.

**المشكلة مع النمو:** Feature واحدة ممكن تكون موزعة في أماكن كثيرة. تعديل جزء خاص بالـ Orders يحتاج تروح \`components/\` و\`services/\` و\`models/\` و\`pipes/\`. فتبدأ المسؤوليات تختلط.

---

## Core / Shared / Feature Architecture

من أشهر الـ Structures في Angular Enterprise Applications.

\`\`\`text
src/app/
├── core/
├── shared/
├── features/
├── layouts/
├── routes/
├── app.component.ts
├── app.config.ts
└── app.routes.ts
\`\`\`

### Core

المكان الخاص بالحاجات التي توجد **مرة واحدة** في التطبيق:

\`\`\`text
core/
├── services/
├── guards/
├── interceptors/
├── auth/
└── config/
\`\`\`

أمثلة: Authentication Service، HTTP Interceptor، Global Error Handler، App Configuration.

قاعدة مهمة: أي شيء **Singleton** غالبًا مكانه هنا.

### Shared

الحاجات التي يتم استخدامها في أكثر من Feature:

\`\`\`text
shared/
├── components/
├── directives/
├── pipes/
├── ui/
└── models/
\`\`\`

مثل Button وModal وLoading Spinner وDate Pipe وReusable Table.

لكن مهم: لا تضع أي شيء هنا لمجرد أنك لا تعرف مكانه. **Shared ليست صندوق "أي حاجة".**

### Features

بدل ما نقسم حسب نوع الملف… نقسم حسب الـ Business Features:

\`\`\`text
features/
├── auth/
├── products/
├── orders/
├── customers/
└── dashboard/
\`\`\`

داخل Feature واحدة، زي Products:

\`\`\`text
features/products/
├── components/
├── pages/
├── services/
├── models/
├── store/
├── routes.ts
└── index.ts
\`\`\`

الميزة: كل ما يخص الـ Product موجود في مكان واحد. أوضح، أسهل للتطوير، مناسب للفرق الكبيرة، ويسهّل حذف أو إضافة Feature.

---

## Feature-Based Architecture

تطور طبيعي للـ Core/Shared/Feature. الفكرة: الـ Application عبارة عن Modules مستقلة حسب الـ Business.

في E-Commerce مثلًا:

\`\`\`text
features/
├── auth/
├── catalog/
├── cart/
├── checkout/
└── payment/
\`\`\`

كل Feature لها Components وServices وState وModels وRoutes.

**المميزات:** Scalable، مناسبة للفرق الكبيرة، تقلل الـ Coupling، أسهل في إضافة Features جديدة.

**العيوب:** تحتاج تخطيط جيد للـ Boundaries. وممكن يحصل تكرار لو التصميم سيئ.

---

## Smart & Presentational Components

من أشهر Patterns في Angular. الفكرة: نفصل بين من يجيب البيانات ومن يعرضها.

**Smart Components** مسؤولة عن Data Fetching وState وBusiness Logic. عادة متصلة بـ Route:

\`\`\`text
orders-page.component.ts
\`\`\`

تتعامل مع Order Service أو Store أو API.

**Presentational Components** مسؤولة عن عرض البيانات فقط:

\`\`\`typescript
@Component({
  selector: 'app-order-card',
  standalone: true,
  templateUrl: './order-card.component.html',
})
export class OrderCardComponent {
  @Input() order!: Order;
}
\`\`\`

تستقبل البيانات عبر \`@Input()\`، ولا تعرف أي شيء عن الـ API. أسهل في إعادة الاستخدام والاختبار، والـ Components تبقى أبسط.

وده نفس تدفق Angular الطبيعي في كتير من التطبيقات:

Component (UI) → Service (Business Logic) → HttpClient → Backend API.

---

## Angular Clean Architecture

نقدر نطبق مبادئ Clean Architecture داخل Angular: فصل الـ Business Rules عن تفاصيل الـ Framework.

\`\`\`text
app/
├── domain/
├── application/
├── infrastructure/
└── presentation/
\`\`\`

- **Domain:** Entities وBusiness Rules وValue Objects.
- **Application:** Use Cases وBusiness Operations زي \`CreateOrderUseCase\`.
- **Infrastructure:** التفاصيل الخارجية: HTTP وDatabase APIs وStorage.
- **Presentation:** Angular Components وTemplates وUI Logic.

**المميزات:** Business Logic مستقلة، Testing أفضل، مناسبة للأنظمة المعقدة.

**العيوب:** Code أكثر. وممكن تكون زيادة لمشروع بسيط.

---

## State Management Architecture

في Angular، إدارة الـ State لها أكثر من مستوى. مش كل State محتاج NgRx.

**Local State** داخل Component: \`signal()\` أو \`BehaviorSubject\`.

**Shared State** بين Components: Services + RxJS، أو NgRx، أو Akita، أو Elf.

**Server State** بيانات من Backend زي Users وProducts وOrders. وهنا ممكن تستخدم Signals أو RxJS أو مكتبات متخصصة.

القاعدة: ابدأ بالأقل. متدخلش Store عالمي إلا لما الـ Shared State يبقى معقّد فعلًا.

---

## NgRx Architecture

واحدة من أشهر طرق إدارة الحالة في Angular. تعتمد على Store وActions وReducers وSelectors وEffects.

\`\`\`text
orders/
├── orders.actions.ts
├── orders.reducer.ts
├── orders.effects.ts
└── orders.selectors.ts
\`\`\`

التدفق:

Action → Effect → Reducer → Selector

الفكرة: الـ Component لا يتعامل مباشرة مع الـ API. هو يرسل Action. الـ Effect يتعامل مع الـ API. الـ Reducer يحدث الـ State. والـ Selector يختار البيانات للـ UI.

**المميزات:** Predictable State Flow، مناسبة للتطبيقات الكبيرة، Debugging قوي.

**العيوب:** Boilerplate كثير، وزيادة تعقيد للمشاريع الصغيرة.

---

## Standalone Components

في Angular الحديث، لم تعد NgModules هي الطريقة الوحيدة — وفي الإصدارات الحالية غالبًا هي الخيار الافتراضي.

\`\`\`typescript
@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent {}
\`\`\`

التنظيم يصبح أكثر اعتمادًا على Components وRoutes وProviders بدل الاعتماد الكبير على NgModules. أبسط، أسهل في الـ Lazy Loading، وأكثر مرونة.

Standalone مش Architecture بديلة لوحدها. هي طريقة بناء تقدر تستخدمها فوق Core/Shared/Feature أو Feature-Based.

---

## Micro Frontends Architecture

نفس فكرة Microservices لكن للـ Frontend: نقسم تطبيق Angular كبير إلى تطبيقات مستقلة.

\`\`\`text
Enterprise App
├── Admin App
├── Customer App
├── Billing App
└── Reports App
\`\`\`

كل فريق يستطيع تطوير ونشر جزء مستقل.

**المميزات:** مناسب للـ Enterprise، فرق متعددة تعمل باستقلالية، Deployment مستقل.

**العيوب:** Infrastructure أعقد، مشاركة Components أصعب، ويحتاج تنظيم قوي. متختارهاش عشان الاسم كبير.

---

## كيف تختار Architecture مناسبة؟

لا يوجد Architecture واحدة تناسب كل المشاريع.

- **صغير:** Layered / Simple Structure + Standalone + Services.
- **متوسط:** Core / Shared / Feature.
- **كبير:** Feature-Based + State Management واضح.
- **Enterprise:** Clean Architecture + NgRx أو Micro Frontends حسب الاحتياج.

اختَر الأبسط الذي يلبي احتياجاتك الآن، ويسمح للنمو لاحقًا.

---

## أهم قواعد Angular Architecture

- لا تضع كل شيء في Shared.
- استخدم Dependency Injection بشكل صحيح.
- افصل الـ API Communication عن الـ UI.
- استخدم Lazy Loading للـ Features.
- استخدم Interceptors للتعامل مع الأخطاء وAuth والـ Headers.
- لا تضع State Management في كل شيء.
- اجعل كل Feature مسؤولة عن نفسها.
- اختر Architecture تناسب حجم المشروع، واتبع Angular Style Guide في التسمية والتنظيم.

---

## الخلاصة

الـ Architecture في Angular ليست مجرد ترتيب فولدرات. هي طريقة تفكير تحدد: أين يعيش الكود؟ من المسؤول عن ماذا؟ كيف تتواصل أجزاء التطبيق؟ وكيف سيكبر المشروع بعد سنة؟

أفضل Angular Architecture ليست الأكثر تعقيدًا. أفضل Architecture هي التي تجعل **التغيير أسهل، والفهم أسرع، والصيانة أقل تكلفة.**

لأن المعماري الجيد لا يبني للتشغيل فقط… بل يبني للتغيير.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Frontend',
  readTime: '12 min read',
  image: angularArchitectureImage,
  featured: true,
};
