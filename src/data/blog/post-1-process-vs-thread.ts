import type { BlogPost } from '@/modules/blog/types';
import processVsThreadImage from '@/assets/blog/process-vs-thread.jpg';

export const post: BlogPost = {
  id: 1,
  title: 'الفرق بين الـ Process والـ Thread في الـ Production',
  excerpt:
    'الإجابة المحفوظة صحيحة: الـ Process أثقل ومعزولة، والـ Threads أخف وبتتشارك الذاكرة. في الـ Production، الفرق ده ممكن يكون الفرق بين Bug صغير وServer كامل يقع.',
  content: `# الفرق بين الـ Process والـ Thread

لو سألت أي حد في Interview: **"إيه الفرق بين الـ Process والـ Thread؟"** غالبًا هتسمع الإجابة المحفوظة:

> الـ Process أثقل وليها Address Space مستقلة، والـ Threads أخف وبتشارك نفس الـ Address Space.

الإجابة صحيحة… لكن في الـ Production، الفرق ده ممكن يكون الفرق بين **Bug صغير** و **Server كامل يقع**.

---

## الـ Blast Radius مش نظرية

تخيل إن عندك Backend Server شغال Multi-threaded:

- Thread مسؤولة عن الدفع.
- Thread بتتعامل مع بيانات الكارت.
- Thread في الـ Background بتعمل Resize لصورة رفعها User.

الصورة فيها Corrupted Header، ومكتبة معالجة الصور حصل جواها Memory Access غلط أدى إلى **Segmentation Fault — SIGSEGV**.

المشكلة هنا إن الـ Threads كلها موجودة داخل نفس الـ Process وبتشارك نفس الـ Address Space.

فلو الـ SIGSEGV غير مُعالج، مش الـ Thread دي بس اللي هتموت… **الـ Process كلها ممكن تنتهي، ومعاها كل الـ Threads الموجودة بداخلها.**

وده بالضبط السبب إن فرق صغير في الـ Architecture ممكن يغيّر الـ Blast Radius بالكامل.

---

## Processes: Isolation قبل أي شيء

كل Process عندها Virtual Address Space مستقلة.

لو Process مخصصة لمعالجة الصور كراشت، الـ API Server الأساسي ممكن يفضل شغال عادي.

وده بيديك:

- Memory Isolation
- Fault Isolation
- Crash Containment

لكن مفيش حاجة ببلاش.

الـ Processes عادةً عندها overhead أكبر في الإنشاء وإدارة الموارد، والتواصل بينها مش مجرد قراءة Variable من الـ Heap. محتاج تستخدم IPC مثل:

- Sockets
- Pipes
- Shared Memory / mmap
- Message Queues

ومع ذلك، على أنظمة حديثة زي Linux الموضوع مش بالضرورة "نسخ كامل للذاكرة"، لأن \`fork()\` مثلًا يعتمد على Copy-on-Write.

---

## Threads: سرعة ومشاركة… مقابل تعقيد

الـ Threads داخل نفس الـ Process بتشارك الـ Heap والـ Global Memory، بينما كل Thread بيكون لها Stack وحالة تنفيذ خاصة بها.

الميزة؟ مشاركة البيانات سريعة جدًا.

لكن نفس الميزة دي هي اللي بتفتح الباب لمشاكل زي:

- Data Races
- Race Conditions
- Deadlocks

تخيل عندك 5 تذاكر متبقية، و100 Request بيحاولوا يحجزوا في نفس اللحظة.

لو العملية \`check availability → decrement tickets\` مش Atomic ومفيش Synchronization مناسب… ممكن أكتر من Request يشوف إن التذاكر لسه متاحة قبل ما الباقيين يحدثوا القيمة.

والنتيجة؟ بيانات غير صحيحة حتى لو كل Thread منفردة "شغالة صح".

عشان كده Shared Mutable State محتاجة تصميم واضح باستخدام أدوات زي:

- Mutexes
- Locks
- Semaphores
- Atomics

أو تقلل مشاركة الـ State أصلًا باستخدام:

- Channels
- Queues
- Message Passing

---

## إمتى تستخدم Process؟

لو محتاج **Fault Isolation** أو عايز تقلل الـ Blast Radius لجزء ممكن يكراش، تشغيله في **Separate Process** اختيار منطقي.

وده مفيد جدًا لحاجات زي:

- Image / Video Processing
- Plugins
- Workers
- Native Libraries
- Untrusted أو Risky Workloads

ولو الكود فعلًا Untrusted، الـ Process Isolation وحدها مش Security Boundary كاملة؛ غالبًا هتحتاج Sandbox وResource Limits وصلاحيات محدودة حسب النظام.

---

## إمتى async/await يكفي؟

لو عندك آلاف العمليات اللي معظم وقتها مستنية Network أو Database أو File I/O، فالـ **async/await** غالبًا مناسب جدًا، لأنه يسمح لك تعمل Concurrency من غير ما تحتاج Thread مستقلة لكل Request.

لكن لو حطيت Heavy CPU Work على نفس الـ Event Loop… أنت كده ممكن توقف باقي الـ Requests بدل ما تحسن الأداء.

---

## إيه وضع الـ CPU-bound؟

مافيش قاعدة اسمها: **CPU-bound = Processes دائمًا.**

Threads ممكن تستغل أكتر من Core في runtimes ولغات كثيرة.

الاختيار هنا بيعتمد على:

- اللغة والـ Runtime
- احتياجك للـ Isolation
- تكلفة مشاركة البيانات
- وطبيعة الـ Workload

---

## الخلاصة

السؤال الحقيقي مش: **"Process ولا Thread؟"**

السؤال الحقيقي: **إيه نوع الـ Failure اللي مستعد تسمح له يأثر على باقي السيستم؟**

لأن الـ Concurrency مش مجرد Performance Decision.

في الـ Production… **هي كمان Reliability Decision.**`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '8 min read',
  image: processVsThreadImage,
  featured: true,
};
