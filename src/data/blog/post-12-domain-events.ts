import type { BlogPost } from '@/modules/blog/types';
import domainEventsImage from '@/assets/blog/domain-events.jpg';

export const post: BlogPost = {
  id: 12,
  title: 'Domain Events في الـ Backend: ليه نستخدمها وإمتى؟',
  excerpt:
    'Domain Event = حقيقة حصلت في الـ Domain، مش أمر للتنفيذ. افصل الحدث عن رد الفعل عشان النظام يفضل سهل التغيير لما يكبر.',
  content: `# Domain Events في الـ Backend: ليه نستخدمها وإمتى؟

من الحاجات اللي بدأت أعتمد عليها أكثر في تصميم الـ Backend Systems هي **Domain Events**.

لكن قبل ما ندخل فيها، خلينا نشوف المشكلة اللي بتحلها.

---

تخيل عندك API مسؤول عن تأكيد حجز Reservation. في البداية الموضوع بسيط:

\`\`\`text
Confirm Reservation
        ↓
Change Status = Confirmed
        ↓
Save Changes
\`\`\`

وخلاص.

لكن مع الوقت المشروع يكبر، وتبدأ تظهر Requirements جديدة. بعد تأكيد الحجز نحتاج إرسال Notification للمستخدم، وتحديث نظام خارجي، وإرسال Email، وتسجيل Audit Log، وتحديث Dashboard.

الحل السهل في البداية: نضيف كل حاجة في نفس الـ Service:

\`\`\`csharp
public async Task ConfirmReservation()
{
    reservation.Confirm();
    await notificationService.Send();
    await externalService.Update();
    await auditService.Log();
    await repository.Save();
}
\`\`\`

الكود سيعمل. لكن المشكلة ليست اليوم. المشكلة بعد 6 شهور.

كل Feature جديدة معناها: ارجع وعدل نفس الـ Method. ومع الوقت الـ Service تكبر، والمسؤوليات تختلط، وTesting يصبح أصعب، وأي تعديل قد يؤثر على أجزاء أخرى. Tight coupling. Harder to maintain.

---

## طيب ما الحل؟

هنا يظهر مفهوم **Domain Events** — من مفاهيم Domain-Driven Design (DDD)، لكن يمكن استخدامه حتى لو لم تطبق DDD بالكامل.

الفكرة الأساسية: بدل أن الـ Domain Object يقول "افعل كل شيء بعدي"، هو فقط يقول **"حدث شيء مهم."**

بدل ما الـ Reservation Service تعمل Confirm ثم Send Notification ثم Update Payment ثم Create Audit… نخلي الـ Domain يقول:

\`\`\`text
ReservationConfirmed
\`\`\`

أي: الحجز أصبح مؤكدًا. انشر حقيقة، مش أمر.

الـ Entity تركز على Business Logic، ومش محتاجة تعرف الـ External Concerns. أسهل في الصيانة والاختبار.

---

## Domain Event vs Command

**Command:** \`SendNotification\` — أمر للنظام أن ينفذ شيء. بيقول للنظام يعمل إيه. وغالبًا بيؤدي لـ Tight Coupling.

**Domain Event:** \`ReservationConfirmed\` — حقيقة حدثت بالفعل. يصف شيء حصل داخل الـ Domain.

أمثلة كلها تصف شيء حصل:

\`\`\`text
OrderCreated
PaymentCompleted
ReservationConfirmed
UserRegistered
\`\`\`

---

## مثال بسيط

قبل Domain Events:

\`\`\`csharp
public async Task ConfirmReservation()
{
    reservation.Confirm();

    await notificationService.Send();
    await auditService.Log();
    await repository.Save();
}
\`\`\`

المشكلة: الـ Reservation أصبحت تعرف تفاصيل كثيرة خارج مسؤوليتها.

بعد Domain Events:

\`\`\`csharp
public class Reservation
{
    public Guid Id { get; private set; }
    public ReservationStatus Status { get; private set; }
    private readonly List<IDomainEvent> _events = new();

    public void Confirm()
    {
        Status = ReservationStatus.Confirmed;
        AddDomainEvent(new ReservationConfirmed(Id));
    }
}
\`\`\`

الـ Entity قامت بمهمتها فقط: غيرت حالتها وأعلنت أن حدثًا حصل.

---

## طيب مين يتعامل مع الـ Event؟

هنا يأتي دور **Event Handlers**. الحدث الواحد ممكن يتفرع لأكتر من رد فعل:

\`\`\`text
Reservation.Confirm()
        ↓
ReservationConfirmed
        ├── Notification Handler
        ├── Audit Handler
        └── Integration Handler
\`\`\`

كل Handler مسؤول عن شيء واحد.

\`\`\`csharp
public class ReservationConfirmedHandler
{
    public async Task Handle(ReservationConfirmed @event)
    {
        await notification.Send();
    }
}

public class AuditHandler
{
    public async Task Handle(ReservationConfirmed @event)
    {
        await audit.Log();
    }
}
\`\`\`

---

## ما الفائدة؟

**Single Responsibility:** الـ Reservation لا تعرف Email ولا Notification ولا External API. هي فقط تعرف Business Rule الخاصة بها.

**تقليل Coupling:** إضافة Feature جديدة لا تحتاج تعديل الكود الأساسي. بعد شهر قررت تضيف Analytics Tracking. بدل تعديل \`ConfirmReservation()\` تضيف \`ReservationConfirmedAnalyticsHandler\`.

**سهولة الاختبار:** تستطيع اختبار هل الحجز يتغير إلى Confirmed بدون الحاجة لتشغيل Notification System أو External APIs.

النتيجة: Looser Coupling، أسهل تضيف Features، Better Testability، وكود أسهل في الصيانة.

---

## Domain Event و Outbox Pattern

لو عندك Event يجب أن يخرج لنظام خارجي — Notification Service أو Payment Provider — لا تريد أن يحدث:

\`\`\`text
Save Database → Success
Send Event → Failed
❌ الرسالة ضاعت
\`\`\`

هنا يأتي دور **Outbox Pattern**: داخل نفس Transaction تحفظ Business Data + Event Record. ثم Worker مستقل يقرأ الـ Outbox ويرسل الـ Events.

\`\`\`text
Save Data + Event to Outbox (one transaction)
        ↓
Background Worker
        ↓
Message Broker
        ↓
External Systems
\`\`\`

يعني العلاقة:

\`\`\`text
Domain Event → Outbox → Integration Event → External System
\`\`\`

كده التوصيل موثوق، الرسائل مش بتضيع، وبتتعامل مع Retries والـ Failures. وده بيشتغل كويس مع Microservices.

مهم: متبعتش الـ Events قبل حفظ البيانات. لو بعت الأول وبعدين الـ Save فشل، الأنظمة التانية هتشوف حدث عن حاجة محصلتش.

---

## Domain Event vs Integration Event

ليس كل Domain Event يجب أن يخرج خارج النظام.

**Domain Event** داخل نفس الـ Application. بيتتعامل معاه Internal Handlers. مثال: \`ReservationConfirmed\`. غالبًا in-process.

**Integration Event** رسالة بين Systems مختلفة. مثال: \`ReservationConfirmedMessage\` تروح RabbitMQ أو Kafka أو Azure Service Bus. عادة asynchronous.

---

## هل Domain Events معناها أن كل شيء يصبح Async؟

لا.

ممكن يكون الـ Handler Synchronous داخل نفس العملية، أو Asynchronous عن طريق Message Broker.

الاختيار يعتمد على: هل العملية Critical؟ هل تحتاج Immediate Response؟ هل يمكن تأخيرها؟

---

## إمتى تستخدمها؟

استخدم Domain Events لما:

- الحدث مهم في الـ Domain وله أكثر من رد فعل.
- المشروع فيه Side Effects كتير بعد نفس العملية.
- المشروع قابل للتوسع وتريد تقليل الـ Coupling بين الأجزاء.
- محتاج Outbox للتواصل الموثوق مع أنظمة خارجية.

---

## أخطاء شائعة

- **استخدام Domain Events لكل شيء.** ليس كل تغيير يحتاج Event. استخدمها للأحداث المهمة في الـ Domain.
- **جعل Event Handler يحتوي Business Logic ضخمة.** الـ Handler مسؤول عن Reaction، ليس مكانًا لكل قواعد النظام.
- **اعتبار Event مجرد Notification.** الـ Domain Event يمثل Business Fact، ليس مجرد استدعاء دالة بطريقة مختلفة.
- **عدم الاهتمام بموثوقية الأنظمة الخارجية.** لو الرسالة لازم توصل، Outbox مش optional.
- **إرسال Events قبل حفظ البيانات.** من غير Transaction واضحة هتسرّب حقائق غلط برّه النظام.

---

## الخلاصة

**Domain Event = شيء مهم حدث داخل الـ Domain.**

**Event Handler = ماذا نفعل بعد حدوثه.**

لما تفصل بينهم: الـ Domain يركز على قواعد العمل، والـ Features الجديدة تصبح أسهل، والـ Coupling يقل، والنظام يصبح أكثر قابلية للتوسع.

لكن أهم شيء: لا تستخدم Domain Events لأن شكلها Architecture جميل. استخدمها عندما يكون عندك **حدث Business مهم، وله أكثر من رد فعل، وتريد أن تفصل هذه المسؤوليات عن بعضها.**

لأن الهدف من الـ Architecture ليس زيادة عدد الـ Patterns… الهدف هو بناء System يظل سهل التغيير عندما يكبر.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '11 min read',
  image: domainEventsImage,
};
