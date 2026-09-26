import type { BlogPost } from '@/modules/blog/types';
import pollyImage from '@/assets/blog/retries-timeouts-circuit-breaker-polly.jpg';

export const post: BlogPost = {
  id: 25,
  title: 'Retries, Timeouts & Circuit Breaker — Building Resilient APIs with Polly in .NET',
  excerpt:
    'تخيل لو Payment API اتأخرت أو رجعت 503 أو وقعت تمامًا.. هل نكرر الطلب؟ ولو كررناه، هل العميل ممكن يتخصم منه مرتين؟ دليلك الشامل لبناء Resilient APIs باستخدام Polly في .NET الحديثة مع Timeouts وRetries وCircuit Breaker وIdempotency.',
  content: `# 🛡️ Retries, Timeouts & Circuit Breaker

## Building Resilient APIs with Polly in .NET

تخيل عندك API للـ Orders، ولما العميل يعمل Checkout السيستم بيكلم Payment Service:

\`\`\`text
Orders API
    ↓
Payment API
\`\`\`

الكود ممكن يكون بسيط جدًا:

\`\`\`csharp
var response =
    await httpClient.PostAsync(
        "/payments",
        content,
        cancellationToken);
\`\`\`

لكن السؤال الحقيقي مش:

> هل الكود ده شغال؟

السؤال:

> هيحصل إيه لو Payment API اتأخرت؟
> هيحصل إيه لو رجعت \`503\`؟
> لو Network حصل فيها glitch لمدة ثانية؟
> لو الـ API وقعت تمامًا؟
> هل نفضل نستناها للأبد؟
> هل نكرر الطلب؟
> ولو كررناه، هل العميل ممكن يتخصم منه مرتين؟

هنا ندخل في مفهوم مهم جدًا:

# Resilience

يعني إن الـ System يقدر يتعامل مع **الفشل المؤقت والجزئي** بطريقة محسوبة، بدل ما أي dependency تقع تسحب باقي السيستم معاها.

في .NET الحديثة، Microsoft توفر حزم resilience مبنية فوق **Polly**، وPolly نفسها تعتمد حاليًا على مفهوم \`ResiliencePipeline\` بدل الـ Policy-centric API القديمة. Microsoft كذلك تعتبر \`Microsoft.Extensions.Http.Polly\` القديمة deprecated، وتوصي باستخدام \`Microsoft.Extensions.Resilience\` و\`Microsoft.Extensions.Http.Resilience\` في التطبيقات الحديثة.

---

# أولًا: المشكلة مش إن الأنظمة بتفشل

المشكلة إننا أحيانًا نبني النظام وكأن:

\`\`\`text
Database is always available
Redis is always available
Payment API always responds
Network never fails
DNS never fails
Another service never gets overloaded
\`\`\`

وده مش واقعي.

أي Distributed System لازم تتوقع:

\`\`\`text
Temporary Failure
Slow Dependency
Network Timeout
Rate Limiting
Service Overload
Partial Outage
\`\`\`

الهدف مش إننا نخلي الفشل مستحيل.

الهدف:

# Fail intelligently.

---

# مثال بسيط جدًا

عندنا:

\`\`\`text
Orders API
     ↓
Shipping API
\`\`\`

Shipping API عادة بترد في:

\`\`\`text
200ms
\`\`\`

فجأة حصل ضغط وأصبحت بتاخد:

\`\`\`text
30 seconds
\`\`\`

لو عندك 1 Request بس، ممكن تعدي.

لكن تخيل:

\`\`\`text
10,000 requests
\`\`\`

كل واحدة مستنية 30 ثانية.

دلوقتي عندك Resources محجوزة:

\`\`\`text
Connections
Memory
Sockets
Request contexts
Thread-pool continuations
\`\`\`

وبالتالي مشكلة Service واحدة ممكن تتحول إلى:

# Cascading Failure

\`\`\`text
Shipping API slow
        ↓
Orders API requests pile up
        ↓
Connections exhausted
        ↓
Orders API becomes slow
        ↓
Frontend starts retrying
        ↓
More traffic
        ↓
Everything becomes worse
\`\`\`

عشان كده Resilience مش Luxury.

---

# أهم Strategies

هنركز على:

\`\`\`text
Timeout
Retry
Circuit Breaker
\`\`\`

لكن الصورة الكاملة كمان تشمل:

\`\`\`text
Rate Limiting / Bulkhead
Fallback
Hedging
Cancellation
Idempotency
\`\`\`

Polly تدعم استراتيجيات مثل Retry وCircuit Breaker وTimeout وRate Limiting وFallback وHedging من خلال Resilience Pipelines.

---

# 1. Timeout

أول قاعدة:

# لا تنتظر Dependency إلى ما لا نهاية.

لو خدمة الطبيعي إنها ترد في أقل من ثانية، مش منطقي Request تفضل معلقة:

\`\`\`text
60 seconds
\`\`\`

بدون سبب.

Timeout معناها:

> أنا مستعد أدي العملية وقت معين، وبعدها أعتبرها فشلت.

مثلًا:

\`\`\`text
Payment API
Expected: < 2 sec

Timeout:
5 sec
\`\`\`

---

# ليه Timeout مهمة؟

من غير Timeout:

\`\`\`text
Request
   ↓
Dependency hangs
   ↓
Your API waits
   ↓
More requests arrive
   ↓
Resources accumulate
\`\`\`

مع Timeout:

\`\`\`text
Request
   ↓
Wait max 3 sec
   ↓
Dependency still slow?
   ↓
Cancel attempt
   ↓
Handle failure
\`\`\`

يعني:

# Timeout تحمي مواردك.

---

# Timeout مش معناها إن العملية فعلًا توقفت

دي نقطة دقيقة جدًا.

لو أنت Cancelled HTTP request، ممكن الـ downstream system يكون:

\`\`\`text
Already received it
\`\`\`

وربما نفّذ العملية.

مثال:

\`\`\`text
POST /payments
\`\`\`

أنت استنيت 5 ثواني.

حصل Timeout عندك.

لكن ممكن Payment Server يكون فعلًا:

\`\`\`text
charged the card
\`\`\`

بس Response ما وصلتش.

دلوقتي لو قلت:

\`\`\`text
Timeout → Retry
\`\`\`

ممكن تعمل Payment ثانية.

وهنا تظهر علاقة مهمة جدًا:

# Retry + Idempotency

هنرجعلها.

---

# Polly Timeout

في Polly الحديثة:

\`\`\`csharp
var pipeline =
    new ResiliencePipelineBuilder()
        .AddTimeout(
            TimeSpan.FromSeconds(5))
        .Build();
\`\`\`

ثم:

\`\`\`csharp
await pipeline.ExecuteAsync(
    async cancellationToken =>
    {
        await CallExternalApiAsync(
            cancellationToken);
    });
\`\`\`

Polly v8 تستخدم \`ResiliencePipelineBuilder\`، والـ timeout strategy تعتمد على cancellation؛ الـ callback نفسه لازم يحترم الـ \`CancellationToken\` عشان الإلغاء يكون فعّالًا.

---

# Timeout vs CancellationToken

الاتنين مش نفس الحاجة.

\`CancellationToken\` ممكن يمثل:

\`\`\`text
Client disconnected
Application shutting down
User cancelled request
\`\`\`

أما Timeout:

\`\`\`text
Operation exceeded allowed duration
\`\`\`

في النهاية الاتنين ممكن يستخدموا Cancellation داخليًا، لكن semantics مختلفة.

ما تعملش:

\`\`\`csharp
catch (OperationCanceledException)
{
    return StatusCode(500);
}
\`\`\`

وتعتبر كل Cancellation bug في السيرفر.

---

# Attempt Timeout vs Total Timeout

دي نقطة مهمة جدًا لما تستخدم Retry.

تخيل:

\`\`\`text
Attempt 1 = max 3 sec
Retry delay = 1 sec
Attempt 2 = max 3 sec
Retry delay = 1 sec
Attempt 3 = max 3 sec
\`\`\`

إجمالي العملية ممكن يوصل:

\`\`\`text
11 seconds
\`\`\`

عشان كده ممكن يكون عندك نوعين:

\`\`\`text
Attempt Timeout
\`\`\`

يعني:

> كل محاولة لوحدها أقصى مدة قد إيه؟

و:

\`\`\`text
Total Timeout
\`\`\`

يعني:

> العملية كاملة، بكل Retries، أقصى مدة قد إيه؟

Microsoft Standard HTTP Resilience Handler فيها الاثنين فعلًا: \`AttemptTimeout\` لكل محاولة، و\`TotalRequestTimeout\` للعملية كلها.

---

# 2. Retry

Retry معناها:

> العملية فشلت، لكن الفشل ممكن يكون مؤقت؛ نجرب مرة تانية.

مثال:

\`\`\`text
Request
 ↓
503 Service Unavailable
 ↓
Wait
 ↓
Retry
 ↓
200 OK
\`\`\`

مفيد جدًا مع:

\`\`\`text
Transient Faults
\`\`\`

يعني مشاكل مؤقتة غالبًا تختفي بعد فترة قصيرة.

---

# أمثلة Transient Failure

مثلًا:

\`\`\`text
Temporary network issue
503 Service Unavailable
429 Too Many Requests
Temporary connection reset
Short-lived timeout
\`\`\`

لكن:

\`\`\`text
400 Bad Request
\`\`\`

غالبًا Retry مش هتحلها.

لو Request غلط:

\`\`\`text
Retry 100 times
\`\`\`

هتفضل غلط 😄

---

# Retry مش:

\`\`\`text
catch(Exception)
{
    tryAgainForever();
}
\`\`\`

Retry لازم يكون عنده:

\`\`\`text
Known transient condition
+
Limited attempts
+
Delay strategy
+
Cancellation
+
Observability
\`\`\`

---

# Retry بسيط باستخدام Polly

\`\`\`csharp
var pipeline =
    new ResiliencePipelineBuilder()
        .AddRetry(new RetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            Delay = TimeSpan.FromSeconds(1)
        })
        .Build();
\`\`\`

لكن ده مجرد مثال.

Production configuration لازم تجاوب:

\`\`\`text
Retry what?
How many times?
How long between attempts?
Which exceptions?
Which responses?
\`\`\`

---

# Immediate Retry

أسوأ حاجة تعمل:

\`\`\`text
Request failed
↓
Retry immediately
↓
Retry immediately
↓
Retry immediately
\`\`\`

لو Server أصلًا overloaded:

\`\`\`text
1000 requests
\`\`\`

كل واحدة تعمل 3 Retries فورًا.

دلوقتي بدل:

\`\`\`text
1000 requests
\`\`\`

ممكن يبقوا:

\`\`\`text
4000 attempts
\`\`\`

والـ dependency اللي كانت تعبانة…

إنت خلّيتها أتعس 😄

---

# Delay Between Retries

الحل:

\`\`\`text
Attempt 1
 ↓
Wait
 ↓
Attempt 2
\`\`\`

وأشهر Strategy:

# Exponential Backoff

مثل:

\`\`\`text
Retry 1 → 1 second
Retry 2 → 2 seconds
Retry 3 → 4 seconds
Retry 4 → 8 seconds
\`\`\`

بدل ما تضرب dependency بوابل requests.

---

# Jitter

تخيل عندك:

\`\`\`text
10,000 instances
\`\`\`

كلهم فشلوا الساعة:

\`\`\`text
12:00:00
\`\`\`

وكلهم عاملين:

\`\`\`text
Retry after 2 seconds
\`\`\`

يبقى الساعة:

\`\`\`text
12:00:02
\`\`\`

عندك 10,000 requests رجعوا مرة واحدة.

دي تسمى أحيانًا:

# Thundering Herd

Jitter تضيف Randomness بسيطة:

\`\`\`text
Instance A → 1.8 sec
Instance B → 2.2 sec
Instance C → 2.6 sec
Instance D → 1.9 sec
\`\`\`

فتوزع الضغط.

---

# Polly Retry مع Exponential Backoff

\`\`\`csharp
var pipeline =
    new ResiliencePipelineBuilder()
        .AddRetry(new RetryStrategyOptions
        {
            MaxRetryAttempts = 3,

            Delay =
                TimeSpan.FromMilliseconds(500),

            BackoffType =
                DelayBackoffType.Exponential,

            UseJitter = true
        })
        .Build();
\`\`\`

Polly الحديثة توفر خيارات backoff وjitter ضمن Retry Strategy.

---

# Retry كل Exception؟

لا.

مثلًا:

\`\`\`text
ArgumentException
NullReferenceException
InvalidOperationException
\`\`\`

دول غالبًا Bugs أو programming problems.

Retry مش هتصلح:

\`\`\`csharp
customer.Name.Length
\`\`\`

لو \`customer\` أصلًا null 😄

Retry ركزها على:

\`\`\`text
Transient failures
\`\`\`

مش:

\`\`\`text
Every failure.
\`\`\`

---

# أخطر مشكلة في Retry: Duplicate Operations

تخيل:

\`\`\`http
POST /payments
\`\`\`

Request وصلت Payment Service.

الخدمة خصمت:

\`\`\`text
$100
\`\`\`

لكن الشبكة قطعت قبل Response.

الـ caller شاف:

\`\`\`text
Timeout
\`\`\`

وقال:

\`\`\`text
Retry
\`\`\`

Payment Service استقبلت Request ثانية:

\`\`\`text
$100
\`\`\`

العميل اتخصم منه:

\`\`\`text
$200
\`\`\`

هنا Retry نفسها اشتغلت "صح".

لكن System Design غلط.

---

# Idempotency

عشان عمليات الـ Write اللي ممكن تتكرر نحتاج:

# Idempotency

مثلًا Request:

\`\`\`http
POST /payments

Idempotency-Key:
order-123-payment
\`\`\`

Payment Server يخزن:

\`\`\`text
order-123-payment
→ already processed
\`\`\`

لو نفس request وصلت مرة تانية:

\`\`\`text
Don't charge twice.
\`\`\`

ممكن يرجع نفس نتيجة العملية الأولى.

---

# GET وRetry

\`GET\` عادة Safe / Idempotent من ناحية semantics.

فـ Retry غالبًا أسهل.

لكن:

\`\`\`text
POST
PATCH
\`\`\`

لازم تفكر كويس.

Microsoft Standard Resilience Handler تعمل Retry لكل HTTP methods افتراضيًا، ولذلك Microsoft توفر \`DisableForUnsafeHttpMethods()\` لتعطيل retries على \`POST\`, \`PATCH\`, \`PUT\`, \`DELETE\`, و\`CONNECT\` لو التطبيق لا يضمن safety/idempotency.

مثال:

\`\`\`csharp
builder.Services
    .AddHttpClient<PaymentClient>()
    .AddStandardResilienceHandler(options =>
    {
        options.Retry
            .DisableForUnsafeHttpMethods();
    });
\`\`\`

دي نقطة Production مهمة جدًا.

---

# 3. Circuit Breaker

Retry تحاول مرة أخرى.

لكن تخيل Dependency واقعة بقالها:

\`\`\`text
20 minutes
\`\`\`

هل منطقي كل Request تعمل:

\`\`\`text
Try
Wait
Retry
Wait
Retry
\`\`\`

لا.

إنت كده بتضيع Resources على خدمة معروف إنها واقعة.

Circuit Breaker تقول:

> لما نسبة failures تعدي Threshold معين، وقف إرسال Requests مؤقتًا.

---

# تخيل الكهرباء

الـ Circuit Breaker في البيت:

\`\`\`text
Problem
↓
Breaker trips
↓
Electricity stops
\`\`\`

عشان يمنع ضرر أكبر.

في Software نفس الفكرة.

---

# Circuit States

عندنا غالبًا:

\`\`\`text
Closed
Open
Half-Open
\`\`\`

## Closed

الوضع الطبيعي:

\`\`\`text
Requests → Dependency
\`\`\`

Circuit بيراقب.

---

## Open

Failures زادت.

Circuit يقول:

\`\`\`text
STOP.
\`\`\`

بدل ما يكلم dependency:

\`\`\`text
Request
 ↓
Circuit Breaker
 ↓
Rejected immediately
\`\`\`

وده يسمى:

# Fail Fast

---

# Half-Open

بعد مدة معينة:

\`\`\`text
Open
 ↓
Wait
 ↓
Half-Open
\`\`\`

Circuit يسمح بمحاولات محدودة لاختبار هل Service رجعت.

لو نجحت:

\`\`\`text
Half-Open
↓
Closed
\`\`\`

لو فشلت:

\`\`\`text
Half-Open
↓
Open again
\`\`\`

---

# Circuit Breaker مش Retry

دي نقطة مهمة جدًا.

Circuit Breaker:

\`\`\`text
doesn't retry.
\`\`\`

وظيفتها:

\`\`\`text
Monitor failures
↓
Stop calls temporarily
\`\`\`

Polly نفسها توضح إن Circuit Breaker لا تنفذ retries؛ لو محتاج الاتنين، تركب Retry وCircuit Breaker في Pipeline واحدة.

---

# مثال Polly Circuit Breaker

\`\`\`csharp
var pipeline =
    new ResiliencePipelineBuilder()
        .AddCircuitBreaker(
            new CircuitBreakerStrategyOptions
            {
                FailureRatio = 0.5,

                SamplingDuration =
                    TimeSpan.FromSeconds(30),

                MinimumThroughput = 10,

                BreakDuration =
                    TimeSpan.FromSeconds(20)
            })
        .Build();
\`\`\`

المعنى تقريبًا:

\`\`\`text
راقب آخر 30 ثانية.

لو عندك على الأقل 10 executions

و50% منهم فشلوا

افتح Circuit لمدة 20 ثانية.
\`\`\`

---

# ليه MinimumThroughput مهمة؟

تخيل:

\`\`\`text
1 request
\`\`\`

وفشلت.

Failure Ratio:

\`\`\`text
100%
\`\`\`

هل نفتح Circuit عشان Request واحدة؟

غالبًا لا.

عشان كده MinimumThroughput تمنع decisions مبنية على sample صغيرة جدًا.

---

# 4. Retry + Circuit Breaker

دلوقتي نقدر نجمعهم:

\`\`\`text
Request
   ↓
Retry
   ↓
Circuit Breaker
   ↓
Dependency
\`\`\`

فلو حصل failure transient:

\`\`\`text
Retry
\`\`\`

لكن لو Dependency بدأت تفشل باستمرار:

\`\`\`text
Circuit opens
\`\`\`

وساعتها Requests الجديدة:

\`\`\`text
Fail fast
\`\`\`

بدل استنزاف Service الواقعة.

---

# 5. Timeout + Retry + Circuit Breaker

الصورة بقت:

\`\`\`text
Request
   ↓
Total Timeout
   ↓
Retry
   ↓
Circuit Breaker
   ↓
Attempt Timeout
   ↓
External Service
\`\`\`

مثلًا:

\`\`\`text
Total timeout = 10 sec

Retry = max 2 retries

Attempt timeout = 2 sec
\`\`\`

لو محاولة تعدي ثانيتين:

\`\`\`text
Timeout
\`\`\`

Retry ممكن تعمل محاولة أخرى.

لو failures أصبحت كثيرة على مستوى dependency:

\`\`\`text
Circuit Breaker opens
\`\`\`

وTotal Timeout تضمن إن العملية كلها ما تتجاوزش Budget محددة.

Polly توضح إن ترتيب الـ strategies في الـ resilience pipeline يغيّر behavior؛ مثلًا ممكن تجعل Timeout داخل Retry فتطبق timeout لكل محاولة، أو Timeout خارجي يشمل كل retries.

---

# ترتيب Strategies مهم جدًا

مثلًا:

\`\`\`csharp
new ResiliencePipelineBuilder()
    .AddRetry(...)
    .AddTimeout(TimeSpan.FromSeconds(2))
\`\`\`

فكرة الـ flow:

\`\`\`text
Retry
 └── Timeout
      └── Operation
\`\`\`

يعني كل attempt عندها Timeout.

لكن:

\`\`\`csharp
new ResiliencePipelineBuilder()
    .AddTimeout(TimeSpan.FromSeconds(10))
    .AddRetry(...)
\`\`\`

تبقى:

\`\`\`text
Total Timeout
 └── Retry
      └── Operation
\`\`\`

يعني كل الـ Retry process لها 10 ثواني إجماليًا.

وفي Systems حقيقية ممكن تحتاج الاتنين:

\`\`\`text
Total Timeout
   ↓
Retry
   ↓
Attempt Timeout
\`\`\`

---

# 6. Rate Limiter / Bulkhead

تخيل Payment API تتحمل:

\`\`\`text
100 concurrent requests
\`\`\`

لكن Orders API بعتت:

\`\`\`text
5,000 concurrent requests
\`\`\`

حتى لو Payment شغالة كويس…

إنت بنفسك ممكن توقعها.

هنا تحتاج:

\`\`\`text
Concurrency Limiting
\`\`\`

الفكرة القديمة معروفة باسم:

# Bulkhead

زي السفينة اللي مقسمة compartments.

لو جزء غرق:

\`\`\`text
مش السفينة كلها تغرق.
\`\`\`

في software:

\`\`\`text
Dependency A
has limited concurrency
\`\`\`

فما تستهلكش كل resources.

---

# Standard Resilience Handler

في .NET الحديثة عندك طريقة جاهزة ممتازة لـ \`HttpClient\`.

ثبت:

\`\`\`bash
dotnet add package Microsoft.Extensions.Http.Resilience
\`\`\`

ثم:

\`\`\`csharp
builder.Services
    .AddHttpClient<PaymentClient>(client =>
    {
        client.BaseAddress =
            new Uri(
                "https://payments.example.com");
    })
    .AddStandardResilienceHandler();
\`\`\`

والـ Standard Handler تجمع مجموعة strategies جاهزة تشمل rate limiting/concurrency control، total timeout، retry، circuit breaker، وattempt timeout.

---

# ليه دي أفضل من Tutorials القديمة؟

ممكن تلاقي tutorials فيها:

\`\`\`csharp
.AddPolicyHandler(...)
\`\`\`

مع:

\`\`\`text
Microsoft.Extensions.Http.Polly
\`\`\`

وده كان شائع جدًا.

لكن التوجيه الحالي من Microsoft:

\`\`\`text
Microsoft.Extensions.Http.Polly
\`\`\`

Deprecated.

استخدم بدلها:

\`\`\`text
Microsoft.Extensions.Resilience
Microsoft.Extensions.Http.Resilience
\`\`\`

وهما مبنيين فوق Polly الحديثة.

---

# Configuration

تقدر تخصص الـ Standard Handler:

\`\`\`csharp
builder.Services
    .AddHttpClient<PaymentClient>()
    .AddStandardResilienceHandler(options =>
    {
        options.TotalRequestTimeout.Timeout =
            TimeSpan.FromSeconds(10);

        options.AttemptTimeout.Timeout =
            TimeSpan.FromSeconds(3);

        options.Retry.MaxRetryAttempts = 2;

        options.CircuitBreaker.BreakDuration =
            TimeSpan.FromSeconds(30);
    });
\`\`\`

لكن خلي بالك:

# Defaults مش معناها إنها مناسبة لكل dependency.

Payment API غير:

\`\`\`text
Weather API
\`\`\`

وDatabase غير:

\`\`\`text
Email Provider
\`\`\`

كل Dependency لها characteristics مختلفة.

---

# Named HttpClient

ممكن:

\`\`\`csharp
builder.Services
    .AddHttpClient(
        "payments",
        client =>
        {
            client.BaseAddress =
                new Uri(
                    "https://payments.example.com");
        })
    .AddStandardResilienceHandler();
\`\`\`

وبعدين:

\`\`\`csharp
var client =
    httpClientFactory
        .CreateClient("payments");
\`\`\`

لكن Typed Clients عادة بتخلي boundaries أوضح:

\`\`\`csharp
public sealed class PaymentClient
{
    private readonly HttpClient _client;

    public PaymentClient(
        HttpClient client)
    {
        _client = client;
    }
}
\`\`\`

---

# 7. Fallback

تخيل Recommendation API وقعت.

هل لازم الموقع كله يقع؟

ممكن بدل:

\`\`\`text
500 Internal Server Error
\`\`\`

تعرض:

\`\`\`text
Most Popular Products
\`\`\`

ده:

# Fallback

\`\`\`text
Recommendation API
       ↓ fails
Fallback
       ↓
Default recommendations
\`\`\`

لكن Fallback مش مناسبة لكل حاجة.

لو:

\`\`\`text
Payment failed
\`\`\`

ماينفعش تقول:

\`\`\`text
Fallback → Pretend payment succeeded
\`\`\`

😅

Fallback مناسبة فقط لما عندك:

\`\`\`text
meaningful degraded behavior.
\`\`\`

---

# Graceful Degradation

فكرة أكبر من Fallback.

تخيل Home Page عندها:

\`\`\`text
Products
Recommendations
Reviews
Ads
Trending
\`\`\`

لو Recommendations وقعت، ممكن الصفحة تشتغل بدونها.

\`\`\`text
Core feature ✅

Optional feature ❌
\`\`\`

وده أفضل من:

\`\`\`text
One dependency failed
↓
Whole page 500
\`\`\`

---

# 8. Hedging

Hedging فكرة مختلفة.

بدل:

\`\`\`text
Request A
wait
failure
retry
\`\`\`

ممكن بعد مدة معينة تبعت محاولة إضافية بالتوازي:

\`\`\`text
Request
 ├── Server A
 └── Server B
\`\`\`

وتستخدم أول Response ناجحة.

مفيد في بعض read-heavy distributed scenarios.

لكن Hedging ممكن تزود:

\`\`\`text
Traffic
Cost
Load
Complexity
\`\`\`

فمش حاجة تتحط افتراضيًا.

---

# 9. Retry-After

لو API رجعت:

\`\`\`http
429 Too Many Requests

Retry-After: 10
\`\`\`

هي بتقول لك:

> استنى 10 ثواني قبل ما تحاول تاني.

مينفعش تقول:

\`\`\`text
شكراً
Retry after 200ms
\`\`\`

😄

\`HttpRetryStrategyOptions\` في .NET resilience tooling تدعم التعامل مع \`Retry-After\` عند حساب تأخير retry.

---

# 10. 429 vs 503

الاتنين ممكن يكونوا transient، لكن معناهم مختلف.

\`\`\`text
429 Too Many Requests
\`\`\`

يعني غالبًا:

> إنت باعت كتير.

أما:

\`\`\`text
503 Service Unavailable
\`\`\`

تعني:

> الخدمة غير متاحة حاليًا.

Retry ممكن يكون مناسب للاتنين…

لكن لازم تحترم:

\`\`\`text
Retry-After
Rate limits
Overall latency budget
\`\`\`

---

# 11. Retry Storm

أخطر scenarios في Microservices.

عندك:

\`\`\`text
API A
↓
API B
↓
API C
\`\`\`

كل واحدة تعمل:

\`\`\`text
3 retries
\`\`\`

Request واحدة من A ممكن تتحول نظريًا إلى attempts متعددة جدًا downstream.

مثال مبسط:

\`\`\`text
A tries B 3 times

B each time tries C 3 times
\`\`\`

ممكن توصل:

\`\`\`text
9 attempts to C
\`\`\`

من Request واحدة.

لو عندك آلاف requests:

# Retry amplification.

عشان كده ما تحطش retry blindly في كل layer.

---

# مين يعمل Retry؟

خلي Owner واضح.

مثال:

\`\`\`text
Frontend
↓
API
↓
Payment
\`\`\`

مش لازم:

\`\`\`text
Browser retries 3x
+
API retries 3x
+
SDK retries 3x
\`\`\`

وتبقى العملية عندها:

\`\`\`text
27 possible attempts
\`\`\`

لازم تعرف هل SDK أصلًا بتعمل Retry قبل ما تضيف Polly فوقها.

---

# 12. Retry Budget

بدل التفكير:

\`\`\`text
Retry 3 times.
\`\`\`

فكر:

# Latency Budget.

مثلًا المستخدم مستعد ينتظر:

\`\`\`text
5 seconds
\`\`\`

فممكن:

\`\`\`text
Attempt 1 = max 1 sec
Delay = 200ms

Attempt 2 = max 1 sec
Delay = 500ms

Attempt 3 = max 1 sec
\`\`\`

إجمالي مع overhead:

\`\`\`text
< 5 sec
\`\`\`

أحسن من:

\`\`\`text
3 retries × 10 sec
\`\`\`

والمستخدم يستنى نص دقيقة.

---

# 13. Database Retry

هل نعمل retry للـ Database؟

أحيانًا نعم.

Transient failures مثل:

\`\`\`text
Temporary network failure
Cloud DB failover
Connection interruption
\`\`\`

ممكن تستفيد.

لكن خد بالك من Transactions.

لو operation بدأت وعدلت data ثم connection lost:

\`\`\`text
Did commit happen?
\`\`\`

دي ممكن تكون غير واضحة.

عشان كده retries مع database writes لازم تتفهم مع:

\`\`\`text
Transactions
Idempotency
Execution strategies
\`\`\`

مش مجرد \`catch + retry\`.

---

# EF Core Execution Strategy

EF Core providers ممكن توفر retry execution strategy للـ transient database failures.

مثل SQL Server:

\`\`\`csharp
options.UseSqlServer(
    connectionString,
    sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    });
\`\`\`

لكن لو أنت بتدير transaction يدويًا، محتاج تفهم Execution Strategy كويس، لأن retry transaction متعددة العمليات لها تعامل خاص.

المهم:

# متعملش retry layer فوق retry layer بدون ما تعرف.

---

# 14. Redis Retry

لو:

\`\`\`text
Redis GET
\`\`\`

فشل transiently، Retry قصيرة ممكن تكون معقولة.

لكن لو Redis عندك:

\`\`\`text
Distributed Lock
\`\`\`

أو:

\`\`\`text
Counter
\`\`\`

أو operation لها side effects…

لازم تفهم semantics قبل Retry.

مش كل Redis operation:

\`\`\`text
safe to blindly repeat.
\`\`\`

---

# 15. Payment Gateway

دي من أوضح الحالات.

لو عندك:

\`\`\`text
POST /charge
\`\`\`

ماتعملش Retry إلا لو Payment Provider عندها:

\`\`\`text
Idempotency mechanism
\`\`\`

مثل:

\`\`\`text
Idempotency-Key
\`\`\`

أو API contract واضح بخصوص retries.

وإلا:

\`\`\`text
Timeout
↓
Retry
↓
Double Payment
\`\`\`

---

# 16. Circuit Breaker Scope

تخيل عندك:

\`\`\`text
Payment Provider A
Payment Provider B
\`\`\`

ما تعملش Circuit واحدة مشتركة بينهم.

لأن Failure في:

\`\`\`text
Provider A
\`\`\`

مينفعش يوقف:

\`\`\`text
Provider B
\`\`\`

Circuit Breaker state لازم يبقى scoped حسب dependency اللي failures بتاعتها مرتبطة ببعض.

---

# 17. Circuit Breaker مش Health Check

لو Circuit مفتوحة:

\`\`\`text
Dependency seems unhealthy from our perspective.
\`\`\`

لكن مش معناها بالضرورة الخدمة كلها down.

ممكن:

\`\`\`text
One endpoint broken
One region broken
Our credentials invalid
Network path issue
\`\`\`

فمتخلطش:

\`\`\`text
Circuit Breaker State
\`\`\`

مع:

\`\`\`text
Service Health Truth.
\`\`\`

---

# 18. Timeout مش رقم عشوائي

مينفعش:

\`\`\`text
Timeout = 30 seconds
\`\`\`

عشان الرقم شكله حلو.

اختيار Timeout يكون بناءً على:

\`\`\`text
Observed latency
SLA/SLO
User latency budget
Operation importance
Network characteristics
\`\`\`

لو:

\`\`\`text
P99 latency = 700ms
\`\`\`

ممكن 30 seconds تكون كبيرة جدًا.

لو operation naturally بتاخد:

\`\`\`text
15 seconds
\`\`\`

فـ 2 seconds هتكون غلط.

---

# 19. Monitor قبل ما Tuned Policies

لازم تعرف:

\`\`\`text
How many retries happen?
Why?
Which dependency?
How long?
Circuit opened how often?
Timeouts increasing?
\`\`\`

لو Retry بقت بتحصل باستمرار، Retry مش solution.

ممكن تكون بتخفي:

\`\`\`text
Real reliability problem.
\`\`\`

---

# Retry مش نجاح

تخيل:

\`\`\`text
First attempt fails
Retry succeeds
\`\`\`

العميل شاف:

\`\`\`text
200 OK
\`\`\`

لكن الـ System عندها signal مهم:

\`\`\`text
Dependency reliability degraded.
\`\`\`

لو ما بتقيسش retries، هتكتشف المشكلة بعد ما retry ما تبقاش كفاية.

---

# 20. Logging

ما تعملش:

\`\`\`text
ERROR attempt 1
ERROR attempt 2
ERROR attempt 3
ERROR final failure
\`\`\`

وبعدين incident واحدة تتحول 4 Errors.

الأفضل تفرق:

\`\`\`text
Retry attempt
\`\`\`

قد تكون:

\`\`\`text
Warning / telemetry
\`\`\`

والـ final failure:

\`\`\`text
Error
\`\`\`

حسب strategy والـ observability design.

---

# 21. Metrics مهمة

في production محتاج تشوف حاجات زي:

\`\`\`text
dependency_requests_total

dependency_failures_total

retry_attempts_total

timeout_total

circuit_open_total

dependency_latency

429_rate

503_rate
\`\`\`

لأن Resilience بدون observability ممكن تخبي مشاكل بدل ما تحلها.

---

# 22. Tracing

لو عندك distributed tracing:

\`\`\`text
User Request
    ↓
Orders API
    ↓
Retry 1
    ↓
Payment
    ↓
Retry 2
\`\`\`

لازم تعرف من الـ trace:

\`\`\`text
Original request
Attempts
Duration
Final outcome
\`\`\`

وده أحد الأماكن اللي OpenTelemetry مفيدة جدًا فيها.

---

# 23. Standard HTTP Resilience Pipeline

الصورة الذهنية المفيدة:

\`\`\`text
HTTP Request
      ↓
Rate Limiter / Concurrency Control
      ↓
Total Request Timeout
      ↓
Retry
      ↓
Circuit Breaker
      ↓
Attempt Timeout
      ↓
External API
\`\`\`

وده تقريبًا الشكل الذي توفره Standard Resilience Handler الجاهزة لـ \`HttpClient\`.

الفكرة إن كل واحدة بتحل مشكلة مختلفة.

---

# Timeout

\`\`\`text
Don't wait forever.
\`\`\`

# Retry

\`\`\`text
Try again if failure is transient.
\`\`\`

# Circuit Breaker

\`\`\`text
Stop calling something that is clearly failing.
\`\`\`

# Rate Limiter

\`\`\`text
Don't overwhelm the dependency.
\`\`\`

# Total Timeout

\`\`\`text
Don't let all retries exceed the request budget.
\`\`\`

---

# 24. مثال Production أقرب للواقع

\`\`\`csharp
builder.Services
    .AddHttpClient<PaymentClient>(client =>
    {
        client.BaseAddress =
            new Uri(
                configuration[
                    "Services:PaymentApi"]!);

        client.DefaultRequestHeaders
            .Add(
                "Accept",
                "application/json");
    })
    .AddStandardResilienceHandler(options =>
    {
        options.TotalRequestTimeout.Timeout =
            TimeSpan.FromSeconds(10);

        options.AttemptTimeout.Timeout =
            TimeSpan.FromSeconds(3);

        options.Retry.MaxRetryAttempts = 2;

        options.Retry.Delay =
            TimeSpan.FromMilliseconds(500);

        options.Retry.BackoffType =
            DelayBackoffType.Exponential;

        options.Retry.UseJitter = true;

        options.CircuitBreaker
            .BreakDuration =
            TimeSpan.FromSeconds(30);
    });
\`\`\`

لكن لو Payment POST ليست Idempotent:

\`\`\`csharp
options.Retry
    .DisableForUnsafeHttpMethods();
\`\`\`

أو تضمن idempotency عند Payment API نفسها.

---

# PaymentClient

\`\`\`csharp
public sealed class PaymentClient
{
    private readonly HttpClient _httpClient;

    public PaymentClient(
        HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<PaymentResponse>
        CreatePaymentAsync(
            CreatePaymentRequest request,
            string idempotencyKey,
            CancellationToken cancellationToken)
    {
        using var message =
            new HttpRequestMessage(
                HttpMethod.Post,
                "/api/payments");

        message.Headers.Add(
            "Idempotency-Key",
            idempotencyKey);

        message.Content =
            JsonContent.Create(request);

        using var response =
            await _httpClient.SendAsync(
                message,
                cancellationToken);

        response.EnsureSuccessStatusCode();

        return (
            await response.Content
                .ReadFromJsonAsync<PaymentResponse>(
                    cancellationToken:
                        cancellationToken)
        )!;
    }
}
\`\`\`

دلوقتي الـ Resilience مش بس Polly.

بقت:

\`\`\`text
Timeout
+
Retry Policy
+
Circuit Breaker
+
Idempotency
\`\`\`

---

# 25. Failure Scenario

خلينا نمشيها عملي.

Request:

\`\`\`text
POST /orders/123/pay
\`\`\`

Orders API:

\`\`\`text
↓
PaymentClient
↓
Payment API
\`\`\`

Attempt 1:

\`\`\`text
3-second timeout
\`\`\`

Payment ما ردتش.

\`\`\`text
Timeout
\`\`\`

لو العملية safe to retry:

\`\`\`text
↓
Backoff + Jitter
↓
Attempt 2
\`\`\`

لو نجحت:

\`\`\`text
Payment OK
↓
Order Paid
\`\`\`

لو dependency فشلت باستمرار:

\`\`\`text
Circuit Breaker detects threshold
↓
Circuit Opens
\`\`\`

Requests التالية:

\`\`\`text
PaymentClient
↓
Circuit Open
↓
Fail Fast
\`\`\`

بدل:

\`\`\`text
Wait 3 sec × every user.
\`\`\`

---

# 26. لكن ماذا نرجع للعميل؟

متقولش:

\`\`\`http
409 Conflict
\`\`\`

لمجرد إن dependency وقعت.

دي مش Business Conflict.

ممكن حسب الـ contract تستخدم مثلًا:

\`\`\`http
503 Service Unavailable
\`\`\`

لما critical downstream dependency غير متاحة مؤقتًا.

لكن الـ HTTP mapping تعتمد على architecture والـ API contract.

الفكرة:

\`\`\`text
Infrastructure failure
≠
Business validation failure.
\`\`\`

---

# 27. Queue بدل Retry؟

أحيانًا الحل مش إنك Retry HTTP Request أصلًا.

تخيل:

\`\`\`text
Send Welcome Email
\`\`\`

هل المستخدم لازم يستنى Email Provider؟

لا.

ممكن:

\`\`\`text
Register User
↓
Persist User
↓
Publish Message
↓
Queue
↓
Email Worker
↓
Email Provider
\`\`\`

لو provider وقعت:

\`\`\`text
Worker retries later.
\`\`\`

هنا Async Messaging أفضل من إن Login Request تستنى.

---

# Retry vs Queue

لو العملية لازم يحصل response فورًا:

\`\`\`text
Synchronous Retry
\`\`\`

قد تكون مناسبة.

لو العملية ممكن تتنفذ لاحقًا:

\`\`\`text
Queue
\`\`\`

غالبًا architecture أقوى.

وده هيظهر معانا أكتر لما نوصل لمقالات:

\`\`\`text
RabbitMQ
Kafka
Message Brokers
\`\`\`

---

# 28. Polly مش Job Scheduler

متعملش:

\`\`\`text
Retry every 24 hours forever.
\`\`\`

باستخدام Polly.

Polly مصممة لمعالجة transient faults قصيرة المدى، وتوثيقها نفسه ينصح باستخدام أدوات scheduling متخصصة مثل Hangfire أو Quartz للـ recurring/background jobs الطويلة بدل استخدام retry strategy كـ scheduler.

---

# 29. Background Worker

لو عندك:

\`\`\`text
BackgroundService
\`\`\`

والـ worker بيكلم external API، Polly ممكن تفيد.

لكن retry strategy تختلف عن HTTP request.

لأن Worker ممكن عنده:

\`\`\`text
Message
↓
Process
↓
Failure
↓
Retry
↓
DLQ
\`\`\`

وهنا retry ownership أحيانًا الأفضل تكون عند:

\`\`\`text
Message Broker
\`\`\`

أو framework مثل MassTransit.

---

# 30. Common Mistakes 🚨

1. **Retry كل Exception بدون تمييز.** Bug في الكود مش transient failure.

2. **Retry على POST بدون Idempotency.** دي وصفة ممتازة للـ duplicate payments والـ duplicate orders.

3. **عدم وجود Timeout.** Request ممكن تمسك resources وقت طويل جدًا.

4. **Timeout كبير جدًا.** وجود timeout لا يعني إنها مفيدة لو رقمها غير منطقي.

5. **Retries كثيرة جدًا.** Retry أداة resilience وليست denial-of-service على dependency.

6. **Retry في كل Layer.** ممكن تعمل retry amplification رهيبة.

7. **Retry فورًا بدون Backoff/Jitter.** كل instances ترجع تضرب dependency في نفس اللحظة.

8. **اعتبار Circuit Breaker Retry.** Circuit Breaker تمنع calls؛ لا تعيد تنفيذها بنفسها.

9. **إضافة Polly فوق SDK تعمل retries أصلًا بدون معرفة إعداداتها.**

10. **استخدام resilience لإخفاء service مكسورة.** لو كل request تحتاج 3 retries، عندك مشكلة يجب إصلاحها.

11. **عدم مراقبة retries وtimeouts وcircuit state.**

12. **Retry عملية لا يمكن تحديد هل نجحت أم لا.** خصوصًا financial writes.

---

# اختار Strategy إزاي؟

| المشكلة                          | Strategy                        |
| -------------------------------- | ------------------------------- |
| Dependency بطيئة جدًا            | Timeout                         |
| Failure مؤقت                     | Retry                           |
| Dependency بتفشل باستمرار        | Circuit Breaker                 |
| Too many concurrent calls        | Rate Limiter / Bulkhead         |
| Optional dependency وقعت         | Fallback / Graceful Degradation |
| Requests غير idempotent          | Idempotency قبل Retry           |
| Process ممكن ينتظر               | Queue / Background Processing   |
| Client تجاوز rate limit          | Retry-After + Backoff           |
| آلاف instances تعيد في نفس الوقت | Jitter                          |
| Retry process كلها ممكن تطول     | Total Timeout                   |
| كل محاولة محتاجة limit           | Attempt Timeout                 |

---

# Rule of Thumb

فكر بالشكل ده:

\`\`\`text
Can the operation hang?
        ↓
       Yes
        ↓
     Timeout
\`\`\`

ثم:

\`\`\`text
Can this failure be transient?
        ↓
       Yes
        ↓
      Retry
\`\`\`

ثم:

\`\`\`text
Is it safe to repeat?
        ↓
   No / Not sure
        ↓
Don't retry blindly
Use Idempotency
\`\`\`

ثم:

\`\`\`text
Is dependency failing repeatedly?
        ↓
       Yes
        ↓
 Circuit Breaker
\`\`\`

ثم:

\`\`\`text
Can too much traffic overwhelm it?
        ↓
       Yes
        ↓
Concurrency / Rate Limiting
\`\`\`

---

# Architecture أهم من Polly

دي أهم نقطة في المقالة.

وجود:

\`\`\`text
Retry
Circuit Breaker
Timeout
\`\`\`

مش هيخلي architecture سيئة تبقى جيدة.

مثلًا:

\`\`\`text
Order
↓
Payment
↓
Inventory
↓
Shipping
↓
Email
↓
Analytics
\`\`\`

كلهم synchronous في Request واحدة.

حتى لو حطيت Polly على كل سهم…

ممكن النظام يفضل fragile.

أحيانًا الحل الصحيح يكون:

\`\`\`text
Order
 ↓
Critical synchronous operation
 ↓
Persist
 ↓
Event / Queue
 ↓
Async work
\`\`\`

---

# Resilience ≠ Never Fail

Resilient System مش معناها:

\`\`\`text
Always succeeds.
\`\`\`

معناها:

\`\`\`text
Fails predictably
Protects itself
Recovers from transient failures
Avoids cascading failures
Degrades gracefully
Makes failures observable
\`\`\`

وده فرق ضخم.

---

# السيناريو المثالي

عندك Service خارجية.

قبل:

\`\`\`text
API
 ↓
External Service
 ↓
Hope it works 🤞
\`\`\`

بعد:

\`\`\`text
API
 ↓
Total Timeout
 ↓
Retry
 ↓
Circuit Breaker
 ↓
Attempt Timeout
 ↓
External Service
\`\`\`

مع:

\`\`\`text
Backoff
Jitter
Idempotency
Rate Limiting
Logging
Metrics
Tracing
\`\`\`

وساعتها تقدر تقول إنك بدأت تبني:

# Production-Ready Integration

---

# الخلاصة 🚀

احفظ الأربع أفكار دول:

## Timeout

**ما تستناش dependency للأبد.**

## Retry

**أعد المحاولة فقط لو المشكلة مؤقتة والعملية آمنة للتكرار.**

## Circuit Breaker

**لو dependency بتفشل باستمرار، وقف ضربها وافشل بسرعة مؤقتًا.**

## Idempotency

**لو العملية ممكن تتكرر، تأكد إن تكرارها مش هيكرر الـ side effect.**

والـ mental model النهائي:

\`\`\`text
Request
   ↓
Protect your resources
   ↓
Timeout
   ↓
Handle transient failures
   ↓
Retry + Backoff + Jitter
   ↓
Protect unhealthy dependencies
   ↓
Circuit Breaker
   ↓
Prevent duplicate effects
   ↓
Idempotency
   ↓
Observe everything
\`\`\`

لأن الهدف من Polly مش إننا نخلي:

\`\`\`text
Failure disappear.
\`\`\`

الهدف إننا نخلي:

# Failure controlled, limited, observable, and recoverable. 🛡️
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-23',
  category: 'Backend',
  readTime: '16 min read',
  image: pollyImage,
  featured: true,
};
