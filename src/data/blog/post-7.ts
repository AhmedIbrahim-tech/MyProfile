import type { BlogPost } from '@/types/blog';
import reflectionImage from '@/assets/blog/reflection-in-csharp.jpg';

export const post: BlogPost = {
  id: 7,
  title: 'Reflection in C# — How Frameworks Work Behind the Scenes',
  excerpt:
    'كيف يعرف EF Core إن الـ Class ده Table؟ وإزاي ASP.NET بيحوّل Controller لـ Endpoint من غير ما تكتب الـ Routing بإيدك؟ الإجابة غالبًا: Reflection.',
  content: `# Reflection في C# — كيف تعمل Frameworks خلف الكواليس؟

هل تساءلت يومًا:

- كيف يعرف Entity Framework أن هذا الـ Class يمثل Table؟
- كيف يعرف ASP.NET Core أن هذا الـ Method هو API Endpoint؟
- كيف يستطيع AutoMapper معرفة أن هذه الـ Property تقابل تلك الـ Property؟
- كيف يستطيع Dependency Injection إنشاء Objects لم تكتب أنت كود إنشائها؟

الإجابة غالبًا تكون: **Reflection**.

Reflection هي واحدة من أهم الآليات الموجودة داخل .NET، وهي السبب الذي يجعل الكثير من الـ Frameworks قادرة على قراءة الكود الخاص بك وفهمه وقت التشغيل بدون أن تخبرها بكل التفاصيل يدويًا.

It's not magic. It's Reflection.

---

## أولًا: كيف يعمل الكود في C#؟

قبل أن نفهم Reflection، نحتاج أن نفهم رحلة الكود.

عندما تكتب:

\`\`\`csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
}
\`\`\`

الـ Compiler لا يحتفظ فقط بالكود. هو يحوله إلى IL، ثم Assembly، ثم Runtime:

\`\`\`text
C# Code (.cs)
    ↓
Compiler (Roslyn) → IL (MSIL)
    ↓
Assembly (.dll) = IL + Metadata
    ↓
Runtime Execution
\`\`\`

داخل الـ Assembly توجد معلومات إضافية اسمها **Metadata**: أسماء الـ Classes والـ Properties والـ Methods والـ Attributes والـ Interfaces والعلاقات بينها.

وهذه الـ Metadata هي التي يقرأها Reflection وقت التشغيل.

---

## ما هو Reflection؟

Reflection هو قدرة البرنامج على فحص الكود أثناء التشغيل: معرفة أنواع الـ Objects، قراءة الـ Properties والـ Methods، إنشاء Objects بشكل ديناميكي، وقراءة الـ Attributes.

بمعنى آخر: الكود يصبح قادرًا على قراءة نفسه.

\`\`\`csharp
Type type = typeof(Product);
var props = type.GetProperties();

foreach (var p in props)
    Console.WriteLine(p.Name);
\`\`\`

Inspect types. Read properties. Read methods. Read attributes. Create instances. Invoke members.

---

## الفرق بين الطريقة التقليدية و Reflection

بدون Reflection أنت تعرف النوع مسبقًا:

\`\`\`csharp
var customer = new Customer();
customer.Name = "Ahmed";
\`\`\`

لكن Reflection يسمح لك أن تتعامل مع Type لا تعرفه أثناء كتابة الكود:

\`\`\`csharp
Type type = typeof(Customer);
Console.WriteLine(type.Name); // Customer
\`\`\`

---

## أهم عناصر Reflection

**Assembly:** ملف الـ DLL أو EXE الذي يحتوي على الكود.

\`\`\`csharp
Assembly assembly = typeof(Customer).Assembly;
\`\`\`

**Type:** يمثل الـ Class أو Interface. يمكنك معرفة \`type.Name\` و\`type.FullName\` و\`type.BaseType\`.

**PropertyInfo:** يمثل Property داخل Class.

\`\`\`csharp
var properties = type.GetProperties();

foreach (var property in properties)
    Console.WriteLine(property.Name);
// Id
// Name
\`\`\`

**MethodInfo:** يمثل Method عبر \`type.GetMethods()\`.

**Attribute:** Metadata تضيفها أنت للكود. Reflection يستطيع قراءة \`[Table("Customers")]\` ومعرفة اسم الجدول.

---

## كيف يستخدم Entity Framework Reflection؟

عندما تكتب Class \`Product\` فيه \`Id\` و\`Name\`، EF Core يحتاج أن يعرف اسم الـ Entity والـ Properties والـ Keys والعلاقات والـ Attributes.

كيف يعرف؟ عن طريق Reflection. مثال مبسط:

\`\`\`csharp
Type type = typeof(Product);
var properties = type.GetProperties();

foreach (var property in properties)
    Console.WriteLine(property.Name);
\`\`\`

ثم يبني Table وColumns وRelationships. Your classes → EF Core (Reflection) → Database.

---

## كيف يعمل ASP.NET Core بالـ Reflection؟

\`\`\`csharp
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok();
}
\`\`\`

ASP.NET Core يحتاج أن يعرف: هذا Controller؟ ما الـ Routes؟ ما الـ HTTP Methods؟ فيبحث داخل الـ Assembly:

\`\`\`text
Find Classes
    ↓
Check ApiController Attribute
    ↓
Find Methods
    ↓
Read HttpGet / HttpPost Attribute
    ↓
Create Endpoint
\`\`\`

Your controllers → Reflection → API Endpoints. Route Table: \`GET /api/products\` و\`POST /api/products\` و\`PUT /api/products/{id}\`.

\`[Authorize]\` نفس الفكرة: ASP.NET يرى \`AuthorizeAttribute\` ويقرر قبل تنفيذ الـ Method لازم Authentication.

---

## Dependency Injection و Reflection

عندما تكتب:

\`\`\`csharp
services.AddScoped<IEmailService, EmailService>();
\`\`\`

أنت تخبر الـ Container بالعلاقة. لكن الـ Container يحتاج أن يعرف Constructor وDependencies.

\`\`\`csharp
public class OrderService
{
    private readonly IEmailService _email;

    public OrderService(IEmailService email)
    {
        _email = email;
    }
}
\`\`\`

الـ DI Container يقرأ الـ Constructor باستخدام Reflection، يعرف إن الـ Class يحتاج \`IEmailService\`، ثم ينشئ الـ Object ويدير الـ Lifetime (Scoped وSingleton وTransient). Your services → Reflection → Working objects.

---

## مثال عملي: Plugin System

لنفترض عندك نظام يدعم Plugins. كل Plugin يطبق:

\`\`\`csharp
public interface IPlugin
{
    void Execute();
}
\`\`\`

وفي المستقبل ستضيف DLLs بدون تعديل الكود الأساسي:

\`\`\`csharp
var files = Directory.GetFiles("Plugins", "*.dll");

foreach (var file in files)
{
    var assembly = Assembly.LoadFrom(file);

    var plugins = assembly.GetTypes()
        .Where(t => typeof(IPlugin).IsAssignableFrom(t) && !t.IsInterface);

    foreach (var plugin in plugins)
    {
        var instance = Activator.CreateInstance(plugin) as IPlugin;
        instance?.Execute();
    }
}
\`\`\`

النظام اكتشف Plugins جديدة بدون معرفة مسبقة بها.

---

## مميزات Reflection

- **Flexibility:** أنظمة ديناميكية زي Plugins وSerializers وORMs.
- **Framework Development:** EF Core وASP.NET Core وxUnit وAutoMapper كلهم بيعتمدوا عليه.
- **Metadata Driven Programming:** الـ Attributes تتحكم في السلوك. \`[Required]\` على Property والـ Framework يقرأها ويطبّق Validation.

---

## عيوب Reflection

- **Performance:** أبطأ من Direct Calls. \`customer.Name\` أسرع من \`property.SetValue(customer, "value")\`. عشان كده Frameworks بتعمل Caching.
- **Runtime Errors:** بدل خطأ Compile، ممكن يفشل وقت التشغيل لو الاسم اتغيّر.
- **وضوح الكود:** الكود الديناميكي أحيانًا يخلي فهم التدفق أصعب.

---

## كيف نحسن أداء Reflection؟

Cache Metadata بدل \`GetProperties()\` كل مرة:

\`\`\`csharp
Dictionary<Type, PropertyInfo[]> cache;
\`\`\`

حوّل العملية إلى Delegate أسرع بدل استدعاء Reflection كل مرة.

وفي .NET الحديث استخدم **Source Generators**: توليد الكود وقت الـ Compile بدل Runtime Reflection، خصوصًا في Serialization.

---

## Reflection مقابل Source Generators

**Reflection (Runtime):** مرن جدًا، مناسب للسيناريوهات الديناميكية، بس أبطأ والأخطاء تظهر وقت التشغيل.

**Source Generators (Compile Time):** أداء أعلى، الأخطاء تظهر بدري، أقل مرونة. أفضل لما السيناريو معروف مسبقًا زي Serialization.

---

## متى تستخدم Reflection؟

استخدمه مع Plugins والتحميل الديناميكي، قراءة Attributes مخصصة، بناء أدوات عامة (ORMs وmappers وserializers)، وتطوير Frameworks وأدوات اختبار.

لا تستخدمه لما فيه طريقة مباشرة أبسط، أو جوّه Loop ضخمة جدًا، أو Performance حساس جدًا، أو تقدر تستخدم Source Generators بدلًا منه.

---

## الخلاصة

Reflection هو أحد الأسباب التي تجعل .NET Framework Ecosystem قويًا. هو الذي يسمح للـ Frameworks بأن تقول: أعطني الكود الخاص بك… وسأفهمه.

لكن القوة تأتي مع مسؤولية. الاستخدام الصحيح يعطيك مرونة كبيرة ويسمح ببناء Frameworks قوية. الاستخدام الخاطئ يسبب مشاكل أداء ويخلي Debugging أصعب.

Developer قوي لا يحفظ فقط استخدام Frameworks… بل يفهم الآليات التي تجعلها تعمل خلف الكواليس.

Reflection turns code into data — and that's where the real power begins.`,
  author: 'Ahmed Ibrahim',
  date: '2024-01-20',
  category: 'Backend',
  readTime: '11 min read',
  image: reflectionImage,
};
