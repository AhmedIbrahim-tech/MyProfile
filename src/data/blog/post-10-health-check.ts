import type { BlogPost } from '@/modules/blog/types';
import healthCheckImage from '@/assets/blog/health-check-healthy-broken.jpg';

export const post: BlogPost = {
  id: 19,
  title: 'لما الـ Health Check يقول Healthy… والـ System يكون Broken',
  excerpt:
    'مش كل Service حالتها Healthy معناها إنها قادرة تنفذ شغل التطبيق. Running مش Ready — والـ Ping مش كفاية لو التطبيق بيعتمد على Write أو Lock.',
  content: `# لما الـ Health Check يقول Healthy… والـ System يكون Broken

من أكثر الحاجات اللي خلتني أراجع طريقة تفكيري عن الـ Production Systems: **مش كل Service حالتها Healthy معناها إنها قادرة تنفذ شغل التطبيق.**

خليني أحكي موقف حصل في Production.

---

كان عندنا API يعتمد على **Redis** لتنفيذ **Distributed Locking**.

الفكرة بسيطة. قبل تنفيذ عملية معينة:

- التطبيق يأخذ Lock من Redis
- ينفذ الـ Business Operation
- يحرر الـ Lock

عشان يمنع تنفيذ نفس العملية من أكثر من Request في نفس الوقت.

---

في وقت معين بدأنا نلاحظ مشكلة غريبة: الـ API يرجع \`409 Conflict\` لطلبات لا يوجد فيها Conflict حقيقي.

المفروض الـ 409 معناها: في تعارض Business حقيقي. مثلًا المستخدم يحاول يحجز مورد تم حجزه بالفعل، أو يحاول تعديل Version قديمة من البيانات.

لكن هنا لم يكن هذا هو السبب.

---

## أول Hypothesis

الرسالة كانت توحي إن في Request ثانية ماسكة الـ Lock.

يعني ممكن Request A تمسك الـ Lock، وRequest B تحاول تدخل فتأخذ \`409 Conflict\`.

لكن بعد مراجعة الـ Logs والـ Metrics… ظهر شيء مختلف.

---

## المشكلة لم تكن في الـ Business Logic

Redis كان Running، وResponding، وHealth Check = Healthy.

لكن لم يكن قادرًا على تنفيذ العملية التي التطبيق يعتمد عليها.

وهنا ظهر الفرق المهم: الـ Health Check كان يجاوب على سؤال **هل Redis شغال؟** لكن التطبيق كان يحتاج إجابة على سؤال **هل Redis جاهز ينفذ الـ operation التي أعتمد عليها؟**

وهذان سؤالان مختلفان تمامًا.

الـ Container شغال، والـ Port مفتوح، وPING بيرد. لكن ده مش معناه إن Redis قادر على تنفيذ الـ Write اللي التطبيق محتاجه.

---

## Running ≠ Ready

ممكن Service تكون:

1. **Running:** الـ Process موجودة.
2. **Responding:** ترد على Request بسيطة.
3. **Healthy:** حسب الـ Health Check الحالي.

لكن في نفس الوقت غير قادرة على تنفيذ الـ Workload الحقيقي: **Ready**.

مثال: Redis ممكن يقبل Ping، ويكون الـ Port مفتوح، والـ Container شغال… لكن لا يستطيع تنفيذ Writes، أو عنده مشكلة في Persistence، أو Memory Pressure، أو حالة تمنع الـ Commands المطلوبة.

A service can be running and healthy, but still not ready for your use case.

---

## أنواع الـ Health Checks

### Liveness Check

السؤال: هل الخدمة ما زالت حية؟ هل الـ Process شغالة؟

لو فشلت: ممكن Kubernetes تعمل Restart للـ Container.

### Readiness Check

السؤال: هل الخدمة جاهزة تستقبل Traffic؟

مثال: Application بدأت لكن لم تتصل بالـ Database، أو لم تحمل Configuration، أو Dependency أساسية غير جاهزة. هنا الأفضل: لا تستقبل Requests. لو فشلت، وقف إرسال الـ Traffic.

### Dependency Health Check

السؤال: هل الـ Dependency التي أعتمد عليها قادرة تنفذ المطلوب؟

ليس فقط \`Redis is reachable\`. لكن: هل أستطيع تنفيذ \`SET\` و\`GET\` وLock operation حسب استخدام التطبيق؟

الفرق بين Check بسيط وCheck فعلي:

- **Basic:** \`PING\` → \`PONG\`. بيجاوب: هل Redis شغال؟
- **Meaningful:** \`SET test-key test-value\` ثم \`GET test-key\`. بيجاوب: هل Redis جاهز للعمليات اللي التطبيق يعتمد عليها؟

---

## لكن انتبه

ليس معنى ذلك أن تعمل Health Check تضرب كل Dependency في كل Request. ولا معنى أن أي Dependency فشلت تجعل التطبيق كله Down.

لأن أحيانًا تحتاج **Graceful Degradation**.

لو Redis الخاص بالـ Cache وقع: ممكن تكمل بدون Cache. Dependency اختيارية.

لكن لو Redis مسؤول عن Distributed Locking وفشل… قد تحتاج تمنع بعض العمليات لأنها غير آمنة. Dependency حرجة: ارجع \`503\` أو عطّل العملية.

القرار يعتمد على: هل الـ Dependency **Optional** أم **Critical**؟

---

## المشكلة الثانية: Error Mapping

واحدة من أهم الدروس: **لا تحول Infrastructure Failure إلى Business Error.**

في الحالة دي Redis Failure تم تفسيره كأنه \`409 Conflict\`. وده خطأ في الـ API Contract.

لأن العميل يفهم: العملية مرفوضة بسبب حالة Business. لكن الحقيقة: النظام عنده مشكلة في Dependency.

- **Wrong:** Redis Failure → \`409 Conflict\`. مضلل للـ Clients وصعب في الـ Debug.
- **Correct:** Redis Failure → \`503 Service Unavailable\`. واضح وبيعبّر عن المشكلة الحقيقية.

أو \`500 Internal Server Error\` حسب الحالة — المهم متلبّسهاش ثوب Business Conflict.

---

## إضافة Retry

بعد تحديد المشكلة تم إصلاح حالة Redis. لكن الاعتماد على ذلك فقط ليس كافيًا.

أضفنا Retry Mechanism لعملية الـ Lock. لكن Retry له قواعد: لا تعمل Retry forever، لأنك ممكن تحول مشكلة صغيرة إلى Traffic أكبر وضغط أكبر.

الأفضل:

- عدد محاولات محدود
- Exponential Backoff
- Timeout واضح
- Logging مناسب للمحاولات والأخطاء

---

## أسئلة لازم تسألها عند تصميم Health Check

قبل ما تقول الخدمة Healthy، اسأل: هل هي فقط Running؟ ولا جاهزة للـ Traffic؟ ولا تستطيع تنفيذ العمليات التي يعتمد عليها التطبيق؟

- **Database:** هل الاتصال موجود فقط؟ أم هل أستطيع تنفيذ Query أساسية؟
- **Redis:** هل الـ Server يرد؟ أم هل يستطيع تنفيذ الـ Commands التي أحتاجها؟
- **External API:** هل Endpoint يرد؟ أم هل الـ Service تقدم النتيجة المطلوبة؟

---

## الدرس الحقيقي من الـ Incident

الـ Production لا يهتم إذا كانت الـ Service "شغالة" فقط. السؤال الحقيقي: **هل هي قادرة على القيام بالدور الذي يعتمد عليه النظام؟**

لأن الفرق بين Running وReady ممكن يكون الفرق بين System مستقر… وSystem يرسل أخطاء غير مفهومة للمستخدمين.

لا تعمل Health Check لتثبت أن الـ Service موجودة فقط. اعملها لتثبت أن **النظام جاهز لتقديم الـ Workload الحقيقي بأمان.**`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '10 min read',
  image: healthCheckImage,
};
