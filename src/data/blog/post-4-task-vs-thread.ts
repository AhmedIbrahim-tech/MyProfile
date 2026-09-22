import type { BlogPost } from '@/modules/blog/types';
import taskVsThreadImage from '@/assets/blog/task-vs-thread-async.jpg';

export const post: BlogPost = {
  id: 4,
  title: 'Task vs Thread vs async/await في .NET',
  excerpt:
    'Thread مش Task، وasync/await مش Parallelism. فهم الفرق — وعلاقته بالـ DbContext — هو أساس Scalability في .NET، مش مجرد سؤال Interview.',
  content: `# Task vs Thread vs async/await في .NET

واحدة من أكتر الحاجات اللي بتعمل لخبطة في .NET هي إننا بنشوف \`Thread\` و\`Task\` و\`async\` و\`await\` ونبدأ نتعامل معاهم كأنهم نفس الحاجة بأسماء مختلفة.

لكن الحقيقة إن كل واحد فيهم بيحل مشكلة مختلفة.

---

## Thread = مين بينفذ الكود

ممكن كبداية نتخيل الـ Thread كأنه **العامل اللي بينفذ الشغل**.

الـ Thread هو execution path داخل الـ Process. يعني في لحظة معينة، الـ Thread ممكن تكون بتنفذ:

\`\`\`csharp
CalculateInvoice();
\`\`\`

أو:

\`\`\`csharp
ProcessImage();
\`\`\`

أو أي كود CPU-bound.

وفي .NET عندك كمان الـ **ThreadPool**: مجموعة Threads بيديرها الـ Runtime بدل ما تعمل Thread جديدة بنفسك لكل شغلانة.

وده مهم لأن إنشاء Threads جديدة لكل Request أو لكل Operation مش scalable.

---

## طيب إيه هي Task؟

الـ \`Task\` مش Thread.

الـ Task هي **Representation لعملية لها Completion**. يعني Object تقدر تعرف منه: هل العملية خلصت؟ هل فشلت؟ هل اتلغت؟ إيه النتيجة لما تخلص؟

\`\`\`csharp
Task<User?> task = GetUserAsync();
\`\`\`

الـ \`task\` هنا بتمثل عملية الحصول على User. لكن ده **مش معناه إن فيه Thread مخصصة للـ Task دي**.

ودي أهم نقطة في الموضوع كله.

---

## Task ≠ Thread

ممكن Task تتنفذ باستخدام ThreadPool Thread.

وممكن Task تمثل I/O Operation، وخلال وقت الانتظار مايبقاش فيه Thread واقفة مستنية أصلًا.

وممكن الكود قبل \`await\` يتنفذ على Thread، وبعد اكتمال العملية يكمل على Thread مختلفة حسب البيئة والـ execution context.

ففكرة:

> One Task = One Thread

غلط.

---

## طيب async/await بتعمل إيه؟

خلينا نشوف المثال ده:

\`\`\`csharp
public async Task<User?> GetUserAsync(int id)
{
    return await _context.Users
        .FirstOrDefaultAsync(x => x.Id == id);
}
\`\`\`

ناس كتير بتتخيل إن \`await\` معناها: "اعمل Thread جديدة وخليها تستنى Database."

لكن ده مش اللي بيحصل.

في الـ I/O الحقيقي، السيناريو المفاهيمي أقرب لـ:

1. الـ Thread تبدأ Database Operation.
2. توصل لـ \`await\`.
3. لو العملية لسه مخلصتش، الـ Method تعمل Yield ويرجع التحكم للـ Caller.
4. والـ Thread مش لازم تفضل واقفة مستنية Database.
5. لما الـ Database Operation تخلص، يكمل باقي الـ Method كـ continuation.

وده أحد أهم أسباب إن async I/O scalable جدًا في Web Servers. بدل ما يكون عندك آلاف Threads واقفة مستنية Network أو Database… الـ Threads تقدر تخدم Requests تانية أثناء فترة الانتظار.

---

## await لا تعني Thread جديدة

دي نقطة لازم تتحفظ:

\`async/await ≠ Multithreading\`

و:

\`async/await ≠ Parallelism\`

الـ async هدفها الأساسي إنك **متعملش Blocking للـ Thread أثناء الانتظار**.

أما Parallelism فمعناه إن شغل بيتنفذ فعليًا في نفس الوقت، غالبًا باستخدام أكتر من Core أو Thread.

وده فرق كبير جدًا.

---

## I/O-Bound vs CPU-Bound

وده المكان اللي ناس كتير بتستخدم فيه \`Task.Run\` غلط.

لو العملية I/O-bound زي Database Query أو HTTP Request أو File I/O أو Network Call، وعندك API Async حقيقية، استخدمها مباشرة:

\`\`\`csharp
var users = await _context.Users.ToListAsync();
\`\`\`

مش:

\`\`\`csharp
var users = await Task.Run(
    () => _context.Users.ToList()
);
\`\`\`

لأنك هنا ما حولتش الـ Database Call إلى Non-Blocking I/O. أنت بس أخذت Blocking Operation وحطيتها على ThreadPool Thread تانية. يعني بدل ما Thread الأولى تستنى… Thread تانية هي اللي هتستنى.

---

## طيب Task.Run معمول ليه؟

\`Task.Run\` بيعمل Queue للشغل على الـ ThreadPool. وده ممكن يكون مفيد خصوصًا مع **CPU-bound work** في السيناريوهات المناسبة.

\`\`\`csharp
var result = await Task.Run(() =>
{
    return GenerateHugeReport();
});
\`\`\`

هنا \`GenerateHugeReport()\` بتستهلك CPU فعلًا.

لكن في ASP.NET Core، متعتبرش \`Task.Run\` optimization سحرية. الـ Request نفسها بالفعل بتشتغل على ThreadPool، فلو عملت \`await Task.Run(() => SomeWork())\` وبعدها استنيتها فورًا، أنت غالبًا أضفت Scheduling إضافي فقط.

ولو عندك CPU-heavy أو Long-running work كبير في Backend، ساعات الحل الأفضل يكون Queue + Background Worker أو Service مستقلة، حسب طبيعة الشغل.

---

## وهنا ندخل على DbContext

الـ \`DbContext\` في EF Core **مش Thread-Safe**.

لكن خلي بالك: المشكلة مش مجرد "Threads". المشكلة الأدق هي: مينفعش تشغل أكتر من Operation بشكل Concurrent على نفس DbContext instance.

يعني الكود ده طبيعي:

\`\`\`csharp
var users = await _context.Users.ToListAsync();

var orders = await _context.Orders.ToListAsync();
\`\`\`

ليه؟ لأن العملية الأولى خلصت قبل ما الثانية تبدأ على نفس الـ Context.

---

## المشكلة تبدأ هنا

\`\`\`csharp
var usersTask = _context.Users.ToListAsync();
var ordersTask = _context.Orders.ToListAsync();

await Task.WhenAll(usersTask, ordersTask);
\`\`\`

العمليتين اشتغلوا concurrently على نفس الـ \`_context\`. وده غير مدعوم في EF Core.

وممكن تشوف Exception مشهورة:

> A second operation was started on this context instance before a previous operation completed.

الفكرة مش إن \`Task.WhenAll\` سيئة. المشكلة إن العمليتين **بيشاركوا نفس DbContext**.

---

## Task.WhenAll نفسها ممتازة… لو الشغل مستقل

\`\`\`csharp
var weatherTask = weatherClient.GetWeatherAsync();
var ratesTask = currencyClient.GetRatesAsync();

await Task.WhenAll(weatherTask, ratesTask);
\`\`\`

لو العمليتين مستقلتين، مفيش مشكلة. المشكلة تبدأ لما الـ Resources اللي تحتهم مش معمولة للاستخدام المتزامن، زي نفس \`DbContext\`.

---

## محتاج Parallel Database Operations فعلًا؟

خلي كل عملية تستخدم DbContext مستقلة. مثلًا باستخدام \`IDbContextFactory<AppDbContext>\`.

كل Method تنشئ Context خاصة بيها:

\`\`\`csharp
async Task<List<User>> GetUsersAsync()
{
    await using var db =
        await _factory.CreateDbContextAsync();

    return await db.Users.ToListAsync();
}
\`\`\`

والـ Method الثانية تستخدم instance مختلفة. كده كل Operation عندها DbContext مستقلة.

لكن مهم جدًا: كونك **تقدر** تعمل Queries بالتوازي مش معناه إن ده دائمًا أسرع. لأنك ممكن تزود الضغط على Database Connections وConnection Pool وDatabase Server وLocks وCPU وNetwork.

فالـ Parallelism لازم يكون له سبب، مش مجرد إن \`Task.WhenAll\` شكلها أسرع.

---

## طب DbContext Lifetime في ASP.NET Core؟

لما تستخدم \`services.AddDbContext<AppDbContext>()\`، EF Core بتسجل الـ DbContext كـ **Scoped** افتراضيًا.

وفي Web Application، الـ Scope عادة مرتبط بالـ HTTP Request. يعني Request A يكون عنده Context، وRequest B يكون عنده Context مختلفة. وده شيء طبيعي ومناسب جدًا لفكرة Unit of Work.

لكن المشكلة تحصل لما جوه نفس Request أنت بنفسك تبدأ Operations متوازية تستخدم نفس instance.

---

## الغلطة المشهورة جدًا

\`\`\`csharp
var usersTask = _context.Users.ToListAsync();

DoSomething();

var ordersTask = _context.Orders.ToListAsync();

await usersTask;
await ordersTask;
\`\`\`

مجرد إنك هتعمل \`await\` في الآخر مش كفاية. أنت بالفعل بدأت العمليتين قبل انتظار الأولى.

الصحيح مع نفس DbContext:

\`\`\`csharp
var users = await _context.Users.ToListAsync();
var orders = await _context.Orders.ToListAsync();
\`\`\`

---

## Thread.Sleep vs Task.Delay

دي واحدة من أحسن الطرق لفهم الفرق.

\`Thread.Sleep(5000)\` معناها: الـ Thread نفسها محجوزة لمدة 5 ثواني ومش بتعمل شغل مفيد.

لكن \`await Task.Delay(5000)\` معناها: استنى 5 ثواني بشكل asynchronous من غير ما تحتاج تحجز Thread طول فترة الانتظار.

وده نفس المبدأ العام وراء asynchronous I/O.

---

## وTask.Result / Wait()؟

لو عندك \`GetDataAsync().Result\` أو \`GetDataAsync().Wait()\`، أنت بتحول asynchronous operation إلى synchronous blocking. يعني Thread هتفضل مستنية.

وده ممكن يقلل Scalability ويسبب مشاكل إضافية حسب البيئة.

الأفضل غالبًا: \`var result = await GetDataAsync();\`. وفي Backend Code، حاول تخلي الـ async ممتدة خلال الـ Call Stack بدل ما تعمل Sync-over-Async.

---

## طب لما أكتب async Method هل الكود كله Async؟

لأ.

\`\`\`csharp
public async Task DoSomethingAsync()
{
    Step1();

    await Step2Async();

    Step3();
}
\`\`\`

\`Step1()\` بتتنفذ بشكل عادي synchronous. لما توصل لـ \`await Step2Async()\`، لو الـ Task لسه مخلصتش، الـ Method ممكن تعمل Yield. وبعد اكتمالها يتنفذ \`Step3()\`.

يعني \`async\` مش معناها إن كل سطر بيشتغل في Background.

---

## الخلاصة

فكر فيها بالشكل ده:

- **Thread:** execution resource تنفذ الكود.
- **ThreadPool:** مجموعة Threads بيديرها .NET ويعيد استخدامها.
- **Task:** تمثيل لعملية قد تكون مكتملة الآن أو ستكتمل لاحقًا.
- **async:** يسمح لك تكتب asynchronous code بطريقة منظمة وقابلة للقراءة.
- **await:** ينتظر الـ Task من غير ما يضطر يحجز الـ current thread أثناء asynchronous wait.
- **Task.Run:** يعمل Queue لشغل على ThreadPool، وغالبًا نفكر فيه مع CPU-bound work في الأماكن المناسبة، مش كبديل للـ true async I/O.
- **Task.WhenAll:** ينتظر عدة Tasks معًا، لكنه لا يجعل الـ shared resources فجأة thread-safe.
- **DbContext:** مش Thread-Safe ولا يدعم Parallel Operations على نفس الـ instance.

وده يخلينا نوصل لأهم نقطة:

مش كل \`Task\` معناها Thread. ومش كل \`async\` معناها Parallel. ومش كل \`Task.WhenAll\` معناها Performance أحسن. ومش معنى إنك استخدمت \`await\` إنك آمن تلقائيًا من مشاكل Concurrency.

في الـ Backend الحقيقي، لازم تسأل:

- الشغل ده CPU-bound ولا I/O-bound؟
- هل أنا بستنى Resource خارجي ولا بحسب حاجة؟
- هل الـ Operations مستقلة فعلًا؟
- هل في Shared State أو Shared DbContext بينهم؟

لأن فهم الفرق بين \`Task\` و\`Thread\` و\`async/await\` مش مجرد سؤال Interview. هو أساس مهم جدًا لفهم Scalability وConcurrency وPerformance في .NET Applications.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '12 min read',
  image: taskVsThreadImage,
  featured: true,
};
