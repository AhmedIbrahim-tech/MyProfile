import type { BlogPost } from '@/modules/blog/types';
import dddTacticalImage from '@/assets/blog/ddd-tactical.jpg';

export const post: BlogPost = {
  id: 24,
  title: 'Domain-Driven Design (DDD) — الجزء الثاني: Tactical Design',
  excerpt:
    'Entity وValue Object وAggregate مش أسماء Classes. دول طريقة تخلي الكود يتكلم لغة الـ Business، ويحافظ على القواعد من غير ما تتحوّل الـ Service لمكان لكل حاجة.',
  content: `# Domain-Driven Design (DDD) — الجزء الثاني: Tactical Design

في الجزء الأول عرفنا أن DDD ليس مجرد استخدام Patterns معينة. الفكرة الأساسية كانت: **افهم الـ Business أولًا، ثم صمم الـ Software ليعكس هذا الفهم.**

وتكلمنا عن Domain وSubdomains وBounded Context وUbiquitous Language وStrategic Design.

في هذا الجزء ننتقل إلى الجانب التقني: **Tactical Design** — تحويل فهم الـ Domain إلى عناصر داخل الكود.

Model the problem, not the database.

أهم العناصر:

- Entities
- Value Objects
- Aggregates وAggregate Roots
- Domain Services
- Domain Events
- Repositories

---

## Entity

الـ Entity هي Object لها Identity واضحة وLifecycle وBehavior. أهم شيء فيها ليس قيمتها فقط، بل **من هي؟**

في نظام متجر، Customer برقم \`123\` اسمه Ahmed. لو الاسم بقى Mohamed، هل أصبح Customer جديد؟ لا. لأن الهوية لم تتغير: \`CustomerId = 123\`. Same identity, different values → same entity.

\`\`\`csharp
public class Customer
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }

    public void ChangeName(string name)
    {
        Name = name;
    }
}
\`\`\`

لم نجعل أي أحد يغير البيانات مباشرة. بدل \`customer.Name = ""\` نستخدم \`customer.ChangeName()\`، لأن تغيير الاسم قد يكون له Rules.

### Entity ليست مجرد Database Table

خطأ شائع: كل Table = Entity. ليس دائمًا. Database تهتم بتخزين البيانات. DDD يهتم بالـ Business Meaning.

جدول \`OrderStatusHistory\` قد يكون مجرد Data Record. ليس بالضرورة Entity.

---

## Value Object

الـ Value Object ليس له Identity. قيمته هي التي تحدده. Value objects are equal if their values are equal.

العنوان غالبًا لا يهمنا أن له رقم. المهم: Street وCity وCountry وZipCode.

Money أيضًا: ليس منطقيًا \`MoneyId = 123\`. لأن 100 USD هي نفس 100 USD.

بدل \`decimal Amount\` و\`string Currency\` داخل الـ Entity:

\`\`\`csharp
public class Money : IEquatable<Money>
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        if (amount < 0)
            throw new DomainException("Amount cannot be negative");

        Amount = amount;
        Currency = currency;
    }

    public bool Equals(Money? other) =>
        other is not null && Amount == other.Amount && Currency == other.Currency;
}
\`\`\`

ثم:

\`\`\`csharp
public class Invoice
{
    public Money Total { get; private set; }
}
\`\`\`

بدل \`decimal price\` نقول \`Money price\`. الاسم نفسه يحمل معنى Business.

### مثال مهم: Email

هل Email مجرد string؟ تقنيًا نعم. لكن في الـ Business له قواعد وFormat معين.

\`\`\`csharp
public class Email
{
    public string Value { get; }

    public Email(string value)
    {
        if (!IsValid(value))
            throw new DomainException("Invalid email");

        Value = value;
    }
}
\`\`\`

الآن أي مكان يستخدم Email مضمون أنه صحيح.

---

## Aggregate و Aggregate Root

من أكثر المفاهيم التي يحدث فيها سوء فهم.

الـ **Aggregate** مجموعة من الـ Entities والـ Value Objects التي يتم التعامل معها كوحدة واحدة.

مثال Order:

\`\`\`text
Order (Aggregate Root)
 ├── OrderItem (Entity)
 ├── ShippingAddress (Value Object)
 └── Payment (Value Object)
\`\`\`

هل أي أحد يستطيع تعديل OrderItem مباشرة؟ مثل \`orderItem.Quantity = -5\`؟ لا. لأن Order هو المسؤول عن الحفاظ على القواعد.

**Aggregate Root** هو الباب الوحيد للدخول. Access through the Aggregate Root only. لا تتعامل مع \`OrderItem\` مباشرة. بل:

\`\`\`csharp
order.AddItem(product, quantity);
\`\`\`

لأن Order يعرف قواعده. مثلًا: لا يمكن إضافة Product بعد إغلاق الطلب.

\`\`\`csharp
public class Order
{
    private readonly List<OrderItem> _items = new();

    public void AddItem(Product product, int quantity)
    {
        if (Status == OrderStatus.Completed)
        {
            throw new DomainException("Order already completed");
        }

        _items.Add(new OrderItem(product, quantity));
    }
}
\`\`\`

### Keep Aggregates Small

لا تجعل Aggregate ضخمًا جدًا.

خطأ: Customer Aggregate يحتوي Orders وPayments وReviews وNotifications. هذا يجعل كل تعديل يحتاج تحميل كل شيء.

الأفضل: Customer وOrder وPayment وReview — كل واحد له حدود.

---

## Domain Service

أحيانًا يوجد Business Logic لا ينتمي إلى Entity واحدة. هنا نستخدم Domain Service.

حساب سعر الشحن يعتمد على وزن المنتج ومكان العميل وشركة الشحن. ليس داخل Order ولا Product، لأنه متعلق بعدة Objects.

\`\`\`csharp
public class ShippingCalculator
{
    public Money Calculate(Order order, Address address)
    {
        // complex shipping rules
        return new Money(10, "USD");
    }
}
\`\`\`

استخدم Domain Service عندما يكون الـ Logic مهم في الـ Business ولا ينتمي إلى Entity واحدة.

لكن لا تجعل كل شيء Domain Service. لو كل Logic أصبح Service، ستعود لنفس مشكلة **Anemic Domain Model**.

---

## Domain Events

Domain Event هو **حقيقة حدثت داخل الـ Domain.** ليس Command.

- Command: \`Confirm Order\` — افعل شيء.
- Event: \`OrderConfirmed\` — حدث شيء.

\`\`\`csharp
public void Confirm()
{
    Status = OrderStatus.Confirmed;
    AddDomainEvent(new OrderConfirmed(Id));
}
\`\`\`

بعد ذلك الـ Handlers ترد الفعل: Send Email، Update Inventory، Create Invoice.

الـ Entity تركز على قواعدها. الـ Side Effects تخرج برّه.

---

## Repository

الـ Repository مسؤول عن التعامل مع تخزين الـ Domain Objects. لكن ليس مجرد Wrapper حول DbContext.

خطأ شائع: \`GetAll()\` و\`Save()\` و\`Delete()\` فتصبح طبقة زائدة.

في DDD، Repository يمثل Collection للـ Aggregate Roots. Think Domain, not database.

\`\`\`csharp
public interface IOrderRepository
{
    Order GetById(Guid id);
    void Add(Order order);
    void Remove(Order order);
}
\`\`\`

لاحظ: لا يوجد \`GetOrderItemsTable()\`. لأننا لا نفكر Database. نفكر Domain. الـ Repository يخفي تفاصيل الـ Persistence، ويشتغل مع Aggregate Roots.

---

## مثال كامل: Place Order

1. User يضغط Checkout → Command: \`PlaceOrder\`
2. Application Layer تستدعي الـ Domain
3. Domain يتأكد: المنتجات موجودة؟ السعر صحيح؟ القواعد مطبقة؟
4. Aggregate ينشئ \`OrderCreated\`
5. Save Changes
6. Event Handlers: Email وInventory وInvoice

الـ Application Layer بتنسّق. الـ Domain بيحكم. الـ Handlers بترد على اللي حصل.

---

## أهم الأخطاء عند تطبيق DDD

- **تحويل كل Class إلى Entity.** ليس كل شيء Entity.
- **جعل الـ Entity مجرد Properties** زي \`public string Status { get; set; }\` بدون Behavior. هذا Anemic Domain Model.
- **عمل Aggregate ضخم** يجعل النظام بطيئًا ومعقدًا.
- **استخدام DDD في CRUD بسيط** يزيد التعقيد بدون فائدة.

---

## الخلاصة

Tactical Design هو الطريقة التي تجعل الـ Domain يظهر داخل الكود.

- **Entity:** شيء له هوية وسلوك.
- **Value Object:** قيمة لها معنى بدون هوية.
- **Aggregate:** مجموعة Objects تحافظ على Business Rules.
- **Aggregate Root:** بوابة التعامل مع الـ Aggregate.
- **Domain Service:** Business Logic لا ينتمي لكيان واحد.
- **Domain Event:** شيء مهم حدث.
- **Repository:** طريقة الوصول للـ Domain Objects.

لكن تذكر: DDD ليس مجموعة Classes. DDD هو محاولة جعل الكود يتكلم لغة الـ Business.

لأن أفضل Software ليس الذي يحتوي على أكثر Patterns… بل الذي يعكس المشكلة الحقيقية التي يحاول حلها.

Good code follows rules. Great code reflects the business.

الجزء التالت اتنشر: **Domain-Driven Design (DDD) — الجزء الثالث: تطبيق عملي في ASP.NET Core**. فيه تقسيم الـ Solution وEF Core Mapping وCQRS وOutbox جوه مشروع .NET.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '12 min read',
  image: dddTacticalImage,
};
