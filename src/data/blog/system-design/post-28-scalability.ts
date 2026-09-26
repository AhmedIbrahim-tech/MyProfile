import type { BlogPost } from '@/modules/blog/types';
import scalabilityImage from '@/assets/blog/system-design/scalability.jpg';

export const post: BlogPost = {
  id: 28,
  title: 'Scalability — إزاي السيستم ينتقل من مئات المستخدمين إلى ملايين؟',
  excerpt:
    '"عايز السيستم يبقى Scalable" مش معناها حط Load Balancer + Redis + Kubernetes. Scalability معناها إن النظام يقدر يزود قدرته على معالجة الـ workload كلما الـ demand يزيد. دليلك الشامل من Scale Up لـ Scale Out لـ Stateless Design لـ Database Bottlenecks وحتى Backpressure.',
  content: `# 🚀 System Design Series #02
# Scalability — إزاي السيستم ينتقل من مئات المستخدمين إلى ملايين؟

في الجزء الأول من سلسلة **System Design** اتفقنا على قاعدة مهمة جدًا:

> **Start simple. Measure. Find the bottleneck. Scale the bottleneck.**

دلوقتي هنبدأ بأول Concept كبير فعلًا في System Design:

# Scalability

ولما حد يقول:

> "عايز السيستم يبقى Scalable."

ده مش معناه:

\`\`\`text
حط Load Balancer
+ Redis
+ Kubernetes
+ Kafka
= Scalable ✅
\`\`\`

😄

الموضوع أعمق من كده.

Scalability معناها إن النظام يقدر **يزود قدرته على معالجة الـ workload كلما الـ demand يزيد، بدون انهيار الأداء بشكل غير مقبول**.

Microsoft تصف الـ scale-out الجيد بأن زيادة الموارد المفروض تؤدي إلى زيادة throughput بشكل قريب من التناسب، لكن عمليًا bottlenecks والـ synchronization points هي اللي بتحد scalability.

---

# 1. قبل Scalability: يعني إيه Load أصلًا؟

خلينا ناخد E-Commerce بسيط:

\`\`\`text
React / Next.js
       ↓
ASP.NET Core
       ↓
PostgreSQL
\`\`\`

في البداية عندك 100 users/day. Everything works.

بعد فترة 10,000 users/day. لسه تمام.

بعدها 1,000,000 users/day، بدأت تلاحظ:

\`\`\`text
CPU ↑   Memory ↑   DB Connections ↑
Latency ↑   Timeouts ↑   Error Rate ↑
\`\`\`

هنا السؤال:

> إزاي نزود قدرة السيستم من غير ما نعيد بناءه بالكامل كل مرة عدد المستخدمين يزيد؟

دي الـ Scalability.

---

# 2. Scalability مش مجرد عدد المستخدمين

لما حد يقول System supports 10M users، المعلومة دي لوحدها تقريبًا ملهاش معنى.

لأن:

\`\`\`text
10M Registered Users   ≠   10M Daily Active Users   ≠   10M Concurrent Users
\`\`\`

لازم نفهم:

\`\`\`text
Requests Per Second / Reads / Writes / Payload Sizes
Database Queries / CPU Work / Storage Growth / Network Bandwidth
\`\`\`

مثال:

System A: 5M users كل واحد يبعت 2 requests/day.

System B: 100K users كل واحد يبعت 100 requests/minute.

System B ممكن تكون أصعب بكتير.

---

# 3. Performance vs Scalability

## Performance

بتسأل: Request واحدة بتاخد وقت قد إيه؟

\`\`\`text
GET /products/10  →  Latency = 80ms
\`\`\`

## Scalability

بتسأل: لو عدد Requests زاد، هل السيستم تقدر تزود قدرتها؟

\`\`\`text
1 server → 2K RPS
2 servers → 4K RPS
4 servers → 8K RPS
\`\`\`

ده Scaling ممتاز تقريبًا.

لكن لو:

\`\`\`text
1 server → 2K RPS
2 servers → 2.3K RPS
4 servers → 2.4K RPS
\`\`\`

غالبًا عندك Bottleneck مش في الـ API Servers.

ممكن Application تكون Fast at 100 users لكن Collapses at 10,000 users.

يعني: Good Performance ≠ Good Scalability.

---

# 4. Scalability vs Elasticity

## Scalability

قدرة System على زيادة capacity.

## Elasticity

قدرة System على Scale Out عند زيادة demand، وScale In عند نقصانه تلقائيًا.

مثلًا:

\`\`\`text
08:00 → 3 Servers
12:00 → 20 Servers
03:00 → 2 Servers
\`\`\`

Cloud platforms بتدعم horizontal autoscaling. Microsoft توضح إن scale-out/scale-in يسمح بإضافة أو إزالة instances حسب الطلب، بينما vertical scaling أقل ملاءمة للأتمتة.

---

# 5. Scale Up vs Scale Out

أول قرار كبير. عندك Server ضعيفة. عندك طريقين.

# Vertical Scaling — Scale Up

نزود قوة نفس الـ Machine:

\`\`\`text
Before: 4 CPU / 8 GB RAM
After: 64 CPU / 256 GB RAM
\`\`\`

## مميزات Vertical Scaling

سهلة جدًا. الـ Application غالبًا مش محتاجة Architecture مختلفة.

\`\`\`text
One Server → Upgrade Machine → Done
\`\`\`

مفيش Distributed State أو Load Balancing بنفس الدرجة.

## عيوب Vertical Scaling

في Limit في الآخر. Machine size != infinity.

كمان Server واحدة تفضل Single Point of Failure.

Microsoft تذكر إن vertical scaling أقل مرونة من horizontal autoscaling.

## إمتى Vertical Scaling مناسبة؟

لو عندك Small/Medium System والـ Database محتاجة RAM أكتر فقط.

\`\`\`text
32 GB → 64 GB
\`\`\`

ممكن ده يكون أبسط وأرخص من Sharding.

مش كل مشكلة تستحق Distributed System.

---

# 6. Horizontal Scaling — Scale Out

بدل Server واحدة، نعمل servers متعددة والـ Traffic تتوزع:

\`\`\`text
              ┌→ API 1
Users → LB ───┼→ API 2
              ├→ API 3
              └→ API 4
\`\`\`

لو Load زادت: نضيف instances.

لو Load قلت: نشيل instances.

وده الاتجاه الأساسي في معظم cloud-scale web workloads.

---

# 7. ليه Horizontal Scaling جذابة؟

\`\`\`text
Scale gradually / Handle failures / Autoscale / Distribute load / Deploy with less downtime
\`\`\`

لكن هنا تبدأ مشاكل Distributed Systems الحقيقية.

---

# 8. أول مشكلة: مين يستقبل الـ Request؟

لما يبقى عندك API 1 وAPI 2 وAPI 3:

# Load Balancer

\`\`\`text
Users → Load Balancer → ┌────┬────┬────┐
                         A    B    C    D
\`\`\`

هنخصص Load Balancing بمقالة مستقلة بعدين.

> Horizontal Scaling تحتاج طريقة لتوزيع الـ Traffic.

---

# 9. المشكلة الأكبر: State

تخيل User سجل Login.

\`\`\`text
Request 1: User → LB → Server A → خزنت Session في Memory
Request 2: User → LB → Server C → "أحمد مين؟" 😄
\`\`\`

لأن الـ state موجودة في RAM بتاعة Server A فقط.

# Stateful Server

\`\`\`text
In-memory sessions / Local files / Local cache / Machine-specific state
\`\`\`

# Sticky Sessions

ممكن تقول للـ Load Balancer: Ahmed → Server A forever.

لكن لو Server A وقعت: Ahmed Session ماتت.

ولو أحمد بيعمل Traffic ضخمة: Server A overloaded وServers B/C idle.

Microsoft تنصح بتجنب instance stickiness.

---

# 10. الحل الأفضل: Stateless Application Layer

\`\`\`text
Any request → Any instance
\`\`\`

الـ state المهمة نحطها في مكان مشترك:

\`\`\`text
Database / Distributed Cache / Object Storage / External Identity Provider
\`\`\`

**Stateless لا يعني مفيش State.**

أي Application تقريبًا عندها State. الفكرة:

> الـ state المهمة ما تكونش مرتبطة بذاكرة Web Server واحدة.

# مثال ASP.NET Core — Distributed Cache

\`\`\`text
           ┌→ API 1
Browser → LB → API 2  → Redis
           └→ API 3
\`\`\`

\`\`\`csharp
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration =
        builder.Configuration
            .GetConnectionString("Redis");
});
\`\`\`

\`\`\`csharp
public sealed class CartService
{
    private readonly IDistributedCache _cache;

    public CartService(IDistributedCache cache)
    {
        _cache = cache;
    }
}
\`\`\`

لكن خد بالك: Redis نفسها بقت dependency جديدة.

\`\`\`text
Scaling solved one problem → Introduced another dependency
\`\`\`

Welcome to System Design 😄

---

# 11. المشكلة التالية: Database

\`\`\`text
API 1, API 2, API 3, API 4, API 5  →  Database (Bottleneck!)
\`\`\`

لو Database تقدر تعمل 10K queries/sec وأنت عندك 20 API servers تنتج 40K…

# الـ Database أصبحت Bottleneck.

# Scaling one layer does not scale the whole system.

زيادة API Servers والـ DB هي Bottleneck ممكن تسوء performance أكتر:

\`\`\`text
More DB connections / More queries / More contention / More locks
\`\`\`

---

# 12. قبل ما تعمل Scale للـ Database: Optimize

المشكلة ممكن تكون:

\`\`\`sql
SELECT * FROM Orders  -- على 100M rows بدون Pagination 😄
\`\`\`

أو Missing Index. أو N+1 Queries.

\`\`\`csharp
// N+1 Example
var orders = await context.Orders.ToListAsync();
foreach (var order in orders)
{
    var customer = order.Customer; // N+1 query per order!
}
\`\`\`

قبل Scaling:

\`\`\`text
Inspect Queries / Use Indexes / Project only needed columns
Paginate / Avoid N+1 / Measure execution plans
\`\`\`

---

# 13. Async/await وعلاقتها بالـ Scalability في .NET

لو كتبت:

\`\`\`csharp
var orders = context.Orders.ToList(); // Thread blocked!
\`\`\`

Thread ممكن تفضل blocked أثناء انتظار I/O.

لكن:

\`\`\`csharp
var orders = await context.Orders
    .ToListAsync(cancellationToken); // Thread free for other work
\`\`\`

# Async لا تجعل Database أسرع

لو Query 500ms، async مش هيحولها 50ms.

الفائدة:

# Better resource utilization under concurrency.

Server نفسها تقدر تتعامل مع عدد أكبر من concurrent I/O operations.

---

# 14. Thread Pool Starvation

1000 Requests كل واحدة تعمل Blocking I/O:

\`\`\`text
Requests → Thread Pool full → Queue grows → Latency ↑ → Timeouts ↑
\`\`\`

وده سبب إن "Async all the way" مهم في I/O-heavy ASP.NET Core code.

---

# 15. Scale Database Reads

لو أغلب load 95% Reads / 5% Writes:

\`\`\`text
        Write
          ↓
       Primary
      ↙   ↓   ↘
Replica1 Replica2 Replica3
   ↑        ↑       ↑
 Reads    Reads     Reads
\`\`\`

ده:

# Read Replicas

لكن تدخل مشكلة:

# Replication Lag.

User يكتب Name = "Ahmed" على Primary، وبعد milliseconds يقرأ من Replica يلاقي "Mohamed".

وده هنوصل له بالتفصيل في مقالات Replication القادمة.

---

# 16. Scale Database Writes

لو المشكلة Writes، عندك options أصعب:

\`\`\`text
Partitioning / Sharding
\`\`\`

\`\`\`text
Users A-F → Shard 1
Users G-M → Shard 2
Users N-S → Shard 3
Users T-Z → Shard 4
\`\`\`

لكن Sharding تضيف Complexity كبيرة:

\`\`\`text
Cross-shard joins / Cross-shard transactions / Rebalancing
Hot shards / Global uniqueness / Routing
\`\`\`

---

# 17. Hot Partition

تخيل shard key هي Country:

\`\`\`text
Egypt → 80% of users → Egypt Shard 🔥🔥🔥
France → 5% → France Shard 😴
\`\`\`

وزعت الـ Data… لكن ما وزعتش الـ Load.

اختيار partition key جزء أساسي من Scalability.

---

# 18. Caching كأداة Scaling

Product ID=100 يتم قراءته 50,000 مرة/min لكن بيتعدل مرة كل ساعتين.

بدل 50,000 DB reads:

\`\`\`text
Request → Cache → Hit → Return
              ↓
             Miss → Database → Cache
\`\`\`

لكن Cache مش Scalability Magic. أنت أضفت:

\`\`\`text
Cache invalidation / Stale data / Cache stampede
Hot keys / Memory pressure / Cache outage
\`\`\`

المقالة رقم 10 في السلسلة (Caching Strategies) هتدخل في التفاصيل.

---

# 19. Scale Static Content

Images وJS وCSS والـ PDFs:

\`\`\`text
Browser → CDN → Object Storage
\`\`\`

فتشيل traffic ضخمة من الـ Backend أصلًا.

أحيانًا أفضل طريقة Scaling هي:

# Make fewer requests reach your servers.

---

# 20. Offloading

\`\`\`http
POST /users/register
\`\`\`

بعد Registration لو السيستم تعمل:

\`\`\`text
Save user + Send email + Generate image + Notify CRM + Analytics + PDF
\`\`\`

كلهم داخل HTTP Request = المستخدم يستنى وقت طويل. Failure في Email توقع Registration كلها.

# الحل: Async Processing

\`\`\`text
Register → Save Critical Data → Return Response
                                      ↓
                                Message Queue
                               ↙    ↓      ↘
                            Email  CRM  Analytics
\`\`\`

الـ Request الأساسية خلصت بسرعة. والـ Workers تقدر تعمل scale بشكل مستقل.

---

# 21. Scaling Workers

لو Queue عندها 1,000,000 jobs:

\`\`\`text
Queue → Worker 1 / Worker 2 / Worker 3 / Worker N
\`\`\`

# ASP.NET Core BackgroundService

\`\`\`csharp
public sealed class EmailWorker : BackgroundService
{
    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Receive job
            // Process job
            await Task.Delay(100, stoppingToken);
        }
    }
}
\`\`\`

في distributed production workload لازم تفكر في:

\`\`\`text
Durability / Retries / Multiple workers
Duplicate delivery / DLQ / Idempotency
\`\`\`

---

# 22. Independent Scaling

مش كل Component محتاج نفس scale:

\`\`\`text
Product Browsing → 100K RPS
Checkout         → 5K RPS
Admin Panel      → 50 RPS
Email Worker     → 2K jobs/sec
\`\`\`

لو كله مربوط في وحدة جامدة، ممكن تضطر تكبر كل حاجة بسبب جزء واحد.

وده أحد أسباب ظهور Microservices أحيانًا.

لكن:

# مش سبب إنك تبدأ Microservices من أول يوم.

---

# 23. Modular Monolith ممكن Scale

\`\`\`text
Next.js → LB → ASP.NET Core Modular Monolith × 10 → PostgreSQL → Redis
\`\`\`

وتخدم Load ضخم.

Microservices مش requirement للـ horizontal scaling.

إمتى Microservices تساعد؟

لما يكون عندك Catalog needs 100 instances وPayments needs 5، أو Different release cycles وDifferent scaling profiles.

ساعتها independent services ممكن تديك value.

لكن تضيف:

\`\`\`text
Network calls / Distributed transactions / Observability complexity
Deployment complexity / Consistency problems
\`\`\`

---

# 24. Coordination هي عدو Scalability

100 Servers، لكن قبل كل Request لازم كلهم يتفقوا:

\`\`\`text
All Servers → Global lock → one at a time
\`\`\`

مفيش استفادة فعلية.

# Amdahl's Law بشكل مبسط

لو 90% من العملية parallelize، لكن 10% serial…

الـ 10% دي في الآخر تحد أقصى Scaling.

دائمًا دور على:

\`\`\`text
Shared lock / Single database / Single queue partition / Global counter
\`\`\`

---

# 25. Connection Pools

\`\`\`text
5 Servers × 100 connections = 500 connections
100 Servers × 100 connections = 10,000 connections
\`\`\`

Database مش شرط تتحمل ده.

# Application scales faster than its dependency.

Autoscaling محتاج يبقى فاهم capacity الـ downstream systems.

---

# 26. Scale-Out ممكن يوقع Database

\`\`\`text
Traffic ↑ → Autoscaler adds 50 instances → Each opens DB connections
→ DB overloaded → API requests slow → Autoscaler adds more → 💥
\`\`\`

😄

Autoscaling لوحدها مش ذكاء. لازم تعرف DB limits وExternal API limits وConnection pools.

---

# 27. Autoscaling

## Metric-based

\`\`\`text
CPU > 70% for 5 minutes → add 2 instances
\`\`\`

## Scheduled Scaling

لو Traffic predictable:

\`\`\`text
08:45 scale out / 19:00 scale in
\`\`\`

Microsoft توصي باستخدام metrics للـ unpredictable workloads والـ schedules للـ predictable patterns.

---

# 28. CPU مش دايمًا Metric صح

\`\`\`text
CPU = 25% → Autoscaler: "Everything is fine 👍"
\`\`\`

لكن:

\`\`\`text
Request Queue = 50,000 / DB latency = 5 sec
\`\`\`

والمستخدمين بيعيطوا 😄

Metric أفضل حسب workload:

\`\`\`text
RPS per instance / Queue length / P95 latency / Concurrent requests
\`\`\`

---

# 29. Scale In مهم زي Scale Out

لو Worker processing job وInstance اتشالت، إيه اللي يحصل للـ Job؟

لازم يبقى فيه:

\`\`\`text
Graceful shutdown / Message acknowledgment / Retry / Checkpoint
\`\`\`

---

# 30. Queue كـ Buffer للـ Traffic Spikes

System تقدر تعالج 10K jobs/sec. فجأة جالك 100K jobs/sec.

\`\`\`text
Producer → Queue → Consumers
\`\`\`

Queue تمتص الـ spike مؤقتًا.

لكن:

# Queue doesn't create capacity.

لو الحمل مستمر، في النهاية لازم:

\`\`\`text
Scale consumers / Reduce producers / Reject work
\`\`\`

---

# 31. Backpressure

لو Producer ينتج 100K msg/sec والـ Consumer يعالج 5K msg/sec، Queue هتكبر للأبد.

في لحظة لازم تقول: Slow down.

ده:

# Backpressure

\`\`\`text
Rate Limiting / Bounded Queues / 429 / Consumer Prefetch limits / Load Shedding
\`\`\`

---

# 32. Rate Limiting

تخيل User واحدة تبعت 100K requests/sec. ليه تستهلك كل الـ Servers؟

\`\`\`text
Client → Rate Limiter → Application
\`\`\`

# مثال ASP.NET Core

\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(
        "api",
        limiter =>
        {
            limiter.PermitLimit = 100;
            limiter.Window = TimeSpan.FromMinutes(1);
        });
});

app.UseRateLimiter();
\`\`\`

---

# 33. Scaling Reads vs Writes

Read-heavy (95% Read / 5% Write):

\`\`\`text
Cache / CDN / Read replicas / Precomputed views / Search indexes
\`\`\`

Write-heavy (10% Read / 90% Write):

\`\`\`text
Partitioning / Batching / Queues / Write optimization / Event streams
\`\`\`

Scalability Design تبدأ من:

# Access Pattern — مش من Technology.

---

# 34. Batching

بدل 1 DB insert per message × 100K messages = 100K DB round trips:

\`\`\`text
Batch 500 items → ممكن تقلل overhead جدًا
\`\`\`

Trade-off:

\`\`\`text
Throughput ↑ / Latency per individual item ↑ sometimes
\`\`\`

---

# 35. Denormalization

أحيانًا Query معقدة محتاجة 10 joins وتتعمل ملايين المرات.

بدل Orders JOIN Users JOIN Payments JOIN Shipping JOIN Products كل مرة، نعمل Read Model جاهز.

لكن:

\`\`\`text
Duplicate data / Synchronization complexity / Eventual consistency
\`\`\`

---

# 36. Hot Keys في Cache

Key واحدة عليها 500K requests/sec:

\`\`\`text
Node 1 🔥 / Node 2 😴 / Node 3 😴
\`\`\`

الـ distribution لازم تبقى distribution للـ load مش للـ data فقط.

---

# 37. Frontend Scalability — React / Next.js

Scalability مش Backend فقط.

لو صفحة Product بتتغير مرة كل ساعة ومليون شخص بيشوفها، هل لازم 1M SSR executions؟

ممكن:

\`\`\`text
Static generation + Revalidation + CDN caching
\`\`\`

أفضل Request للـ Backend:

# هي الـ Request اللي ما احتجناش نبعتها أصلًا.

---

# 38. Don't Send What You Don't Need

لو endpoint يرجع كل الـ fields لكل Product والواجهة محتاجة Id وName وPrice وImage فقط:

\`\`\`text
أنت بتدفع: Database I/O + Serialization CPU + Network bandwidth + Memory
\`\`\`

مجانًا.

استخدم DTO / Projection مناسب للـ use case.

---

# 39. Pagination

لو عندك 10M Orders:

\`\`\`http
GET /orders?page=1&pageSize=50
\`\`\`

وفي large datasets، cursor pagination ممكن تكون أنسب.

---

# 40. Compression

لو Response 2 MB وتطلع 1000 مرة/sec:

\`\`\`text
~2 GB/sec network traffic
\`\`\`

Compression وتقليل payloads ممكن يكونوا scaling techniques فعلية.

---

# 41. Scale حسب Bottleneck

| Bottleneck | الحل |
|---|---|
| CPU | More instances / Better algorithms |
| Database Reads | Indexes / Cache / Read Replicas |
| Database Writes | Batching / Partitioning / Sharding |
| Network | CDN / Compression / Smaller payloads |
| External API | Cache / Queue / Rate limit / Circuit breaker |

---

# 42. غلط تقول: "نحتاج Redis عشان Scale"

اسأل: إيه Bottleneck؟

Technology لازم تحل Constraint واضحة.

لو DB مفيهاش مشكلة: Redis may add unnecessary complexity.

لو المشكلة CPU: Redis won't magically fix CPU-heavy code.

---

# 43. مثال كامل: من 100 User إلى ملايين

## المرحلة 1 — 100 Users

\`\`\`text
Browser → ASP.NET Core → PostgreSQL
\`\`\`

لا Redis. لا Kafka. لا Kubernetes.

## المرحلة 2 — 10K Users

Scale Up + Optimize Queries + Indexes + Async I/O + Pagination.

## المرحلة 3 — 100K Users

\`\`\`text
        ┌→ API 1
LB ─────┼→ API 2  → PostgreSQL
        └→ API 3
\`\`\`

API Stateless.

## المرحلة 4 — 500K Users

\`\`\`text
API → Redis → PostgreSQL
Browser → CDN → Object Storage
\`\`\`

## المرحلة 5 — 1M Users

\`\`\`text
Writes → Primary / Reads → Replicas
\`\`\`

لكن دلوقتي لازم نفهم Replication lag وConsistency وStale reads.

## المرحلة 6 — Background Work

\`\`\`text
API → Message Queue → Workers × N
\`\`\`

## المرحلة 7 — 10M Users

\`\`\`text
Partitioning / Sharding / Independent workloads
\`\`\`

فقط لو metrics بتقول إن ده المطلوب.

---

# Architecture النهائية ممكن تبقى:

\`\`\`text
                     ┌──────── CDN ─────── Object Storage
                     │
Users ── Load Balancer
                     │
         ┌───────────┼───────────┐
         ↓           ↓           ↓
       API 1       API 2       API N
         │           │           │
         └─────── Redis ─────────┘
                     │
              Database Primary
                ↙    ↓    ↘
             Read  Read   Read
            Replica Replica Replica
                     │
                Message Queue
              ↙      ↓       ↘
           Worker  Worker   Worker
\`\`\`

# إحنا ما بنيناش الشكل ده في Day 1. وصلنا له لأن المشاكل فرضته.

---

# 44. كيف تعرف إنك محتاج Scale؟

مش بالإحساس. راقب:

| Metric | ممكن تدل على |
|---|---|
| CPU | Compute pressure |
| Memory | Memory pressure/leaks |
| P95/P99 latency | User-visible degradation |
| RPS | Traffic growth |
| Error rate | Capacity/failure issues |
| DB Connections | Connection pressure |
| Slow Queries | Query/index issues |
| Cache Hit Rate | Cache effectiveness |
| Queue Length | Worker capacity gap |
| Thread Pool | Blocking/starvation |
| 429s | Rate limits reached |

---

# 45. P95 وP99 أهم من Average

\`\`\`text
Average latency = 100ms  ← يبدو ممتاز
\`\`\`

لكن:

\`\`\`text
P50 = 50ms / P95 = 300ms / P99 = 8 seconds
\`\`\`

يعني جزء من المستخدمين Experience بتاعتهم كارثية.

في scalable systems:

# Tail latency matters.

---

# 46. Load Testing

| Test Type | الهدف |
|---|---|
| Load Test | Expected production load |
| Stress Test | فين نقطة الانهيار؟ |
| Spike Test | إيه اللي يحصل لو traffic تضاعفت فجأة؟ |
| Soak Test | هل النظام يفضل مستقر لساعات/أيام؟ |

# Capacity of the whole chain.

لو عملت Mock للـ Database وقلت "API handles 100K RPS"… ده مش معناه System handles 100K RPS.

Load Testing تكشف:

\`\`\`text
Connection pool exhaustion / Thread pool starvation / Lock contention
GC pressure / Memory leaks / Hot cache keys / DB deadlocks
\`\`\`

حاجات مش هتظهر عند localhost + one developer 😄

---

# 47. Scalability vs Reliability

5 Servers → واحدة وقعت → 4 لسه شغالة.

لكن لو كل Servers تعتمد على One Database وقعت: كلهم وقعوا.

Scaling مش Automatically High Availability.

---

# 48. Scalability vs Cost

100 servers تستخدم 5% منهم = Scalable + بتحرق فلوس 🔥

الهدف:

\`\`\`text
Enough capacity + Reasonable headroom + Autoscaling + Cost efficiency
\`\`\`

---

# 49. Premature Scaling

\`\`\`text
User count = 100
Developer: Let's shard PostgreSQL. 😄
\`\`\`

Sharding ممكن يحل مشكلة أنت لسه معندكش إياها ويخلق 20 مشكلة جديدة.

---

# 50. أشهر أخطاء Scalability

1. **Scale قبل Measure.**
2. **زيادة API Servers بينما Database هي المشكلة.**
3. **تخزين critical state في local memory.**
4. **الاعتماد على Sticky Sessions بدون داعٍ.**
5. **Blocking I/O داخل ASP.NET Core تحت Load عالي.**
6. **N+1 queries وغياب Pagination/Indexes.**
7. **Autoscaling على CPU فقط.**
8. **نسيان limits بتاعة Database والـ External APIs.**
9. **Queue غير محدودة بدون Backpressure.**
10. **عمل Microservices فقط لأن "هنكبر بعدين".**
11. **Sharding قبل الحاجة الحقيقية.**
12. **تجاهل Hot Keys وHot Partitions.**
13. **Scale-out من غير graceful scale-in.**
14. **عدم وجود Rate Limiting.**
15. **عدم عمل Load Testing.**
16. **اعتبار Registered Users مقياسًا للـ Load.**
17. **استخدام Average latency فقط.**
18. **حل كل مشكلة بإضافة Technology بدل تحسين الموجودة.**

---

# 51. Scalability في ASP.NET Core تحديدًا

\`\`\`csharp
[HttpGet("{id:guid}")]
public async Task<ActionResult<OrderDto>> Get(
    Guid id,
    CancellationToken cancellationToken)
{
    var order = await _context.Orders
        .AsNoTracking()
        .Where(x => x.Id == id)
        .Select(x => new OrderDto(x.Id, x.Number, x.Total))
        .SingleOrDefaultAsync(cancellationToken);

    return order is null ? NotFound() : Ok(order);
}
\`\`\`

لاحظ:

\`\`\`text
Async / AsNoTracking / Projection / CancellationToken
\`\`\`

كل حاجة منهم صغيرة… لكن على ملايين Requests، التفاصيل الصغيرة تتراكم.

---

# 52. Mental Model مهم جدًا

\`\`\`text
Users Increase → Load Increases → Measure System
→ Find Bottleneck → Optimize First → Scale Only What Needs Scaling
\`\`\`

\`\`\`text
Compute Problem     → Scale Compute
Read Problem        → Cache / Replicas
Write Problem       → Partition
Async Work Problem  → Queue
Static Content      → CDN
Coordination        → Reduce Coordination
Traffic Abuse       → Rate Limiting
Traffic Spike       → Elasticity / Buffering
\`\`\`

---

# 53. أهم قاعدة في Scalability

مش "More servers."

لكن:

# Remove the thing preventing more servers from helping.

لأن لو عندك 100 API Servers كلهم واقفين على one global lock، فأنت فعليًا لسه عندك One-at-a-time System.

---

# الخلاصة 🚀

Scalability مش Technology.

Scalability هي:

> **قدرة النظام على زيادة قدرته مع نمو الـ workload بدون انهيار غير مقبول في الأداء أو التكلفة أو الاعتمادية.**

ابدأ بسيستم بسيطة ومع نموها:

\`\`\`text
Scale Up → Scale Out → Stateless Instances → Load Balancing
→ Optimize Database → Cache → Replication
→ Async Messaging → Partitioning
\`\`\`

كل خطوة لازم يكون قبلها سؤال:

# What bottleneck am I solving?

وخلّي القاعدة دي معاك طول سلسلة System Design:

> **Scale the bottleneck — not the architecture diagram.**

---

# 🔜 System Design Series #03

المقالة الجاية:

# **CAP Theorem**

\`\`\`text
Database A
     ↕
Network
     ↕
Database B
\`\`\`

ماذا يحدث لو A شغالة وB شغالة لكن Network بينهم اتقطعت؟

وهنا تبدأ:

# Consistency vs Availability during a Network Partition.
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-26',
  category: 'Architecture',
  readTime: '20 min read',
  image: scalabilityImage,
};

