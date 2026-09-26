import type { BlogPost } from '@/modules/blog/types';
import replicationImage from '@/assets/blog/system-design/intro-to-database-replication.jpg';

export const post: BlogPost = {
  id: 30,
  title: 'Intro to Database Replication — ليه بنعمل نسخ متعددة من الـ Database؟ وإيه المشاكل الجديدة اللي بتظهر بعدها؟',
  excerpt:
    'أول ما تعمل Database Replication تظهر أسئلة أصعب: مين يستقبل Writes؟ إمتى الـ Replica تعتبر محدثة؟ وماذا لو الـ Primary وقعت أو Replica تأخرت؟ دليلك الشامل لأساسيات Database Replication: من High Availability وRead Scalability وDisaster Recovery إلى Replication Lag، Stale Reads، وSynchronous vs Asynchronous.',
  content: `# 🗄️ System Design Series #04
# Intro to Database Replication
## ليه بنعمل نسخ متعددة من الـ Database؟ وإيه المشاكل الجديدة اللي بتظهر بعدها؟

في المقالة السابقة عن **CAP Theorem** وصلنا لنقطة مهمة جدًا.

بدأنا في أول السلسلة بـ:

\`\`\`text
Application
    ↓
Database
\`\`\`

وبعد ما الـ System كبرت، بقينا نفكر:

\`\`\`text
Application
    ↓
Database Primary
       ↓
     Replica
\`\`\`

أو حتى:

\`\`\`text
               ┌── Replica A
Primary ───────┼── Replica B
               └── Replica C
\`\`\`

شكليًا الموضوع بسيط:

> عندي Database، أعمل منها كام نسخة وخلاص.

لكن أول ما تعمل Replication تبدأ أسئلة أصعب بكتير:

\`\`\`text
مين يستقبل Writes؟

مين يستقبل Reads؟

إمتى الـ Replica تعتبر محدثة؟

ماذا لو الـ Primary وقعت؟

ماذا لو Replica متأخرة؟

ماذا لو Network اتقطعت؟

هل آخر Write ممكن تضيع؟

هل المستخدم ممكن يقرأ بيانات قديمة؟

هل Replication تعتبر Backup؟

هل Replicas تزود Write Capacity؟
\`\`\`

وده اللي هنفهمه في المقالة دي.

---

# Database Replication يعني إيه؟

ببساطة:

# Replication = الاحتفاظ بنسخ متعددة من نفس البيانات على أكثر من Database Node.

بدل:

\`\`\`text
           Database
\`\`\`

يبقى عندنا:

\`\`\`text
          Primary
          /  |  \\
         ↓   ↓   ↓
       R1    R2   R3
\`\`\`

كل واحدة من:

\`\`\`text
R1
R2
R3
\`\`\`

تحاول تحتفظ بنسخة من البيانات الموجودة على الـ Primary.

في PostgreSQL مثلًا، الـ primary يمكنه إرسال تغييرات الـ WAL إلى standby servers باستمرار، ويمكن لبعض الـ standbys خدمة read-only queries، بينما توجد أيضًا logical replication بشكل منفصل.

---

# أول سؤال: ليه أصلًا نعمل Replication؟

فيه أكتر من سبب، وأهم حاجة ما نخلطهمش ببعض.

ممكن نستخدم Replication من أجل:

\`\`\`text
High Availability

Fault Tolerance

Read Scalability

Disaster Recovery

Geographic Distribution

Reducing Recovery Time
\`\`\`

لكن كل هدف منهم له Architecture مختلفة شوية.

---

# 1. High Availability

تخيل عندك:

\`\`\`text
Application
    ↓
Database
\`\`\`

والـ Database وقعت.

النتيجة:

\`\`\`text
API ✅
Frontend ✅
Redis ✅

Database ❌

System ❌
\`\`\`

الـ Database أصبحت:

# Single Point of Failure

ممكن نضيف Replica:

\`\`\`text
Application
    ↓
Primary
    ↓
Replica
\`\`\`

لو Primary وقعت:

\`\`\`text
Primary ❌

Replica
   ↓
Promote
   ↓
New Primary ✅
\`\`\`

وده يقلل الـ downtime.

---

# لكن وجود Replica وحده ≠ High Availability

دي نقطة مهمة جدًا.

لو عندك Replica لكن Failover محتاج Engineer:

\`\`\`text
يصحي من النوم
↓
يفتح Laptop
↓
يتأكد من الـ Replica
↓
يغير Connection String
↓
Restart Application
\`\`\`

😄

ممكن downtime تفضل طويلة.

High Availability محتاجة الصورة كاملة:

\`\`\`text
Replication
+
Failure Detection
+
Failover
+
Routing
+
Application Reconnection
+
Monitoring
\`\`\`

مش Replication فقط.

---

# 2. Read Scalability

تخيل E-Commerce عندها:

\`\`\`text
5% Writes

95% Reads
\`\`\`

مثلًا:

\`\`\`text
Create Order       → Write
Update Product     → Write

View Product       → Read
Search Products    → Read
View Order         → Read
Reports            → Read
\`\`\`

لو كل العمليات تروح نفس Database:

\`\`\`text
               Reads
                 ↓
Application → Primary
                 ↑
               Writes
\`\`\`

الـ Primary ممكن تبقى Bottleneck.

نعمل:

\`\`\`text
                     ┌── Replica 1 ← Reads
                     │
Writes → Primary ────┼── Replica 2 ← Reads
                     │
                     └── Replica 3 ← Reads
\`\`\`

فنوزع الـ Read workload.

PostgreSQL توثق هذا الاستخدام بوضوح: hot standby يمكن أن يخدم read-only queries، والـ replication يمكن استخدامها مع load balancing لتخفيف القراءة عن الـ primary.

---

# هل Read Replicas تزود Write Scalability؟

غالبًا:

# لا.

في Single-Leader architecture:

\`\`\`text
Writes
  ↓
Primary
\`\`\`

حتى لو عندك:

\`\`\`text
100 Replicas
\`\`\`

الـ Writes لسه داخلة:

\`\`\`text
One Primary
\`\`\`

يعني:

\`\`\`text
Read Scalability ↑↑↑

Write Scalability
قد تظل محدودة بالـ Primary
\`\`\`

ودي نقطة مهمة جدًا.

Replication وSharding مش نفس الحاجة.

---

# Replication vs Sharding

## Replication

بنكرر نفس البيانات:

\`\`\`text
Node A → Users 1...1M
Node B → Users 1...1M
Node C → Users 1...1M
\`\`\`

## Sharding

بنقسم البيانات:

\`\`\`text
Shard A → Users 1...300K

Shard B → Users 300K...600K

Shard C → Users 600K...1M
\`\`\`

يعني:

\`\`\`text
Replication
= Copy the data

Sharding
= Split the data
\`\`\`

وممكن System تستخدم الاتنين معًا:

\`\`\`text
Shard 1
├── Primary
├── Replica
└── Replica

Shard 2
├── Primary
├── Replica
└── Replica
\`\`\`

---

# 3. Fault Tolerance

لو عندك Data على Machine واحدة:

\`\`\`text
Disk Failure
Server Failure
OS Failure
Hardware Failure
\`\`\`

ممكن تمنع الوصول للبيانات.

وجود Replica على Machine مختلفة يخليك تتحمل بعض أنواع الفشل.

لكن لازم تسأل:

> مختلفة قد إيه؟

لو:

\`\`\`text
Primary
Replica
\`\`\`

الاتنين على نفس Physical Host...

الـ Host وقع:

\`\`\`text
Primary ❌
Replica ❌
\`\`\`

😄

يبقى Replication مش مفيدة قوي.

---

# Failure Domains

الأفضل نفكر في:

\`\`\`text
Different Process
Different Machine
Different Rack
Different Availability Zone
Different Region
\`\`\`

كل ما زودت المسافة والاستقلال:

\`\`\`text
Fault Isolation ↑
\`\`\`

لكن عادة:

\`\`\`text
Network Latency ↑

Cost ↑

Replication Complexity ↑
\`\`\`

Trade-off جديدة.

---

# 4. Disaster Recovery

ممكن يكون عندك:

\`\`\`text
Primary Database
Region A
\`\`\`

وReplica في:

\`\`\`text
Region B
\`\`\`

لو Region A بالكامل حصل لها مشكلة:

\`\`\`text
Power outage
Network outage
Natural disaster
Cloud region failure
\`\`\`

ممكن Region B تساعد في Recovery.

لكن هنا لازم نرجع لمفهومين من أول السلسلة:

# RPO

و:

# RTO

---

# RPO

Recovery Point Objective:

> مسموح أفقد قد إيه Data؟

لو:

\`\`\`text
RPO = 0
\`\`\`

معناها:

\`\`\`text
No committed data loss tolerated.
\`\`\`

لو:

\`\`\`text
RPO = 5 minutes
\`\`\`

يبقى في disaster ممكن تقبل فقد آخر خمس دقائق.

---

# RTO

Recovery Time Objective:

> مسموح الخدمة تفضل واقعة قد إيه؟

مثلًا:

\`\`\`text
RTO = 10 minutes
\`\`\`

يعني لازم ترجع خلال عشر دقائق تقريبًا.

Replication design تؤثر جدًا على الاتنين.

---

# 5. أهم Concept: الـ Replication مش Instant

دي النقطة اللي هنبني عليها مقالات كتير بعد كده.

تخيل:

\`\`\`text
Primary

Name = Ahmed
\`\`\`

وعندنا Replica:

\`\`\`text
Replica

Name = Ahmed
\`\`\`

User تعمل:

\`\`\`text
UPDATE User
SET Name = 'Mohamed'
\`\`\`

الـ Primary تصبح:

\`\`\`text
Primary

Mohamed
\`\`\`

لكن التغيير محتاج:

\`\`\`text
Generate replication record
↓
Send over network
↓
Replica receives it
↓
Replica applies it
\`\`\`

خلال الوقت ده ممكن تبقى:

\`\`\`text
Primary         Replica

Mohamed         Ahmed
\`\`\`

وده طبيعي في asynchronous replication.

---

# Replication Lag

الفترة اللي Replica فيها متأخرة عن مصدرها تسمى:

# Replication Lag

أو Replica Lag.

AWS مثلًا تعرض \`ReplicaLag\` كـ metric تقيس مقدار تأخر read replica عن source instance وتوصي بمراقبتها تشغيليًا.

---

# ليه Replication Lag تحصل؟

ممكن بسبب:

\`\`\`text
Network latency
Network outage
High write rate
Slow replica
CPU pressure
Disk I/O
Large transaction
Long-running queries
Replication backlog
\`\`\`

AWS تذكر مثلًا أن ارتفاع write rate أو contention والـ heavy queries على replicas يمكن أن يزيد lag.

---

# مثال

Primary تنتج:

\`\`\`text
10,000 changes/sec
\`\`\`

لكن Replica قادرة تطبق:

\`\`\`text
7,000 changes/sec
\`\`\`

كل ثانية:

\`\`\`text
+3,000 changes backlog
\`\`\`

بعد دقيقة:

\`\`\`text
180,000 changes behind
\`\`\`

Replication مش Magic.

الـ Replica لازم تكون قادرة:

# Keep up.

---

# 6. Stale Reads

هنا المستخدم يبدأ يلاحظ المشكلة.

User يعمل:

\`\`\`http
PUT /profile

{
    "name": "Mohamed"
}
\`\`\`

Write تروح Primary:

\`\`\`text
Primary:

Mohamed ✅
\`\`\`

API ترجع:

\`\`\`http
200 OK
\`\`\`

بعدها فورًا:

\`\`\`http
GET /profile
\`\`\`

Request راحت Replica:

\`\`\`text
Replica:

Ahmed
\`\`\`

فترد:

\`\`\`json
{
  "name": "Ahmed"
}
\`\`\`

المستخدم:

> أنا لسه مغير اسمي! 😐

ده:

# Stale Read

وهنعمل له مقالة كاملة لاحقًا:

**Tackling Stale Reads**

---

# 7. Read After Write

الـ scenario السابق اسمه مشكلة:

\`\`\`text
Read After Write
\`\`\`

User عملت Write...

ثم عايزة تشوف نفس الـ Write فورًا.

ممكن نحلها بأكتر من طريقة، مثل:

\`\`\`text
Read from Primary after write

Sticky read routing

Wait until replica reaches version

Session consistency
\`\`\`

هنفصلهم في المقالة الخاصة بـ Stale Reads.

---

# 8. الـ Primary والـ Replica

في أبسط Replication topology:

\`\`\`text
             Primary
           /    |    \\
          ↓     ↓     ↓
        R1      R2     R3
\`\`\`

## Primary

غالبًا تستقبل:

\`\`\`text
Writes
\`\`\`

وممكن تستقبل Reads أيضًا.

## Replica

عادة تستقبل:

\`\`\`text
Replication changes
\`\`\`

وفي كثير من architectures:

\`\`\`text
Read-only application queries
\`\`\`

PostgreSQL تستخدم terminology مثل primary وstandby، ويمكن للـ hot standby أن تقبل read-only connections.

---

# Primary / Replica أسماء Conceptual

ممكن تلاقي أنظمة أو Tutorials قديمة تستخدم:

\`\`\`text
Master / Slave
\`\`\`

والـ terminology الحديثة غالبًا:

\`\`\`text
Primary / Replica
Leader / Follower
Primary / Standby
Writer / Reader
\`\`\`

حسب المنتج.

---

# 9. التغييرات بتنتقل إزاي؟

مش عادة بنعمل:

\`\`\`text
SELECT *
FROM Database
\`\`\`

بعد كل Write ونبعت Database كلها 😄

معظم engines تسجل Changes في Log.

مثلًا concepts بأسماء مختلفة:

\`\`\`text
PostgreSQL → WAL

MySQL → Binary Log

SQL Server → Transaction Log
\`\`\`

الصورة العامة:

\`\`\`text
Transaction
    ↓
Primary writes to log
    ↓
Replication stream
    ↓
Replica
    ↓
Apply changes
\`\`\`

---

# WAL مثلًا

PostgreSQL عندها:

# Write-Ahead Log

بشكل مبسط:

قبل ما التغيير يعتبر durable بالشكل المطلوب، engine تسجل information في WAL.

Streaming Replication تقدر ترسل WAL records إلى standbys أثناء توليدها. PostgreSQL توضح أن الـ standby تتصل بالـ primary، والـ primary يstream الـ WAL إليها باستمرار.

---

# 10. Initial Sync

طيب لو Database عندها:

\`\`\`text
5 TB
\`\`\`

وضفت Replica جديدة...

مش هتبدأ من:

\`\`\`text
empty database
\`\`\`

وتستقبل changes الجديدة فقط.

لازم الأول تاخد:

# Initial Copy / Snapshot / Base Backup

ثم:

\`\`\`text
Snapshot
    ↓
Replica has baseline
    ↓
Replay changes after snapshot
    ↓
Catch up
    ↓
Ready
\`\`\`

---

# مثال

وقت Snapshot:

\`\`\`text
Primary LSN = 1000
\`\`\`

Replica تأخذ النسخة.

خلال النسخ Primary وصلت:

\`\`\`text
LSN = 1400
\`\`\`

بعد الـ snapshot لازم Replica تطبق:

\`\`\`text
1001
1002
...
1400
\`\`\`

لحد ما تلحق.

وده سبب إن إضافة Replica ضخمة مش instant.

---

# 11. Physical Replication

Replication ممكن تحصل على مستوى قريب جدًا من storage/log representation.

دي تسمى عادة:

# Physical Replication

بشكل مفاهيمي:

\`\`\`text
Database blocks / WAL
        ↓
Replica
\`\`\`

مميزاتها غالبًا:

\`\`\`text
High fidelity
Full database copy
Good for standby/failover
\`\`\`

لكن عادة بتكون مرتبطة بشكل أكبر بنفس engine/version/platform semantics حسب المنتج.

PostgreSQL تفرق صراحة بين physical streaming replication وlogical replication.

---

# 12. Logical Replication

بدل نسخ physical changes، ممكن نتعامل مع تغييرات منطقية:

\`\`\`text
INSERT Product
UPDATE Customer
DELETE Order
\`\`\`

الصورة:

\`\`\`text
Primary
 ↓
Logical Changes
 ↓
Subscriber
\`\`\`

وده يسمح في أنظمة معينة بمرونة أكبر:

\`\`\`text
Specific tables
Data integration
Selective replication
Migration scenarios
\`\`\`

وفي PostgreSQL مثلًا يوجد Publisher/Subscriber model للـ logical replication.

---

# Physical vs Logical

بشكل مبسط:

| Physical | Logical |
|---|---|
| Low-level replication | Higher-level changes |
| غالبًا full server/cluster style | ممكن selective |
| ممتازة للـ standby | ممتازة لبعض integration/migration |
| engine-coupled أكثر | أكثر مرونة في بعض السيناريوهات |
| replay storage/log changes | replay logical data changes |

مش معناها واحدة أفضل مطلقًا.

الـ use case هو اللي يحدد.

---

# 13. Synchronous Replication

دي واحدة من أهم القرارات.

User تعمل Write:

\`\`\`text
Client
  ↓
Primary
\`\`\`

في synchronous replication، الـ Primary ممكن تقول:

> مش هرجع Success غير لما Replica المطلوبة تأكد استلام/تثبيت التغيير حسب الـ configuration.

الصورة المبسطة:

\`\`\`text
Client
  ↓
Primary
  ↓
Replica
  ↓
ACK
  ↓
Primary
  ↓
Success
\`\`\`

---

# مميزات Synchronous Replication

ممكن تقلل احتمال فقد acknowledged writes أثناء failover.

كمان تقلل window اللي فيها replicas متأخرة، حسب الـ implementation والـ acknowledgement semantics.

PostgreSQL توضح إن synchronous solutions تؤخر اعتبار transaction committed حتى تتحقق acknowledgement المطلوبة، بينما asynchronous replication تسمح بتأخير propagation.

---

# لكن الثمن؟

# Latency.

تخيل Primary في:

\`\`\`text
Cairo
\`\`\`

والـ synchronous replica في:

\`\`\`text
New York
\`\`\`

كل Write ممكن تحتاج network round trip بين قارتين قبل Success.

يعني:

\`\`\`text
Consistency / Durability guarantees ↑

Write Latency ↑
\`\`\`

---

# ولو Replica unreachable؟

لو الـ commit محتاجة acknowledgement منها:

\`\`\`text
Primary ✅

Replica ❌
\`\`\`

ممكن Writes:

\`\`\`text
Wait
or
Fail
\`\`\`

يعني:

\`\`\`text
Availability ↓
\`\`\`

وهنا CAP اللي شرحناها في المقالة السابقة تبدأ تظهر عمليًا.

---

# 14. Asynchronous Replication

هنا الـ Primary تقول:

\`\`\`text
Write locally
↓
Commit
↓
Return Success
↓
Replicate afterwards
\`\`\`

الصورة:

\`\`\`text
Client
  ↓
Primary
  ↓
Success
  │
  └──── later ───→ Replica
\`\`\`

---

# الميزة

Write latency أقل.

ولو Replica بطيئة:

\`\`\`text
Primary can continue
\`\`\`

في كثير من التصاميم.

لكن فيه Window:

\`\`\`text
Primary = latest

Replica = behind
\`\`\`

PostgreSQL streaming replication asynchronous افتراضيًا؛ والتوثيق يوضح أن crash على الـ primary قبل وصول بعض committed transactions إلى standby قد يؤدي إلى فقدها عند failover.

---

# مثال Data Loss Window

عندنا:

\`\`\`text
T0 → Order 100 saved
T1 → Order 101 saved
T2 → Order 102 saved
\`\`\`

Replica وصلت لحد:

\`\`\`text
Order 100
\`\`\`

وفجأة Primary ماتت.

لو Promote للـ Replica:

\`\`\`text
Order 101 ❌
Order 102 ❌
\`\`\`

من منظور الـ new primary.

يعتمد مقدار الخطر على replication architecture والمنتج.

---

# Synchronous vs Asynchronous

| | Synchronous | Asynchronous |
|---|---|---|
| Write Latency | أعلى | أقل |
| Replication Lag | أقل عادة | متوقعة |
| Availability عند replica failure | ممكن تتأثر | أفضل غالبًا |
| Data-loss window عند failover | أقل | ممكن توجد |
| Geographic distance | أصعب | أسهل غالبًا |
| Complexity | عالية | عالية بشكل مختلف |

يعني:

# مفيش Free Lunch.

---

# 15. Semi-Synchronous؟

بعض الأنظمة توفر حلول وسط.

مثلًا بدل ما تستنى:

\`\`\`text
All replicas
\`\`\`

ممكن تستنى:

\`\`\`text
At least one replica
\`\`\`

أو:

\`\`\`text
Quorum
\`\`\`

ثم باقي النسخ تلحق Async.

Conceptually:

\`\`\`text
Primary
 ├── R1 ACK ✅
 ├── R2 ...
 └── R3 ...

One required ACK received
↓
Commit succeeds
\`\`\`

وده محاولة لموازنة:

\`\`\`text
Durability
Latency
Availability
\`\`\`

التفاصيل تختلف بشدة حسب الـ database.

---

# 16. Read Replicas

أحد أشهر استخدامات replication.

Architecture:

\`\`\`text
                     ┌── Replica A ← Product Reads
                     │
Application ─ Primary┼── Replica B ← Reports
                     │
                     └── Replica C ← Search/Analytics reads
\`\`\`

لكن في التطبيق مين يقرر Read تروح فين؟

ممكن يكون:

\`\`\`text
Application logic

Database driver

Proxy

Load balancer

Managed cloud endpoint
\`\`\`

حسب النظام.

---

# 17. Read Routing

ممكن نعمل:

\`\`\`text
Commands
   ↓
Primary

Queries
   ↓
Replica
\`\`\`

وده قريب جدًا من CQRS Concept اللي اتكلمنا عنه قبل كده.

لكن:

\`\`\`text
CQRS
≠
Read Replicas
\`\`\`

CQRS فصل مسؤوليات Read/Write في الـ application design.

أما Replication:

\`\`\`text
Data infrastructure concern.
\`\`\`

ممكن تستخدم واحدة بدون الثانية.

---

# 18. مثال .NET

ممكن يكون عندك Connection String للـ Write:

\`\`\`json
{
  "ConnectionStrings": {
    "WriteDatabase": "Host=primary-db;...",
    "ReadDatabase": "Host=replica-db;..."
  }
}
\`\`\`

وتعمل DbContexts مختلفة.

مثلًا:

\`\`\`csharp
builder.Services.AddDbContext<WriteDbContext>(
    options =>
        options.UseNpgsql(
            configuration.GetConnectionString(
                "WriteDatabase")));
\`\`\`

وللقراءة:

\`\`\`csharp
builder.Services.AddDbContext<ReadDbContext>(
    options =>
        options.UseNpgsql(
            configuration.GetConnectionString(
                "ReadDatabase")));
\`\`\`

---

# Query

\`\`\`csharp
public sealed class GetProductHandler
{
    private readonly ReadDbContext _context;

    public GetProductHandler(
        ReadDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto?> Handle(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Products
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new ProductDto(
                x.Id,
                x.Name,
                x.Price))
            .SingleOrDefaultAsync(
                cancellationToken);
    }
}
\`\`\`

والـ Commands:

\`\`\`text
WriteDbContext
→ Primary
\`\`\`

لكن...

لو Command خلصت وبعدها Query فورًا راحت Replica:

\`\`\`text
Stale Read ممكن تحصل.
\`\`\`

وده لازم Architecture تعرف تتعامل معاه.

---

# 19. كل Reads ينفع تروح Replica؟

لا.

دي غلطة شائعة.

مثال Checkout:

\`\`\`text
User applies coupon
↓
Coupon marked used on Primary
\`\`\`

بعد milliseconds:

\`\`\`text
Validate coupon
↓
Replica
\`\`\`

Replica لسه شايفة:

\`\`\`text
Used = false
\`\`\`

فتقبل Coupon تاني.

Oops.

في عمليات حساسة ممكن تحتاج:

\`\`\`text
Read from Primary
\`\`\`

أو consistency strategy أقوى.

---

# 20. Reporting Workload

من أفضل use cases للـ Replicas:

\`\`\`text
Reporting
BI
Analytics Queries
Exports
Dashboards
\`\`\`

تخيل Admin يعمل Report:

\`\`\`sql
SELECT ...
FROM Orders
JOIN Customers ...
GROUP BY ...
\`\`\`

تأخذ:

\`\`\`text
30 seconds
\`\`\`

لو نفذتها على Primary اللي بتخدم Checkout...

ممكن تعمل pressure عليها.

نقدر:

\`\`\`text
Production Writes
      ↓
   Primary
      ↓
 Reporting Replica
      ↑
 Big Reports
\`\`\`

وبالتالي نعزل workloads نسبيًا.

---

# 21. لكن Replica نفسها ممكن تتعب

لو عندك Report يعمل scan لـ:

\`\`\`text
500M rows
\`\`\`

على Replica...

Replica CPU/Disk تتشغل.

وهي في نفس الوقت لازم:

\`\`\`text
Apply replication stream
\`\`\`

لو Queries الثقيلة تستهلك مواردها:

\`\`\`text
Replication Lag ↑
\`\`\`

وده سبب إن الـ workload isolation محتاجة Capacity Planning حقيقي.

---

# 22. Cascading Replication

بدل:

\`\`\`text
Primary
 ├── Replica 1
 ├── Replica 2
 ├── Replica 3
 ├── Replica 4
 └── Replica 5
\`\`\`

كلهم ياخدوا data مباشرة من Primary...

ممكن نعمل:

\`\`\`text
Primary
   ↓
Replica A
  /    \\
 ↓      ↓
R1      R2
\`\`\`

ده:

# Cascading Replication

الفائدة:

\`\`\`text
Reduce direct replication load on primary
\`\`\`

لكن:

\`\`\`text
Additional lag
More failure dependencies
\`\`\`

PostgreSQL تدعم cascading replication حيث يمكن standby أن ترسل WAL downstream إلى standbys أخرى.

---

# 23. لو الـ Primary ماتت؟

دخلنا في:

# Failover

الحالة:

\`\`\`text
Primary ❌

Replica A ✅
Replica B ✅
\`\`\`

لازم نختار Replica تتحول:

\`\`\`text
Replica A
    ↓
 Promote
    ↓
New Primary
\`\`\`

ثم Application توصل لها.

---

# مراحل Failover

Conceptually:

\`\`\`text
Detect failure
      ↓
Choose new primary
      ↓
Promote replica
      ↓
Prevent old primary from writing
      ↓
Redirect clients
      ↓
Reconfigure replicas
\`\`\`

كل خطوة فيها مشاكل.

---

# 24. مين يختار الـ New Primary؟

ممكن:

\`\`\`text
Human operator

Cluster manager

Consensus system

Managed database service
\`\`\`

حسب architecture.

لكن السؤال الصعب:

> إزاي نعرف إن الـ Primary فعلًا ماتت ومش مجرد Network Partition؟

دي ترجعنا مباشرة لـ:

# CAP Theorem.

---

# 25. Split Brain

تخيل:

\`\`\`text
Primary A
   │
   X Network
   │
Replica B
\`\`\`

B مش شايفة A.

فتقول:

\`\`\`text
A ماتت.
أنا New Primary.
\`\`\`

لكن A لسه شغالة وبتستقبل Writes.

يبقى عندنا:

\`\`\`text
Primary A ← Writes

Primary B ← Writes
\`\`\`

ده:

# Split Brain

والبيانات تبدأ تختلف.

---

# Fencing

عشان نتجنب ده، distributed systems تحتاج mechanisms تمنع الـ old primary من الاستمرار في الكتابة بعد فقد leadership.

Conceptually:

\`\`\`text
Old Leader
    ↓
Revoke authority
    ↓
New Leader
\`\`\`

وده مجال كامل من:

\`\`\`text
Leases
Epochs
Terms
Fencing Tokens
Consensus
\`\`\`

مش هنغوص فيه هنا، لكن مهم تعرف إن:

# Failover مش مجرد تغيير DNS.

---

# 26. Failover ممكن يعمل Data Loss

خصوصًا مع async replication.

قبل failure:

\`\`\`text
Primary:

Transaction 100 ✅
Transaction 101 ✅
Transaction 102 ✅
\`\`\`

Replica:

\`\`\`text
100 ✅
101 ✅
102 ❌ not received yet
\`\`\`

Primary تقع.

Promote Replica.

Transaction 102:

\`\`\`text
Gone from active history
\`\`\`

رغم إن الـ Client ربما أخذت:

\`\`\`text
Success
\`\`\`

قبل كده.

ودي واحدة من أهم trade-offs في Replication.

---

# 27. Failback

Primary القديمة رجعت.

هل نقول:

\`\`\`text
Welcome back, you are primary again.
\`\`\`

لا 😄

لأن New Primary حصل عليها Writes جديدة.

يبقى القديمة أصبحت:

\`\`\`text
Outdated.
\`\`\`

غالبًا لازم:

\`\`\`text
Rejoin
Resynchronize
Become Replica
\`\`\`

وبعدين لو عايز ترجع topology الأصلية، تعمل controlled switchover/failback.

---

# Failover vs Switchover

## Failover

غالبًا:

\`\`\`text
Unexpected failure
\`\`\`

Primary وقعت.

## Switchover

غالبًا:

\`\`\`text
Planned operation
\`\`\`

مثل Maintenance.

\`\`\`text
Primary A
↓ controlled handoff
Primary B
\`\`\`

الـ switchover غالبًا أسهل لأنه فيه coordination.

---

# 28. Replica ≠ Backup

دي من أهم النقاط في المقالة.

عندك:

\`\`\`text
Primary
↓
Replica
\`\`\`

Developer يقول:

> خلاص، عندي Backup.

# لا.

تخيل حد عمل:

\`\`\`sql
DELETE FROM Orders;
\`\`\`

بالغلط.

Replication تقول:

\`\`\`text
حاضر 😄
\`\`\`

وتنسخ:

\`\`\`text
DELETE FROM Orders
\`\`\`

للـ Replica.

دلوقتي:

\`\`\`text
Primary → Orders deleted
Replica → Orders deleted
\`\`\`

---

# لو Ransomware / Corruption / Bad Migration؟

ممكن يتكرر الضرر أيضًا:

\`\`\`text
Primary corruption
       ↓
Replication
       ↓
Replica corruption
\`\`\`

حسب نوع المشكلة.

---

# Backup هدفها مختلف

Backup تساعدك تقول:

> رجعني للحالة اللي كنت عليها امبارح الساعة 10.

مثل:

\`\`\`text
Snapshot
Point-in-time recovery
Archived logs
\`\`\`

أما Replica:

> خليك قريب جدًا من الحالة الحالية.

إذن:

\`\`\`text
Replication
≠
Backup

High Availability
≠
Disaster Recovery

Replica
≠
Historical recovery
\`\`\`

ممكن تحتاج:

# Replication + Backups

معًا.

---

# 29. Replication ≠ Disaster Recovery بالكامل

حتى لو عندك Replica:

\`\`\`text
same region
same credentials
same account
same operator
\`\`\`

لو حصل:

\`\`\`text
Region failure
Account compromise
Human error
\`\`\`

ممكن الاتنين يتأثروا.

DR strategy ممكن تحتاج:

\`\`\`text
Cross-region copies
Independent backups
Separate recovery credentials
Restore procedures
Regular recovery tests
\`\`\`

---

# 30. Replication وDurability

وجود عدة copies ممكن يزود durability against certain failures.

لكن لازم نعرف:

\`\`\`text
هل الـ Write وصلت Replica قبل Success؟

كام Replica؟

وصلت Memory ولا durable storage؟

هل replication sync ولا async؟
\`\`\`

لأن:

\`\`\`text
3 replicas
\`\`\`

لو كلهم لسه ما استلموش آخر write...

مش هينقذوك منها.

---

# 31. Replication Factor

مصطلح مهم.

لو:

\`\`\`text
Replication Factor = 3
\`\`\`

معناه عادة:

\`\`\`text
لدينا 3 copies
\`\`\`

من البيانات المقصودة.

مثل:

\`\`\`text
Node A
Node B
Node C
\`\`\`

لكن:

\`\`\`text
Replication Factor ↑
\`\`\`

يأتي معه:

\`\`\`text
Storage Cost ↑
Network Traffic ↑
Coordination ↑
Operational complexity ↑
\`\`\`

---

# 32. هل نعمل Replica في نفس Region ولا مختلفة؟

## Same Region / Zone-separated

ميزة:

\`\`\`text
Low latency
Fast failover
\`\`\`

لكن Region كاملة لو وقعت:

\`\`\`text
❌
\`\`\`

## Cross Region

ميزة:

\`\`\`text
Regional disaster protection
Closer reads for global users sometimes
\`\`\`

لكن:

\`\`\`text
Latency ↑
Bandwidth Cost ↑
Consistency Complexity ↑
\`\`\`

مفيش إجابة واحدة صح.

---

# 33. Replication Topologies

دلوقتي ندخل للصورة الكبيرة.

أشهر families هنفصلهم في المقالات القادمة:

\`\`\`text
Single-Leader
Multi-Leader
Leaderless
\`\`\`

---

# Single-Leader

\`\`\`text
          Leader
        /    |    \\
       ↓     ↓     ↓
      R1     R2     R3
\`\`\`

كل Writes غالبًا:

\`\`\`text
Leader
\`\`\`

وده أبسط model لفهم replication.

هنا تظهر:

\`\`\`text
Leader failure
Replication lag
Read replicas
Failover
\`\`\`

---

# Multi-Leader

\`\`\`text
Leader A ←→ Leader B
\`\`\`

الاتنين يستقبلوا Writes.

ميزة:

\`\`\`text
Multiple write locations
\`\`\`

لكن:

\`\`\`text
Concurrent conflicts 😈
\`\`\`

مثل:

\`\`\`text
A:
Name = Ahmed

B:
Name = Mohamed
\`\`\`

مين يكسب؟

---

# Leaderless

مفيش Node واحدة صاحبة كل Writes.

مثلًا:

\`\`\`text
Client
 ├→ Node A
 ├→ Node B
 └→ Node C
\`\`\`

وتبدأ concepts:

\`\`\`text
Quorum
R
W
N
Read Repair
Hinted Handoff
Conflict Resolution
\`\`\`

وده عالم لوحده.

---

# هنفصلهم ليه؟

لأن مجرد كلمة:

\`\`\`text
Replication
\`\`\`

مش كفاية.

التصميم اللي يجاوب:

> مين يقبل Writes؟

بيغيّر كل حاجة.

---

# 34. Replication Strategy تؤثر على كل حاجة

اختيار Strategy يؤثر على:

\`\`\`text
Write latency

Read latency

Consistency

Availability

Conflict handling

Failover complexity

Write scalability

Geographic distribution

Operational complexity
\`\`\`

عشان كده عندنا في السلسلة:

\`\`\`text
Intro to Replication
        ↓
Replication Strategies
        ↓
Single-Leader
        ↓
Multi-Leader
        ↓
Leaderless
\`\`\`

---

# 35. الـ Application لازم تكون Replication-Aware؟

أحيانًا Managed Database تخفي details كثيرة.

Application تقول:

\`\`\`text
Writer Endpoint

Reader Endpoint
\`\`\`

وخلاص.

لكن حتى لو Infrastructure مخفية...

الـ Application لازم تفهم semantics.

مثلًا:

\`\`\`text
Reader might be stale.
\`\`\`

دي مش حاجة Driver تقدر تحلها لوحدها.

Business logic لازم تعرف:

> Query دي ينفع تقرأ stale data ولا لأ؟

---

# مثال

صفحة:

\`\`\`text
Top Selling Products
\`\`\`

لو data متأخرة ثانية:

\`\`\`text
Fine.
\`\`\`

لكن:

\`\`\`text
Is this payment already processed?
\`\`\`

لو قرأت من Replica متأخرة:

\`\`\`text
Dangerous.
\`\`\`

إذن routing decisions مش مجرد infrastructure optimization.

---

# 36. Read Consistency Classes

ممكن نقسم Reads تقريبًا:

## Stale-friendly

مثل:

\`\`\`text
Product catalog
Analytics
Recommendations
Reports
View counters
\`\`\`

ممكن Replica ممتازة.

## Freshness-sensitive

مثل:

\`\`\`text
Payment state
Inventory reservation
Coupon redemption
Password change
User permissions after update
\`\`\`

ممكن تحتاج Primary/stronger guarantee.

---

# 37. Authentication Example

تخيل User:

\`\`\`text
Role = User
\`\`\`

Admin غيرها إلى:

\`\`\`text
Role = Admin
\`\`\`

لو Request راحت Replica قديمة:

\`\`\`text
Role = User
\`\`\`

قد يتأخر وصول permission.

أخطر:

User اتشالت منها Permission:

\`\`\`text
Admin → User
\`\`\`

Replica قديمة لسه:

\`\`\`text
Admin
\`\`\`

لو Authorization decisions بتقرأ مباشرة من stale replica...

دي ممكن تبقى Security Issue.

Consistency requirement تختلف حسب البيانات.

---

# 38. Monitoring Replication

مينفعش تعمل Replication وتسيبها.

لازم تراقب مثلًا:

\`\`\`text
Replication lag

Replication throughput

Apply rate

WAL/log backlog

Replica CPU

Replica disk

Replica network

Failed replication

Replica health

Failover events
\`\`\`

خصوصًا:

# Replica Lag

لأن Application ممكن تكون شغالة:

\`\`\`text
200 OK ✅
\`\`\`

لكن Users تقرأ Data عمرها:

\`\`\`text
20 minutes
\`\`\`

وده failure وظيفي حتى لو السيرفر "Healthy".

---

# 39. Read Replica Health مش بس Alive/Dead

ممكن Replica تكون:

\`\`\`text
Process running ✅
TCP accepting ✅
Queries working ✅
\`\`\`

لكن:

\`\`\`text
Lag = 2 hours ❌
\`\`\`

هل تعتبرها Healthy للـ Read Traffic؟

غالبًا لأ حسب الـ use case.

Health هنا لازم تشمل:

\`\`\`text
Freshness
\`\`\`

مش مجرد:

\`\`\`text
Process alive.
\`\`\`

---

# 40. Alerting

بدل Alert واحدة:

\`\`\`text
Replica Down
\`\`\`

محتاج مثلًا:

\`\`\`text
Lag > threshold

Replication stopped

Disk nearly full

Replay rate < write rate

Connection failures

Failover happened
\`\`\`

والـ threshold تعتمد على الـ business.

Analytics Replica:

\`\`\`text
Lag 30 seconds
\`\`\`

يمكن عادي.

Payment status replica:

\`\`\`text
Lag 30 seconds
\`\`\`

ممكن كارثة.

---

# 41. Replication Lag Budget

زي ما عندك:

\`\`\`text
Latency Budget
\`\`\`

ممكن تفكر في:

# Freshness Budget

مثال:

\`\`\`text
Catalog:
Max stale = 60 sec

Dashboard:
Max stale = 5 min

Payment:
Max stale = 0 / near-zero
\`\`\`

ده يخلي Architecture decision مرتبطة بالـ business.

---

# 42. Load Balancing بين Replicas

عندك:

\`\`\`text
Replica A
Replica B
Replica C
\`\`\`

ممكن Read Router يوزع:

\`\`\`text
Round Robin
Least Connections
Latency-based
Region-aware
\`\`\`

لكن...

لو:

\`\`\`text
Replica B Lag = 10 min
\`\`\`

مينفعش تتعامل معاها زي Replica A اللي lag عندها:

\`\`\`text
50ms
\`\`\`

Read routing ممكن تحتاج تكون:

# Lag-aware.

---

# 43. Geographical Reads

عندك Users:

\`\`\`text
Egypt
USA
Japan
\`\`\`

بدل كلهم يقرأوا من Database في أوروبا:

\`\`\`text
Egypt ──────────────┐
USA ────────────────┼→ Europe DB
Japan ──────────────┘
\`\`\`

ممكن Replicas أقرب:

\`\`\`text
Egypt → Europe Replica

USA → US Replica

Japan → Asia Replica
\`\`\`

فتحسن:

\`\`\`text
Read latency
\`\`\`

لكن Write consistency تصبح أعقد.

وده يمهد لمقال:

# Multi-Leader.

---

# 44. Replication Traffic نفسها Cost

لو Writes:

\`\`\`text
500 MB/sec
\`\`\`

وعندك:

\`\`\`text
5 Replicas
\`\`\`

Primary لازم تبعت change stream.

خصوصًا cross-region:

\`\`\`text
Network egress
\`\`\`

ممكن تبقى تكلفة حقيقية.

يعني Replication بتحل Scalability...

لكن هي نفسها:

\`\`\`text
Consumes network
Consumes storage
Consumes compute
\`\`\`

---

# 45. Replica مش "مجانية"

لو Database:

\`\`\`text
1 TB
\`\`\`

وعندك:

\`\`\`text
5 copies
\`\`\`

عندك تقريبًا:

\`\`\`text
5 TB+
\`\`\`

Storage قبل overhead/backups/logs.

وكمان:

\`\`\`text
5 machines
5 memory allocations
replication traffic
monitoring
\`\`\`

High Availability لها ثمن.

---

# 46. Schema Changes

تخيل Migration:

\`\`\`sql
ALTER TABLE Orders ...
\`\`\`

في replicated environment.

لازم Engine / replication mechanism تعرف تتعامل معها.

في physical replication عادة تغييرات الـ database نفسها تنتقل ضمن replicated log/physical state.

في logical systems الموضوع قد يحتاج اعتبارات مختلفة حسب product/configuration.

يعني deployment strategy للـ Database مهمة.

---

# 47. Large Transactions

تخيل Transaction واحدة تغير:

\`\`\`text
10M rows
\`\`\`

الـ Primary تنفذها.

الـ Replica محتاجة تستقبل وتطبق كمية ضخمة من changes.

ممكن Lag تقفز.

عشان كده Operations مثل:

\`\`\`text
Huge backfills
Bulk updates
Large migrations
\`\`\`

لازم تتعمل بحذر في replicated systems.

---

# 48. Slow Replica

لو واحدة من Replicas ضعيفة:

\`\`\`text
Primary: 64 CPU
Replica: 4 CPU
\`\`\`

وwrite workload ضخم...

Replica غالبًا مش هتلحق.

مش منطقي تعمل:

\`\`\`text
Ferrari
↓
replicated to bicycle
\`\`\`

وتستغرب من Lag 😄

Capacity بتاعة replicas مهمة.

---

# 49. Synchronous Replica بعيدة خطر على Latency

لو الـ business محتاجة:

\`\`\`text
P95 write latency < 100ms
\`\`\`

وعملت synchronous replica في Region round-trip إليها:

\`\`\`text
180ms
\`\`\`

أنت كسرت الـ SLO بالتصميم نفسه.

Architecture لازم تجمع:

\`\`\`text
Consistency Requirements
+
Latency Requirements
+
Availability Requirements
\`\`\`

مع بعض.

---

# 50. Replication وحجم الـ Writes

Read-heavy system ممكن تستفيد جدًا.

لكن write-heavy system:

\`\`\`text
90% Writes
\`\`\`

Replication نفسها هتضاعف internal work.

كل Write:

\`\`\`text
Primary write
+
Network transmission
+
Replica apply
+
Replica storage
\`\`\`

وده مش معناه Replication غلط.

لكن لازم تحسب التكلفة.

---

# 51. هل Replication تحل كل Database Scaling؟

لا.

لو الـ Primary وصلت:

\`\`\`text
Maximum write throughput
\`\`\`

إضافة Read Replicas:

\`\`\`text
لن تزيد Write Capacity
\`\`\`

قد تحتاج بعدين:

\`\`\`text
Partitioning
Sharding
Multi-Leader
Leaderless
Different data model
\`\`\`

حسب الـ use case.

---

# 52. Replica لأغراض مختلفة

مش لازم كل Replica تخدم Users.

ممكن:

\`\`\`text
Replica A → App Reads

Replica B → Analytics

Replica C → Backup source

Replica D → Disaster recovery

Replica E → Reporting
\`\`\`

وده يفصل workloads.

لكن كل واحدة لها capacity وfreshness requirements مختلفة.

---

# 53. Replication وCAP

نرجع للمقالة السابقة.

عندك:

\`\`\`text
Primary
   ↓
Replica
\`\`\`

حصل Network Partition:

\`\`\`text
Primary      X      Replica
\`\`\`

السؤال:

> هل Replica تفضل تستقبل operations؟

لو Read فقط:

\`\`\`text
قد ترجع stale data.
\`\`\`

لو Promote وتقبل Writes:

\`\`\`text
ممكن يحصل conflict لو Primary القديمة ما زالت شغالة.
\`\`\`

وهنا CAP مش Theory بعيدة.

دي مشكلة تشغيلية حقيقية.

---

# 54. Replication وConsistency

كل ما تزود Copies:

\`\`\`text
More availability opportunities
\`\`\`

لكن في المقابل:

\`\`\`text
More copies to keep synchronized
\`\`\`

يعني paradox لطيف:

> Replication تساعدك ضد failure، وفي نفس الوقت تخلق consistency problem جديدة.

وده جوهر distributed databases.

---

# 55. أكثر الأخطاء شيوعًا

**اعتبار Replica Backup.**  
لو الـ Primary نفذت Delete غلط، غالبًا التغيير هيتكرر على النسخ.

**إرسال كل Reads للـ Replicas.**  
بعض العمليات لا تتحمل stale data.

**الاعتقاد أن Replication تزيد Write Capacity تلقائيًا.**  
مش في Single-Leader العادية.

**عدم مراقبة Replication Lag.**  
Replica متأخرة ساعتين مش Read Replica صحية لمعظم الاستخدامات.

**Synchronous replication بعيدة جغرافيًا بدون حساب Latency.**

**الاعتماد على Replica واحدة في نفس Failure Domain.**

**Failover بدون حماية من Split Brain.**

**عدم اختبار Failover.**  
Runbook غير مجرب = أمل، مش Strategy.

**الخلط بين HA وDR وBackup.**

**إضافة Replicas قبل تحسين Queries.**  
Query سيئة × خمس Replicas ما زالت Query سيئة 😄

---

# 56. إزاي تقرر إنك محتاج Replication؟

ابدأ بالسؤال:

\`\`\`text
What problem am I solving?
\`\`\`

لو المشكلة:

\`\`\`text
Database is a single point of failure
\`\`\`

Replication ممكن تساعد.

لو:

\`\`\`text
Read traffic is overwhelming primary
\`\`\`

Read replicas ممكن تساعد.

لو:

\`\`\`text
Need regional disaster recovery
\`\`\`

Cross-region replication ممكن تدخل الصورة.

لكن لو المشكلة:

\`\`\`text
One query takes 20 seconds
\`\`\`

يمكن الحل:

\`\`\`text
Index
Query optimization
\`\`\`

مش Replica.

ولو المشكلة:

\`\`\`text
Primary cannot handle write throughput
\`\`\`

ممكن Replication العادية مش الحل الرئيسي.

---

# 57. أسئلة لازم تجاوب عليها قبل التصميم

فكر في النظام كده:

\`\`\`text
Why replicate?

How many copies?

Where should copies live?

Who accepts writes?

Who accepts reads?

Synchronous or asynchronous?

How much lag is acceptable?

What is our RPO?

What is our RTO?

What happens when primary fails?

How is new primary chosen?

How do clients discover it?

How do we prevent split brain?

Which reads can tolerate stale data?

How do we monitor replication?

Do we also have backups?
\`\`\`

لو الأسئلة دي مش واضحة...

لسه ما عندكش Replication Strategy كاملة.

---

# 58. مثال E-Commerce كامل

عندنا:

\`\`\`text
ASP.NET Core API
+
PostgreSQL
\`\`\`

في البداية:

\`\`\`text
API
 ↓
PostgreSQL
\`\`\`

الـ Traffic زادت.

بقى عندنا:

\`\`\`text
90% Reads
10% Writes
\`\`\`

نضيف Replicas:

\`\`\`text
                          ┌→ Replica 1
Reads → Read Router ──────┼→ Replica 2
                          └→ Replica 3

Writes ─────────────────────→ Primary
\`\`\`

Catalog:

\`\`\`text
GET /products
→ Replica
\`\`\`

Reports:

\`\`\`text
GET /admin/reports
→ Reporting Replica
\`\`\`

لكن:

\`\`\`text
POST /orders
→ Primary
\`\`\`

وبعد Create Order:

\`\`\`text
GET /orders/{newId}
\`\`\`

ممكن مؤقتًا نوجه Primary لضمان Read-Your-Writes.

---

# الـ Primary تقع

Cluster Manager:

\`\`\`text
Detect Primary failure
        ↓
Verify quorum / topology
        ↓
Promote best replica
        ↓
Redirect writer endpoint
        ↓
Application reconnects
\`\`\`

وبعدها:

\`\`\`text
Old primary returns
↓
Resync
↓
Join as replica
\`\`\`

ده أقرب للصورة الحقيقية.

---

# 59. Mental Model الأساسي

احفظها كده:

\`\`\`text
Write
 ↓
Authoritative Node
 ↓
Replication Log
 ↓
Network
 ↓
Replica receives change
 ↓
Replica applies change
 ↓
Replica catches up
\`\`\`

الفترة بين:

\`\`\`text
Primary Commit
\`\`\`

و:

\`\`\`text
Replica Apply
\`\`\`

هي المكان اللي تظهر فيه:

\`\`\`text
Replication Lag
Stale Reads
Failover Data Loss Window
\`\`\`

---

# 60. Replication Triangle

أي design تقريبًا بتوازن بين:

\`\`\`text
          Freshness
             ▲
            / \\
           /   \\
          /     \\
         /       \\
Latency ◄────────► Availability
\`\`\`

مثال:

لو عايز كل Write تستنى عدة مناطق:

\`\`\`text
Freshness/Durability ↑

Latency ↑

Partition Availability ↓
\`\`\`

لو ترجع Success بسرعة وتنسخ Async:

\`\`\`text
Latency ↓

Availability ↑

Temporary Staleness ↑
\`\`\`

مش معنى إن مفيش حلول متقدمة.

لكن:

# Trade-off لن تختفي.

---

# الخلاصة

Database Replication مش مجرد:

\`\`\`text
Make another copy.
\`\`\`

هي قرار Architecture كبير يغيّر:

\`\`\`text
Availability
Read Scalability
Consistency
Latency
Durability
Failover
Cost
Operations
\`\`\`

والـ journey تبدأ:

\`\`\`text
One Database
      ↓
Need more resilience / reads
      ↓
Add Replica
      ↓
Replication Lag appears
      ↓
Stale Reads appear
      ↓
Primary failure question appears
      ↓
Failover appears
      ↓
Split Brain question appears
      ↓
Consistency choices appear
\`\`\`

وعشان كده Replication تعتبر واحدة من أهم البوابات لفهم **Distributed Systems** فعلًا.

أهم خمس أفكار تحفظهم:

\`\`\`text
Replication = multiple copies of data.

Replica ≠ Backup.

Read Replica ≠ automatic write scaling.

Async replication → lag is expected.

More copies improve some failure/scaling properties,
but make consistency harder.
\`\`\`

والقاعدة الأهم:

# قبل ما تعمل Replica، اعرف أنت محتاجها ليه.

لأن:

\`\`\`text
High Availability
Read Scaling
Disaster Recovery
Geo Distribution
\`\`\`

كل واحدة فيهم ممكن تبدأ بنفس كلمة:

**Replication**

لكن تصميمها الصحيح مش بالضرورة يكون واحد.

---

# 🔜 System Design Series — Next

المقالة الجاية:

# Replication Strategies

وهنبدأ نقارن الصورة الكبيرة بين:

\`\`\`text
Single-Leader
        vs
Multi-Leader
        vs
Leaderless
\`\`\`

ونجاوب السؤال المحوري:

# مين في الـ Cluster مسموح له يقبل Write؟

لأن الإجابة على السؤال ده هتحدد تقريبًا كل حاجة بعده:

\`\`\`text
Consistency
Conflict Resolution
Failover
Write Scalability
Latency
Availability
\`\`\`

وبعد المقالة العامة دي هندخل في كل Strategy لوحدها بالتفصيل.
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-26',
  category: 'Architecture',
  readTime: '22 min read',
  image: replicationImage,
};
