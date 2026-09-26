import type { BlogPost } from '@/modules/blog/types';
import capTheoremImage from '@/assets/blog/system-design/cap-theorem.jpg';

export const post: BlogPost = {
  id: 29,
  title: 'CAP Theorem — ماذا يحدث عندما لا تستطيع الـ Nodes التواصل مع بعضها؟',
  excerpt:
    'لما أضفنا Replicas للـ Database، ظهر سؤال أخطر: ماذا لو Node A وNode B شغالين، لكن الـ Network بينهم اتقطعت؟ دليلك الشامل لفهم CAP Theorem بشكل صحيح: Consistency vs Availability أثناء Partition، Stale Reads، Quorum، وقرارات التصميم الحقيقية.',
  content: `# 🌐 System Design Series #03
# CAP Theorem — ماذا يحدث عندما لا تستطيع الـ Nodes التواصل مع بعضها؟

في المقالة السابقة عن **Scalability** وصلنا للحظة مهمة جدًا.

بدأنا بـ:

\`\`\`text
Application
    ↓
Database
\`\`\`

وبعد زيادة الـ Load بدأنا نفكر في:

\`\`\`text
Database Replication
\`\`\`

فبقى عندنا مثلًا:

\`\`\`text
          Database A
             ↕
          Database B
\`\`\`

وده يبدو أفضل.

عندنا أكثر من نسخة من البيانات، ونقدر نحسن الـ Availability والـ Scalability.

لكن ظهر سؤال أخطر:

> ماذا لو Database A وDatabase B شغالين، لكن الـ Network بينهم اتقطعت؟

يعني:

\`\`\`text
Database A       Database B
    ✅               ✅

        ❌ Network ❌
\`\`\`

المستخدم الموجود ناحية A يستطيع الوصول إلى A.

والمستخدم الموجود ناحية B يستطيع الوصول إلى B.

لكن:

\`\`\`text
A cannot talk to B
B cannot talk to A
\`\`\`

دلوقتي لو User كتب:

\`\`\`text
Balance = $50
\`\`\`

على A...

وUser آخر قرأ من B...

إيه القيمة اللي المفروض ترجع؟

وهنا تبدأ:

# CAP Theorem

---

# 1. يعني إيه CAP؟

CAP اختصار لثلاث خصائص:

\`\`\`text
C → Consistency
A → Availability
P → Partition Tolerance
\`\`\`

النظرية ارتبطت بإريك بروير، ثم قام Seth Gilbert وNancy Lynch بصياغة وبرهنة نتيجة عدم الإمكان رسميًا في سياق أنظمة read/write موزعة. الفكرة الأساسية: أثناء وجود Network Partition لا يمكن لنظام موزع أن يضمن في الوقت نفسه consistency القوية والavailability الكاملة لكل العمليات.

لكن الجملة المشهورة:

> "Choose any 2 out of 3."

مفيدة كبداية فقط...

لكنها **تبسيط زائد جدًا**.

حتى Eric Brewer نفسه وضح لاحقًا إن صيغة "2 of 3" أدت لكثير من سوء الفهم؛ الاختيار الحقيقي المهم يظهر **أثناء حدوث Partition**، ويمكن أن يختلف حسب العملية أو نوع البيانات داخل نفس النظام.

هنفهم ده بالتدريج.

---

# 2. أولًا: Consistency

في CAP، كلمة:

# Consistency

لها معنى محدد جدًا.

مش المقصود:

\`\`\`text
Database constraints
Foreign Keys
Valid business data
\`\`\`

وده مختلف عن حرف C الموجود في:

\`\`\`text
ACID
\`\`\`

Microsoft تنبه صراحةً إلى أن Consistency في CAP لها معنى تقني مختلف عن Consistency في ACID.

في CAP إحنا بنتكلم بصورة مبسطة عن فكرة قريبة من:

> كل Read تشوف أحدث Write ناجحة، أو العملية تفشل بدل ما ترجع نسخة قديمة.

تخيل:

\`\`\`text
Initial Value:  Name = Ahmed
\`\`\`

User يعمل:

\`\`\`text
WRITE  Name = Mohamed
\`\`\`

ونجحت العملية.

بعدها مباشرة:

\`\`\`text
READ
\`\`\`

لو النظام Consistent بالشكل المقصود هنا، المفروض تشوف:

\`\`\`text
Mohamed
\`\`\`

مش:

\`\`\`text
Ahmed
\`\`\`

---

# 3. Consistency مع Replicas

عندك:

\`\`\`text
Node A: Name=Ahmed
    ↕
Node B: Name=Ahmed
\`\`\`

User يكتب على A:

\`\`\`text
Name = Mohamed
\`\`\`

في لحظة معينة ممكن تبقى الحالة:

\`\`\`text
Node A           Node B
Mohamed ✅        Ahmed ⚠️
\`\`\`

لأن Replication لسه ما وصلت.

لو Request راحت Node B في اللحظة دي وطلبت:

\`\`\`text
GET /user
\`\`\`

ممكن ترجع:

\`\`\`text
Ahmed
\`\`\`

وده:

# Stale Read

وده بالضبط أحد المواضيع اللي هنخصص لها جزء كامل لاحقًا.

---

# 4. Strong Consistency

لو Business Requirement تقول:

> ممنوع User تشوف Data قديمة.

يبقى ممكن النظام يقول:

\`\`\`text
أنا مش هرجع Read
إلا لما أتأكد إنها أحدث نسخة.
\`\`\`

ممكن يحتاج:

\`\`\`text
Coordination / Replication acknowledgments
Quorum / Leader / Consensus
\`\`\`

وده غالبًا له تكلفة:

\`\`\`text
Latency ↑
Coordination ↑
Availability during failures ↓
\`\`\`

وده أول Trade-off.

---

# 5. Availability

الـ A في CAP تعني:

# Availability

في النموذج النظري، كل request تصل إلى node سليمة يجب أن تنتهي برد، بدل أن تنتظر للأبد أو تُرفض فقط لأن النظام لا يستطيع التأكد من consistency. Gilbert وLynch عرّفا availability بأن كل request تنتهي في النهاية باستجابة، بينما AWS تصيغها عمليًا بأن request تحصل على non-error response حتى تحت حالات failure المشمولة بالنموذج.

يعني النظام Availability-oriented غالبًا يحاول:

\`\`\`text
Respond to requests
\`\`\`

بدل:

\`\`\`text
Sorry, I cannot verify the other node.
\`\`\`

---

# خلي بالك

Availability في CAP مش معناها:

\`\`\`text
99.99% uptime
\`\`\`

بالضبط.

الـ Production Availability اللي بنتكلم عنها في SLOs (99.9%، 99.99%...) Concept أوسع وعملي.

أما CAP Availability فهي property داخل الـ theorem.

دي نقطة مهمة جدًا عشان متخلطش المفهومين.

---

# 6. Partition Tolerance

الـ P معناها:

# Partition Tolerance

يعني إن النظام لازم يحدد Behavior مع استمرار تعذر التواصل بين مجموعات من الـ Nodes.

مثلًا:

\`\`\`text
      Region A
      Node A
         │
         X
         │
      Node B
      Region B
\`\`\`

الـ Nodes نفسها شغالة.

لكن:

\`\`\`text
Packets delayed / Packets dropped
Link failed / Region connectivity failed
\`\`\`

Gilbert وLynch تعاملوا مع partition على أساس إن communication بين الـ servers قد تصبح غير موثوقة، والرسائل قد تتأخر أو تضيع.

---

# 7. Network Partition مش معناها Server وقع

دي نقطة مهمة جدًا.

ممكن:

\`\`\`text
Server A ✅
Server B ✅
\`\`\`

لكن:

\`\`\`text
A → B ❌
B → A ❌
\`\`\`

من وجهة نظر A:

> B ماتت؟

مش عارف.

ممكن B تكون شغالة لكن Network هي المشكلة.

ودي واحدة من أصعب مشاكل Distributed Systems:

# You often cannot reliably distinguish a dead node from a very slow or unreachable node.

---

# 8. السيناريو اللي CAP بتحاول تشرحه

عندنا:

\`\`\`text
Node A: X = 10
    ↕
Node B: X = 10
\`\`\`

حصل:

# Network Partition

\`\`\`text
Node A  X  Node B
X = 10     X = 10
\`\`\`

دلوقتي Client ناحية A يقول:

\`\`\`text
WRITE X = 20
\`\`\`

إيه اللي تعمل Node A؟

عندنا طريقين أساسيين.

---

# 9. اختيار Consistency

Node A تقول:

> أنا مش قادرة أكلم B. لو قبلت Write، ممكن B تفضل عندها X=10. ساعتها بقينا inconsistent.

فتقول:

\`\`\`text
Reject / block operation
\`\`\`

مثلًا:

\`\`\`text
503 / Unavailable / Cannot achieve quorum
\`\`\`

وبالتالي:

\`\`\`text
Consistency ✅
Availability ❌ during this partition
\`\`\`

وده الاتجاه المعروف عادة باسم:

# CP behavior

Consistency + Partition tolerance.

---

# 10. اختيار Availability

بدل كده Node A تقول:

> أنا مش قادرة أكلم B، لكن مش هوقف المستخدمين.

فتقبل:

\`\`\`text
X = 20
\`\`\`

وفي نفس الوقت Node B ممكن User آخر يكتب:

\`\`\`text
X = 30
\`\`\`

فتبقى:

\`\`\`text
Node A: X = 20
Node B: X = 30
\`\`\`

النظام متاح. لكن:

# البيانات اختلفت.

وبالتالي:

\`\`\`text
Availability ✅
Immediate Consistency ❌
\`\`\`

وده behavior أقرب إلى:

# AP

Availability + Partition tolerance.

وبعد رجوع الـ Network لازم يحصل:

\`\`\`text
Conflict detection + Reconciliation
\`\`\`

---

# 11. إذن CAP بتقول إيه فعلًا؟

المعنى الأهم:

# عندما يحدث Network Partition، لازم تحدد هل العملية ستحافظ على Consistency أم Availability.

AWS تلخص الفكرة بنفس الشكل: لأن distributed systems الواقعية تحتاج التعامل مع network failures، فعند partition يظهر الاختيار بين إرجاع responses مع احتمال inconsistency، أو رفض بعض العمليات للحفاظ على consistency.

\`\`\`text
               Network Partition
                       │
                 ┌─────┴─────┐
                 ↓           ↓
            Preserve C   Preserve A
                 ↓           ↓
          Reject/Block   Accept Request
           some work     maybe stale/
                         divergent data
\`\`\`

دي الصورة الأصح.

---

# 12. طب فين CA؟

هنا أشهر سؤال.

هل ممكن نختار Consistency + Availability ونتجاهل Partition Tolerance؟

المشكلة إنك مش قادر تقول للـ Network:

> ممنوع يحصل Partition 😄

في نظام distributed، failure في الاتصال حاجة لازم تتعامل معاها.

عشان كده في الأنظمة الموزعة على شبكة، P مش checkbox تختار تشيله ببساطة.

Microsoft تقول في سياق cloud environments إن network partitions لا يمكن اعتبارها شيئًا يمكن تجاهله، ولذلك عند وقوعها يظهر trade-off بين consistency وavailability.

---

# 13. إمتى CA تبقى Concept مفيد؟

لو عندك:

\`\`\`text
Single database node
Application → SQL Server
\`\`\`

مفيش بين replicas Network Partition. لأن مفيش replicas.

لكن في المقابل... لو الـ Database وقعت:

\`\`\`text
System unavailable.
\`\`\`

إنت تفاديت distributed consistency problem... مش لأنك هزمت CAP. لكن لأن Architecture مش distributed بالشكل اللي theorem بتتناوله.

---

# 14. "Pick Two" ليه مضللة؟

الجملة:

\`\`\`text
Pick C+A  or  C+P  or  A+P
\`\`\`

بتدي impression إنك أثناء تصميم database تختار package ثابتة للأبد.

لكن الحقيقة أدق.

Eric Brewer وضح إن Partitions are exceptional periods.

ولما مفيش Partition، النظام يقدر عادة يوفر Consistency + Availability في نفس الوقت.

الـ conflict يظهر أساسًا:

# أثناء الـ Partition.

كما أشار إلى أن الاختيار قد يحدث على مستوى operation أو subsystem أو data item، وليس بالضرورة قاعدة واحدة لكل النظام.

---

# 15. التصميم الحقيقي

بدل:

\`\`\`text
Database = AP
\`\`\`

فكر:

\`\`\`text
When partition happens...
  What operations remain available?
  What operations stop?
  What consistency level do we need?
  How do we recover afterwards?
\`\`\`

ده Mental Model أقوى بكتير.

---

# 16. مثال E-Commerce

عندنا System موزعة بين Cairo Region وDubai Region، وحصل Partition.

## Product Description

Cairo: iPhone — Black
Dubai نسخة متأخرة: iPhone — Space Black

هل ده Disaster؟ غالبًا: **No.**

ممكن تقبل Availability أعلى مع temporary inconsistency.

## Inventory

\`\`\`text
Last item in stock.
Cairo: Stock = 1
Dubai: Stock = 1
\`\`\`

لو الاتنين أثناء Partition قبلوا Buy last item:

\`\`\`text
2 customers / 1 item → Oops 😄
\`\`\`

هنا consistency requirement أهم.

## Payment / Balance

\`\`\`text
Balance = $100
Client A يسحب $80
Client B يسحب $80
\`\`\`

لو الاتنين nodes قبلوا العمليات بشكل مستقل:

\`\`\`text
$160 withdrawn from $100
\`\`\`

وده ممكن يكون غير مقبول تمامًا.

## Likes Counter

\`\`\`text
Node A: 10,001
Node B: 10,003  (لمدة قصيرة)
\`\`\`

غالبًا مقبول. نقدر نعمل reconciliation بعدين.

---

# نفس الـ System ممكن تختار Behavior مختلف

| Data | أثناء Partition |
|---|---|
| Product description | Favor Availability |
| Product reviews | Favor Availability |
| Analytics | Favor Availability |
| Bank balance | Favor Consistency |
| Unique coupon redemption | Favor Consistency |
| Inventory final units | غالبًا Consistency أقوى |
| View counter | Eventual consistency ممكن تكون ممتازة |

إذن:

# CAP decision belongs to business semantics too.

مش Database technology فقط.

---

# 17. CP System عمليًا

في CP-oriented operation، لو Node مش قادرة تتأكد من صحة state:

\`\`\`text
Don't accept operation.
\`\`\`

\`\`\`text
Node A
   │
   X Cannot reach quorum
   │
Reject Write
\`\`\`

المستخدم ممكن يشوف:

\`\`\`text
Temporarily unavailable
\`\`\`

لكن ميزة القرار:

\`\`\`text
We prefer no answer
over a potentially incorrect answer.
\`\`\`

## CP مناسبة فين؟

\`\`\`text
Leader election / Configuration / Distributed coordination
Financial invariants / Critical inventory / Locks / ownership
\`\`\`

لكن حتى هنا implementation details مهمة جدًا، ومش معنى category دي إن كل عملية داخل النظام لازم تكون CP بنفس الدرجة.

---

# 18. AP System عمليًا

في Availability-oriented design:

\`\`\`text
Node A accepts write.
Node B accepts write.
\`\`\`

حتى أثناء partition.

بعد رجوع Network:

\`\`\`text
Merge / Reconcile
\`\`\`

يبقى لازم تحل:

\`\`\`text
Conflicting Writes
\`\`\`

## Conflict Resolution

ممكن تستخدم استراتيجيات مثل:

\`\`\`text
Last Write Wins / Version vectors / Application merge
CRDTs / Manual reconciliation
\`\`\`

وده يوضح إن:

# Choosing Availability doesn't eliminate complexity.

هي تنقل جزء من الـ complexity إلى Conflict Resolution.

---

# 19. Eventual Consistency

واحدة من أشهر الأفكار المرتبطة بـ AP systems.

معناها ببساطة:

> لو وقفنا writes الجديدة، replicas هتتقارب في النهاية لنفس state.

مثال:

\`\`\`text
Time 0:    A=100 / B=90 / C=95
Time +Δ:   A=100 / B=100 / C=100
\`\`\`

خلال الفترة قبل convergence: Stale reads possible.

---

# Eventual Consistency ≠ Random Data Forever

دي غلطة شائعة.

مش معناها كل node ترجع أي حاجة وخلاص.

هي consistency model لها guarantees وتصميم reconciliation.

لكن أضعف من strict immediate consistency.

---

# 20. Strong vs Eventual Consistency

| Strong | Eventual |
|---|---|
| Read ترى أحدث value المطلوبة | Read قد ترى نسخة أقدم مؤقتًا |
| Coordination أكثر | Coordination أقل عادة |
| Latency أعلى أحيانًا | Latency أقل أحيانًا |
| Partition قد يسبب رفض عمليات | ممكن استمرار خدمة أكثر |
| ممتازة للـ critical invariants | ممتازة لبيانات تقبل التأخير |

مش معنى:

\`\`\`text
Strong = good
Eventual = bad
\`\`\`

كل واحدة مناسبة لمشكلة.

---

# 21. Stale Reads

عندنا:

\`\`\`text
Primary → Replica
\`\`\`

User عمل:

\`\`\`http
POST /profile
Name = Mohamed → Primary → 200 OK
\`\`\`

بعدها مباشرة:

\`\`\`http
GET /profile → Replica
\`\`\`

لكن replication متأخرة:

\`\`\`text
Replica: Name = Ahmed
\`\`\`

User يقول:

> أنا لسه مغير الاسم! 😄

ده:

# Stale Read

---

# 22. Read-Your-Writes Consistency

واحد من solutions:

بعد User تعمل Write... نضمن إن Reads الخاصة بنفس User لمدة معينة تروح Primary أو Node عندها النسخة الأحدث.

\`\`\`text
Write → Read → See your write ✅
\`\`\`

حتى لو Users آخرين ممكن يشوفوا نسخة متأخرة قليلًا.

وده مثال ممتاز إن consistency:

# مش On / Off فقط.

في Levels وGuarantees مختلفة.

---

# 23. Monotonic Reads

تخيل User قرأت Version 10، وبعدها Request راحت Replica أبطأ ورجعت Version 8.

حسيت كأن الزمن رجع للخلف 😄

Monotonic Reads تحاول تضمن:

\`\`\`text
Once you've seen version 10,
don't later show version 8.
\`\`\`

دي consistency guarantee أقل من linearizability الكاملة، لكنها مفيدة جدًا UX-wise.

---

# 24. Quorum

تخيل عندك:

\`\`\`text
N = 3 replicas
\`\`\`

بدل ما كل Write تستنى الثلاثة، تقول:

\`\`\`text
Write considered successful if 2 replicas acknowledge.
W = 2
R = 2
N = 3
\`\`\`

# Quorum Formula المشهورة

\`\`\`text
W + R > N
2 + 2 > 3 ✅
\`\`\`

بالتالي المفروض واحدة على الأقل من replicas اللي قرأنا منها تكون شاركت في أحدث write.

لكن:

# ده لا يجعل كل distributed database تلقائيًا linearizable.

التوقيت، conflict resolution، concurrent writes، sloppy quorum، implementation details كلها مهمة.

لكن الفكرة أساسية جدًا لفهم Leaderless systems.

---

# 25. Quorum والـ Availability

لو عندك:

\`\`\`text
N = 5
W = 3
\`\`\`

ممكن Node أو Nodeين يختفوا وما زالت writes تنجح.

لكن لو المتاح 2 nodes فقط:

\`\`\`text
Cannot reach write quorum.
\`\`\`

إذن Availability تعتمد على:

\`\`\`text
Quorum requirements + Failure pattern
\`\`\`

مش مجرد كلمة AP أو CP.

---

# 26. Leader-based Replication

الـ CAP theorem بتبدأ تبان أكتر مع Replication Strategies.

\`\`\`text
        Leader
       /      \\
      ↓        ↓
Follower 1   Follower 2
\`\`\`

Writes تروح Leader وده يقلل conflict possibilities.

لكن لو Leader اتعزل:

\`\`\`text
Follower side  X  Leader side
\`\`\`

مين المفروض يقبل Writes؟

لو الاتنين قبلوا:

# Split Brain

---

# 27. Split Brain

أحد أخطر scenarios.

قبل partition:

\`\`\`text
Node A = Leader / Node B = Follower
\`\`\`

Partition حصل. Node B:

> مش شايفة A، غالبًا ماتت. → تصبح Leader.

لكن A:

> أنا لسه Leader أصلًا 😅

بقى:

\`\`\`text
Leader A  X network  Leader B
A ← Writes           B ← Writes
\`\`\`

البيانات diverged.

عشان كده leader election وquorum مهمين جدًا.

---

# 28. ليه Consensus Protocols موجودة؟

Protocols مثل:

\`\`\`text
Raft / Paxos-family protocols
\`\`\`

تحاول تساعد مجموعة Nodes تتفق على state/leader/order رغم failures معينة.

الفكرة مش "CAP solved."

لكن:

\`\`\`text
When communication is insufficient,
some operations may become unavailable
rather than allow conflicting decisions.
\`\`\`

يعني Consistency ليها تكلفة.

---

# 29. Latency وعلاقتها بـ CAP

CAP classic theorem بتتكلم عن partition.

لكن Production فيها مشكلة تانية:

# إمتى أقرر إن دي Partition؟

تخيل:

\`\`\`text
A sends message to B
B ما ردتش بعد 100ms
\`\`\`

هل B ماتت؟ ولا Network slow؟ GC pause؟ CPU overload؟

لو استنيت للأبد: Availability suffers.

لو قررت بسرعة وكملت لوحدك: Consistency may suffer.

Eric Brewer شرح إن عمليًا timeout هو اللحظة التي يُجبر فيها النظام على اتخاذ "partition decision": إما انتظار/إلغاء العملية للحفاظ على consistency، أو الاستمرار مع خطر divergence.

وده رابط CAP بالـ Latency.

---

# 30. Network Partition مش Binary بالكامل

الحياة مش دائمًا:

\`\`\`text
Network working ✅  or  Network dead ❌
\`\`\`

ممكن:

\`\`\`text
High packet loss / 500ms latency / One-way connectivity
Partial connectivity / Specific nodes unreachable / Intermittent failure
\`\`\`

وده سبب إن distributed systems صعبة.

---

# 31. CAP وDatabase Choice

مينفعش تختار Database بس بناء على chart تقول:

\`\`\`text
SQL Server = CA / Cassandra = AP / MongoDB = CP
\`\`\`

الرسومات دي تعليمية جدًا لكنها غالبًا oversimplified.

Database الحديثة ممكن توفر:

\`\`\`text
Different consistency levels / Different replication modes
Different read/write concerns / Different behaviors per operation
\`\`\`

Eric Brewer نفسه أشار إلى إن الاختيارات يمكن أن تكون دقيقة وعلى مستوى operation أو subsystem، بدل تصنيف النظام كله في bucket ثابتة.

السؤال الأفضل:

> في Configuration والعملية اللي أنا بستخدمها، إيه behavior أثناء partition؟

---

# 32. مثال: Social Media

## Feed

لو Feed متأخرة ثانيتين: Okay. Availability غالبًا أهم.

## Likes

ممكن eventual consistency.

## Username uniqueness

لو الاتنين Regions سمحوا بـ @ahmed في نفس الوقت، هتعمل إيه؟ ممكن تحتاج coordination أقوى.

## Password Change

User غيّر password. مش لطيف إن Region تانية تسمح بالـ old password لمدة طويلة.

## Ads Analytics

ممكن تفضل شغالة وتعمل reconciliation بعدين.

نفس Platform. قرارات Consistency مختلفة.

---

# 33. مثال Shopping Cart

Shopping Cart classic مثال لبيانات ممكن نفضل Availability على strict immediate consistency.

User أضاف Laptop على Device A.

وأضاف Mouse على Device B أثناء مشكلة Network.

ممكن بعدين merge:

\`\`\`text
Cart = Laptop + Mouse
\`\`\`

بدل ما نقول للمستخدم:

\`\`\`text
Shopping temporarily unavailable
\`\`\`

حسب business rules طبعًا.

---

# 34. مثال Booking

لكن Seat Booking مختلف.

\`\`\`text
Seat A10
User في القاهرة: Book A10
User في دبي: Book A10
\`\`\`

لو الاتنين Regions قبلوا:

\`\`\`text
Two owners / One seat → مشكلة كبيرة
\`\`\`

هنا coordination/consistency أقوى غالبًا مطلوبة.

---

# 35. Availability أحيانًا مش معناها "نفذ الطلب"

ممكن تحافظ على جزء من تجربة المستخدم:

\`\`\`text
Product browsing ✅
Checkout ❌ temporarily
\`\`\`

مش لازم System تختار Everything available أو Everything down.

ممكن degradation على مستوى feature.

وده تصميم Production أذكى.

---

# 36. Partition Recovery

الموضوع مش ينتهي لما Network ترجع.

لو أثناء partition سمحنا Divergent Writes:

\`\`\`text
A = X / B = Y
\`\`\`

دلوقتي Network رجعت. لازم:

\`\`\`text
Detect divergence → Resolve conflict
→ Repair replicas → Restore normal operation
\`\`\`

Brewer اقترح التفكير صراحةً في lifecycle للـ partition: اكتشافها، العمل في partition mode، ثم recovery لإعادة consistency ومعالجة القرارات التي حدثت أثناء الانقسام.

---

# 37. Conflict Resolution ممكن تكون Business Problem

تخيل:

\`\`\`text
Address on A: Cairo
Address on B: Alexandria
\`\`\`

Last Write Wins ممكن يكون acceptable.

لكن:

\`\`\`text
Account balance
\`\`\`

مش كفاية تقول: آخر write تكسب.

ممكن تمسح transaction حقيقية.

يعني Application semantics مهمة جدًا.

---

# 38. CAP وMicroservices

CAP مش بس Database. أي distributed state/coordination ممكن يدخل في نفس النوع من المشاكل.

لكن CAP بصيغتها الأصلية تتعلق بخدمة shared-data موزعة. مش كل HTTP failure تقول عليها "CAP theorem!" 😄

لكن principles بتاعت:

\`\`\`text
Network failure / Coordination / Partial failure
Consistency / Availability
\`\`\`

هي قلب الـ distributed systems.

---

# 39. CAP وCaching

حتى Caching ممكن تدخلنا في consistency issues.

\`\`\`text
Database: Price = $100
Cache:    Price = $90  ← stale!
\`\`\`

Microsoft توضح إن Cache-Aside مع replicated/eventually consistent stores قد تعيد إدخال نسخة قديمة إلى cache لو replica لم تلحق أحدث write بعد.

يعني لما نوصل لمقالة Caching Strategies، CAP concepts هتظهر معانا مرة تانية.

---

# 40. CAP وMulti-Region

عندك:

\`\`\`text
Egypt Region ↕ Germany Region ↕ US Region
\`\`\`

المسافات نفسها تضيف Latency وأصبح عندك failure boundaries أكتر.

AWS تشير في إرشادات multi-region إلى إن نقل البيانات بين مناطق مختلفة يفرض consideration بين consistency والlatency والavailability، وأن asynchronous replication غالبًا يقلل write latency لكنه يفتح باب replication lag وeventual consistency.

---

# 41. Synchronous Replication

\`\`\`text
Client → Node A → Node B → ACK → Success
\`\`\`

ميزة: Stronger consistency.

لكن:

\`\`\`text
Latency ↑
\`\`\`

ولو B unreachable:

\`\`\`text
Write may fail → Availability تقل.
\`\`\`

---

# 42. Asynchronous Replication

\`\`\`text
Write A → Return Success → Replicate later to B
\`\`\`

أسرع ومتاحة أكثر.

لكن في Window:

\`\`\`text
A = New Data
B = Old Data
\`\`\`

لو A ماتت قبل Replication: Latest write could be unavailable.

وده هنفصله جدًا في Intro to Database Replication وReplication Strategies.

---

# 43. CAP مش مبرر لكل Eventual Consistency

ناس تقول: Distributed System، يبقى لازم Eventual Consistency.

لا.

ممكن تستخدم distributed consensus وتوفر strong consistency لبعض operations.

لكن الثمن يظهر في:

\`\`\`text
Latency / Availability under partitions / Coordination
\`\`\`

الموضوع Trade-off، مش استسلام.

---

# 44. CAP مش معناها إن Consistency مستحيلة

برضه غلط.

تقدر تعمل Consistent distributed system.

لكن أثناء partition لازم رفض بعض العمليات بدل استمرار كل operations.

\`\`\`text
Consistency achievable.

Consistency + full availability
during arbitrary partition
is the conflict.
\`\`\`

---

# 45. CAP مش معناها Database تختار خاصيتين للأبد

واحدة من أهم الأخطاء:

\`\`\`text
PostgreSQL = CA / Cassandra = AP / ZooKeeper = CP
\`\`\`

وتقف.

التصنيف ده مفيد جدًا كـ toy model... لكن Production behavior يعتمد على:

\`\`\`text
Topology / Configuration / Quorum / Consistency level
Replication mode / Operation / Failure mode
\`\`\`

فخلي CAP:

# Tool for reasoning.

مش Sticker نحطه على الـ Database.

---

# 46. PACELC — بعد CAP فين الـ Latency؟

CAP تركز أساسًا على: What happens during Partition?

لكن معظم الوقت: No partition.

وبرضه عندك Trade-off مهم:

\`\`\`text
Consistency vs Latency
\`\`\`

هنا يظهر Model اسمه:

# PACELC

\`\`\`text
If Partition:   Availability vs Consistency
Else:           Latency vs Consistency
\`\`\`

Microsoft تعرض PACELC بجانب CAP في شرح اختيار data stores، لأنه يضيف التفكير في latency خلال التشغيل الطبيعي، وليس فقط وقت partition.

---

# 47. مثال PACELC

حتى لو Network شغالة:

\`\`\`text
Node A — Egypt / Node B — USA
\`\`\`

لو كل Write لازم تستنى الاتنين:

\`\`\`text
Strong consistency ↑ / Latency ↑
\`\`\`

لو تكتب محليًا وترجع فورًا:

\`\`\`text
Latency ↓ / Temporary inconsistency possible ↑
\`\`\`

يعني trade-offs ما بتختفيش لمجرد إن مفيش Partition.

---

# 48. أهم سؤال: Data دي تتحمل إيه؟

| السؤال | ليه مهم؟ |
|---|---|
| هل Read قديمة لمدة ثانية مشكلة؟ | تحدد consistency level |
| هل Duplicate write مقبولة؟ | تحدد idempotency |
| هل Conflict ممكن يتعمل لها Merge؟ | تساعد AP-style designs |
| هل العملية مالية؟ | غالبًا consistency أقوى |
| هل Availability أهم من freshness؟ | قد تسمح eventual consistency |
| هل User لازم يشوف write بتاعته فورًا؟ | Read-your-writes |
| هل كل Regions لازم تقبل writes؟ | تؤثر على replication design |

---

# 49. System Design الحقيقي

بدل ما تقول:

\`\`\`text
I want a CP database.
\`\`\`

قول:

\`\`\`text
For payment confirmation:
  I prefer consistency.
  If quorum cannot be achieved, I will reject the operation.

For page-view analytics:
  I prefer availability.
  Events can be accepted locally and reconciled later.
\`\`\`

كده القرار له Business Meaning.

---

# 50. مثال API

\`\`\`http
POST /payments
\`\`\`

أثناء partition، النظام مش قادر يضمن إن transaction مش اتنفذت في Region أخرى.

ممكن تختار:

\`\`\`http
503 Service Unavailable
\`\`\`

بدل risk double charge.

لكن:

\`\`\`http
POST /analytics/page-view
\`\`\`

ممكن:

\`\`\`text
Accept locally → Synchronize later
\`\`\`

نفس Application. اتجاهين مختلفين.

---

# 51. أشهر الأخطاء في فهم CAP

| الخطأ | الصحيح |
|---|---|
| اختر أي 2 من 3 دائمًا | trade-off الأساسي يظهر أثناء partition |
| P اختيار اختياري | partitions لازم يتم التعامل معها في الشبكات الواقعية |
| C في CAP = C في ACID | مختلفين |
| AP يعني بيانات غلط دائمًا | قد تكون temporarily inconsistent ثم reconcile |
| CP يعني System كلها Down | ممكن عمليات معينة فقط تصبح unavailable |
| Database دائمًا AP أو CP | behavior قد يختلف حسب configuration/operation |
| Eventual Consistency سيئة | أحيانًا هي التصميم الأنسب |
| Strong Consistency دائمًا أفضل | لها latency/availability cost |
| CAP تحل تصميم Database | CAP framework للتفكير في trade-offs |
| Replicas = Scalability مجانية | replication تجيب consistency problems جديدة |

---

# 52. Decision Model بسيط

لما يحصل Network Partition، اسأل:

\`\`\`text
Can both sides continue independently
without violating business invariants?
\`\`\`

لو YES: ممكن تفكر ناحية Availability + Reconciliation later.

لو NO: غالبًا Preserve consistency + Reject/block some operations.

وده Mental Model أقوى من: AP or CP؟

---

# 53. قاعدة Payments vs Social

اختصار ممتاز:

\`\`\`text
Money:
Wrong answer is often worse than no answer.
\`\`\`

بينما:

\`\`\`text
Social feed:
Slightly stale answer is often better than no answer.
\`\`\`

مش قاعدة مطلقة، لكنها توضح فلسفة الاختيار.

---

# 54. أين تظهر CAP في سلسلة System Design؟

CAP هي الجسر بين Scalability وDatabase Replication.

لأن لما قلنا في المقالة السابقة:

\`\`\`text
Database Bottleneck → Add Replicas
\`\`\`

إحنا في اللحظة دي أدخلنا أسئلة جديدة:

\`\`\`text
Who's the latest replica?
What happens if replication is delayed?
What happens if leader fails?
What happens during partition?
Who accepts writes?
How do we resolve conflicts?
\`\`\`

وعشان كده ترتيب السلسلة بعد CAP منطقي جدًا:

\`\`\`text
CAP Theorem
      ↓
Intro to Database Replication
      ↓
Replication Strategies
      ↓
Single-Leader
      ↓
Multi-Leader
      ↓
Leaderless
      ↓
Tackling Stale Reads
\`\`\`

---

# 55. الخلاصة

CAP مش بتقول: اختار حرفين وارمي الثالث.

الأدق:

> في shared-data distributed system، عندما تمنع الـ Network أجزاء النظام من التواصل، لا يمكنك لكل العمليات أن تحافظ في الوقت نفسه على consistency القوية والavailability الكاملة.

أثناء Partition عندك سؤال:

\`\`\`text
Do I refuse some operations to protect consistency?
\`\`\`

أم:

\`\`\`text
Do I continue serving and reconcile later?
\`\`\`

الـ CAP Mental Model:

\`\`\`text
             Distributed Data
                    ↓
            Network Partition
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
   Preserve Consistency   Preserve Availability
          ↓                   ↓
 Reject/Block some work   Continue operations
                              ↓
                        Possible divergence
                              ↓
                           Reconcile
\`\`\`

وأهم حاجة:

# القرار مش تقني فقط.

لازم تسأل:

\`\`\`text
What does the business prefer:
  a temporarily unavailable answer
  or
  a potentially stale/conflicting answer?
\`\`\`

لأن Product Description... مش زي Inventory.

والـ Likes... مش زي Bank Balance.

والـ Analytics... مش زي Payment.

وده جوهر CAP فعلًا.

---

# 🧠 احفظ الأربع جمل دول

\`\`\`text
CAP Consistency
= reads observe the required latest consistent state.

CAP Availability
= requests keep receiving responses.

Partition
= nodes cannot reliably communicate.

During a partition,
strong consistency and full availability conflict.
\`\`\`

وأهم تصحيح للمفهوم:

# CAP ليست "Choose 2 forever."

الأفضل:

# "When Partition happens, decide what you are willing to sacrifice for this operation."

---

# 🔜 System Design Series #04

المقالة الجاية:

# Intro to Database Replication

وهنا هنحول الكلام النظري لArchitecture حقيقية:

\`\`\`text
            Primary
          /    |    \\
         ↓     ↓     ↓
     Replica Replica Replica
\`\`\`

ونفهم:

\`\`\`text
ليه نعمل Replication أصلًا؟
هل الهدف Availability ولا Scalability؟
Synchronous vs Asynchronous Replication؟
Replication Lag بيحصل ليه؟
لو Primary وقعت مين يبقى مكانها؟
هل User ممكن تقرأ بيانات قديمة؟
وهل كل Replicas تقدر تستقبل Writes؟
\`\`\`

ومن هنا هنبدأ ندخل فعلًا في قلب **Distributed Databases**.
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-26',
  category: 'Architecture',
  readTime: '18 min read',
  image: capTheoremImage,
};

