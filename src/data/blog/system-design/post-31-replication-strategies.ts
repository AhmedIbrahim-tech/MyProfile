import type { BlogPost } from '@/modules/blog/types';
import replicationStrategiesImage from '@/assets/blog/system-design/replication-strategies.jpg';

export const post: BlogPost = {
  id: 31,
  title: 'Replication Strategies — Single-Leader vs Multi-Leader vs Leaderless: مين يستقبل الـ Writes وإزاي الـ Replicas تتفق؟',
  excerpt:
    'السؤال الذي يحدد شكل الـ Replication Architecture كلها: مين مسموح له يستقبل الـ Writes؟ دليلك الشامل للمقارنة بين Single-Leader وMulti-Leader وLeaderless: من مسارات القراءة والكتابة وQuorum (N, W, R) إلى Conflict Handling، Failover، والـ Trade-offs الحقيقية لكل Strategy.',
  content: `# 🗄️ System Design Series #05
# Replication Strategies
## Single-Leader vs Multi-Leader vs Leaderless — مين يستقبل الـ Writes وإزاي الـ Replicas تتفق؟

في المقالة السابقة **Intro to Database Replication** عرفنا ليه بنعمل أكثر من نسخة من البيانات:

\`\`\`text
High Availability
Read Scalability
Fault Tolerance
Disaster Recovery
Geo Distribution
\`\`\`

وعرفنا إن الصورة البسيطة:

\`\`\`text
        Database
            ↓
         Replica
\`\`\`

بتخبي وراها مشاكل كبيرة:

\`\`\`text
Replication Lag
Stale Reads
Failover
Split Brain
Data Loss Window
Consistency
\`\`\`

دلوقتي هننتقل للسؤال اللي بيحدد شكل الـ Replication Architecture كلها:

# مين مسموح له يستقبل Writes؟

لأن الإجابة على السؤال ده هي اللي بتقسم أشهر Replication Architectures إلى:

\`\`\`text
Single-Leader

Multi-Leader

Leaderless
\`\`\`

وده مش مجرد اختلاف في الرسم.

كل Strategy بتغيّر:

\`\`\`text
Write Path
Read Path
Consistency
Latency
Availability
Conflict Handling
Failover
Multi-Region Design
Operational Complexity
\`\`\`

فخلينا نبني الصورة من الصفر.

---

# أولًا: Replication Strategy يعني إيه؟

تخيل عندك 3 نسخ من نفس البيانات:

\`\`\`text
Node A

Node B

Node C
\`\`\`

وعندنا:

\`\`\`text
Product 100
Stock = 5
\`\`\`

كلهم حاليًا متفقين:

\`\`\`text
A → Stock = 5
B → Stock = 5
C → Stock = 5
\`\`\`

دلوقتي وصل Request:

\`\`\`text
Buy one item
\`\`\`

وبالتالي:

\`\`\`text
Stock = 4
\`\`\`

السؤال:

> العميل يكتب على Node مين؟

هل لازم:

\`\`\`text
Node A فقط؟
\`\`\`

ولا:

\`\`\`text
A أو B أو C؟
\`\`\`

ولو اتنين Users كتبوا في نفس اللحظة على Nodes مختلفة...

مين يحدد الترتيب؟

دي هي أساس Replication Strategy.

---

# الصورة الكبيرة

عندنا ثلاثة Mental Models رئيسية.

\`\`\`text
Single-Leader

        Leader
       /      \\
      ↓        ↓
Follower    Follower
\`\`\`

كل الـ Writes تروح Leader واحدة.

---

\`\`\`text
Multi-Leader

Leader A ←→ Leader B ←→ Leader C
\`\`\`

أكثر من Node مسموح لها تستقبل Writes.

---

\`\`\`text
Leaderless

        Node A
       ↗
Client → Node B
       ↘
        Node C
\`\`\`

مفيش Leader وحيدة مسؤولة عن الكتابة.

---

# 1. Single-Leader Replication

دي أبسط Strategy ذهنيًا، ومن أشهر الـ models المستخدمة في قواعد البيانات.

الفكرة:

# فيه Node واحدة فقط مسؤولة عن قبول الـ Writes.

نسميها:

\`\`\`text
Leader
Primary
Writer
\`\`\`

حسب الـ Database.

والـ Nodes الأخرى:

\`\`\`text
Followers
Replicas
Standbys
Secondaries
\`\`\`

---

# الشكل

\`\`\`text
                   Reads
                     ↑
                 Replica 1
                    ↑
                    │
Writes → Leader ────┼────→ Replica 2
                    │
                    ↓
                 Replica 3
                     ↑
                   Reads
\`\`\`

الـ Write flow:

\`\`\`text
Client
 ↓
Leader
 ↓
Commit Change
 ↓
Replication Log
 ↓
Followers
\`\`\`

---

# الميزة الأكبر

لما يكون عندك Writer واحدة...

يبقى ترتيب الـ Writes أسهل.

مثلًا:

\`\`\`text
Current balance = 100

Transaction A:
-20

Transaction B:
+50
\`\`\`

الـ Leader تحدد sequence:

\`\`\`text
1 → -20
2 → +50
\`\`\`

وتنقل نفس الترتيب للـ followers.

وده يقلل جدًا مشاكل:

\`\`\`text
Concurrent write conflicts
\`\`\`

مقارنة بـ Multi-Leader.

---

# Read Path

ممكن تعمل Reads من Leader:

\`\`\`text
Client
 ↓
Leader
 ↓
Latest Data
\`\`\`

وده غالبًا يعطيك freshness أعلى.

أو تستخدم:

\`\`\`text
Read Replicas
\`\`\`

لزيادة Read Throughput:

\`\`\`text
Client
 ↓
Read Router
 ↓
Replica
\`\`\`

لكن هنا تظهر:

# Replication Lag.

---

# مثال

Leader:

\`\`\`text
Price = $120
\`\`\`

Replica:

\`\`\`text
Price = $100
\`\`\`

لأن آخر update لسه ما وصلتش.

يبقى Read من Replica ممكن تكون:

\`\`\`text
Stale.
\`\`\`

وده مش Bug بالضرورة.

ده نتيجة طبيعية لو Replication:

\`\`\`text
Asynchronous
\`\`\`

---

# Single-Leader + Synchronous Replication

ممكن Leader تقول:

\`\`\`text
مش هرجع success
إلا لما Replica معينة تأكد التغيير.
\`\`\`

Flow:

\`\`\`text
Client
 ↓
Leader
 ↓
Replica
 ↓
ACK
 ↓
Leader
 ↓
Success
\`\`\`

ميزة:

\`\`\`text
Data-loss window ↓
Freshness ↑
\`\`\`

لكن:

\`\`\`text
Write Latency ↑
Availability may decrease
\`\`\`

لو الـ Replica المطلوبة اختفت.

PostgreSQL مثلًا تدعم synchronous standbys بحيث transactions المنتظرة لا تكمل commit حسب الـ configuration إلا بعد وصول acknowledgement المطلوبة من standbys المحددة.

---

# Single-Leader + Async Replication

الأكثر شيوعًا في scenarios كثيرة:

\`\`\`text
Client
 ↓
Leader
 ↓
Commit
 ↓
Success
 ↓
Replicate Later
\`\`\`

الميزة:

\`\`\`text
Fast Writes
\`\`\`

والـ follower failure غالبًا لا توقف الـ Leader.

لكن يوجد:

\`\`\`text
Replication Lag
\`\`\`

وقد يوجد:

\`\`\`text
Data loss window during failover
\`\`\`

PostgreSQL streaming replication مثلًا asynchronous افتراضيًا، ولذلك توجد فترة صغيرة بين commit على الـ primary وظهور التغيير على الـ standby.

---

# المشكلة الكبيرة: Leader Failure

لو:

\`\`\`text
Leader ❌
\`\`\`

مين يستقبل Writes؟

محتاج:

\`\`\`text
Follower
 ↓
Promotion
 ↓
New Leader
\`\`\`

ودي عملية:

# Failover.

---

# Failover مش مجرد "اختار أي Replica"

لازم تسأل:

\`\`\`text
مين أحدث Replica؟

هل استلمت آخر Writes؟

هل الـ Leader القديمة فعلًا ماتت؟

هل ممكن ترجع فجأة؟

هل Clients تعرف الـ Leader الجديدة؟
\`\`\`

لأن أسوأ scenario:

# Split Brain

\`\`\`text
Leader A ← Writes

    X Network

Leader B ← Writes
\`\`\`

الاتنين فاكرين نفسهم Leader.

---

# ليه Single-Leader منتشرة؟

لأن الـ mental model بسيط نسبيًا:

\`\`\`text
One authority for writes.
\`\`\`

وده مناسب جدًا لما:

\`\`\`text
Consistency around writes مهمة
Conflict handling عايزين نقلله
Writes مش محتاجة تتوزع على Regions كثيرة
\`\`\`

MySQL Group Replication مثلًا عندها single-primary mode يكون فيه Server واحدة read/write والباقي read-only، وهو الـ default mode للـ Group Replication.

---

# المشكلة: الـ Leader نفسها Write Bottleneck

لو Leader تستحمل:

\`\`\`text
20K writes/sec
\`\`\`

وSystem محتاجة:

\`\`\`text
100K writes/sec
\`\`\`

إضافة:

\`\`\`text
20 Read Replicas
\`\`\`

مش هتخلي الـ Leader تقبل 100K Writes.

يعني:

# Single-Leader scales reads far more naturally than writes.

ولو write scalability وصلت limit، ممكن نحتاج:

\`\`\`text
Partitioning
Sharding
Multi-Leader
Leaderless Architecture
\`\`\`

حسب المشكلة.

---

# 2. Multi-Leader Replication

دلوقتي نغير القاعدة.

بدل:

\`\`\`text
One Leader
\`\`\`

نعمل:

\`\`\`text
Multiple Leaders
\`\`\`

مثلًا:

\`\`\`text
Region Egypt
Leader A

      ↕ replication

Region Europe
Leader B
\`\`\`

الاتنين يقبلوا:

\`\`\`text
Reads
+
Writes
\`\`\`

---

# الشكل

\`\`\`text
Users Egypt
    ↓
Leader A
    ↕
Replication
    ↕
Leader B
    ↑
Users Europe
\`\`\`

ممكن كمان:

\`\`\`text
Leader A ↔ Leader B ↔ Leader C
\`\`\`

كل واحدة تخدم Region مختلفة.

---

# ليه نعمل كده؟

أكبر use case:

# Multi-Region Writes.

تخيل Application عالمية.

لو عندك Leader الوحيدة في:

\`\`\`text
USA
\`\`\`

وUser في Egypt تعمل:

\`\`\`text
POST /orders
\`\`\`

الـ Request لازم تسافر:

\`\`\`text
Egypt
 ↓
USA
 ↓
Egypt
\`\`\`

Network latency عالية.

لو عندنا Leader في Egypt:

\`\`\`text
Egypt User
 ↓
Egypt Leader
\`\`\`

Write latency تتحسن.

---

# Offline / Occasionally Connected Systems

Multi-Leader pattern تظهر كمان conceptually في حالات مثل:

\`\`\`text
Branch offices
Offline clients
Disconnected environments
\`\`\`

كل موقع ممكن يعمل updates محليًا...

وبعدين يsync later.

لكن هنا يظهر الوحش الكبير:

# Write Conflicts.

---

# مثال بسيط

عندنا:

\`\`\`text
User.Name = Ahmed
\`\`\`

Network بين Leaders حصل فيها مشكلة.

User في Egypt:

\`\`\`text
Name = Mohamed
\`\`\`

وفي نفس اللحظة User في Europe:

\`\`\`text
Name = Ali
\`\`\`

يبقى:

\`\`\`text
Leader A
Name = Mohamed

Leader B
Name = Ali
\`\`\`

الـ Network رجعت.

دلوقتي:

# مين الصح؟

---

# ده الفرق الجوهري

في Single-Leader:

\`\`\`text
كل Writes تمر بنقطة واحدة
\`\`\`

فترتيب العمليات أوضح.

في Multi-Leader:

\`\`\`text
Concurrent Writes ممكن تحصل
في Locations مختلفة.
\`\`\`

وبالتالي لازم عندك:

# Conflict Resolution Strategy.

---

# Conflict Resolution

ممكن تستخدم approaches مختلفة.

مثلًا:

\`\`\`text
Last Write Wins
\`\`\`

أو:

\`\`\`text
Version / Timestamp-based rules
\`\`\`

أو:

\`\`\`text
Application-level merge
\`\`\`

أو designs أكثر تقدمًا مثل:

\`\`\`text
CRDTs
\`\`\`

لكن كل طريقة لها semantics مختلفة.

---

# Last Write Wins مشكلة؟

مش دائمًا، لكن ممكن تكون خطيرة.

مثلًا:

Leader A:

\`\`\`text
Address = Cairo
\`\`\`

Leader B:

\`\`\`text
Address = Alexandria
\`\`\`

آخر واحدة حسب timestamp تكسب.

يمكن مقبول.

لكن لو:

\`\`\`text
Balance updates
\`\`\`

أو:

\`\`\`text
Inventory decrements
\`\`\`

فـ "آخر واحدة تكسب" ممكن تمسح transaction صحيحة.

---

# مثال Inventory

Stock:

\`\`\`text
1
\`\`\`

Region A تبيع آخر Item.

وفي نفس اللحظة Region B تبيع آخر Item.

كل واحدة محليًا شافت:

\`\`\`text
Stock = 1
\`\`\`

الاتنين عملوا:

\`\`\`text
Stock = 0
\`\`\`

لكن في الحقيقة:

\`\`\`text
2 orders
1 item
\`\`\`

ده conflict Business-wise حتى لو replication engine قدرت تدمج values.

---

# Multi-Leader مناسبة إمتى؟

لما:

\`\`\`text
Local write latency مهمة جدًا
Multiple regions تحتاج accept writes
Workload ممكن تتعامل مع conflicts
Data partitions يمكن فصلها منطقيًا
\`\`\`

لكن لو عندك invariants صارمة جدًا:

\`\`\`text
No double booking
No double spending
Unique global allocation
\`\`\`

Multi-Leader تصبح أصعب بكثير.

---

# مثال حقيقي: MySQL Group Replication

MySQL Group Replication تدعم Single-Primary وMulti-Primary modes. في multi-primary mode، أكثر من member يمكن أن يكون read/write ويعالج write transactions، بما فيها concurrent transactions، مع وجود قواعد وآليات consistency/conflict handling داخل الـ group.

وده مثال ممتاز إن Strategy مش مجرد theory.

---

# Multi-Leader ومشكلة الـ Network Partition

لو Leader A وB مش قادرين يتواصلوا:

\`\`\`text
A ✅      X      B ✅
\`\`\`

هل الاتنين يفضلوا يستقبلوا Writes؟

لو نعم:

\`\`\`text
Availability ↑
\`\`\`

لكن divergence ممكن تزيد.

لو تمنع جانب من الكتابة:

\`\`\`text
Consistency ↑
\`\`\`

لكن Availability تقل في الجزء الممنوع.

رجعنا تاني لـ:

# CAP.

---

# 3. Leaderless Replication

دلوقتي نشيل مفهوم الـ Leader نفسها.

مفيش Node تقول:

> أنا صاحبة الـ Writes.

بدل كده:

\`\`\`text
Client / Coordinator
       ↓
  Multiple Replicas
\`\`\`

مثلًا:

\`\`\`text
          Replica A
         ↗
Client → Replica B
         ↘
          Replica C
\`\`\`

---

# الفكرة

عندنا:

\`\`\`text
Replication Factor = 3
\`\`\`

يعني Data لها ثلاث Copies.

وقت Write، النظام ممكن يبعث التغيير إلى عدة Replicas.

\`\`\`text
WRITE X = 100

 ↓
A
B
C
\`\`\`

ومش شرط يستنى الثلاثة.

ممكن يقول:

\`\`\`text
اعتبر الـ Write ناجحة
لو 2 Replicas ردت.
\`\`\`

ده:

# Write Quorum.

---

# N, W, R

من أشهر المفاهيم في Leaderless Systems:

\`\`\`text
N
W
R
\`\`\`

حيث:

\`\`\`text
N = عدد النسخ

W = عدد acknowledgements المطلوبة للـ Write

R = عدد replicas المطلوبة للـ Read
\`\`\`

مثال:

\`\`\`text
N = 3
W = 2
R = 2
\`\`\`

Write:

\`\`\`text
A ✅
B ✅
C ❌

2 ACKs
→ Success
\`\`\`

Read:

\`\`\`text
A → version 10
C → version 9

Pick latest valid version
\`\`\`

---

# ليه نقرأ من أكتر من Replica؟

لأن مش كل Replicas لازم تكون محدثة بنفس اللحظة.

مثال:

\`\`\`text
A = 100
B = 100
C = 90
\`\`\`

لو قرأت من C فقط:

\`\`\`text
Stale Read
\`\`\`

لكن لو قرأت من:

\`\`\`text
A + C
\`\`\`

تقدر تكتشف إن A عندها Version أحدث.

---

# W + R > N

في النموذج المبسط جدًا:

\`\`\`text
W + R > N
\`\`\`

تضمن overlap بين الـ read quorum والـ write quorum.

مثال:

\`\`\`text
N = 3
W = 2
R = 2

2 + 2 > 3
\`\`\`

يبقى على الأقل Replica واحدة من الـ Read set المفروض تكون شاركت في الـ Write set.

لكن دي **مش عصا سحرية تضمن linearizability في كل implementation وفي كل scenario**؛ concurrent writes والـ versioning والـ failure behavior والتصميم الفعلي كلهم مهمين.

Cassandra توضح نفس فكرة tunable consistency، وتذكر العلاقة \`W + R > RF\` لتكوين read/write quorum متداخل، كما توفر consistency levels مثل \`ONE\`, \`QUORUM\`, \`ALL\`, \`LOCAL_QUORUM\`.

---

# Leaderless ليه جذابة؟

لأنك مش عندك:

\`\`\`text
One Leader
\`\`\`

تبقى bottleneck أو نقطة failover رئيسية.

ممكن node تقع:

\`\`\`text
A ✅
B ✅
C ❌
\`\`\`

والـ Write لسه تنجح لو المطلوب:

\`\`\`text
W = 2
\`\`\`

وده يعطي Availability قوية.

---

# لكن الثمن؟

# Replicas ممكن تختلف.

مثلًا:

\`\`\`text
A = Version 10

B = Version 10

C = Version 8
\`\`\`

محتاج mechanisms تخلي النظام يتقارب.

---

# Hinted Handoff

تخيل Node C واقعة.

Coordinator حاول يبعت Write:

\`\`\`text
A ✅
B ✅
C ❌
\`\`\`

ممكن يحتفظ بـ:

\`\`\`text
Hint
\`\`\`

يقول:

> لما C ترجع، افتكر ابعتلها update دي.

Cassandra عندها hinted handoff لهذا النوع من السيناريوهات؛ الـ coordinator يمكن أن يخزن hint للـ replica غير المتاحة ثم يحاول تسليمه لاحقًا.

---

# Read Repair

وقت Read النظام يلاحظ:

\`\`\`text
A = 100
B = 100
C = 90
\`\`\`

فيعرف إن:

\`\`\`text
C stale
\`\`\`

ويقدر يصلحها.

ده:

# Read Repair.

---

# Anti-Entropy Repair

مش كل Keys هيتقرأ عليها باستمرار.

فمين يصلح البيانات اللي حصل بينها divergence ومحدش قرأها؟

ممكن يبقى فيه background repair process تقارن replicas وتصلح الاختلافات.

Cassandra تعتمد على repair mechanisms، بما فيها anti-entropy repair، لضمان convergence بين replicas، وتستخدم Merkle trees للمقارنة بين ranges من البيانات.

---

# يعني Leaderless مش "مفيش Coordination"

هي:

\`\`\`text
No fixed leader for each write path
\`\`\`

لكن لسه عندك:

\`\`\`text
Coordinator
Quorum
Versioning
Repair
Conflict handling
\`\`\`

يعني distributed complexity ما اختفتش.

هي اتغير شكلها.

---

# 4. أهم مقارنة: مين يقبل الـ Write؟

| Strategy | مين يقبل Writes؟ |
|---|---|
| Single-Leader | Leader واحدة |
| Multi-Leader | أكثر من Leader |
| Leaderless | عدة Replicas مباشرة/عبر Coordinator |

وده السؤال اللي يبدأ منه تقريبًا كل باقي trade-offs.

---

# 5. Write Conflicts

## Single-Leader

أقل تعقيدًا نسبيًا:

\`\`\`text
Writes → Leader
\`\`\`

الـ Leader تحدد order.

---

## Multi-Leader

Conflicts طبيعية أكثر:

\`\`\`text
Leader A → Update X

Leader B → Update X
\`\`\`

محتاج merge أو conflict resolution.

---

## Leaderless

ممكن يحصل:

\`\`\`text
Concurrent Versions
\`\`\`

ويستخدم النظام version metadata / timestamps / application reconciliation حسب الـ implementation.

---

# 6. Read Scalability

Single-Leader:

\`\`\`text
Followers
\`\`\`

ممتازة للـ Reads.

Multi-Leader:

\`\`\`text
كل Region ممكن تقرأ محليًا.
\`\`\`

Leaderless:

\`\`\`text
الـ Reads موزعة طبيعيًا بين replicas.
\`\`\`

لكن في التلاتة السؤال مش بس:

> أقدر أقرأ من كام Node؟

السؤال:

> الـ Read هتشوف Data قديمة قد إيه؟

---

# 7. Write Scalability

Single-Leader:

\`\`\`text
Writer واحدة
\`\`\`

إذن write throughput قد تصبح bottleneck.

Multi-Leader:

\`\`\`text
Multiple write locations
\`\`\`

ممكن تزيد توزيع Writes جغرافيًا.

Leaderless:

\`\`\`text
Writes distributed
\`\`\`

فتقدر تحصل على horizontal write scalability جيدة في architectures مناسبة.

لكن:

\`\`\`text
Write Scaling ↑
\`\`\`

غالبًا يأتي مع:

\`\`\`text
Coordination / consistency complexity ↑
\`\`\`

---

# 8. Failover

## Single-Leader

واضحة نسبيًا:

\`\`\`text
Leader dies
↓
Elect / Promote another leader
\`\`\`

لكن election وsplit-brain مش trivial.

---

## Multi-Leader

لو Leader واحدة ماتت:

\`\`\`text
Leaders الأخرى ممكن تكمل.
\`\`\`

لكن clients لازم تعرف route الجديد حسب topology.

---

## Leaderless

مفيش Leader واحدة تحتاج Promotion أصلًا.

لو Replica اختفت:

\`\`\`text
Quorum ممكن يفضل شغال.
\`\`\`

دي ميزة كبيرة.

لكن مش معناها failure handling سهل.

---

# 9. Geographic Distribution

تخيل Users في:

\`\`\`text
Egypt
USA
Japan
\`\`\`

Single-Leader في USA:

\`\`\`text
Egypt Write ─────→ USA

Japan Write ─────→ USA
\`\`\`

Latency.

Multi-Leader:

\`\`\`text
Egypt → Local Leader
USA → Local Leader
Japan → Local Leader
\`\`\`

أحسن latency...

لكن conflicts.

Leaderless multi-datacenter:

\`\`\`text
Client → Local replicas
\`\`\`

مع consistency levels محلية أو عالمية حسب التصميم.

Cassandra مثلًا تسمح بـ \`LOCAL_QUORUM\` لتطلب majority من replicas في الـ local datacenter، وهو trade-off عملي مهم للـ multi-datacenter workloads.

---

# 10. Synchronous vs Asynchronous مش Strategy رابعة

دي نقطة مهمة جدًا.

عندنا:

\`\`\`text
Single-Leader
Multi-Leader
Leaderless
\`\`\`

دي topology/write-authority models.

أما:

\`\`\`text
Synchronous
Asynchronous
\`\`\`

دي Dimension مختلفة.

ممكن تعمل:

\`\`\`text
Single-Leader + Async
\`\`\`

أو:

\`\`\`text
Single-Leader + Sync
\`\`\`

وفي Multi-Leader replication بين leaders ممكن تكون asynchronous أو تستخدم coordination أقوى حسب النظام.

يعني التصنيفات دي بتتقاطع.

---

# 11. Physical vs Logical برضه Dimension مختلفة

كمان:

\`\`\`text
Physical Replication
Logical Replication
\`\`\`

مش بدائل مباشرة لـ:

\`\`\`text
Single-Leader
Multi-Leader
Leaderless
\`\`\`

Physical vs Logical بتسأل:

> بنكرر إيه وإزاي؟

PostgreSQL مثلًا تفرق بين physical replication التي تعتمد على low-level storage/WAL representation وبين logical replication التي تنقل logical data changes باستخدام publication/subscription model.

أما Leader topology بتسأل:

> مين يملك حق قبول الـ Writes؟

---

# يعني ممكن يبقى عندك عدة Dimensions

تصميم Replication كامل ممكن يوصف مثلًا:

\`\`\`text
Single-Leader
+
Physical Streaming Replication
+
Asynchronous
+
3 Replicas
+
Cross-Zone
\`\`\`

ده وصف مفيد أكتر من:

\`\`\`text
We use replication.
\`\`\`

😄

---

# 12. Replication Factor

Replication Factor:

\`\`\`text
RF
\`\`\`

تعني عدد النسخ المستهدفة من البيانات.

مثلًا:

\`\`\`text
RF = 3
\`\`\`

يعني:

\`\`\`text
Data Copy 1
Data Copy 2
Data Copy 3
\`\`\`

في Cassandra مثلًا الـ RF يحدد عدد replicas لكل partition، ويمكن replication strategy اختيار replicas عبر racks/datacenters لتوزيع الـ failure domains.

---

# هل RF أعلى = أفضل؟

مش بالمجان.

لو:

\`\`\`text
RF = 5
\`\`\`

بدل:

\`\`\`text
RF = 3
\`\`\`

عندك:

\`\`\`text
Storage ↑
Network replication ↑
Write work ↑
Operational overhead ↑
\`\`\`

في المقابل:

\`\`\`text
Failure tolerance opportunities ↑
\`\`\`

Trade-off.

---

# 13. Consistency Model

اختيار Replication Strategy مرتبط جدًا بالـ Consistency المطلوبة.

Single-Leader مع reads من Leader:

\`\`\`text
Freshness أقوى غالبًا.
\`\`\`

Single-Leader مع async followers:

\`\`\`text
Stale reads possible.
\`\`\`

Multi-Leader:

\`\`\`text
Temporary divergence possible.
\`\`\`

Leaderless:

\`\`\`text
Consistency configurable/tunable في بعض الأنظمة.
\`\`\`

مفيش كلمة:

\`\`\`text
Replicated
\`\`\`

لوحدها تقول لك consistency guarantee.

---

# 14. Latency

## Single-Leader

لو Leader قريبة:

\`\`\`text
Write Latency جيدة.
\`\`\`

لو Leader في continent ثانية:

\`\`\`text
Write Latency ↑
\`\`\`

---

## Multi-Leader

Local writes:

\`\`\`text
Latency ↓
\`\`\`

لكن replication/conflict processing بعد كده.

---

## Leaderless

Latency تعتمد على:

\`\`\`text
W
R
Replica location
Slowest required acknowledgement
\`\`\`

لو:

\`\`\`text
W = ALL
\`\`\`

أبطأ Replica ممكن تحد write latency.

لو:

\`\`\`text
W = 1
\`\`\`

Latency أقل...

لكن consistency/durability behavior مختلف.

---

# 15. Availability

في Single-Leader:

\`\`\`text
Leader unavailable
\`\`\`

محتاج failover قبل Writes ترجع.

في Multi-Leader:

\`\`\`text
other leaders may continue.
\`\`\`

وفي Leaderless:

\`\`\`text
operation can succeed
as long as enough replicas respond.
\`\`\`

لكن availability مش binary.

بتعتمد على:

\`\`\`text
Topology
Quorum
Region
Failure mode
Network partition
\`\`\`

---

# 16. Consistency vs Availability

هنا CAP تظهر بوضوح.

لو network قسمت nodes:

\`\`\`text
Side A   X   Side B
\`\`\`

Single-Leader ممكن يسمح فقط للجانب صاحب الـ quorum/leader الشرعية بالكتابة.

Multi-Leader قد يسمح لعدة مناطق تكمل وتحتاج conflict resolution لاحقًا، حسب النظام.

Leaderless ممكن يحدد نجاح العملية بناءً على quorum.

كل Strategy بتتعامل مع partition بشكل مختلف.

---

# 17. مثال Banking System

تخيل Account:

\`\`\`text
Balance = $100
\`\`\`

طلبات متزامنة:

\`\`\`text
Withdraw $80

Withdraw $80
\`\`\`

هل تقدر بسهولة تسمح:

\`\`\`text
Region A accepts one

Region B accepts another
\`\`\`

وبعدين نعمل merge؟

غالبًا لأ.

لأن:

\`\`\`text
Business invariant:
Balance must not go negative.
\`\`\`

هنا model بترتيب writes قوي أو coordination مناسب قد يكون أفضل.

مش معنى الكلام:

\`\`\`text
Banking = Single-Leader دائمًا.
\`\`\`

لكن requirements تدفعك نحو stronger coordination.

---

# 18. مثال Social Likes

Post:

\`\`\`text
Likes = 1000
\`\`\`

Region A استقبلت:

\`\`\`text
+20
\`\`\`

Region B:

\`\`\`text
+15
\`\`\`

لو ظهر للمستخدم لحظيًا:

\`\`\`text
1020
\`\`\`

وبعد شوية:

\`\`\`text
1035
\`\`\`

غالبًا acceptable.

هنا ممكن تتحمل:

\`\`\`text
Eventual Consistency
\`\`\`

أكتر.

---

# 19. مثال User Profile

User تغير:

\`\`\`text
DisplayName
\`\`\`

في Device A.

وتغير:

\`\`\`text
ProfilePicture
\`\`\`

في Device B.

ممكن Application-level merge تعرف تحافظ على التعديلين.

لكن لو الاتنين غيروا:

\`\`\`text
DisplayName
\`\`\`

يبقى Conflict.

يعني suitability تعتمد كمان على:

# نوع الـ Data نفسها.

---

# 20. Example: E-Commerce

ممكن E-Commerce تستخدم consistency profiles مختلفة.

| Data | Replication preference |
|---|---|
| Product catalog | Reads موزعة وstaleness بسيطة ممكنة |
| Recommendations | Eventual consistency مناسبة |
| Analytics | Availability/throughput غالبًا أهم |
| Payment state | Freshness/consistency مهمة |
| Last inventory item | Coordination مهمة جدًا |
| Reviews | ممكن eventual consistency |
| Search index | نسخة مشتقة ومتأخرة قليلًا مقبولة غالبًا |

وده سبب إن System حقيقية ممكن تستخدم:

# أكثر من Database / Replication Strategy.

مش لازم كل data يبقى ليها نفس guarantees.

---

# 21. هل أستخدم Database واحدة لكل شيء؟

لو Requirements بسيطة:

\`\`\`text
نعم، غالبًا.
\`\`\`

مش لازم تقول:

\`\`\`text
Payments → Database A

Catalog → Database B

Analytics → Database C
\`\`\`

من أول يوم.

لكن في systems كبيرة جدًا ممكن:

\`\`\`text
Different workloads
→ Different storage technologies
→ Different replication semantics
\`\`\`

وده اسمه أحيانًا:

# Polyglot Persistence.

لكن له Operational Cost كبير.

---

# 22. Replication Strategy وFailover Complexity

Single-Leader:

\`\`\`text
مين الـ New Leader؟
\`\`\`

Multi-Leader:

\`\`\`text
إزاي نحل conflicts؟
إزاي نمنع incompatible concurrent writes؟
\`\`\`

Leaderless:

\`\`\`text
إزاي نعرف أحدث version؟
إزاي نrepair replicas؟
إزاي نحدد quorum؟
\`\`\`

كل Strategy بتشيل complexity من مكان وتحطها في مكان تاني.

---

# مفيش Strategy "بدون Complexity"

ده أهم درس هنا.

Single-Leader تقول:

> هبسط الـ writes لكن عندي leader/failover problem.

Multi-Leader تقول:

> هوزع writes لكن عندي conflict problem.

Leaderless تقول:

> هشيل الـ leader لكن عندي quorum/version/repair problem.

---

# 23. Single Point of Failure؟

وجود Leader واحدة مش بالضرورة يعني:

\`\`\`text
Single Point of Failure
\`\`\`

لو عندك:

\`\`\`text
Automatic failover
Followers
Consensus/election
\`\`\`

لأن Leader role نفسها ممكن تنتقل.

لكن أثناء الـ failover ممكن يبقى فيه:

\`\`\`text
Temporary write unavailability.
\`\`\`

يعني:

\`\`\`text
Single Writer
≠
Single physical copy.
\`\`\`

---

# 24. Multi-Leader ≠ Infinite Write Scaling

دي غلطة.

لو عندك 3 Leaders مش معناها:

\`\`\`text
Write throughput exactly ×3.
\`\`\`

لأن عندك:

\`\`\`text
Replication traffic
Conflict certification
Coordination
Indexes
Shared downstream dependencies
\`\`\`

وفي بعض systems الـ writes المتعارضة نفسها تحد scalability.

---

# 25. Leaderless ≠ Always Available

لو:

\`\`\`text
RF = 3
W = 2
\`\`\`

والمتاح:

\`\`\`text
1 replica
\`\`\`

Write تفشل.

يعني:

\`\`\`text
No Leader
\`\`\`

مش معناها:

\`\`\`text
No Availability Limits.
\`\`\`

الـ consistency level / quorum requirements هي اللي تحدد.

---

# 26. Read Repair مش بديل دائم للصيانة

في Leaderless systems، read repair ممكن تصلح discrepancies أثناء القراءة.

لكن Data نادرًا ما تتقرأ...

ممكن divergence تفضل موجودة.

عشان كده systems مثل Cassandra عندها anti-entropy repair كجزء مهم من maintenance لضمان convergence، وليس الاعتماد على read repair وحدها.

---

# 27. Replication Across Regions

المشكلة الأساسية:

\`\`\`text
Distance = Latency.
\`\`\`

لو Egypt ↔ USA round trip كبيرة...

Synchronous replication بينهم هتدخل latency على كل Write المطلوبة تنتظر الطرف الآخر.

Async replication:

\`\`\`text
Latency أقل
\`\`\`

لكن:

\`\`\`text
Lag / possible data-loss window
\`\`\`

أكبر.

عشان كده Multi-Region design دائمًا تقريبًا balancing بين:

\`\`\`text
Latency
Consistency
Availability
RPO
\`\`\`

---

# 28. Active-Passive vs Active-Active

مصطلحين مهمين مرتبطين بالموضوع.

## Active-Passive

\`\`\`text
Region A → Active Writer

Region B → Passive / Standby
\`\`\`

قريب من Single-Leader Multi-Region.

---

## Active-Active

\`\`\`text
Region A → Writes

Region B → Writes
\`\`\`

قريب conceptually من Multi-Leader أو distributed write architectures.

لكن كلمة:

\`\`\`text
Active-Active
\`\`\`

لا تخبرك وحدها عن الـ replication semantics.

لازم تعرف:

\`\`\`text
How conflicts are prevented/resolved?
\`\`\`

---

# 29. Client Routing

حتى لو Database design ممتاز...

Application محتاجة تعرف تبعت requests فين.

Single-Leader:

\`\`\`text
Write Endpoint
↓
Current Leader
\`\`\`

Reads:

\`\`\`text
Reader Endpoint
↓
Replicas
\`\`\`

Multi-Leader:

\`\`\`text
User Region
↓
Nearest Leader
\`\`\`

Leaderless:

\`\`\`text
Client
↓
Coordinator
↓
Replica Set
\`\`\`

يعني Routing جزء أساسي من design.

---

# 30. What if a Node is Slow وليس Dead؟

دي من أصعب مشاكل Distributed Systems.

Replica:

\`\`\`text
لسه شغالة
\`\`\`

لكن response:

\`\`\`text
5 seconds.
\`\`\`

هل تستناها؟

لو:

\`\`\`text
W = ALL
\`\`\`

ممكن operation كلها تتعطل.

لو:

\`\`\`text
W = QUORUM
\`\`\`

ممكن تكمل من غيرها.

يبقى quorum مش بس failure tolerance.

كمان:

# Tail-latency decision.

---

# 31. Quorum مش Majority دائمًا كمفهوم عام

كلمة quorum غالبًا تشير لمجموعة كافية من المشاركين لتحقيق guarantee.

في Cassandra \`QUORUM\` تحديدًا تعني majority \`n/2 + 1\` للـ replica set المطلوب.

لكن ما تعممّش implementation واحدة على كل distributed database.

كل Product لها semantics مختلفة.

---

# 32. Versioning

لو Nodes مختلفة تحمل نسخ مختلفة:

\`\`\`text
A → v10

B → v9

C → v10
\`\`\`

النظام محتاج يعرف:

\`\`\`text
Which version is newer?
\`\`\`

أحيانًا:

\`\`\`text
Sequence Number
Log Position
Term + Index
Timestamp
Version Vector
Hybrid Logical Clock
\`\`\`

حسب architecture.

من غير version metadata، reconciliation أصعب بكتير.

---

# 33. Clock مشكلة لوحدها

لو بتستخدم timestamps لحل conflicts:

\`\`\`text
Last Write Wins
\`\`\`

مين قال إن ساعات كل السيرفرات متطابقة تمامًا؟

\`\`\`text
Node A clock = 10:00:00.005

Node B clock = 10:00:00.001
\`\`\`

Clock skew ممكن يؤثر على القرار.

عشان كده distributed databases المتقدمة لا تعتمد دائمًا على wall-clock بشكل naive.

---

# 34. Conflict Avoidance أفضل من Conflict Resolution

بدل ما تسمح conflicts وبعدين تحاول تصلحها...

أحيانًا صمم ownership.

مثال:

\`\`\`text
User IDs 1-1M
→ Region A owns writes

User IDs 1M-2M
→ Region B owns writes
\`\`\`

ساعتها كل item لها Leader منطقية.

ده يقلل concurrent conflicts.

لكن:

\`\`\`text
Rebalancing
Ownership transfer
Regional failure
\`\`\`

يبقوا تحديات جديدة.

---

# 35. Sharding + Replication

System كبيرة ممكن يكون عندها:

\`\`\`text
Shard A
├── Leader
├── Follower
└── Follower

Shard B
├── Leader
├── Follower
└── Follower
\`\`\`

يعني:

# Single-Leader per shard.

مش بالضرورة Leader واحدة لكل Database في العالم.

وده pattern شائع conceptually.

---

# 36. Single-Leader per Partition

مثال:

\`\`\`text
Partition 1 → Leader Node A

Partition 2 → Leader Node B

Partition 3 → Leader Node C
\`\`\`

دلوقتي على مستوى الـ cluster:

\`\`\`text
عدة Nodes تقبل writes.
\`\`\`

لكن لكل partition:

\`\`\`text
Leader واحدة.
\`\`\`

وده يديك write scaling بدون conflict model كامل زي Multi-Leader على نفس البيانات.

مهم جدًا تفرق بين:

\`\`\`text
One leader for the whole database
\`\`\`

و:

\`\`\`text
One leader per partition.
\`\`\`

---

# 37. Multi-Leader مش نفس Single-Leader per Shard

في Single-Leader per shard:

\`\`\`text
Data Item X
→ لها Leader واحدة في نفس اللحظة.
\`\`\`

أما Multi-Leader:

\`\`\`text
نفس replicated dataset
قد تقبل writes من أكثر من leader.
\`\`\`

وده سبب اختلاف conflict story.

---

# 38. Disaster Recovery

لو الهدف الأساسي:

\`\`\`text
Disaster Recovery
\`\`\`

ممكن Single-Leader + async cross-region replica تكون كفاية.

مش لازم Multi-Leader.

مثال:

\`\`\`text
Egypt Active
↓ async replication
Germany Standby
\`\`\`

لو Egypt region وقعت:

\`\`\`text
Promote Germany.
\`\`\`

أبسط بكتير من Active-Active لو Business مش محتاج global writes.

---

# 39. Don't Solve a Latency Problem with Conflict Complexity Without Need

لو عندك مستخدمين عالميين، أول instinct:

\`\`\`text
Multi-Leader everywhere!
\`\`\`

لكن ممكن الحل:

\`\`\`text
Global CDN
Read replicas
Local caches
Single writer region
\`\`\`

يكون كفاية.

لو الـ Writes قليلة...

ليه تدخل Multi-Leader conflict complexity؟

مرة تانية:

# Solve the bottleneck you actually have.

---

# 40. .NET Application Perspective

كتطبيق ASP.NET Core، أهم حاجة مش إنك تكتب replication algorithm بنفسك.

غالبًا Database / managed platform هي اللي تعمل replication.

مسؤوليتك:

\`\`\`text
تفهم guarantees.
\`\`\`

مثلًا عندك:

\`\`\`csharp
WriteDbContext
\`\`\`

يوصل Writer endpoint.

و:

\`\`\`csharp
ReadDbContext
\`\`\`

يوصل Reader endpoint.

---

# مثال

\`\`\`csharp
builder.Services.AddDbContext<WriteDbContext>(
    options =>
        options.UseNpgsql(
            configuration.GetConnectionString(
                "WriteDatabase")));

builder.Services.AddDbContext<ReadDbContext>(
    options =>
        options.UseNpgsql(
            configuration.GetConnectionString(
                "ReadDatabase")));
\`\`\`

لكن التطبيق لازم تعرف:

\`\`\`text
هل ReadDatabase stale؟
\`\`\`

وده قرار أكبر من DI.

---

# مثال Use Case

\`\`\`csharp
public async Task<OrderDto?> GetOrderAsync(
    Guid id,
    CancellationToken cancellationToken)
{
    return await _readContext.Orders
        .AsNoTracking()
        .Where(x => x.Id == id)
        .Select(x => new OrderDto(
            x.Id,
            x.Status,
            x.Total))
        .SingleOrDefaultAsync(
            cancellationToken);
}
\`\`\`

ينفع للـ order history غالبًا.

لكن بعد:

\`\`\`text
POST /orders/{id}/pay
\`\`\`

هل لازم تقرأ status فورًا من Primary؟

ممكن.

الـ use case هي اللي تحدد.

---

# 41. CQRS وعلاقتها بالموضوع

CQRS تقول:

\`\`\`text
Commands
≠
Queries
\`\`\`

Replication تقول:

\`\`\`text
Data Copies
+
Write Authority
\`\`\`

ممكن تدمجهم:

\`\`\`text
Command Handler
 ↓
Writer / Leader

Query Handler
 ↓
Read Replica
\`\`\`

وده design شائع جدًا.

لكن:

\`\`\`text
CQRS لا تشترط Replication.
Replication لا تشترط CQRS.
\`\`\`

---

# 42. Metrics لازم تراقبها

مهما كانت Strategy، محتاج تشوف:

| Metric | ليه مهمة؟ |
|---|---|
| Replication Lag | هل replicas متأخرة؟ |
| Apply Rate | هل replica تلحق الـ writes؟ |
| Write Throughput | هل writer bottleneck؟ |
| Read Throughput | هل توزيع reads فعّال؟ |
| Conflict Rate | مهم جدًا في multi-writer |
| Quorum Failures | هل replicas المتاحة كفاية؟ |
| Failover Count | هل cluster غير مستقرة؟ |
| Repair Backlog | مهم للـ leaderless systems |
| Network Latency | خصوصًا multi-region |
| Replication Traffic | cost + capacity |
| Disk Queue / IOPS | replication apply bottleneck |
| Error Rate | هل clients بتفشل؟ |

---

# 43. Strategy Selection

بدل سؤال:

> مين الأفضل؟

خلينا نقارن عمليًا.

| Requirement | Single-Leader | Multi-Leader | Leaderless |
|---|---:|---:|---:|
| Simplicity | ⭐⭐⭐ | ⭐ | ⭐ |
| Write conflict simplicity | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| Read scaling | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Multi-region local writes | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Easy ordering of writes | ⭐⭐⭐ | ⭐ | ⭐ |
| No leader failover | ❌ | جزئيًا | ✅ |
| Conflict handling required | قليل | عالي | متوسط/عالي |
| Tunable consistency | محدود حسب DB | حسب DB | شائع |
| Operational complexity | متوسط | عالي | عالي |
| Great first default | غالبًا | حالات خاصة | workloads معينة |

دي مش Ranking مطلق.

كل row بتجاوب Requirement مختلفة.

---

# 44. إمتى أميل لـ Single-Leader؟

لو عندك:

\`\`\`text
Application عادية
Strong ownership للـ writes
Reads كتير
Writes manageable
Conflict complexity مش مرغوبة
\`\`\`

غالبًا Single-Leader مكان منطقي جدًا تبدأ منه.

وهي أبسط mental model.

---

# إمتى أفكر Multi-Leader؟

لما Requirement فعلًا تقول:

\`\`\`text
Multiple regions must accept local writes.
\`\`\`

أو distributed/offline environments.

ومستعد تدفع تمن:

\`\`\`text
Conflict resolution
More operational complexity
\`\`\`

---

# إمتى Leaderless جذابة؟

لـ workloads محتاجة:

\`\`\`text
High write availability
Horizontal distribution
No single fixed leader
Tunable consistency
Large distributed data sets
\`\`\`

ومستعد تتعامل مع:

\`\`\`text
Quorum
Versioning
Repairs
Eventual consistency
\`\`\`

---

# 45. أشهر الأخطاء

أكبر خطأ هو اعتبار \`Multi-Leader\` تلقائيًا أفضل لأنها "أكثر distributed". الأكثر distributed مش معناه الأنسب. خطأ تاني هو افتراض أن \`Leaderless\` معناها no coordination؛ الـ quorum والـ repair والتعامل مع concurrent versions كلها forms من coordination. وبرضه إضافة read replicas لا تحل write bottleneck في single-leader، و\`Last Write Wins\` لا يصلح كقاعدة business لكل conflict، و\`RF=3\` مش معناها تلقائيًا إنك تقدر تفقد أي Node في أي configuration.

ومن الأخطاء المهمة كمان الخلط بين synchronous/asynchronous وبين leader topology، والخلط بين replication وbackup، والاعتماد على replica للـ authorization أو payment decisions من غير فهم freshness، وتشغيل multi-region synchronous replication من غير حساب network RTT، واختيار strategy من architecture diagram بدل الـ business invariants.

---

# 46. أهم سؤال في المقال كله

قبل أي technology اسأل:

# هل نفس Data لازم تقبل Writes من أكثر من مكان في نفس الوقت؟

لو:

\`\`\`text
لا
\`\`\`

Single-Leader غالبًا أبسط.

لو:

\`\`\`text
نعم
\`\`\`

اسأل:

> لو Writes تعارضت، أقدر أحل Conflict؟

لو:

\`\`\`text
نعم
\`\`\`

Multi-Leader ممكن تدخل الصورة.

لو محتاج:

\`\`\`text
Distributed writes
+
Replica availability
+
Tunable consistency
\`\`\`

Leaderless ممكن تكون مناسبة.

لكن الإجابة مش:

\`\`\`text
Technology X أسرع.
\`\`\`

الإجابة تبدأ من:

# Data Semantics.

---

# 47. Decision Flow

\`\`\`text
Need Replication
      ↓

Who should accept writes?
      ↓

Only one authority?
      ↓
Single-Leader
\`\`\`

أما:

\`\`\`text
Need local writes
in multiple regions?
      ↓
Can handle conflicts?
      ↓
Multi-Leader
\`\`\`

أما:

\`\`\`text
Want writes distributed
across replica set?
      ↓
Can design around quorum,
versioning and repair?
      ↓
Leaderless
\`\`\`

ثم لكل اختيار:

\`\`\`text
Sync or Async?

How many replicas?

Where are they?

What consistency?

How much lag?

What happens during partition?

What happens after recovery?
\`\`\`

---

# 48. Mental Model النهائي

احفظ الفرق كده:

\`\`\`text
Single-Leader
=
One place decides writes.
\`\`\`

\`\`\`text
Multi-Leader
=
Multiple places accept writes,
so conflicts become first-class.
\`\`\`

\`\`\`text
Leaderless
=
No fixed writer;
replicas + quorum + reconciliation
decide success and convergence.
\`\`\`

والـ trade-off الأساسي:

\`\`\`text
More freedom to write
        ↓
More coordination/conflict complexity
\`\`\`

---

# 49. الخلاصة

Replication Strategy مش سؤال:

> كام Replica أعمل؟

السؤال الأهم:

# مين يملك حق الكتابة؟

لأن:

\`\`\`text
One Writer
→ Single-Leader
\`\`\`

\`\`\`text
Multiple Writers
→ Multi-Leader
\`\`\`

\`\`\`text
No Fixed Writer
→ Leaderless
\`\`\`

ومن السؤال ده يتفرع:

\`\`\`text
Consistency
Availability
Latency
Conflict Resolution
Failover
Write Scalability
Multi-Region Architecture
\`\`\`

وأهم شيء:

> **مفيش Strategy أحسن مطلقًا.**

Single-Leader بتشتري:

\`\`\`text
Simpler write ordering
\`\`\`

مقابل:

\`\`\`text
Leader dependency.
\`\`\`

Multi-Leader بتشتري:

\`\`\`text
Local / distributed writes
\`\`\`

مقابل:

\`\`\`text
Conflicts.
\`\`\`

Leaderless بتشتري:

\`\`\`text
Distributed availability
and tunable quorum behavior
\`\`\`

مقابل:

\`\`\`text
Versioning + repair + reconciliation complexity.
\`\`\`

وده System Design الحقيقي:

# مش تختار Technology أقوى؛ تختار الـ Trade-off اللي الـ Business يقدر يعيش معاه.

---

# 🔜 System Design Series — Next

المقالة الجاية:

# **Single-Leader Replication**

وساعتها هنفك Strategy الأولى بالكامل:

\`\`\`text
Leader
↓
Followers

Write Path
Read Path
Replication Log
Sync vs Async
Leader Failure
Failover
Leader Election
Split Brain
Stale Reads
Read-Your-Writes
Replication Lag
Data Loss Window
\`\`\`

ونشوف بالسيناريوهات إيه اللي يحصل لو:

\`\`\`text
Leader ماتت قبل ما آخر Write توصل للـ Followers.
\`\`\`

ومن هنا هنبدأ ندخل بعمق أكتر في كل Replication Model لوحدها.
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-26',
  category: 'Architecture',
  readTime: '24 min read',
  image: replicationStrategiesImage,
};
