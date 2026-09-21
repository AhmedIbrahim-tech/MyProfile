import type { BlogPost } from '@/types/blog';
import notificationIdempotencyImage from '@/assets/blog/notification-idempotency.jpg';

export const post: BlogPost = {
  id: 18,
  title: 'إزاي Notification واحدة تتبعت لنفس الشخص 150 مرة؟',
  excerpt:
    'Outbox Pattern بيمنع ضياع الرسالة، مش التكرار. في الـ Distributed Systems لازم تصمم للـ Duplicates، مش تفترض إن الإرسال هيحصل مرة واحدة.',
  content: `# إزاي Notification واحدة تتبعت لنفس الشخص 150 مرة؟

من أكثر الـ Production Incidents اللي بتعلمك إن الـ Distributed Systems مختلفة تمامًا عن الكود المحلي…

إن عملية بسيطة جدًا زي "ابعت Notification للمستخدم" ممكن تتحول إلى: **ابعتها 150 مرة لنفس الشخص**.

وده حصل بسبب مشكلة تبدو بسيطة، لكن وراءها Concept مهم جدًا في تصميم الأنظمة: **Idempotency**.

---

## السيناريو كان ماشي إزاي؟

عندي Notification System يعتمد على **Outbox Pattern**.

بدل ما تعمل \`Save Data\` وبعدها \`Send Notification\` في نفس اللحظة…

تعمل الاتنين داخل Database Transaction:

\`\`\`text
Database Transaction
 ├── Save Business Data
 └── Save Notification Event in Outbox Table
\`\`\`

وبعدها Worker مستقل يقرأ الـ Outbox ويرسل الـ Notification.

الميزة؟ لو حصل Failure بعد الـ Transaction… الـ Notification Event ما تضيعش. Outbox Pattern يضمن عدم فقدان الرسائل.

---

لكن ظهرت مشكلة.

بدأت ألاحظ: بعض الـ Notifications بتوصل للمستخدم أكثر من مرة. وفي حالة وصلت إلى **150 مرة لنفس العميل**.

---

## طيب إزاي حصل ده؟

الـ Flow كان كده:

\`\`\`text
Worker picks message
        ↓
Send Notification
        ↓
Timeout / No response
        ↓
Retry
        ↓
Send Notification Again
\`\`\`

المشكلة هنا: الـ Worker لا يعرف هل الإرسال فشل فعلًا؟ أم إن الـ Notification اتبعت بنجاح لكن الـ Response ضاع بسبب Network Issue.

يعني عندك حالتين شكلهم واحد:

**الحالة الأولى — Send Failed:** Network issue، أو Provider down، أو Timeout. هنا Retry صحيح.

**الحالة الثانية — Send Success لكن Response Lost:** الـ Notification اتبعت بنجاح، لكن الرد ضاع. لو عملت Retry هنا… أنت أرسلت نفس الـ Notification مرتين.

وهنا تظهر مشكلة كبيرة في Distributed Systems: **أنت لا تستطيع دائمًا معرفة هل العملية حدثت أم لا.** في الأنظمة الموزعة، مفيش طريقة موثوقة تعرف النتيجة دائمًا.

---

## At-Least-Once Delivery

معظم أنظمة الـ Messaging والـ Queues تفضل **At-Least-Once Delivery**.

يعني: سأضمن أن الرسالة لن تضيع. لكن المقابل: قد تصل أكثر من مرة.

وده طبيعي. لأن النظام يفضل Duplicate Message عن Lost Message، خصوصًا في الأنظمة المهمة.

ضمانات التوصيل باختصار:

- **At-Most-Once:** الرسالة ممكن تضيع، ومفيش duplicates. نادرًا ما يناسب أنظمة مهمة.
- **At-Least-Once:** الرسالة مش هتضيع، لكن ممكن توصل أكتر من مرة. ده الأشهر في الـ Queues.
- **Exactly-Once:** صعب ومكلف في الأنظمة الموزعة. غالبًا نظري أكتر مما هو عملي بالكامل.

---

## طيب هل نقدر نضمن إرسال مرة واحدة فقط؟

نظريًا تريد **Exactly-Once Processing**. لكن في الأنظمة الموزعة الموضوع أصعب مما يبدو.

لأن عندك Database وMessage Broker وWorker وExternal Notification Provider. وكل جزء ممكن يفشل في توقيت مختلف.

لذلك الحل العملي غالبًا: **Design for Duplicates** — مش Assume No Duplicates.

---

## الحل الأول: Idempotency

يعني: لو نفس العملية اتنفذت مرة أو 100 مرة… النتيجة النهائية تكون واحدة.

عندك Notification:

\`\`\`text
NotificationId = 12345
\`\`\`

قبل الإرسال راجع: هل الـ \`NotificationId\` ده اتبعت قبل كده؟

- لو نعم: أتجاهل التنفيذ.
- لو لا: أرسل وأسجل النجاح.

استخدم Idempotency Key، وتحقق من الإرسال السابق. لو الرسالة اتنفذت بالفعل، متكررش التنفيذ. ويفضّل Unique Constraint في قاعدة البيانات عشان سباق الـ Workers ما يكررش نفس السطر.

مثال Table:

\`\`\`sql
CREATE TABLE notification_deliveries (
  id UUID PRIMARY KEY,
  notification_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  sent_at TIMESTAMP,
  UNIQUE (notification_id, provider)
);
\`\`\`

الـ Unique على \`(notification_id, provider)\` هو اللي بيمنع إن اتنين Workers يسجّلوا نفس الإرسال في نفس اللحظة.

---

## الحل الثاني: Deduplication

لو نفس الرسالة دخلت الـ Queue مرتين:

\`\`\`text
Message A
Message A
\`\`\`

لازم يكون عندك طريقة تعرف: دي نفس العملية. مثلًا كل Event له Unique Identifier:

\`\`\`text
EventId = 8f92-xxxx
\`\`\`

والـ Consumer يحتفظ بالـ IDs التي عالجها.

---

## الحل الثالث: Status Machine

بدل Boolean زي \`Sent = true\`، استخدم حالات واضحة:

\`\`\`text
Pending → Processing → Sent
                 ↘ Failed → Dead Letter Queue
\`\`\`

الـ Worker يأخذ Notification من \`Pending\` إلى \`Processing\` ثم \`Sent\`. لو حصل Failure تبقى \`Failed\`. وبعد عدد معين من المحاولات تروح Dead Letter Queue.

الحالات الواضحة بتخلّي Retry وRecovery أسهل من Flag واحد.

---

## الحل الرابع: Retry Policy

الـ Retry مهم… لكن Retry بدون حدود خطر. لازم تحدد:

- عدد المحاولات
- Backoff Strategy
- Maximum Delay
- Dead Letter Queue

بدل Retry forever:

\`\`\`text
Retry 5 times with backoff
        ↓
Move to Failed / Dead Letter Queue
\`\`\`

---

## الحل الخامس: Expiration

ماذا يحدث لو Notification عمرها أسبوع؟ هل ما زالت مهمة؟

OTP Notification لو وصلت بعد يوم… ليس لها قيمة. لذلك بعض الرسائل تحتاج \`ExpiresAt\`، والـ Worker يتجاهل الرسائل القديمة.

---

## تدفق أأمن للإشعارات

الـ Flow الأدق أقرب لـ:

\`\`\`text
Outbox Table
    ↓
Worker picks message
    ↓
Check Idempotency
    ↓
Send Notification
    ↓
Update Status (Sent / Failed)
\`\`\`

ولو فشل الإرسال: Retry with backoff. حتى لو نفس الرسالة اتنفذت عدة مرات… النتيجة النهائية صحيحة.

كمان لازم تفكّر في Recovery: ماذا يحدث عند إعادة تشغيل الـ Worker؟ الرسائل اللي كانت \`Processing\` لازم تتراجع لحالة قابلة للإعادة، من غير ما تتبعت تاني لو كانت خلصت.

---

## طيب Outbox Pattern حل المشكلة؟

لا. ودي نقطة مهمة جدًا.

Outbox Pattern يحل مشكلة: Database Updated لكن Message لم يتم إرسالها.

بدون Outbox:

\`\`\`text
Save Order
Database Success
Send Event Failed
❌ Event Lost
\`\`\`

مع Outbox:

\`\`\`text
Save Order
+ Save Event
Transaction Commit
Worker Sends Event
\`\`\`

لكن Outbox لا يمنع Duplicate Processing. لأن الـ Worker قد يقرأ نفس الرسالة مرة أخرى.

لذلك غالبًا تحتاج: **Outbox + Idempotent Consumer**.

---

## أسئلة لازم تسألها لأي Background Job

قبل ما تطلق أي Worker، اسأل:

- ماذا يحدث لو العملية اشتغلت مرتين؟
- ماذا يحدث لو الـ Response ضاع؟
- ماذا يحدث لو الـ Worker عمل Restart؟
- ماذا يحدث لو الرسالة وصلت متأخرًا؟
- ماذا يحدث لو الـ External Service نفذ العملية لكن رجع Error؟

هذه الأسئلة هي الفرق بين Code يعمل في الـ Development، وSystem يعيش في Production.

---

## الدرس الحقيقي من الـ Incident

في الـ Happy Path كل شيء جميل:

\`\`\`text
Request → Process → Success
\`\`\`

لكن Production مليان Timeouts وRetries وNetwork Failures وRestarts وDuplicate Messages وPartial Failures.

عشان كده في الأنظمة الحقيقية لا تسأل فقط: هل الكود يعمل؟

اسأل: **لو نفس الحاجة حصلت مرتين… هل النظام سيظل صحيحًا؟**

لأن الـ Production لا يختبر فقط إذا كان الكود يعمل. الـ Production يختبر: هل تصميمك يتحمل الفشل؟

الـ Happy Path مش كافي. أي عملية ممكن تتكرر. صمم أنظمتك لتكون آمنة الفشل.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '11 min read',
  image: notificationIdempotencyImage,
};
