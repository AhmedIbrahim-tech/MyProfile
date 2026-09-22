import type { BlogPost } from '@/modules/blog/types';
import architectureVsDebtImage from '@/assets/blog/architecture-vs-technical-debt.jpg';

export const post: BlogPost = {
  id: 7,
  title: 'Frontend Architecture & Technical Debt',
  excerpt:
    'ليه بعض المشاريع بتكبر بسهولة ومشاريع تانية كل Feature فيها بتبقى معركة؟ نظرة عميقة على Frontend Architecture، تنظيم المسؤوليات، ومخاطر الديون المعمارية.',
  content: `# 🏗️ Frontend Architecture & Technical Debt

## ليه بعض المشاريع تكبر بسهولة… ومشاريع تانية كل Feature فيها بتبقى معركة؟

في بداية أي Frontend Project، أغلب التركيز بيكون على:

* الـ UI
* الـ Components
* الـ APIs
* والـ Features اللي لازم تخلص بسرعة

وده طبيعي.

لكن بعد شهور تبدأ تسمع جمل زي:

> "متلمسش الـ Component ده عشان بيكسر حاجات غريبة."

أو:

> "إضافة Feature دي محتاجة تعديل في 12 ملف."

أو الأسوأ:

> "مش عارف الـ State دي جاية منين أصلًا."

هنا المشكلة غالبًا مش React أو Angular أو Vue.

المشكلة اسمها:

# Architecture Debt

وهي جزء من:

**Technical Debt**

---

# أولًا: يعني إيه Frontend Architecture؟

ناس كتير أول ما تسمع Architecture تفكر في:

\`\`\`text
components/
pages/
services/
utils/
hooks/
\`\`\`

لكن ده:

**Folder Structure**

مش Architecture كاملة.

الـ Architecture الحقيقية بتجاوب على أسئلة أعمق:

* مين مسؤول عن الـ Business Logic؟
* مين مسموح له يكلم الـ API؟
* فين الـ State؟
* إيه اللي ينفع يعتمد على إيه؟
* إزاي Features تتواصل مع بعض؟
* لو غيرنا UI Library، إيه اللي هيتكسر؟
* لو الـ API تغيرت، كام جزء في المشروع هيتأثر؟
* هل Feature معينة ممكن تتفهم وتُختبر لوحدها؟

بمعنى أبسط:

> **Architecture = تنظيم المسؤوليات والعلاقات بين أجزاء النظام.**

مش مجرد تنظيم الملفات.

---

# المشكلة الحقيقية: Coupling

تخيل Component مسؤول عن:

\`\`\`text
Rendering UI
+
Calling API
+
Validation
+
Business Rules
+
State Management
+
Error Handling
+
Navigation
\`\`\`

مثال:

\`\`\`tsx
function CheckoutPage() {
  // fetch cart

  // calculate discount

  // validate coupon

  // call payment API

  // update global state

  // show toast

  // redirect user

  return (...);
}
\`\`\`

الكود ممكن يشتغل.

لكن الـ Component هنا أصبح يعرف تفاصيل كثيرة جدًا.

كل تغيير في:

* Payment
* Discount
* API
* Routing

ممكن يجبرك تعدل نفس المكان.

وده مثال واضح على:

# Tight Coupling

---

# Separation of Concerns

واحدة من أهم أفكار أي Architecture جيدة هي:

**كل جزء يكون مسؤول عن حاجة واضحة.**

مثلًا:

\`\`\`text
UI
↓
Application / Feature Logic
↓
Data Access
↓
API
\`\`\`

بدل:

\`\`\`text
UI
↓
Everything 😅
\`\`\`

مثلًا:

\`\`\`tsx
function CheckoutPage() {
  const checkout = useCheckout();

  return (
    <CheckoutView
      state={checkout.state}
      onSubmit={checkout.submit}
    />
  );
}
\`\`\`

والـ Logic يبقى في مكان منفصل:

\`\`\`ts
function useCheckout() {
   // orchestration
}
\`\`\`

والـ API في:

\`\`\`text
checkoutService.ts
\`\`\`

الهدف مش زيادة Layers.

الهدف:

**منع التفاصيل المختلفة من الالتصاق ببعض.**

---

# أهم Dependency Rule

في المشاريع الكبيرة حاول تخلي الـ Dependencies تتحرك في اتجاه واضح.

مثال:

\`\`\`text
UI
↓
Feature Logic
↓
Domain / Business Rules
↓
Data Abstractions
\`\`\`

مش:

\`\`\`text
Domain Logic
↓
React Component
\`\`\`

لأن Business Rules المفروض متبقاش مرتبطة بتفاصيل Rendering.

---

# مثال

عندك Rule:

> العميل Premium يحصل على 15% Discount لو قيمة الـ Order تجاوزت 1000.

مش الأفضل تحطها هنا:

\`\`\`tsx
<ProductCard />
\`\`\`

الأفضل يكون عندك:

\`\`\`ts
calculateDiscount(customer, order)
\`\`\`

لأن نفس الـ Rule ممكن تحتاجها في:

* Checkout
* Cart
* Admin Panel
* Tests

---

# مستويات تنظيم Frontend Project

مفيش Structure واحدة مناسبة لكل المشاريع.

وده أهم شيء.

---

# 1️⃣ Small Project — Simple Structure

في مشروع صغير:

\`\`\`text
src/

components/
pages/
hooks/
services/
utils/
\`\`\`

ده ممكن يكون كافي جدًا.

مناسب مثلًا لـ:

* Landing Page
* Small Dashboard
* MVP

المشكلة مش في البساطة.

المشكلة لما المشروع يكبر وأنت تفضل تستخدم نفس التنظيم بدون حدود واضحة.

---

# 2️⃣ Feature-Based Architecture

مع زيادة الـ Features، تنظيم الكود حسب نوع الملف يبدأ يسبب مشكلة.

بدل:

\`\`\`text
components/
services/
hooks/
types/
\`\`\`

ممكن تعمل:

\`\`\`text
features/

  auth/
    components/
    hooks/
    api/
    types/

  products/
    components/
    hooks/
    api/
    types/

  checkout/
    components/
    hooks/
    api/
    types/
\`\`\`

الميزة هنا:

كل Feature موجودة في مكان واحد.

وده يقلل:

* التنقل بين Folders
* الـ Coupling
* صعوبة فهم المشروع

---

# مثال

بدل ما ملفات الـ Checkout تكون موزعة:

\`\`\`text
components/CheckoutForm.tsx

services/checkoutService.ts

hooks/useCheckout.ts

types/checkout.ts
\`\`\`

تبقى:

\`\`\`text
features/checkout/

  CheckoutForm.tsx
  useCheckout.ts
  checkout.api.ts
  checkout.types.ts
\`\`\`

أوضح بكتير.

---

# 3️⃣ Vertical Slice / Feature Modules

في المشاريع الأكبر، كل Feature ممكن تبقى Module شبه مستقل.

مثلًا:

\`\`\`text
features/

  orders/

    domain/
    application/
    api/
    ui/
\`\`\`

يعني الـ Order Feature فيها:

\`\`\`text
UI
Business Logic
Data Access
Tests
\`\`\`

داخل نفس الـ Boundary.

وده يخلي Team معين يقدر يمتلك Feature كاملة بدون ما يدخل في عشرات أجزاء المشروع.

---

# 4️⃣ Modular Frontend

لما المشروع يكبر أكتر، ممكن تقسم التطبيق إلى Modules واضحة:

\`\`\`text
Auth
Orders
Payments
Inventory
Reports
\`\`\`

كل Module له Public API واضح.

مثلًا:

\`\`\`text
Orders Module

exports:
- OrderList
- useOrders
- OrderRoutes
\`\`\`

لكن ماينفعش أي Module يدخل جواه مباشرة ويستخدم Internal Files.

لأن لو كل Module يعرف تفاصيل التاني:

أنت عمليًا معندكش Modules.

عندك:

**Folders شكلها منظم فقط.**

---

# Shared Folder Trap 🚨

واحدة من أشهر المشاكل:

في البداية تعمل:

\`\`\`text
shared/
\`\`\`

وبعدين بعد سنة تلاقي:

\`\`\`text
shared/

components/
hooks/
services/
helpers/
business/
utils/
common/
common2/
final-utils/
\`\`\`

😅

الـ Shared Folder بسهولة تتحول إلى:

**مكان بنرمي فيه أي حاجة مش عارفين نحطها فين.**

الحل:

ما تحطش حاجة في Shared إلا لو فعلًا:

* Generic
* Reusable
* مالهاش Ownership لـ Feature معينة

مثال جيد:

\`\`\`text
Button
Modal
DateFormatter
HTTP Client
\`\`\`

لكن:

\`\`\`text
calculateOrderDiscount()
\`\`\`

غالبًا مش Shared.

دي ملك:

\`\`\`text
Orders / Pricing Domain
\`\`\`

---

# State Management مش Architecture

وجود:

\`\`\`text
Redux
Zustand
NgRx
Signals
Context
\`\`\`

مش معناه إن عندك Architecture.

دي Tools.

السؤال الأهم:

**إيه الـ State اللي أصلًا محتاجة تكون Global؟**

مش كل شيء يتحط في Store.

فرق بين:

\`\`\`text
Server State
UI State
Form State
Domain State
Global App State
\`\`\`

مثلًا:

Products جاية من Server.

ممكن Data Fetching Library تديرها.

لكن:

\`\`\`text
Modal isOpen
\`\`\`

دي Local UI State.

مش محتاجة Global Store.

---

# Data Access Layer

من أكثر الحاجات اللي بتسبب Coupling إن كل Component يعمل:

\`\`\`ts
fetch(...)
\`\`\`

بنفسه.

مثال:

\`\`\`tsx
function ProductsPage() {
   fetch("/api/products");
}
\`\`\`

بعدها:

\`\`\`tsx
function HomePage() {
   fetch("/api/products");
}
\`\`\`

وبعدين:

\`\`\`tsx
function SearchPage() {
   fetch("/api/products");
}
\`\`\`

لو الـ API تغير:

3 أماكن تتكسر.

الأفضل غالبًا:

\`\`\`ts
productsApi.getAll()
\`\`\`

ثم الـ UI تعتمد على abstraction أو service واضحة.

---

# DTO ≠ Domain Model

نقطة مهمة جدًا.

الـ API ممكن يرجع:

\`\`\`json
{
  "product_id": 17,
  "product_name": "Laptop",
  "price_value": 40000
}
\`\`\`

مش لازم الـ UI كلها تعرف الشكل ده.

ممكن تعمل Mapping:

\`\`\`text
API DTO

↓

Mapper

↓

Frontend Model
\`\`\`

ليه؟

عشان تغيير الـ Backend Contract ماينتشرش في التطبيق كله.

---

# Clean Architecture في Frontend

هل ينفع؟

أيوه.

لكن:

**مش لازم تستخدمها كاملة في كل مشروع.**

الفكرة المفيدة منها:

خلي الـ Business Logic أقل اعتمادًا على:

\`\`\`text
React
Angular
HTTP
Browser APIs
Libraries
\`\`\`

مثلًا:

\`\`\`text
Domain
↑
Application
↑
Infrastructure
↑
UI
\`\`\`

لو عندك Domain Complex:

* Financial App
* Booking Engine
* Pricing System

ممكن ده يكون مفيد جدًا.

لكن Landing Page؟

غالبًا Overengineering.

---

# MVVM في Frontend

MVVM مفيدة كفكرة:

\`\`\`text
View
↓
ViewModel
↓
Model
\`\`\`

في React مثلًا:

\`\`\`text
Component
↓
Custom Hook
↓
Services / Domain
\`\`\`

ممكن Custom Hook يلعب دور قريب من:

**ViewModel**

مثال:

\`\`\`ts
const {
  products,
  loading,
  error,
  search
} = useProductsPage();
\`\`\`

والـ Component يركز على Rendering.

---

# Feature-Sliced Thinking

في المشاريع الكبيرة، فكرة مهمة هي:

**Organize by business capability, not just technical type.**

يعني بدل:

\`\`\`text
controllers
services
components
hooks
\`\`\`

فكر:

\`\`\`text
auth
orders
payments
products
\`\`\`

ثم داخل كل Feature:

\`\`\`text
ui
api
model
lib
\`\`\`

وده يقلل انتشار الـ Feature على المشروع كله.

---

# طيب إيه هي Technical Debt؟

Technical Debt ببساطة:

قرار تقني يوفر عليك وقت دلوقتي…

لكن غالبًا يخليك تدفع تكلفة لاحقًا.

مثال:

بدل ما تعمل abstraction صح:

تعمل Copy/Paste لأن Deadline بكرة.

أنت كسبت ساعتين.

لكن بعد 6 شهور عندك نفس Logic في:

\`\`\`text
7 places
\`\`\`

دلوقتي أي تعديل محتاج تعديل السبعة.

دي Debt.

---

# Technical Debt مش دايمًا شيء سيئ

ودي نقطة مهمة.

أحيانًا تكون واعيًا إنك تعمل Shortcut.

مثلًا:

عندك MVP ولازم تجرب السوق.

فتقول:

> هنعمل implementation أبسط دلوقتي، ولو المنتج نجح نعيد تنظيم الجزء ده.

ده Decision منطقي.

المشكلة مش إن عندك Debt.

المشكلة:

**Debt بدون ما تعرف إنها موجودة.**

---

# Architecture Debt

نوع أخطر من Technical Debt.

لأن المشكلة مش Method وحشة.

المشكلة إن:

**Boundaries نفسها غلط.**

مثال:

\`\`\`text
UI
↓
Business Logic
↓
API Logic
↓
Global State
↓
Other Feature
\`\`\`

كلهم مربوطين ببعض.

وقتها Refactor مش هيكون:

\`\`\`text
Fix Function
\`\`\`

هيكون:

\`\`\`text
Change Architecture
\`\`\`

وده مكلف جدًا.

---

# علامات إن المشروع داخل في Technical Debt 🚨

لو بدأت تشوف الحاجات دي باستمرار:

## 1️⃣ Fear of Change

Developer يقول:

> متعدلش الملف ده.

دي علامة خطيرة.

---

## 2️⃣ Feature جديدة بتكسر Feature قديمة

غالبًا الحدود مش واضحة.

---

## 3️⃣ نفس Business Rule مكتوبة في أكتر من مكان

Duplicate Logic.

---

## 4️⃣ Components ضخمة جدًا

مثل:

\`\`\`text
2500 lines component
\`\`\`

ده غالبًا Component بيعمل أكتر من مسؤولية.

---

## 5️⃣ Circular Dependencies

\`\`\`text
Feature A → Feature B

Feature B → Feature A
\`\`\`

دي Architecture Smell واضحة.

---

## 6️⃣ كل حاجة Shared

لو كل شيء:

\`\`\`text
shared
common
global
\`\`\`

فالـ Ownership ضاعت.

---

## 7️⃣ تعديل API يكسر نص التطبيق

معناه إن الـ API Contract منتشر في كل مكان.

---

## 8️⃣ Tests صعبة جدًا

لو عشان تختبر Business Rule لازم تشغل:

\`\`\`text
Router
API
Store
Browser
React Tree
\`\`\`

فالمنطق غالبًا مربوط بالـ Framework أكتر من اللازم.

---

# كيف تقلل Technical Debt؟

مش عن طريق:

> "هنعمل Refactor للمشروع كله."

غالبًا ده مش عملي.

الأفضل:

## Step 1

حدد أكتر Areas بتتغير.

## Step 2

اعمل Boundaries واضحة.

## Step 3

افصل:

\`\`\`text
UI

Business Logic

Data Access
\`\`\`

## Step 4

Move by Feature.

بدل ما تعيد كتابة المشروع كله.

## Step 5

كل Feature جديدة التزم بالـ Architecture الجديدة.

وده أحيانًا يسمى:

**Incremental Refactoring**

---

# Architecture Decision

قبل ما تختار Architecture اسأل:

\`\`\`text
Project Size?
Team Size?
Business Complexity?
Expected Growth?
Number of Features?
Testing Needs?
Deployment Model?
\`\`\`

مش:

> الناس بتستخدم إيه دلوقتي؟

---

# مقارنة سريعة

| نوع المشروع                  | تنظيم مناسب غالبًا        |
| ---------------------------- | ------------------------- |
| Landing Page                 | Simple Structure          |
| MVP                          | Simple / Feature-Based    |
| Medium SaaS                  | Feature-Based             |
| Large SPA                    | Feature Modules           |
| Complex Business App         | Clean / Domain-oriented   |
| Multi-team Product           | Modular / Vertical Slices |
| Very Large Independent Teams | Micro Frontends أحيانًا   |

---

# وماذا عن Micro Frontends؟

Micro Frontends ممكن تكون مفيدة لما:

* عندك Teams مستقلة.
* أجزاء مختلفة لها Deployment Lifecycle مختلف.
* Ownership واضح لكل جزء.

لكنها تضيف Complexity كبيرة:

* Routing
* Shared Dependencies
* Versioning
* Communication
* Deployment

فمتستخدمهاش لأن المشروع "كبير".

استخدمها لما:

**Team & Deployment Boundaries تحتاجها فعلًا.**

---

# قاعدة مهمة جدًا

Architecture مش هدفها منع التغيير.

هدفها:

# جعل التغيير أرخص.

لو Feature جديدة تحتاج:

\`\`\`text
2 files
\`\`\`

بدل:

\`\`\`text
20 files
\`\`\`

فالـ Architecture بتساعدك.

لو تغيير API معزول داخل:

\`\`\`text
api/
\`\`\`

بدل ما يكسر 15 Component…

فالـ Architecture بتساعدك.

لو Developer جديد يقدر يعرف Feature موجودة فين في دقائق…

فالـ Architecture بتساعدك.

---

# الخلاصة 🚀

Frontend Architecture مش:

\`\`\`text
components/
hooks/
services/
utils/
\`\`\`

وبس.

هي طريقة تحدد:

* المسؤوليات
* الحدود
* اتجاه الـ Dependencies
* Ownership
* كيفية نمو المشروع

والـ Technical Debt مش مجرد:

> "الكود مش Clean."

هي:

**التكلفة اللي هتدفعها مستقبلًا بسبب قرارات بتسهل عليك الشغل اليوم.**

المشروع الصغير مش محتاج Architecture ضخمة.

والمشروع الكبير مينفعش يفضل بنفس Structure المشروع الصغير.

ابدأ بسيط.

لكن لما الـ Complexity تكبر…

خلّي الـ Architecture تكبر **معها**، مش قبلها.

لأن أفضل Architecture مش الأعقد.

أفضل Architecture هي اللي تخلي:

**التغيير أسهل، المخاطر أقل، والفريق أسرع مع مرور الوقت.** 🚀`,
  author: 'Ahmed Ibrahim',
  date: '2025-03-09',
  category: 'Frontend',
  readTime: '10 min read',
  image: architectureVsDebtImage,
};
