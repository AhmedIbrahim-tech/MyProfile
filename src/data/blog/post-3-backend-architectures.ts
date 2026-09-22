import type { BlogPost } from '@/modules/blog/types';
import backendArchitecturesImage from '@/assets/blog/backend-architectures.jpg';

export const post: BlogPost = {
  id: 3,
  title: 'أشهر Architectural Styles في الـ Backend',
  excerpt:
    'Layered وClean وVertical Slice وMicroservices مش بدائل لبعض. كل واحدة بتحل مشكلة مختلفة. الخريطة دي توضح الفرق، وإمتى تستخدم كل واحدة في .NET.',
  content: `# أشهر Architectural Styles في الـ Backend

لو بتتعلم Backend — وخصوصًا مع \`.NET\` — أكيد قابلتك أسماء زي:

- Layered Architecture
- Clean Architecture
- Vertical Slice
- Onion Architecture
- Hexagonal Architecture
- Modular Monolith
- Microservices
- Event-Driven Architecture
- CQRS
- DDD

والمشكلة إنك ممكن تحفظ شكل كل واحدة… لكن تفضل مش عارف:

**إيه الفرق بينهم؟ وإمتى تستخدم كل واحدة؟ وهل أصلًا كلهم بدائل لبعض؟**

والإجابة الأخيرة مهمة جدًا: **لأ.**

لأن المصطلحات دي مش كلها بتحل نفس المشكلة.

- بعضها بينظم الـ Dependencies داخل التطبيق.
- بعضها بينظم الـ Features.
- بعضها بيحدد حدود الـ Deployment.
- بعضها بيتعامل مع طريقة التواصل بين أجزاء الـ System.
- وبعضها مجرد Pattern تقدر تستخدمه داخل Architecture أكبر.

خلينا نفك الصورة واحدة واحدة.

---

## Layered Architecture

من أبسط وأشهر طرق تنظيم الـ Backend. الفكرة إنك تقسم التطبيق حسب المسؤوليات:

\`Presentation → Business Logic → Data Access → Database\`

وفي تطبيق ASP.NET Core تقليدي ممكن تشوف:

- Controllers
- Services
- Repositories
- Entities

الفكرة هنا إن كل Layer يكون عندها Responsibility واضحة.

- سهلة في الفهم والبداية
- Separation of Concerns واضح
- مناسبة جدًا لكثير من CRUD Applications

لكن مع نمو المشروع ممكن تبدأ المشكلة تظهر: الـ Business Layer تعتمد بشكل كبير على Data Access Layer، والـ Dependencies تتحرك من فوق لتحت.

وساعتها تغيير Infrastructure أو اختبار الـ Business Logic بمعزل عنها ممكن يصبح أصعب.

---

## Clean Architecture

هنا السؤال مش بس: **هنقسم الملفات إزاي؟**

لكن: **مين مسموح له يعتمد على مين؟**

الفكرة الأساسية إن الـ Business Rules والـ Application Core يكونوا في الداخل، والتفاصيل الخارجية تعتمد عليهم وليس العكس.

ممكن تلاقي تقسيم مثل:

- Domain
- Application
- Infrastructure
- Presentation

والـ Dependency Direction تتجه للداخل. يعني الـ Domain نفسه مايبقاش محتاج يعرف إنك بتستخدم EF Core أو SQL Server أو ASP.NET Core أو RabbitMQ أو External APIs. التفاصيل دي تبقى في الطبقات الخارجية.

- Testability أعلى
- فصل أقوى بين الـ Business Logic والـ Infrastructure
- تغيير التفاصيل الخارجية أسهل نسبيًا

لكن:

- Structure أكبر
- Abstractions أكتر
- ممكن تتحول لـ Overengineering لو المشروع بسيط جدًا

---

## Onion Architecture

Onion Architecture قريبة جدًا في روحها من Clean Architecture.

الـ Domain موجود في قلب الـ System، والـ Layers الخارجية تعتمد على اللي بداخلها.

يعني بدل ما الـ Business Logic تقول: "أنا محتاجة EF Core" — هي تقول: "أنا محتاجة Interface تحقق لي الوظيفة دي". والـ Infrastructure هي اللي توفر الـ Implementation.

الهدف الأساسي: **خلي الـ Business Rules مستقلة عن التفاصيل الخارجية.**

---

## Hexagonal Architecture — Ports & Adapters

نفس العائلة تقريبًا، لكن هنا طريقة التفكير مختلفة شوية.

بدل ما تفكر في Layers، فكر في: **Application Core + Ports + Adapters**

الـ Port هو Contract يحدد إزاي العالم الخارجي يتعامل مع التطبيق أو التطبيق يتعامل مع العالم الخارجي. والـ Adapter هو Implementation للتفصيلة دي.

مثلًا:

\`Application → IProductRepository → EF Core Adapter\`

أو:

\`Application → IPaymentGateway → Stripe Adapter\`

وبالتالي لو غيرت EF Core أو Payment Provider، الهدف إن الـ Business Logic نفسها ما تحتاجش تعرف تفاصيل التغيير.

النقطة المهمة: Clean وOnion وHexagonal مش ثلاث أفكار متعارضة لازم تختار واحدة منهم بحرفية. فيهم overlap كبير جدًا، وكلهم تقريبًا بيحاولوا يحافظوا على الـ Core بعيد عن Infrastructure Details.

---

## Vertical Slice Architecture

هنا بنغير محور التنظيم نفسه.

بدل ما المشروع يتقسم حسب نوع الملفات (Controllers، Services، Repositories، Validators، DTOs) نقسمه حسب الـ Use Cases أو الـ Features.

مثلًا \`CreateOrder\` وجواه كل ما يحتاجه الـ Use Case:

- Endpoint
- Command
- Handler
- Validator
- Data Access Logic

وفي Slice تانية \`CancelOrder\`، وفي Slice تالتة \`GetOrderDetails\`.

كل Feature تبقى قريبة من الكود الخاص بيها بدل ما تكون موزعة على 5 فولدرات مختلفة.

- Feature-oriented
- التغييرات المتعلقة بالـ Feature غالبًا تبقى Localized
- مناسب جدًا للـ APIs اللي فيها Use Cases كثيرة
- ينسجم بشكل طبيعي مع Commands وQueries

لكن:

- محتاج تغيير في طريقة التفكير
- ممكن يحصل Duplication بين الـ Slices
- لو الحدود سيئة ممكن كل Slice تتحول لفوضى مستقلة

ومهم: **Vertical Slice مش معناها إنك لازم تستخدم MediatR أو CQRS.** دي Implementation Choices، مش تعريف الـ Architecture نفسها.

---

## Modular Monolith

واحدة من أهم الاختيارات اللي أحيانًا بتتاخد أقل من حقها.

مش كل System كبير محتاج يبدأ Microservices. ممكن يكون عندك Application واحدة وDeployment واحدة… لكن داخليًا مقسمة إلى Modules مستقلة بحدود واضحة.

مثلًا:

- Identity
- Catalog
- Orders
- Payments
- Inventory

كل Module مسؤول عن Business Capability محددة، ويفضل إن التواصل والـ Data Ownership بينهم يبقوا واضحين.

النتيجة؟ أنت لسه عندك بساطة الـ Monolith في الـ Deployment والتشغيل… لكن بدون ما كل أجزاء الـ System تبقى ماسكة في بعض.

وده كمان ممكن يخلي فصل Module إلى Microservice مستقبلًا أسهل **لو ظهر سبب حقيقي للفصل**.

---

## Microservices Architecture

هنا حدود الـ Modules ما بقتش مجرد حدود داخل الكود. بقت Services مستقلة.

في E-Commerce مثلًا:

- Order Service
- Payment Service
- Inventory Service
- Identity Service

والفكرة الأساسية إن كل Service تمثل Business Capability واضحة، ويمكن تطويرها ونشرها وتوسيعها بشكل مستقل بدرجات مختلفة حسب التصميم.

- Independent Deployment
- Independent Scaling
- Stronger Service Boundaries
- ممكن فرق مختلفة تمتلك Services مختلفة

لكن هنا أنت دخلت عالم الـ Distributed Systems. يعني لازم تتعامل مع:

- Network Failures
- Retries
- Timeouts
- Distributed Tracing
- Observability
- Message Delivery
- Data Consistency
- Deployment Complexity

وعشان كده: **Microservices مش Upgrade طبيعي لأي Monolith.** هي Trade-off. بتحل مشاكل معينة… وفي المقابل بتضيف مشاكل جديدة.

---

## Event-Driven Architecture

بدل ما Component تقول للتانية بشكل مباشر "نفذي الأمر ده دلوقتي"، ممكن Component تعلن \`OrderCreated\` وباقي الـ Components المهتمة بالحدث تتفاعل معاه.

مثلًا:

- Payment يبدأ عملية الدفع.
- Inventory يحجز المنتجات.
- Notification يرسل Confirmation.

وغالبًا في Distributed Systems بيكون فيه Messaging Infrastructure زي RabbitMQ أو Kafka أو Azure Service Bus.

الميزة الأساسية هي تقليل الـ Direct Coupling ودعم الـ Asynchronous Processing.

لكن المقابل:

- Eventual Consistency
- Retry & Duplicate Handling
- Debugging أصعب
- محتاج Observability قوية
- لازم تفكر في Idempotency

وفي الأنظمة الحقيقية، مجرد إنك بعت Event مش معناه إن المهمة خلصت. لازم تسأل:

- ماذا لو الرسالة وصلت مرتين؟
- ماذا لو Consumer وقع؟
- ماذا لو Database اتحدثت لكن نشر الـ Event فشل؟

وهنا تبدأ Patterns تانية تظهر زي Transactional Outbox.

---

## CQRS

CQRS مش Architecture كاملة لوحدها. هو Pattern بيقول: **افصل مسؤولية تغيير الـ State عن مسؤولية قراءة الـ Data.**

Commands:

- \`CreateOrder\`
- \`CancelOrder\`
- \`UpdateProduct\`

Queries:

- \`GetOrderById\`
- \`SearchProducts\`

الـ Write Model يركز على Business Rules والتغييرات. والـ Read Model ممكن يتصمم بشكل مناسب للقراءة والعرض.

ومهم جدًا: **CQRS مش معناها إنك لازم تستخدم Databases منفصلة.** ممكن الـ Read وWrite Models يستخدموا نفس الـ Database.

وفي أنظمة أكبر ممكن يكون لكل جانب Data Model أو Data Store مختلف، وساعتها تظهر تحديات Synchronization وEventual Consistency.

- مفيد لما Reads وWrites لهم احتياجات مختلفة
- مناسب للـ Complex Business Logic
- يسمح بOptimization مستقل للقراءة والكتابة

لكن:

- Complexity أكبر
- Code أكتر
- مش مفيد لو عندك CRUD بسيط

وكمان: **CQRS مش لازم Microservices.** ممكن تستخدمه داخل Monolith، أو Modular Monolith، أو مع Vertical Slice.

---

## Domain-Driven Design — DDD

ودي نقطة ناس كتير بتتلخبط فيها: **DDD مش Folder Structure.** ومش معناها إنك عملت فولدر \`Domain\` يبقى أنت بتطبق DDD.

DDD هي Approach لتصميم الـ Software حول الـ Business Domain نفسه، خصوصًا لما الـ Business Rules تكون معقدة.

ومن مفاهيمها:

- Ubiquitous Language
- Bounded Contexts
- Entities
- Value Objects
- Aggregates
- Domain Services
- Domain Events

ومن أهم أفكار DDD إن حدود الـ Software تعكس حدود الـ Business نفسها. يعني بدل ما الـ Developers يتكلموا بلغة والكلام التجاري بلغة مختلفة… يبقى فيه Shared Language بين الـ Developers والـ Domain Experts.

---

## إيه العلاقة بين كل ده؟

دي أهم نقطة في الموضوع كله.

مش لازم تختار اسم واحد من القائمة وتبني عليه الـ System كله.

ممكن جدًا تعمل **Modular Monolith** وتقسمه إلى Orders وPayments وInventory، وبداخل كل Module تستخدم مبادئ **Clean / Onion / Hexagonal** لتفصل الـ Business Logic عن Infrastructure، وتنظم الـ Use Cases باستخدام **Vertical Slices**، وفي أجزاء معينة فقط تستخدم **CQRS**، ولو Modules محتاجة تتواصل Asynchronously تستخدم **Events**، ولو عندك Domain معقد تستخدم **DDD**.

وبعد فترة، لو Module معينة أصبح عندها سبب فعلي لـ Independent Deployment أو Independent Scaling أو Independent Team Ownership، ممكن وقتها تفصلها إلى **Microservice**.

الـ Architectures والـ Patterns دي مش Pokémon لازم تختار واحد بس منهم. هي أدوات ممكن تكمل بعضها.

---

## طب أختار إزاي؟

ابدأ من المشكلة، مش من اسم الـ Architecture.

- لو التطبيق CRUD بسيط، Architecture بسيطة غالبًا أفضل.
- لو المشكلة هي Dependencies معقدة، فكر في Clean / Onion / Hexagonal.
- لو المشكلة إن الـ Features متوزعة في عشرات الـ Layers، Vertical Slice ممكن تساعد.
- لو الـ System كبير لكنك مش محتاج Distributed System، Modular Monolith يستحق التفكير بجدية.
- لو عندك Boundaries واضحة وتحتاج Independent Deployment أو Scaling، Microservices ممكن تكون مناسبة.
- لو عندك أجزاء محتاجة تتفاعل Asynchronously، Event-Driven Architecture ممكن تدخل في الصورة.
- لو Reads وWrites عندهم احتياجات مختلفة فعلًا، CQRS قد يكون مفيد.
- ولو أصعب جزء في المشروع هو الـ Business Domain نفسه، ساعتها DDD يصبح مهم جدًا.

---

## الخلاصة

**الـ Architecture الجيدة مش اللي فيها أكبر عدد من Patterns.**

الـ Architecture الجيدة هي اللي بتحل مشاكل الـ System الحالية، وتسيب مساحة معقولة للتغيير، من غير ما تدفع Complexity أنت مش محتاجها.

فبدل ما تسأل: **"إيه أفضل Architecture؟"**

اسأل: **"إيه المشكلة اللي عندي؟ وإيه أبسط تصميم يحلها من غير ما يصنع لي مشاكل أكبر؟"**

وده في رأيي هو الفرق الحقيقي بين إنك تحفظ Architecture… وإنك تبدأ تفكر كـ Software Engineer.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '12 min read',
  image: backendArchitecturesImage,
  featured: true,
};
