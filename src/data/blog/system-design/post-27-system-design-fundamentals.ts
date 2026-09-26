import type { BlogPost } from '@/modules/blog/types';
import systemDesignImage from '@/assets/blog/system-design/system-design-fundamentals.jpg';

export const post: BlogPost = {
  id: 27,
  title: 'System Design Fundamentals — كيف تصمم System حقيقي من الصفر؟',
  excerpt:
    'السؤال الأول في تصميم أي نظام مش "نستخدم Redis ولا Microservices؟"، السؤال الأول هو "What are we actually building؟". دليلك الشامل لأساسيات System Design: من المتطلبات والـ Scale والـ Bottlenecks وحتى High-Level وLow-Level Design.',
  content: `# 🏗️ System Design Fundamentals
## كيف تصمم System حقيقي من الصفر؟

تخيل حد قالك:

> عايزين نعمل E-Commerce Application.

Developer مبتدئ ممكن يبدأ فورًا:

\`\`\`text
ASP.NET Core
React
SQL Server
Redis
RabbitMQ
Docker
Microservices
\`\`\`

لكن هنا إحنا بدأنا من **التكنولوجيا** قبل ما نفهم **المشكلة**.

وده واحد من أكبر الأخطاء في System Design.

السؤال الأول مش:

> نستخدم Redis ولا لأ؟

ولا:

> نعمل Microservices؟

ولا:

> Kafka ولا RabbitMQ؟

السؤال الأول هو:

# What are we actually building?

---

# يعني إيه System Design أصلًا؟

System Design هي عملية اتخاذ قرارات حول كيفية بناء Software System بحيث يحقق:

\`\`\`text
Business Requirements
+
Performance
+
Scalability
+
Reliability
+
Security
+
Maintainability
+
Cost
\`\`\`

يعني مش بنصمم:

\`\`\`text
Classes
Methods
Interfaces
\`\`\`

بس.

إحنا بنفكر في الصورة الكبيرة:

\`\`\`text
Users
   ↓
Frontend
   ↓
API
   ↓
Application
   ↓
Database
   ↓
Cache
   ↓
Message Broker
   ↓
External Services
\`\`\`

وبنسأل:

> لو عدد المستخدمين زاد 100 مرة، إيه اللي هيحصل؟

> لو Database وقعت؟

> لو External API بطّأت؟

> لو نفس Request وصلت مرتين؟

> لو Service وقعت وإحنا بننفذ Transaction؟

> البيانات لازم تكون محدثة فورًا ولا ممكن تتأخر ثانية؟

> السيستم محتاج يتحمل كام Request في الثانية؟

> محتاج Availability قد إيه؟

> التكلفة المقبولة كام؟

دي هي System Design.

Microsoft في Azure Architecture Center بتتعامل مع تصميم الأنظمة باعتباره موازنة بين reliability وsecurity وcost وoperations وperformance مع متطلبات الـ business، وليس مجرد اختيار architecture style معينة.

---

# System Design مش رسم Boxes وأسهم

أحيانًا نشوف:

\`\`\`text
Client
 ↓
Load Balancer
 ↓
Microservices
 ↓
Kafka
 ↓
Redis
 ↓
Database Cluster
\`\`\`

ونقول:

> يا سلام، Architecture جامدة.

😄

لكن الرسم لوحده لا يعني حاجة لو مش عارف:

\`\`\`text
ليه Load Balancer؟

ليه Redis؟

ليه Kafka؟

ليه أكتر من Database؟

إيه المشكلة اللي كل Component بتحلها؟
\`\`\`

System Design الجيدة هي:

# مجموعة قرارات لها أسباب واضحة.

---

# مفيش Perfect Architecture

دي قاعدة مهمة جدًا من البداية.

أي قرار في System Design له:

# Trade-off

يعني لما تكسب حاجة، غالبًا بتدفع تمن في حاجة تانية.

مثلًا:

| القرار | المكسب | الثمن |
|---|---|---|
| Cache | سرعة أعلى | Stale Data + Invalidation Complexity |
| Replication | Availability وRead Scaling | Replication Lag |
| Sharding | Scale أكبر | Queries وTransactions أصعب |
| Microservices | Independent deployment | Distributed complexity |
| Strong Consistency | Data correctness أقوى | Latency/Availability trade-offs |
| Async Messaging | Loose coupling | Eventual consistency |
| More redundancy | Reliability أعلى | Cost أعلى |

عشان كده Architect شاطر مش بيسأل:

> إيه أحسن Technology؟

يسأل:

> إيه أنسب Trade-off للـ requirements بتاعتي؟

---

# System Design تبدأ من Requirements

قبل أي Architecture، لازم نفهم نوعين من المتطلبات.

# Functional Requirements

دي بتقول:

> السيستم بيعمل إيه؟

لو عندنا E-Commerce:

\`\`\`text
User can register
User can browse products
User can add items to cart
User can place an order
User can pay
Admin can manage products
\`\`\`

دي Features.

---

# Non-Functional Requirements

ودي في System Design غالبًا أهم من الـ features نفسها.

هي بتجاوب:

\`\`\`text
السيستم لازم يكون سريع قد إيه؟

يستحمل كام مستخدم؟

مسموح يقع قد إيه؟

البيانات لازم تكون consistent قد إيه؟

محتاج security قد إيه؟

محتاج يكبر قد إيه؟

ميزانيته قد إيه؟
\`\`\`

مثلًا:

| Requirement | مثال |
|---|---|
| Availability | 99.99% |
| Latency | P95 < 300ms |
| Throughput | 20K requests/sec |
| Users | 10M registered users |
| Concurrent Users | 500K |
| Storage | 20 TB |
| Data Retention | 7 years |
| Consistency | Strong for payments |
| Recovery | Restore within 15 minutes |

دي كلها بتغير شكل Architecture.

---

# نفس الـ Feature ممكن تحتاج Architectures مختلفة

تخيل Application اسمها:

\`\`\`text
Notes App
\`\`\`

لو عندها:

\`\`\`text
100 users
\`\`\`

ممكن:

\`\`\`text
React
 ↓
ASP.NET Core
 ↓
PostgreSQL
\`\`\`

وده ممتاز.

لكن لو:

\`\`\`text
100 Million users
\`\`\`

نفس الـ feature ممكن تحتاج:

\`\`\`text
CDN
Load Balancers
Multiple API Instances
Cache
Database Replicas
Partitioning
Queues
Object Storage
Monitoring
\`\`\`

المشكلة واحدة.

لكن الـ scale مختلف.

---

# أول سؤال مهم: مين المستخدمين؟

قبل ما تقول:

\`\`\`text
10 million users
\`\`\`

لازم نفهم إن:

\`\`\`text
Registered Users
\`\`\`

مش نفس:

\`\`\`text
Daily Active Users
\`\`\`

ومش نفس:

\`\`\`text
Concurrent Users
\`\`\`

مثلًا:

\`\`\`text
10,000,000 Registered Users

1,000,000 Daily Active Users

100,000 Concurrent Users
\`\`\`

الرقم اللي يؤثر على Load هو الاستخدام الفعلي.

---

# Traffic مهم أكتر من عدد المستخدمين

ممكن System عندها:

\`\`\`text
1 million users
\`\`\`

لكن كل User يفتح التطبيق مرة في الأسبوع.

وممكن System تانية عندها:

\`\`\`text
100,000 users
\`\`\`

لكن كل واحد بيبعت عشرات requests في الثانية.

عشان كده بنفكر في:

# RPS / QPS

\`\`\`text
Requests Per Second
Queries Per Second
\`\`\`

---

# مثال بسيط

عندك:

\`\`\`text
1,000,000 active users/day
\`\`\`

كل مستخدم يعمل:

\`\`\`text
20 requests/day
\`\`\`

يبقى:

\`\`\`text
20,000,000 requests/day
\`\`\`

عدد الثواني في اليوم:

\`\`\`text
86,400
\`\`\`

Average:

\`\`\`text
≈ 231 requests/sec
\`\`\`

لكن مينفعش نصمم على Average فقط.

لأن traffic مش متوزعة بالتساوي.

ممكن Peak يكون:

\`\`\`text
5x
10x
20x
\`\`\`

المتوسط.

يعني لازم تفكر في:

# Peak Traffic

---

# Back-of-the-Envelope Estimation

في System Design مش مطلوب دائمًا أرقام دقيقة 100%.

لكن مطلوب تعرف **حجم المشكلة**.

مثلًا:

\`\`\`text
Users
Requests/sec
Storage/day
Bandwidth
Cache size
\`\`\`

عشان تعرف هل Architecture بسيطة كفاية ولا لأ.

---

# Read Heavy vs Write Heavy

سؤال مهم جدًا:

> المستخدمين بيقروا أكتر ولا بيكتبوا أكتر؟

مثال Social Media:

\`\`\`text
Read Feed
Read Posts
Read Comments
\`\`\`

أكتر بكتير من:

\`\`\`text
Create Post
Write Comment
\`\`\`

ممكن يبقى:

\`\`\`text
95% Reads
5% Writes
\`\`\`

وده يخليك تفكر في:

\`\`\`text
Caching
Read Replicas
CDN
Precomputed feeds
\`\`\`

بطريقة مختلفة.

---

# مثال مختلف: Logging System

ممكن تكون:

\`\`\`text
90% Writes
10% Reads
\`\`\`

Architecture مختلفة تمامًا.

إذن:

# Access Pattern يحدد Architecture.

AWS بتؤكد على اختيار التكنولوجيا بناءً على workload goals وdata access patterns بدل اختيار technology بشكل عشوائي.

---

# High-Level Design vs Low-Level Design

الاتنين مش نفس الحاجة.

# High-Level Design — HLD

بيركز على Components الرئيسية:

\`\`\`text
Client
 ↓
Load Balancer
 ↓
API Servers
 ↓
Cache
 ↓
Database
 ↓
Message Broker
\`\`\`

نسأل:

\`\`\`text
Services بتتكلم إزاي؟
Data فين؟
Scaling إزاي؟
Failure يحصل إزاي؟
\`\`\`

---

# Low-Level Design — LLD

هنا ننزل للكود:

\`\`\`text
Classes
Interfaces
Methods
Entities
Design Patterns
Object Relationships
\`\`\`

مثلًا:

\`\`\`text
Order
Payment
OrderService
IPaymentGateway
OrderRepository
\`\`\`

يعني:

\`\`\`text
System Design
        ↓
High-Level Architecture
        ↓
Component Design
        ↓
Low-Level Design
        ↓
Code
\`\`\`

---

# System Design تبدأ Simple

لو عايزين نبني تطبيق:

\`\`\`text
React / Next.js
+
ASP.NET Core
\`\`\`

أول Architecture ممكن تكون:

\`\`\`text
Browser
   ↓
ASP.NET Core API
   ↓
SQL Server
\`\`\`

وخلاص.

وده مش تصميم ضعيف.

لو بيلبي requirements فهو غالبًا:

# التصميم الصح.

---

# ما تبدأش Architecture بحجم Google

خطأ مشهور:

\`\`\`text
Users today = 500
\`\`\`

والـ Developer يعمل:

\`\`\`text
15 Microservices
Kafka
Redis Cluster
Kubernetes
ElasticSearch
CQRS
Event Sourcing
API Gateway
Service Mesh
\`\`\`

😄

وده اسمه غالبًا:

# Overengineering

المشكلة إن كل Technology بتضيف:

\`\`\`text
Development complexity
Deployment complexity
Monitoring
Failure modes
Cost
Knowledge requirements
\`\`\`

Architecture لازم تكبر مع المشكلة.

---

# Monolith مش كلمة سيئة

ممكن تبدأ:

\`\`\`text
Frontend
    ↓
Modular Monolith
    ↓
Database
\`\`\`

ويستحمل عدد مستخدمين ضخم جدًا لو مصمم صح.

System Design مش معناها:

\`\`\`text
Microservices.
\`\`\`

حتى Azure Architecture guidance بتوضح إنك مش محتاج architecture style محددة مثل microservices عشان تبني cloud application جيد.

---

# إزاي System تكبر؟

خلينا نبنيها تدريجيًا.

## المرحلة الأولى

\`\`\`text
Users
  ↓
Server
  ↓
Database
\`\`\`

مثال:

\`\`\`text
Next.js
  ↓
ASP.NET Core
  ↓
PostgreSQL
\`\`\`

ممتاز.

---

# عدد المستخدمين زاد

السيرفر بدأ يوصل:

\`\`\`text
CPU 95%
Memory 90%
\`\`\`

ممكن أول حل:

# Vertical Scaling

بدل Server:

\`\`\`text
4 CPU
8 GB RAM
\`\`\`

نخليه:

\`\`\`text
16 CPU
64 GB RAM
\`\`\`

يعني:

\`\`\`text
Scale Up
\`\`\`

---

# بعد فترة Server واحدة مش كفاية

نعمل:

\`\`\`text
           ┌── API Server 1
Users → LB ├── API Server 2
           ├── API Server 3
           └── API Server 4
\`\`\`

ده:

# Horizontal Scaling

وده موضوع المقالة الجاية بالتفصيل.

Microsoft توصي في الأنظمة المناسبة للسحابة بتصميم التطبيقات بحيث يمكنها scale out بإضافة وإزالة instances، مع الانتباه إلى bottlenecks ونقاط synchronization.

---

# لكن هنا تظهر مشكلة Session

لو User عمل Login على:

\`\`\`text
Server 1
\`\`\`

والـ Request اللي بعدها راحت:

\`\`\`text
Server 3
\`\`\`

ولو session موجودة في Memory بتاعة Server 1:

\`\`\`text
Server 3:
Who are you? 😅
\`\`\`

هنا نبدأ نفهم أهمية:

# Stateless Applications

بدل server تحتفظ بـ session محليًا.

ممكن تستخدم:

\`\`\`text
Distributed Session
Shared Cache
Database
Secure client credential
\`\`\`

حسب architecture.

---

# Stateless يعني إيه؟

بشكل مبسط:

أي API Instance تقدر تتعامل مع أي Request.

\`\`\`text
Request 1 → Server A
Request 2 → Server C
Request 3 → Server B
\`\`\`

بدون ما User تعتمد على نفس السيرفر.

وده يجعل Horizontal Scaling أسهل بكتير.

---

# أول Bottleneck غالبًا Database

بعد ما تزود API Servers:

\`\`\`text
     API 1
       ↓
     API 2
       ↓
     API 3
       ↓
     API 4
       ↓
   Database
\`\`\`

دلوقتي Database ممكن تبقى:

# Bottleneck

ليه؟

كل Servers بتكلم نفس الـ DB.

---

# Bottleneck يعني إيه؟

هو الجزء اللي محدوديته بتحدد Performance السيستم كله.

تخيل:

\`\`\`text
API Capacity:
100,000 RPS
\`\`\`

لكن Database:

\`\`\`text
5,000 queries/sec
\`\`\`

إذن System:

\`\`\`text
مش 100,000
\`\`\`

عمليًا:

\`\`\`text
≈ 5,000
\`\`\`

لأن Database أبطأ component.

---

# حل Database مش دائمًا "جيب DB أقوى"

قبل Scaling لازم تسأل:

\`\`\`text
Queries optimized?
Indexes موجودة؟
N+1؟
Connection Pool صح؟
Unnecessary queries؟
Missing pagination؟
\`\`\`

ممكن مشكلة Architecture تكون مجرد Query سيئة.

---

# Database Scaling

مع زيادة الضغط ممكن نبدأ نتكلم عن:

\`\`\`text
Indexes
Caching
Replication
Read Replicas
Partitioning
Sharding
\`\`\`

وعشان كده إحنا هنخصص أجزاء كبيرة جدًا في السلسلة لـ:

\`\`\`text
CAP
Replication
Single Leader
Multi Leader
Leaderless
Stale Reads
\`\`\`

---

# Cache تظهر إمتى؟

تخيل:

\`\`\`text
GET /products/10
\`\`\`

يتم طلبها:

\`\`\`text
20,000 times/minute
\`\`\`

والمنتج بيتغير مرة كل:

\`\`\`text
3 hours
\`\`\`

هل منطقي كل Request تضرب Database؟

ممكن:

\`\`\`text
Client
 ↓
API
 ↓
Cache
 ↓
Database
\`\`\`

أول Request:

\`\`\`text
Cache Miss
↓
Database
↓
Cache
\`\`\`

بعدها:

\`\`\`text
Cache Hit
\`\`\`

وبالتالي نقلل:

\`\`\`text
Database Load
Latency
Cost
\`\`\`

لكن Cache تجيب مشاكل جديدة:

\`\`\`text
Stale Data
Invalidation
Stampede
Memory limits
Consistency
\`\`\`

وده سبب إن Caching مش:

> حط Redis وخلاص.

---

# Messaging تظهر إمتى؟

تخيل User عمل Order.

السيستم محتاج:

\`\`\`text
Save Order
Charge Payment
Send Email
Update Analytics
Update Inventory
Notify Seller
Generate Invoice
\`\`\`

لو عملنا كل حاجة Sync:

\`\`\`text
User
 ↓
Order API
 ↓
Payment
 ↓
Inventory
 ↓
Email
 ↓
Analytics
 ↓
Invoice
 ↓
Response
\`\`\`

لو Email Service بطّأت:

User يستنى.

لو Analytics وقعت:

Order ممكن تفشل رغم إن Analytics مش critical.

ممكن بدل ده:

\`\`\`text
Order Created
      ↓
Message Broker
   ┌──┼─────┬────────┐
   ↓  ↓     ↓        ↓
Email Inventory Analytics Invoice
\`\`\`

وده:

# Asynchronous Processing

لكن يدخلنا في:

\`\`\`text
Retries
Duplicates
Ordering
Eventual Consistency
DLQ
Idempotency
\`\`\`

وده هنعمله في Message Queue article.

---

# Sync vs Async

مش معنى Messaging إن:

> Async دايمًا أفضل.

Payment أثناء Checkout مثلًا قد تحتاج نتيجة فورية.

لكن إرسال Email:

\`\`\`text
مش لازم User تستناه.
\`\`\`

القرار يعتمد على:

\`\`\`text
Does the caller need the result immediately?
\`\`\`

---

# Consistency

دي من أهم كلمات System Design.

تخيل User عدل اسمه:

\`\`\`text
Ahmed
↓
Mohamed
\`\`\`

دخل صفحة بعدها فورًا.

هل لازم يشوف:

\`\`\`text
Mohamed
\`\`\`

فورًا؟

لو نعم:

\`\`\`text
Strong / Read-your-write consistency
\`\`\`

مهمة.

لكن عدد Views في YouTube مثلًا:

\`\`\`text
1,000,01
\`\`\`

لو ظهر عند User تاني:

\`\`\`text
999,997
\`\`\`

لمدة ثانية…

غالبًا مش disaster.

هنا ممكن نقبل:

# Eventual Consistency

الـ business requirement هي اللي تحدد.

---

# Payments مختلفة

لو Account عنده:

\`\`\`text
$100
\`\`\`

واتعمل:

\`\`\`text
Withdraw $80
\`\`\`

مينفعش Server تانية تشوف:

\`\`\`text
$100
\`\`\`

وتسمح:

\`\`\`text
Withdraw another $80
\`\`\`

هنا consistency أهم بكتير.

يعني نفس Architecture مش مناسبة لكل Data.

---

# CAP Theorem

هنخصص لها المقالة رقم 3.

لكن الصورة الأساسية:

في Distributed Data Systems عند حدوث:

\`\`\`text
Network Partition
\`\`\`

لا يمكنك ضمان:

\`\`\`text
Perfect Consistency
+
Full Availability
\`\`\`

في نفس الوقت لكل request.

لازم تختار behavior مناسب.

وده مش معناه:

\`\`\`text
Database X = CP forever
Database Y = AP forever
\`\`\`

الموضوع أدق، وهنفصله بالكامل في المقالة الخاصة بيه.

---

# Latency

Latency:

> الوقت اللي Request واحدة بتاخده.

مثلًا:

\`\`\`text
GET /products
\`\`\`

تأخذ:

\`\`\`text
120ms
\`\`\`

لكن Average لوحده مش كفاية.

ممكن:

\`\`\`text
P50 = 100ms
P95 = 400ms
P99 = 3s
\`\`\`

وده معناه إن جزء من المستخدمين Experience بتاعتهم سيئة جدًا رغم إن Average شكلها مقبول.

---

# Throughput

Throughput:

> حجم العمل اللي System تقدر تعالجه في مدة معينة.

مثلًا:

\`\`\`text
10,000 Requests / Second
\`\`\`

System ممكن تكون:

\`\`\`text
Latency ممتازة
\`\`\`

لكن throughput قليلة.

أو العكس.

الاتنين Concepts مختلفة.

---

# Availability

يعني:

> هل System متاحة وقت ما المستخدم يحتاجها؟

مثال:

\`\`\`text
99%
99.9%
99.99%
99.999%
\`\`\`

الفرق بين الأرقام دي كبير جدًا.

تقريبًا:

\`\`\`text
99%       ≈ 3.65 days downtime/year

99.9%     ≈ 8.76 hours/year

99.99%    ≈ 52.6 minutes/year

99.999%   ≈ 5.26 minutes/year
\`\`\`

كل 9 إضافية أصعب وأغلى.

---

# Reliability

Availability وReliability مش نفس الحاجة.

System ممكن تكون:

\`\`\`text
Online ✅
\`\`\`

لكن كل Checkout:

\`\`\`text
يفشل بعد Payment 😅
\`\`\`

هي Available…

لكن مش Reliable.

Reliability تعني إن السيستم:

\`\`\`text
ينفذ وظيفته بشكل صحيح
ويتعامل مع failures
ويستعيد حالته
\`\`\`

AWS Well-Architected تتعامل مع reliability على أساس التعافي من الأعطال، اختبار recovery procedures، وإدارة التغيير والطلب بدل افتراض عدم وجود failures.

---

# Fault Tolerance

تخيل عندك 3 Servers:

\`\`\`text
Server A
Server B
Server C
\`\`\`

واحدة وقعت:

\`\`\`text
Server B ❌
\`\`\`

السيستم يفضل:

\`\`\`text
A + C ✅
\`\`\`

ده Fault Tolerance.

المهم:

> Failure في Component واحدة ما توقعش System كلها.

---

# Single Point of Failure

لو Architecture:

\`\`\`text
Users
 ↓
Load Balancer
 ↓
10 Servers
\`\`\`

لكن عندك:

\`\`\`text
Load Balancer واحدة فقط
\`\`\`

لو وقعت:

\`\`\`text
10 Servers شغالين
لكن Users مش قادرين يوصلوا لهم.
\`\`\`

إذن Load Balancer بقت:

# Single Point of Failure

System Design تحاول تعرف:

\`\`\`text
فين الـ SPOFs؟
\`\`\`

وتتعامل معاها حسب criticality.

---

# Redundancy

عشان نقلل SPOF نعمل:

\`\`\`text
Multiple Instances
Replicas
Failover
Multiple Zones
\`\`\`

لكن ده يزود:

\`\`\`text
Cost
Complexity
Consistency issues
\`\`\`

Trade-off تاني.

---

# Data Durability

Durability بتسأل:

> لو حفظت Data، احتمال أفقدها قد إيه؟

Database ممكن تكون Available دلوقتي.

لكن Disk تلفت وضاعت البيانات.

هنا:

\`\`\`text
Availability
\`\`\`

مش نفس:

\`\`\`text
Durability.
\`\`\`

ممكن نستخدم:

\`\`\`text
Replication
Backups
Snapshots
Object Storage
Multi-zone copies
\`\`\`

حسب أهمية البيانات.

---

# Backup ≠ High Availability

لو Database وقعت وعندك Backup:

\`\`\`text
Backup ✅
\`\`\`

لكن Restore تأخذ:

\`\`\`text
6 hours
\`\`\`

أنت مش Highly Available.

Backup هدفها:

\`\`\`text
Recovery
\`\`\`

مش بالضرورة:

\`\`\`text
Instant failover.
\`\`\`

---

# RPO وRTO

مصطلحين مهمين جدًا.

# RPO — Recovery Point Objective

قد إيه Data مسموح أفقدها؟

مثلًا:

\`\`\`text
RPO = 5 minutes
\`\`\`

يعني كارثة حصلت…

مقبول نفقد آخر 5 دقائق من البيانات.

---

# RTO — Recovery Time Objective

قد إيه System مسموح تفضل Offline؟

مثلًا:

\`\`\`text
RTO = 15 minutes
\`\`\`

يعني لازم الخدمة ترجع خلال ربع ساعة.

---

# API Design جزء من System Design

قبل Database حتى، لازم نفكر في interface.

مثلًا:

\`\`\`http
POST /orders
\`\`\`

\`\`\`http
GET /orders/{id}
\`\`\`

\`\`\`http
GET /products?cursor=abc
\`\`\`

API Contract تؤثر على:

\`\`\`text
Performance
Pagination
Idempotency
Caching
Versioning
Security
\`\`\`

---

# Pagination مثال مهم

مينفعش:

\`\`\`http
GET /orders
\`\`\`

ترجع:

\`\`\`text
5 million orders
\`\`\`

😄

لازم Pagination.

مثلًا:

\`\`\`http
GET /orders?page=1&pageSize=50
\`\`\`

وفي datasets ضخمة ممكن:

\`\`\`text
Cursor Pagination
\`\`\`

تكون أفضل من Offset Pagination حسب access pattern.

---

# Data Model

بعد Requirements وAPI نبدأ نسأل:

\`\`\`text
إيه الـ entities؟
العلاقات؟
Query patterns؟
Write patterns؟
\`\`\`

مثل E-Commerce:

\`\`\`text
User
Product
Order
OrderItem
Payment
Inventory
\`\`\`

لكن ما تبدأش Data Model من diagram فقط.

ابدأ من:

# Access Patterns.

---

# سؤال مهم

إنت بتسأل Data إزاي؟

مثلًا:

\`\`\`text
Get product by ID
Search products by category
Get latest orders for user
Get order with its items
\`\`\`

دي بتؤثر على:

\`\`\`text
Indexes
Schema
Database choice
Partitioning
Caching
\`\`\`

---

# SQL vs NoSQL

مش:

\`\`\`text
Small system → SQL
Big system → NoSQL
\`\`\`

دي خرافة.

SQL Databases تقدر تشغل systems ضخمة جدًا.

الاختيار حسب:

\`\`\`text
Relationships
Transactions
Query patterns
Consistency
Scale characteristics
Schema flexibility
Operations
\`\`\`

---

# Data Ownership

لو عندك Monolith:

\`\`\`text
One Database
\`\`\`

طبيعي جدًا.

لكن لو Microservices:

\`\`\`text
Orders Service
Payments Service
Inventory Service
\`\`\`

لو كلهم بيعدلوا نفس الجداول:

\`\`\`text
Shared DB
\`\`\`

فإنت غالبًا عندك coupling قوي.

وده موضوع هنفصله بعدين في Distributed Systems.

---

# Security من أول التصميم

Security مش:

\`\`\`text
خلصنا التطبيق
↓
يلا نحط JWT.
\`\`\`

😄

لازم من البداية تفكر:

\`\`\`text
Authentication
Authorization
Encryption
Secrets
Data classification
Audit
Rate Limiting
Attack surface
\`\`\`

AWS وAzure well-architected guidance تعتبر security pillar أساسيًا جنب reliability وperformance وcost، مش إضافة بعد انتهاء النظام.

---

# Least Privilege

لو Orders Service محتاجة:

\`\`\`text
Read Orders
Write Orders
\`\`\`

مش محتاجة:

\`\`\`text
DROP DATABASE 😅
\`\`\`

اعطي كل Component أقل صلاحيات تحتاجها فقط.

---

# Observability

System Production لازم تعرف:

\`\`\`text
إيه اللي بيحصل جواه؟
\`\`\`

مش تستنى User يقول:

> الموقع بطيء.

عندنا 3 Concepts أساسية:

\`\`\`text
Logs
Metrics
Traces
\`\`\`

---

# Logs

بتقول:

\`\`\`text
What happened?
\`\`\`

مثل:

\`\`\`text
Order 123 failed because payment timed out.
\`\`\`

---

# Metrics

بتقول:

\`\`\`text
How much/how often?
\`\`\`

مثل:

\`\`\`text
CPU = 80%

Requests/sec = 10K

Error rate = 3%

P95 latency = 700ms
\`\`\`

---

# Traces

بتقول:

\`\`\`text
Where did the request spend its time?
\`\`\`

مثل:

\`\`\`text
Browser
 ↓ 20ms
API
 ↓ 50ms
Orders Service
 ↓ 400ms
Database
\`\`\`

فتعرف bottleneck فين.

---

# Health Checks

مش كفاية:

\`\`\`http
GET /health
\`\`\`

ويرجع:

\`\`\`text
200 OK
\`\`\`

بينما:

\`\`\`text
Database unavailable
Redis unavailable
Message broker disconnected
\`\`\`

لازم نفهم:

\`\`\`text
Liveness
Readiness
Dependency Health
\`\`\`

وده عندنا مقال مستقل لاحقًا.

---

# Reliability تبدأ من توقع الفشل

بدل:

\`\`\`text
What if service fails?
\`\`\`

فكر:

\`\`\`text
When service fails...
\`\`\`

لأن failures هتحصل.

\`\`\`text
Network fails
Machine dies
Database slows
Certificate expires
Dependency returns 500
Disk fills
Region goes down
\`\`\`

System Design الجيدة تسأل:

> إيه اللي يحصل بعدها؟

---

# Timeout

لو External Service علقت:

\`\`\`text
متستناش للأبد.
\`\`\`

---

# Retry

لو Failure مؤقت:

\`\`\`text
جرب تاني بحساب.
\`\`\`

---

# Circuit Breaker

لو Dependency واقعة:

\`\`\`text
بلاش تفضل تضربها.
\`\`\`

---

# Idempotency

لو Request اتكررت:

\`\`\`text
متنفذش العملية مرتين بالغلط.
\`\`\`

زي Payment.

---

# Rate Limiting

لو User أو Bot بعت:

\`\`\`text
100,000 requests/sec
\`\`\`

لازم تمنع مستخدم واحد من أكل System كلها.

---

# Backpressure

ماذا لو System تستقبل:

\`\`\`text
50K jobs/sec
\`\`\`

لكن تقدر تعالج:

\`\`\`text
10K jobs/sec
\`\`\`

الـ Queue هتكبر:

\`\`\`text
10K
100K
1M
10M
\`\`\`

في مرحلة لازم تقول:

\`\`\`text
Slow down
Reject
Drop
Prioritize
Scale
\`\`\`

وده Backpressure.

---

# Scale ≠ Performance

فرق مهم.

Performance:

> Request الواحدة سريعة قد إيه؟

Scalability:

> لما نزود load، هل System تقدر تزيد قدرتها؟

ممكن System تكون:

\`\`\`text
Very fast at 100 users
\`\`\`

لكن:

\`\`\`text
collapse at 10,000 users
\`\`\`

إذن performant لكن مش scalable.

---

# Scalability ≠ Availability

ممكن عندك:

\`\`\`text
100 servers
\`\`\`

وتستحمل ملايين users.

لكن Database واحدة:

\`\`\`text
SPOF
\`\`\`

فتقع System كلها.

إذن scalable لكن مش highly available.

---

# Architecture Design = Constraints

مفيش System عندها:

\`\`\`text
Unlimited money
Unlimited servers
Unlimited engineers
Unlimited time
\`\`\`

😄

عندك Constraints:

\`\`\`text
Budget
Team size
Deadline
Existing infrastructure
Compliance
Cloud provider
Developer experience
\`\`\`

قرار ممتاز لشركة كبيرة ممكن يكون سيئ لشركة صغيرة.

---

# Cost جزء من Architecture

ممكن تعمل System:

\`\`\`text
Active-Active across 5 regions
\`\`\`

وتكون ممتازة.

لكن لو المنتج بيكسب:

\`\`\`text
$1,000/month
\`\`\`

والـ infrastructure:

\`\`\`text
$30,000/month
\`\`\`

عندك مشكلة 😄

AWS Well-Architected نفسها تعتبر Cost Optimization pillar أساسي بجانب Reliability وSecurity وPerformance.

---

# Build vs Buy

مش كل حاجة لازم تبنيها.

مثلًا:

\`\`\`text
Authentication
Email
Object Storage
CDN
Monitoring
Search
Message Broker
\`\`\`

ممكن تستخدم Managed Service.

السؤال:

\`\`\`text
هل بناء وتشغيل التقنية دي جزء من القيمة الأساسية للمنتج؟
\`\`\`

لو لأ، managed solution أحيانًا توفر engineering effort كبير.

---

# System Design Evolution

خلينا نشوف System تتطور.

## Version 1

\`\`\`text
Users
 ↓
ASP.NET Core
 ↓
SQL Server
\`\`\`

---

## Traffic زاد

\`\`\`text
Users
 ↓
Load Balancer
 ↓
ASP.NET Core × N
 ↓
SQL Server
\`\`\`

---

## Reads زادت

\`\`\`text
API
 ↓
Redis
 ↓
SQL Server
\`\`\`

---

## Database reads زادت جدًا

\`\`\`text
           ┌→ Read Replica
API → DB ──┼→ Read Replica
           └→ Read Replica
\`\`\`

Writes:

\`\`\`text
Primary
\`\`\`

---

## Background Tasks ظهرت

\`\`\`text
API
 ↓
Message Queue
 ↓
Workers
\`\`\`

---

## Static Content ضخم

\`\`\`text
Users
 ↓
CDN
 ↓
Object Storage
\`\`\`

---

## Database ضخمة جدًا

ممكن نبدأ:

\`\`\`text
Partitioning
Sharding
\`\`\`

لكن كل مرحلة:

> تأتي بسبب مشكلة.

مش لأن architecture diagram شكلها أحلى.

---

# Design for Current Scale + Reasonable Growth

لو عندك:

\`\`\`text
10K users
\`\`\`

ومتوقع السنة الجاية:

\`\`\`text
100K
\`\`\`

صمم بحيث الانتقال ممكن.

لكن مش لازم من دلوقتي تبني لـ:

\`\`\`text
1 Billion users.
\`\`\`

إلا لو الـ business فعلًا عندها requirement قريبة من كده.

---

# Premature Optimization

لو عملت:

\`\`\`text
Sharding
\`\`\`

قبل ما Database تحتاجه، دفعت Complexity بدون فايدة.

لكن برضه:

# تجاهل المستقبل تمامًا غلط.

التوازن:

\`\`\`text
Simple today
+
Clear path to scale tomorrow
\`\`\`

---

# أهم Skill في System Design

مش معرفة أسماء Technologies.

المهارة الحقيقية:

# Asking the right questions.

قبل التصميم اسأل عن:

\`\`\`text
Users
Traffic
Read/write ratio
Latency
Availability
Consistency
Storage
Security
Data retention
Growth
Budget
Failure tolerance
\`\`\`

الـ answers هي اللي توجه Architecture.

---

# System Design Interview vs Production Design

في Interview:

\`\`\`text
45 minutes
\`\`\`

فممكن تتكلم High-Level.

لكن Production:

\`\`\`text
Months / Years
\`\`\`

وفيها:

\`\`\`text
Real users
Real money
Real incidents
Real data
\`\`\`

فلازم قراراتك تبقى أعمق بكتير.

---

# إزاي تحل أي System Design Problem؟

خلينا نعمل Framework ثابت نمشي عليه طول السلسلة.

## Step 1 — Understand Requirements

اسأل:

\`\`\`text
What does the system do?
\`\`\`

و:

\`\`\`text
How well must it do it?
\`\`\`

---

## Step 2 — Estimate Scale

احسب تقريبًا:

\`\`\`text
Users
RPS
Storage
Bandwidth
Read/write ratio
Peak traffic
\`\`\`

---

## Step 3 — Define APIs

مثل:

\`\`\`text
POST /orders

GET /orders/{id}
\`\`\`

---

## Step 4 — Design Data Model

حدد:

\`\`\`text
Entities
Relationships
Access patterns
Indexes
Consistency requirements
\`\`\`

---

## Step 5 — Start Simple

\`\`\`text
Client
 ↓
API
 ↓
Database
\`\`\`

---

## Step 6 — Find Bottlenecks

اسأل:

\`\`\`text
إيه أول حاجة هتقع لو Traffic ×10؟
\`\`\`

API؟

Database؟

Storage؟

Network؟

External Service؟

---

## Step 7 — Scale the Bottleneck

حسب المشكلة:

\`\`\`text
More instances
Cache
Replica
Queue
Partition
CDN
\`\`\`

---

## Step 8 — Handle Failure

اسأل:

\`\`\`text
لو كل Component وقعت، إيه اللي يحصل؟
\`\`\`

مثال:

\`\`\`text
API Server dies?

Database dies?

Redis dies?

Queue dies?

External API dies?
\`\`\`

---

## Step 9 — Security

اسأل:

\`\`\`text
Who can access what?

Where are secrets?

Is sensitive data encrypted?

How do we prevent abuse?
\`\`\`

---

## Step 10 — Observability

اسأل:

\`\`\`text
How will we know it's broken?
\`\`\`

لازم:

\`\`\`text
Logs
Metrics
Tracing
Alerts
Health checks
\`\`\`

---

## Step 11 — Review Trade-offs

في النهاية:

\`\`\`text
Why this database?

Why cache?

Why queue?

Why strong consistency?

Why microservices?
\`\`\`

لازم كل إجابة تبدأ بسبب، مش باسم Technology.

---

# مثال سريع — E-Commerce

Requirements:

\`\`\`text
Browse products
Add to cart
Place order
Pay
Track order
\`\`\`

نبدأ:

\`\`\`text
React / Next.js
       ↓
ASP.NET Core
       ↓
PostgreSQL
\`\`\`

Traffic زاد:

\`\`\`text
              ┌→ API 1
Load Balancer ├→ API 2
              └→ API 3
                   ↓
               PostgreSQL
\`\`\`

Product reads ضخمة:

\`\`\`text
API
 ↓
Redis
 ↓
PostgreSQL
\`\`\`

Images:

\`\`\`text
Browser
 ↓
CDN
 ↓
Object Storage
\`\`\`

Order created:

\`\`\`text
API
 ↓
Database
 ↓
Message Queue
 ├→ Email
 ├→ Inventory
 └→ Analytics
\`\`\`

Database reads زادت:

\`\`\`text
Primary
 ↓
Replicas
\`\`\`

دلوقتي Architecture تطورت بناءً على:

# Real problems.

---

# ما الذي لا نفعله؟

ما نبدأش:

\`\`\`text
Microservices
Redis
Kafka
ElasticSearch
Kubernetes
CQRS
Event Sourcing
\`\`\`

وبعدين نسأل:

> طيب إحنا بنبني إيه؟ 😄

---

# أشهر System Design Mistakes

| الخطأ | المشكلة |
|---|---|
| اختيار Technology قبل Requirement | Tool-driven architecture |
| تصميم لـ Billion Users من أول يوم | Overengineering |
| عدم حساب Peak Traffic | System تنهار وقت الضغط |
| الاعتماد على Average Latency | إخفاء Tail Latency |
| Database بدون Index Strategy | Bottleneck مبكر |
| استخدام Cache بدون invalidation plan | Stale/incorrect data |
| Retry بدون Idempotency | Duplicate operations |
| كل العمليات Synchronous | High latency وcascading failures |
| إضافة Message Queue لكل حاجة | Complexity بدون قيمة |
| Shared state داخل API servers | صعوبة Horizontal Scaling |
| عدم وجود Timeouts | Resource exhaustion |
| تجاهل Failure Scenarios | Production incidents |
| Monitoring بعد Production | Blind system |
| Security في آخر المشروع | Expensive vulnerabilities |
| Microservices قبل حدود واضحة | Distributed Monolith |

---

# Architecture مش ثابتة

System Design عملية مستمرة.

Architecture اللي كانت ممتازة عند:

\`\`\`text
10K users
\`\`\`

ممكن تكون غير مناسبة عند:

\`\`\`text
10M users
\`\`\`

والعكس صحيح.

Architecture الضخمة المصممة لـ 10M Users ممكن تكون كارثة لمشروع عنده:

\`\`\`text
500 users.
\`\`\`

عشان كده التصميم يتطور.

---

# Well-Architected System

لما نبص للصورة الكاملة، System حقيقية لازم توازن بين جوانب متعددة، ومن أشهر الـ frameworks في المجال Azure وAWS Well-Architected، والاتنين بيركزوا على محاور مثل reliability وsecurity وperformance وoperations وcost بدل النظر للأداء فقط.

ممكن نبسط الـ mental model بتاعنا إلى:

\`\`\`text
              System Design

      ┌──────────┼──────────┐
      ↓          ↓          ↓
Performance  Reliability  Security
      ↓          ↓          ↓
Scalability Availability Data Protection

      ┌──────────┼──────────┐
      ↓          ↓          ↓
Data        Operations     Cost
      ↓          ↓          ↓
Consistency Observability Sustainability
\`\`\`

كل قرار يؤثر على أكتر من جزء.

---

# أهم Mental Model في السلسلة كلها

لما تشوف Technology، اسأل:

\`\`\`text
What problem does this solve?
\`\`\`

مثل:

\`\`\`text
Load Balancer
→ distributes traffic

Cache
→ reduces repeated expensive reads

Replica
→ availability / read scaling

Message Queue
→ decouples asynchronous work

Circuit Breaker
→ protects against failing dependencies

CDN
→ moves content closer to users

Sharding
→ distributes data/write load

Observability
→ tells us what the system is doing
\`\`\`

لو مش عارف المشكلة:

# متضيفش الـ technology.

---

# System Design في جملة واحدة

System Design هي:

> **تصميم طريقة تعاون الـ Components والـ Data والـ Infrastructure بحيث يحقق النظام متطلبات الـ business تحت الحمل الحقيقي والفشل الحقيقي وقيود التكلفة الحقيقية.**

مش الهدف:

\`\`\`text
Use more technologies.
\`\`\`

الهدف:

\`\`\`text
Solve the required problem
with the simplest architecture
that can meet the requirements.
\`\`\`

---

# الخلاصة 🧠

لما يطلب منك تصميم أي System، ما تبدأش بـ:

\`\`\`text
Redis?
Kafka?
Microservices?
SQL or NoSQL?
\`\`\`

ابدأ بـ:

\`\`\`text
What are the requirements?
        ↓
What is the expected scale?
        ↓
What are the access patterns?
        ↓
What consistency do we need?
        ↓
What happens when things fail?
        ↓
Where are the bottlenecks?
        ↓
How do we secure it?
        ↓
How do we observe it?
        ↓
What are the trade-offs?
\`\`\`

وبعدها Technology تيجي كإجابة.

مش كنقطة بداية.

وأهم قاعدة ناخدها معانا لباقي السلسلة:

# Start simple. Measure. Find the bottleneck. Scale the bottleneck.

لأن System عند مليون مستخدم مش بتتبني غالبًا في أول يوم بالشكل النهائي.

بتبدأ:

\`\`\`text
Client
↓
Server
↓
Database
\`\`\`

وبعد كل مشكلة حقيقية تظهر، Architecture تتطور:

\`\`\`text
Scale
↓
Replicate
↓
Cache
↓
Queue
↓
Partition
↓
Observe
↓
Improve
\`\`\`

وده بالضبط اللي هنعمله في باقي سلسلة **System Design**: ناخد كل خطوة من دول لوحدها ونفهم المشكلة اللي بتحلها قبل ما نتعلم الأداة.

## المقالة التالية

# **Scalability — إزاي System تنتقل من مئات المستخدمين إلى ملايين المستخدمين؟**

وهنبدأ فيها من:

\`\`\`text
Single Server
     ↓
Vertical Scaling
     ↓
Horizontal Scaling
     ↓
Stateless APIs
     ↓
Load Distribution
     ↓
Database Bottlenecks
     ↓
Scaling to Millions
\`\`\`
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-26',
  category: 'Architecture',
  readTime: '15 min read',
  image: systemDesignImage,
};
