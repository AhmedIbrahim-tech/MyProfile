import type { BlogPost } from '@/modules/blog/types';
import dddImage from '@/assets/blog/ddd.jpg';

export const post: BlogPost = {
  id: 14,
  title: 'Domain-Driven Design (DDD) — كيف تبني Software يعكس الـ Business؟',
  excerpt:
    'أصعب جزء مش إن الكود يشتغل. الأصعب إن الكود يعكس الـ Business، ويحافظ على القواعد، ويفضل قابل للتغيير بعد سنين. DDD بيصمم النظام حول الـ Domain مش حول الـ Database.',
  content: `# Domain-Driven Design (DDD) — كيف تبني Software يعكس الـ Business؟

من أصعب المشاكل التي تواجه أي Backend Developer ليست أن تكتب كودًا يعمل… لكن أن تكتب كودًا يعكس الـ Business الحقيقي، ويحافظ على قواعد العمل، ويمنع الأخطاء قبل حدوثها، ويظل قابلًا للتطوير بعد سنوات.

في البداية، أي مشروع تقريبًا يمكن أن يبدأ بشكل بسيط:

\`\`\`text
Controller → Service → Repository → Database
\`\`\`

والحل يعمل.

لكن مع زيادة حجم المشروع تبدأ المشكلة. الـ Business Rules تبدأ في الانتشار بين Controllers وServices وDatabase Queries وHelper Classes وValidation Layers.

وبعد فترة يصبح عندك نظام يعمل… لكن من الصعب فهمه، ومن الصعب تعديله، وأي تغيير صغير قد يكسر أجزاء أخرى. القواعد متناثرة، والمنطق غير متسق، والتعقيد بيزيد مع الوقت.

وهنا يظهر مفهوم **Domain-Driven Design (DDD)**.

---

## ما هو Domain-Driven Design؟

DDD هو Software Design Approach يركز على **تصميم النظام حول الـ Business Domain نفسه** — وليس حول Database Tables أو Framework أو Controllers أو APIs.

يعني قبل أن تسأل "كيف سأكتب الـ Entity؟" أو "كيف سأصمم الـ Database؟" تسأل:

- كيف يعمل هذا الـ Business؟
- ما القواعد التي تحكمه؟
- ما الأشياء التي لا يمكن السماح بكسرها؟
- ما المصطلحات التي يستخدمها أصحاب الـ Business؟

**Model the software around the domain itself.** ركّز على Business Logic، خلي الكود يعكس القواعد الحقيقية، وده أنسب للأنظمة المعقدة.

---

## مثال بسيط

لنفترض أننا نبني نظام حجز. في البداية قد تفكر: عندي جدول \`Reservations\` وفيه \`Id\` و\`CustomerId\` و\`Date\` و\`Status\`.

لكن الـ Business ليس جدولًا. هناك قواعد:

- لا يمكن تأكيد حجز منتهي.
- لا يمكن إلغاء حجز قبل ساعتين من الموعد.
- لا يمكن حجز نفس المورد في نفس الوقت.
- بعض العملاء لهم شروط مختلفة.

هذه القواعد هي قلب النظام. وهنا يأتي دور DDD: أن تجعل الـ Software يعكس هذه القواعد.

---

## ما هو الـ Domain؟

الـ Domain هو **المجال أو النشاط التجاري الذي يحاول النظام خدمته.**

**Healthcare:** Patients وDoctors وAppointments وMedical Records وInsurance Rules.

**E-Commerce:** Products وOrders وPayments وInventory وShipping.

**Banking:** Accounts وTransactions وLoans وInterest Rules وCompliance.

الـ Domain ليس Database Schema، وليس مجرد مجموعة Classes. هو المعرفة والقواعد الخاصة بمجال العمل.

---

## لماذا نحتاج DDD؟

لأن المشكلة الأساسية في الأنظمة الكبيرة ليست كتابة الكود. المشكلة هي **التعامل مع التعقيد.**

كلما زاد الـ Business Complexity، زاد احتمال أن تصبح القواعد موزعة ومتناقضة وصعبة التغيير. DDD يحاول أن يجعل التعقيد في مكان واضح.

ليه نحتاجه؟

- يخلي قواعد العمل في مكان واحد.
- يقلل الـ Coupling.
- أسهل في التوسع.
- يمنع الأخطاء بدري.
- يسهّل شغل الفريق بنفس اللغة.
- بيتعامل مع التعقيد بدل ما يخبيه في الـ Services.

---

## قبل DDD

Business Logic جوّه الـ Service:

\`\`\`csharp
public async Task CancelFlight(int id)
{
    var flight = await repository.Get(id);

    if (flight.DepartureTime < DateTime.UtcNow.AddHours(2))
    {
        throw new Exception();
    }

    flight.Status = FlightStatus.Cancelled;
    await repository.Save();
}
\`\`\`

أو تحويل أموال:

\`\`\`csharp
public async Task TransferMoney()
{
    var account = await repository.GetAccount();

    if (account.Balance > amount)
    {
        account.Balance -= amount;
        await notification.Send();
        await audit.Log();
        await repository.Save();
    }
}
\`\`\`

المشكلة: أين قاعدة التحويل؟ داخل Service. أين الإشعار؟ داخل Service. أين الـ Audit؟ داخل Service. مع الوقت تصبح الـ Service مسؤولة عن كل شيء.

---

## بعد DDD

نجعل الـ Domain Model مسؤولًا عن قواعده:

\`\`\`csharp
public class Flight
{
    public DateTime DepartureTime { get; private set; }
    public FlightStatus Status { get; private set; }

    public void Cancel()
    {
        if (DepartureTime < DateTime.UtcNow.AddHours(2))
        {
            throw new DomainException("Cannot cancel flight");
        }

        Status = FlightStatus.Cancelled;
    }
}
\`\`\`

\`\`\`csharp
public class BankAccount
{
    public decimal Balance { get; private set; }

    public void Withdraw(decimal amount)
    {
        if (amount > Balance)
        {
            throw new DomainException("Insufficient balance");
        }

        Balance -= amount;
    }
}
\`\`\`

الآن الحساب نفسه يعرف هل يمكن السحب أم لا. والـ Flight نفسها تعرف هل الإلغاء مسموح. أي مكان يستخدمهم سيحترم نفس القاعدة.

---

## DDD لا يعني أن كل مشروع يحتاجه

هذه نقطة مهمة جدًا. DDD ليس Pattern تضعه في كل مشروع.

**غالبًا مش محتاجه** لو عندك CRUD بسيط، أو Dashboard صغيرة، أو Admin Panel، أو مفيش قواعد Business معقدة.

**بيبقى مفيد جدًا** لو عندك قواعد Business كثيرة، أو عمليات معقدة، أو Domain يحتاج خبرة متخصصة، أو فرق متعددة، أو تغييرات مستمرة، أو نظام كبير وبينمو.

---

## DDD ينقسم إلى جزئين رئيسيين

### Strategic Design

الجزء الأكبر والأهم. قبل كتابة الكود. نحاول فهم حدود النظام، وأجزاء الـ Business، والعلاقات بينها.

يشمل: Subdomains وBounded Contexts وUbiquitous Language وContext Mapping.

### Tactical Design

الجزء التقني. نحول فهم الـ Business إلى Code.

يشمل: Entities وValue Objects وAggregates وDomain Events وRepositories وDomain Services.

---

## Strategic Design: Subdomains

أي Business كبير يمكن تقسيمه إلى أجزاء أصغر. بدل أن نقول "E-Commerce Domain" يمكن تقسيمه إلى Sales وInventory وShipping وPayments وCustomer Support. كل جزء له قواعده الخاصة.

### Core Subdomain

الجزء الذي يعطي الشركة ميزتها الأساسية. مثال: شركة توصيل — اختيار أفضل Route وإدارة السائقين وتوقع وقت الوصول. في بنك: Risk Calculation. Login وEmail Sending مش Core.

### Supporting Subdomain

مهم لكنه ليس سبب نجاح المنتج. مثال: Reports.

### Generic Subdomain

شيء عام يمكن استخدام حلول جاهزة له: Authentication وLogging وEmail.

---

## Ubiquitous Language

من أهم مفاهيم DDD: لغة مشتركة بين Developers وBusiness Experts وProduct Owners. نستخدم نفس المصطلحات في الكلام والكود.

بدل:

\`\`\`csharp
UpdateStatus(3)
\`\`\`

نكتب:

\`\`\`csharp
order.Ship();
\`\`\`

لأن Ship مصطلح Business واضح.

مثال آخر: كلمة Customer. في نظام المبيعات تعني Person who buys products. في نظام الدعم تعني Person who opens support tickets. نفس الكلمة، لكن المعنى مختلف حسب السياق.

وهنا نصل لأهم مفهوم في Strategic Design: **Bounded Context**.

---

## لحد هنا… وإيه الجاي؟

الجزء ده غطى السؤال الأساسي: ليه DDD موجود، وإيه الـ Domain، وإمتى تستخدمه، وإزاي Strategic Design بيبدأ من Subdomains ولغة مشتركة.

الجزء التاني اتنشر: **Domain-Driven Design (DDD) — الجزء الثاني: Tactical Design**. فيه Entity وValue Object وAggregate وDomain Events وRepository، وأمثلة عملية على تحويل قواعد العمل لكود.

لأن أصعب جزء مش إنك تكتب كود يشتغل… أصعب جزء إنك تكتب كود **يمثل الـ Business.**`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '11 min read',
  image: dddImage,
};
