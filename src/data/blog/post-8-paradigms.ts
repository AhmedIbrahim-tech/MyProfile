import type { BlogPost } from '@/types/blog';
import paradigmImage from '@/assets/blog/csharp-multi-paradigm.jpg';

export const post: BlogPost = {
  id: 8,
  title: 'C# as a Multi-Paradigm Language',
  excerpt:
    'C# مش مجرد Classes وObjects. هي لغة Multi-Paradigm: تقدر تحل نفس المشكلة بأكتر من أسلوب، والمهم تختار اللي يناسب المشكلة مش اللي اتعودت عليه.',
  content: `# C# as a Multi-Paradigm Language

عندما يسمع أحدهم كلمة .NET Developer، غالبًا أول شيء يأتي في ذهنه: "C# = Classes وObjects". وهذا صحيح… لكن ليس كاملًا.

C# تطورت عبر السنوات لتصبح لغة **Multi-Paradigm Language**. أي أنها تدعم أكثر من طريقة للتفكير وكتابة البرامج.

يمكنك كتابة نفس المشكلة بعدة أساليب: Object-Oriented وFunctional وImperative وDeclarative وEvent-Driven وAsynchronous وParallel.

والاختيار الصحيح يعتمد على طبيعة المشكلة، والأداء المطلوب، وقابلية الصيانة، وطريقة تنظيم النظام.

One language. Multiple ways of thinking. It's not about one right way. It's about the right way for the right problem.

---

## ما معنى Programming Paradigm؟

الـ Paradigm هو **طريقة تفكير أو أسلوب لوصف الحل البرمجي.** يعني: كيف تفكر في المشكلة؟

هل تفكر: ما الخطوات التي يجب تنفيذها؟ أم: ما النتيجة التي أريد الوصول إليها؟ أم: ما الكائنات التي تمثل الـ Business؟

---

## Imperative Programming

**(كيف يتم التنفيذ؟)** أنت تخبر البرنامج: افعل هذه الخطوات بالترتيب.

\`\`\`csharp
var result = new List<int>();

for (int i = 0; i < numbers.Length; i++)
{
    if (numbers[i] > 10)
        result.Add(numbers[i]);
}
\`\`\`

أنت حددت إنشاء List، والمرور على العناصر، وفحص الشرط، وإضافة النتائج. أنت تتحكم في تفاصيل التنفيذ.

مفيد عندما تحتاج تحكمًا كاملًا، أو تعمل على Algorithms، أو تحتاج Optimization. مثل Game Engine أو Processing على ملايين العناصر.

---

## Declarative Programming

**(ماذا تريد وليس كيف؟)** هنا تصف النتيجة المطلوبة وتترك التفاصيل للـ Framework.

\`\`\`csharp
var result = numbers
    .Where(x => x > 10)
    .ToList();
\`\`\`

أنت لم تقل: ابدأ Loop، افحص كل عنصر، خزّن النتيجة. قلت فقط: أريد الأرقام الأكبر من 10.

أمثلة Declarative في .NET:

- **LINQ:** \`users.Where(x => x.Active)\`
- **EF Core:** \`db.Products.Where(x => x.Price > 100)\` — أنت تصف Query، وEF Core يحولها إلى SQL.
- **ASP.NET Routing:** \`[HttpGet("products")]\` — أنت تصف هذا Endpoint، والـ Framework يتولى الربط.

---

## Object-Oriented Programming (OOP)

أشهر Paradigm في C#. نظم الكود حول Objects تمثل أشياء في النظام: Order وCustomer وProduct وPayment.

\`\`\`csharp
public class Order
{
    public decimal Total { get; private set; }

    public void AddItem(Product product)
    {
        // Business rules
    }
}
\`\`\`

**Encapsulation:** إخفاء التفاصيل الداخلية. لا تسمح لأي أحد أن يعدل \`Balance = -1000\`. بل \`account.Withdraw(amount)\`.

**Inheritance:** إعادة استخدام السلوك. \`Dog : Animal\`.

**Polymorphism:** التعامل مع أنواع مختلفة بنفس الواجهة. \`IPayment\` ثم \`CreditCardPayment\` و\`PaypalPayment\` و\`BankTransferPayment\`.

مناسب جدًا لـ Business Applications وDomain Modeling.

---

## Functional Programming Style

C# ليست Functional Language بالكامل مثل F# أو Haskell. لكن تدعم Functional Style: Functions واضحة، بدون Side Effects، تعتمد على Input وتعيد Output.

\`\`\`csharp
decimal CalculateTax(decimal price) => price * 0.15m;
\`\`\`

نفس Input = نفس Output.

C# تدعم هذا عبر Lambda Expressions وLINQ وImmutability:

\`\`\`csharp
var names = users.Select(u => u.Name).ToList();

public record User(string Name, string Email);
\`\`\`

بدل تغيير Object ننشئ نسخة جديدة. مناسب لمعالجة البيانات.

---

## تنظيم الكود: تقدر تخلط الأساليب

C# مش بتجبرك على أسلوب واحد في نفس المشروع:

- **Classes & Objects:** تمثل مفاهيم الـ Business.
- **Functions / Methods:** تنظّم الـ Logic القابل لإعادة الاستخدام.
- **LINQ & Expressions:** تتعامل مع البيانات بشكل declarative.

You can mix and match styles. C# gives you the freedom to choose what fits your problem.

Generic Programming نفس الفكرة: \`List<T>\` و\`Repository<T>\` يشتغلوا مع User وProduct وOrder من غير تكرار الكود.

---

## Event-Driven Programming

في الأنظمة الكبيرة كثيرًا لا تريد أن يكون كل Component يعرف الآخر. فتستخدم Events.

بعد إنشاء Order: \`OrderCreated\`. تستمع له Email Service وInventory Service وNotification Service.

\`\`\`csharp
public event EventHandler OrderCreated;
\`\`\`

ويظهر كثيرًا مع Domain Events وMessage Brokers وMicroservices. مناسب للـ Distributed Systems.

---

## Execution Model ليس Paradigm

هنا يحدث خلط كبير. Async وThreads وParallelism **ليست Programming Paradigms**. هذه طرق تنفيذ: كيف الكود بيجري، مش إزاي بتفكّر في المشكلة.

**Synchronous:** انتظر العملية حتى تنتهي. \`var data = GetData();\` — بسيط، لكن ممكن يحجز الـ Thread.

**Asynchronous:** لا تجمد التنفيذ أثناء انتظار عملية طويلة.

\`\`\`csharp
var data = await httpClient.GetStringAsync(url);
\`\`\`

مناسب جدًا لـ HTTP وDatabase وFile I/O.

مهم جدًا: **async لا يعني Parallel.** \`await DownloadFile()\` ليس معناها "شغل Thread جديد." هي تعني: لا تحجز التنفيذ أثناء الانتظار.

---

## Concurrency vs Parallelism

**Concurrency:** إدارة عدة مهام في نفس الوقت، حتى لو يوجد Core واحد. Server يعالج Request A وB وC ويتنقل بينهم. Fast switching يعطي إحساس إنهم شغالين مع بعض.

**Parallelism:** تنفيذ فعلي في نفس اللحظة على أكتر من Core.

\`\`\`csharp
Parallel.ForEach(numbers, x => Calculate(x));
\`\`\`

مناسب للـ CPU-heavy work.

---

## Thread vs Task

**Thread:** العامل الذي ينفذ الكود.

**Task:** تمثيل لعملية غير مكتملة أو عمل سيتم تنفيذه.

\`\`\`csharp
Task<Order> task = GetOrderAsync();
\`\`\`

أنت تتعامل مع العملية. ليس بالضرورة مع Thread معين.

\`Task.Run\` و\`Parallel.ForEach\` ليهم أماكنهم. مش كل شغل محتاج Parallelism.

---

## كيف تختار الأسلوب المناسب؟

- **Business Applications:** OOP + Domain Modeling (زي DDD).
- **Data Processing:** Functional Style + LINQ.
- **APIs / Web:** Declarative + Async (ASP.NET Core).
- **CPU Heavy Work:** Parallelism.
- **Distributed Systems:** Event-Driven.

Developer قوي لا يسأل: ما أفضل Paradigm؟ بل يسأل: **ما المشكلة التي أحاول حلها؟**

---

## الخلاصة

C# ليست مجرد لغة Classes. هي تجمع بين عدة طرق للتفكير:

- **تنظيم Business Logic:** OOP
- **معالجة البيانات:** Functional / LINQ
- **وصف النتيجة:** Declarative
- **كتابة Algorithms:** Imperative
- **الأنظمة الموزعة:** Event-Driven
- **انتظار العمليات:** Async
- **الحسابات الثقيلة:** Parallel

القوة الحقيقية ليست في أنها تدعم كل هذه الأساليب فقط… بل في أنك تستطيع دمجها معًا داخل نفس التطبيق.

ASP.NET Core API حقيقي ممكن يستخدم OOP لبناء الـ Domain، وLINQ للبيانات، وasync/await للـ I/O، وEvents لفصل الخدمات، وParallelism للمهام الحسابية الثقيلة.

وهنا يظهر معنى: **C# is a Multi-Paradigm Language.**

C# doesn't force you to think in one way. It gives you the tools to solve problems in the best way.`,
  author: 'Ahmed Ibrahim',
  date: '2025-03-09',
  category: 'Backend',
  readTime: '11 min read',
  image: paradigmImage,
};
