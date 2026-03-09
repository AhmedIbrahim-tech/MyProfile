import type { BlogPost } from '@/types/blog';

export const post: BlogPost = {
  id: 7,
  title: 'Reflection in C# — How Frameworks Work Behind the Scenes',
  excerpt:
    'كيف تقرأ Entity Framework وASP.NET وAutoMapper بنيات الكود وتتعامل معها دون معرفة مسبقة؟ الجواب في Reflection والـ Metadata وقت التشغيل.',
  content: `# Reflection في C#

كيف تحوّل Entity Framework الـ classes إلى جداول؟ كيف يربط ASP.NET الـ routes بالـ controllers؟ كيف ينشئ AutoMapper التعيين بين نوعين مختلفين؟ كل هذا يحدث دون أن تكتب بنفسك الكود الذي يفحص البنية — والآلية الأساسية هي Reflection.

---

## ما هو Reflection؟

Reflection في .NET يسمح بقراءة والتعامل مع ميتا بيانات التجميع (Assembly) والنوع (Type) وقت التشغيل: أسماء الـ types والـ properties والـ methods، والـ attributes، وغيرها. بمعنى آخر: يمكن للبرنامج أن يفحص البنية الداخلية للكود ويعاملها كبيانات.

---

## مثال: تحميل موديولات ديناميكياً

نفترض نظاماً يحمّل موديولات إضافية من ملفات DLL في مجلد معيّن، ويشغّل كل صنف ينفّذ واجهة IModule:

\`\`\`csharp
var assemblies = Directory.GetFiles("Modules", "*.dll");

foreach (var file in assemblies)
{
  var assembly = Assembly.LoadFrom(file);
  var types = assembly.GetTypes()
    .Where(t => typeof(IModule).IsAssignableFrom(t) && !t.IsInterface);

  foreach (var type in types)
  {
    var instance = Activator.CreateInstance(type) as IModule;
    instance?.Run();
  }
}
\`\`\`

هنا Reflection يُستخدم لـ: تحميل التجميع، استخراج الأنواع، التحقق من تطبيق IModule، ثم إنشاء مثيل وتشغيله. نفس الفكرة تُستخدم في ASP.NET عند اكتشاف الـ controllers وربطها بالـ routes.

---

## المميزات

- مرونة: كتابة كود يعمل على أنواع لم تُعرّف مسبقاً في وقت التصميم.
- إعادة استخدام: كثير من الـ frameworks (مثل EF، ASP.NET، AutoMapper، xUnit) تعتمد على Reflection.
- تحليل الكود: بناء أدوات مثل محلّلي كود أو مفتشين للـ metadata.

---

## العيوب والاحتياطات

- أداء: استدعاءات Reflection أبطأ من الاستدعاء المباشر؛ يُفضّل التخزين المؤقت لـ PropertyInfo و MethodInfo عند التكرار.
- تصحيح الأخطاء: السلوك ديناميكي وقد لا يظهر بوضوح في وقت التصميم.
- التغليف: الوصول إلى أعضاء private عبر Reflection قد يكسر مبدأ الإخفاء؛ يُستخدم فقط عند وجود مبرر واضح.

---

## متى نستخدم Reflection؟

يناسب Reflection عندما تحتاج سلوكاً يعتمد على البنية في وقت التشغيل، مثل:

- تحميل إضافات أو DLLs ديناميكياً.
- بناء أدوات عامة (مثل serializers أو test runners).
- قراءة الـ attributes المخصصة (مثل [Authorize] أو [HttpGet]) لاتخاذ قرارات في الإطار.

يُفضّل تجنّبه عندما يكون الأداء حرجاً (حلقات مكثفة أو APIs عالية الحمل)، أو عندما تكفي واجهات أو أنواع عامة لتحقيق المطلوب بدون فحص البنية.

---

## بدائل وتوصيات

- تخزين مؤقت لنتائج Reflection (مثل PropertyInfo/MethodInfo) وتجنّب استدعائها داخل حلقات ضيقة.
- استخدام Expression Trees أو الـ delegates عند الحاجة لأداء أفضل مع الحفاظ على جزء من المرونة.
- Source Generators في .NET: توليد كود في وقت التصميم بناءً على البنية دون الاعتماد على Reflection في وقت التشغيل عند الإمكان.

---

## الخاتمة

Reflection هو الآلية التي تسمح للكثير من الـ frameworks بالتعامل مع بنية الكود دون معرفة مسبقة. استخدامه بحكمة يعطي مرونة وقوة؛ الإكثار منه في المسارات الحساسة للأداء قد يسبب مشاكل أداء يصعب حلها لاحقاً.`,
  author: 'Ahmed Ibrahim',
  date: '2024-01-20',
  category: 'Backend',
  readTime: '8 min read',
  image: 'https://miro.medium.com/v2/resize:fit:1200/1*6yZGUYgLFc5rRDa9ZYPl-g.png',
};
