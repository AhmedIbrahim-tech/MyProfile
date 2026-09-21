import type { BlogPost } from '@/types/blog';
import dddAspNetImage from '@/assets/blog/ddd-aspnet.jpg';

export const post: BlogPost = {
  id: 25,
  title: 'Domain-Driven Design (DDD) — الجزء الثالث: تطبيق عملي في ASP.NET Core',
  excerpt:
    'DDD مش Folder Structure. في ASP.NET Core الـ Domain بيحمي القواعد، والـ Application بتنسّق الـ Use Case، والـ Infrastructure بتخبّي EF Core والـ Outbox.',
  content: `# Domain-Driven Design (DDD) — الجزء الثالث: تطبيق عملي في ASP.NET Core

في الجزأين السابقين فهمنا ليه نحتاج DDD، وإيه Strategic Design، وإزاي Tactical Design بيحوّل الـ Business لكود.

الآن السؤال الأهم: **كيف نطبق DDD فعليًا في مشروع .NET؟**

Same business. Different code. Better systems.

---

## مثال عملي: E-Commerce System

سنفترض أننا نبني نظام متجر إلكتروني. عمليات زي إنشاء Order، إضافة Products، الدفع، الشحن، وإرسال Notifications.

---

## أول خطوة: تقسيم الـ Solution

في مشروع ASP.NET Core تقليدي قد ترى Controllers وServices وRepositories وModels.

لكن في DDD نركز على المسؤوليات:

\`\`\`text
ECommerce.sln
└── src/
    ├── ECommerce.Domain/
    │   ├── Entities/
    │   ├── ValueObjects/
    │   ├── Events/
    │   ├── Exceptions/
    │   └── Interfaces/
    ├── ECommerce.Application/
    │   ├── Orders/
    │   │   ├── Commands/
    │   │   ├── Queries/
    │   │   └── Handlers/
    │   └── DTOs/
    ├── ECommerce.Infrastructure/
    │   ├── Persistence/
    │   ├── Repositories/
    │   ├── ExternalServices/
    │   ├── Messaging/
    │   └── Configurations/
    └── ECommerce.Presentation/
        ├── Controllers/
        ├── Middlewares/
        └── Extensions/
\`\`\`

كل طبقة لها مسؤولية واضحة، وتعتمد فقط على الطبقات الداخلية. Domain في النص. Presentation وInfrastructure على الأطراف.

---

## Domain Layer

هذه أهم طبقة. هنا يوجد Business Rules وEntities وValue Objects وDomain Events.

ولا يجب أن تعرف EF Core ولا SQL Server ولا HTTP ولا APIs خارجية.

### Entity: Order

بدل أن يكون Order مجرد Data Container، نجعله يحتوي Behavior. الـ Order يحمي قواعده. مفيش Business Logic في Controller أو Service.

\`\`\`csharp
public class Order
{
    private readonly List<OrderItem> _items = new();

    public Guid Id { get; private set; }
    public OrderStatus Status { get; private set; }
    public IReadOnlyCollection<OrderItem> Items => _items;

    public void AddItem(Product product, int quantity)
    {
        if (Status == OrderStatus.Completed)
        {
            throw new DomainException("Cannot modify completed order");
        }

        _items.Add(new OrderItem(product, quantity));
    }

    public void Confirm()
    {
        if (!_items.Any())
            throw new DomainException("Order is empty");

        Status = OrderStatus.Confirmed;
        AddDomainEvent(new OrderConfirmed(Id));
    }
}
\`\`\`

---

## Value Objects

Express intent, not just data. Value objects have no identity. Their value defines them.

بدل \`decimal Price\` و\`string Currency\`:

\`\`\`csharp
public record Money
{
    public decimal Amount { get; init; }
    public string Currency { get; init; }

    public Money(decimal amount, string currency)
    {
        if (amount < 0)
            throw new DomainException("Amount cannot be negative");

        Amount = amount;
        Currency = currency;
    }
}

public record Address(string Street, string City, string Country);
\`\`\`

أي مكان يستخدم Money يعرف أنه له Amount وCurrency. والـ Address مش ثلاث strings متفرقين.

---

## Application Layer

هذه الطبقة تنسق الـ Use Cases. لكن لا تحتوي Business Rules. الـ Handler بتنسّق الـ Flow. الـ Domain فيه القواعد.

عملية Confirm Order:

\`\`\`csharp
public record ConfirmOrderCommand(Guid Id);

public class ConfirmOrderHandler
{
    private readonly IOrderRepository _repository;

    public async Task Handle(ConfirmOrderCommand command)
    {
        var order = await _repository.GetById(command.Id)
            ?? throw new NotFoundException();

        order.Confirm();
        await _repository.Save(order);
    }
}
\`\`\`

لاحظ: الـ Handler لم يقرر هل يمكن التأكيد. هو فقط طلب من الـ Domain.

---

## Infrastructure Layer

هنا التفاصيل التقنية: EF Core وDatabase وExternal APIs وMessage Brokers.

في Domain نكتب Interface:

\`\`\`csharp
public interface IOrderRepository
{
    Task<Order?> GetById(Guid id);
    Task Add(Order order);
    Task Save();
}
\`\`\`

في Infrastructure ننفذها. الـ Domain لا يعرف EF Core. وهذا هو الهدف. Repository يشتغل مع الـ Domain Model، مش مع جداول الـ Database.

\`\`\`csharp
public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public async Task<Order?> GetById(Guid id) =>
        await _context.Orders.FirstOrDefaultAsync(x => x.Id == id);
}
\`\`\`

---

## EF Core و DDD

EF Core يحتاج Mapping. نفصل Domain Model عن Database Mapping. الـ Configuration تفضل في Infrastructure. الـ Domain يفضل persistence-agnostic.

\`\`\`csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(x => x.Id);
        builder.OwnsMany(x => x.Items);
        builder.OwnsOne(x => x.ShippingAddress);
        builder.Property(x => x.Status).HasConversion<string>();
    }
}
\`\`\`

---

## Domain Events عمليًا

Domain events represent facts that already happened — not commands.

\`\`\`csharp
public record OrderConfirmed(Guid OrderId);

public class SendEmailHandler : INotificationHandler<OrderConfirmed>
{
    private readonly IEmailService _email;

    public async Task Handle(OrderConfirmed notification, CancellationToken cancellationToken)
    {
        await _email.SendOrderConfirmation(notification.OrderId);
    }
}
\`\`\`

الـ Entity بتعلن اللي حصل. الـ Handler بيرد الفعل.

---

## Outbox Pattern مع DDD

هنا نصل للـ Production. لو Order Confirmed وتريد Send Email وUpdate Inventory وNotify Shipping، لا تفعل Save Order ثم Call Services في نفس اللحظة. أي Failure قد يسبب مشكلة.

الأفضل:

\`\`\`text
Domain Event
    ↓
Save to Outbox Table
    ↓
Background Worker
    ↓
Message Broker
    ↓
External Systems
\`\`\`

كده توصيل موثوق، وConsistency مع الأنظمة الخارجية.

---

## أين يدخل CQRS؟

DDD يعمل بشكل ممتاز مع CQRS: الفصل بين Commands اللي بتغيّر البيانات (\`CreateOrder\` و\`ConfirmOrder\` و\`CancelOrder\`) وQueries اللي بتقرأ (\`GetOrderDetails\`).

ليس معنى ذلك أن كل مشروع DDD يحتاج CQRS. لكن عندما يصبح النظام معقدًا، قد يكون مفيدًا.

---

## DDD و Microservices

خطأ شائع: "DDD يعني Microservices". لا. DDD يأتي أولًا. ثم قد تقرر هل تحتاج Microservices؟

بعد تحليل الـ Domain وجدت Sales Context وPayment Context وShipping Context. هذه Bounded Contexts. قد تصبح Modules داخل Monolith، أو Microservices مستقلة — حسب الحاجة.

### Modular Monolith + DDD

كثير من الأنظمة الكبيرة تبدأ هكذا: Sales Module وPayment Module وInventory Module. كل Module له Domain وApplication وInfrastructure.

هذا يعطيك حدود واضحة واستقلالية، وسهولة التحول لاحقًا إلى Microservices.

---

## متى تستخدم DDD؟ ومتى لا؟

**غالبًا مش محتاجه:** CRUD بسيط، Admin Dashboard، Prototype، أدوات داخلية صغيرة، مفيش تعقيد Business حقيقي.

**مفيدة جدًا لما:** قواعد Business كثيرة، نظام كبير وبينمو، الـ Domain محتاج خبرة متخصصة، أكتر من فريق، والنظام هيعيش سنين.

---

## أخطاء تجعل DDD يفشل

- التركيز على الكود ونسيان الـ Business. DDD يبدأ من فهم المشكلة.
- عمل Entities بدون Behavior. هذا يعيدك إلى Anemic Model.
- تحويل كل شيء إلى Pattern. مش الهدف تستخدم Repository وFactory وEvent لمجرد استخدامها.
- إنشاء Aggregates ضخمة. اجعل الحدود صغيرة وواضحة.

---

## الصورة النهائية

\`\`\`text
Business Experts
        ↓
Domain Understanding
        ↓
Bounded Contexts
        ↓
Rich Domain Model
        ↓
Entities + Value Objects
        ↓
Domain Events
        ↓
Application Use Cases
        ↓
Infrastructure (EF Core, Outbox, Messaging)
\`\`\`

الـ Request flow في Place Order: Client → Application validates and calls Domain → Domain enforces rules → Save with Outbox → Event Handlers (Email, Inventory, …).

---

## الخلاصة النهائية

DDD ليس Framework. وليس Library. وليس مجرد Folder Structure.

DDD هو طريقة تجعل الـ Software قريبًا من الواقع الذي يحاول حله.

Developer بدون DDD قد يبني نظامًا يعمل. لكن Developer يفهم DDD يستطيع بناء نظام يفهمه الـ Business، ويستطيع الفريق تطويره، ويتحمل التغيير، ويبقى قابلًا للصيانة بعد سنوات.

لأن أصعب جزء في أي System ليس كتابة الكود… بل كتابة كود يمثل العالم الحقيقي الذي نريد خدمته.

DDD is not about more code. It's about code that represents the real world.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '12 min read',
  image: dddAspNetImage,
};
