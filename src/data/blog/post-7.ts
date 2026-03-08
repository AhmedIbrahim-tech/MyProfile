import type { BlogPost } from '../../types/blog';

export const post: BlogPost = {
  id: 7,
  title: 'Reflection in C# - السر ورا الـ Frameworks الكبيرة',
  excerpt:
    'عمرك فكرت إزاي الـ frameworks الكبيرة بتتعامل مع الكود بتاعك من غير ما تعرف تفاصيله؟ اكتشف السر ورا Entity Framework، ASP.NET، و AutoMapper.',
  content: `🔍 "عمرك فكرت إزاي الـ frameworks الكبيرة بتتعامل مع الكود بتاعك من غير ما تعرف تفاصيله؟"

يعني مثلًا:

Entity Framework بيحوّل الـ classes بتاعتك لجدول في الـ database

ASP.NET بيقدر يـ inject dependencies أو يـ bind الـ routes والـ controllers

AutoMapper بيعمل mapping بين كائنين مختلفين تلقائي

كل ده بيحصل من غير ما انت تحدد حاجة manual...

السر هنا هو: 🪞 Reflection

💡 إيه هو Reflection باختصار؟

هو الـ feature في .NET اللي بيسمحلك تقرأ وتتعامل مع الميتا داتا (Metadata) بتاعت الكود — زي أسماء الـ classes، الـ properties، والـ methods — وقت التشغيل (Runtime).

بمعنى أبسط:

تقدر تبص جوه الكود "وهو شغال" وتتعامل معاه كأنه data.

⚙️ مثال واقعي بسيط:

تخيل عندك system فيه feature اسمها Dynamic Module Loader

الموديلات (Modules) بتتضاف من برّا كـ DLL files، والـ system بيقرأها ويشغلها أوتوماتيك.

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

🔥 هنا Reflection هو اللي خلا الكود:

يقرأ DLLs جديدة أثناء التشغيل

يحدد إيه الـ classes اللي implement IModule

يشغّلها كأنها جزء من السيستم الأصلي

وده نفس الأسلوب اللي بيستخدمه ASP.NET لما يـ load الـ Controllers بتاعتك من غير ما تكتبهم بإيدك واحد واحد.

⚡ مميزات Reflection:

🔄 مرونة رهيبة: تقدر تكتب كود بيشتغل على أنواع مختلفة بدون ما يعرفها مسبقًا.

🧱 Reusable: frameworks كتير مبنية عليه (EF, ASP.NET, AutoMapper, xUnit).

🧠 تحليل الكود: تستخدمه تبني tools زي analyzers أو code inspectors.

⚠️ عيوب Reflection:

🐢 بطيء نسبيًا: كل access أو invocation بيستهلك أكتر من الكود العادي.

🧩 صعب في الـ Debugging: لأن السلوك ديناميكي ومش واضح في الـ compile time.

🔐 ممكن يفتح access لحاجات private: لو مش واخد بالك، ممكن تكسر الـ encapsulation.

🧠 امتى نستخدم Reflection؟

✅ لما تكون فعلاً محتاج Dynamic Behavior زي:

Loading Plugins أو DLLs runtime

Building Generic Tools زي Serializers وTest Runners

Reading Custom Attributes (زي [Authorize], [HttpGet])

🚫 متستخدموش لو:

الأداء critical (زي loops أو APIs عالية الحمل)

ممكن تستخدم Generics أو Interfaces بدل منه

عايز كود واضح وسهل الصيانة

⚙️ Best Practices:

🧭 Cache كل حاجة (PropertyInfo, MethodInfo) — متجيبهمش كل مرة

🪶 استخدم Expression Trees / Delegates لتحسين الأداء

🧰 Source Generators بديل حديث بيعمل نفس الفكرة لكن وقت الـ compile

📏 استخدمه باعتدال… مش علشان عندك مطرقة يبقى كل حاجة مسمار 😅

🧩 خلاصة الكلام:

Reflection مش مجرد feature…

ده المحرك اللي ورا نص الـ frameworks اللي بنستخدمها كل يوم 🔥

بس هو سلاح ذو حدين — استخدمه صح، هتبني systems مرنة وسهلة التطوير

استخدمه غلط، هتفتح على نفسك performance bottlenecks مش هتخلص 😅`,
  author: 'Ahmed Ibrahim',
  date: '2024-01-20',
  category: 'Backend',
  readTime: '12 min read',
  image: 'https://miro.medium.com/v2/resize:fit:1200/1*6yZGUYgLFc5rRDa9ZYPl-g.png'
};
