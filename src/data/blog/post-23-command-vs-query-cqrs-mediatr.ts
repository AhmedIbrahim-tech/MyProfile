import type { BlogPost } from '@/modules/blog/types';
import cqrsMediatrImage from '@/assets/blog/cqrs-mediatr.jpg';

export const post: BlogPost = {
  id: 23,
  title: 'Command vs Query — CQRS & MediatR في .NET: ليه بنفصل الـ Read عن الـ Write؟',
  excerpt:
    'ليه بنفصل الـ Read عن الـ Write؟ وإيه دور MediatR فعلًا؟ دليلك الشامل لفهم CQRS والفرق الحقيقي بين Command وQuery، ومستويات التطبيق من Logical CQRS حتى قواعد البيانات المنفصلة مع Pipeline Behaviors.',
  content: `# ⚡ Command vs Query — CQRS & MediatR في .NET

## ليه بنفصل الـ Read عن الـ Write؟ وإيه دور MediatR فعلًا؟

من الحاجات اللي بتظهر كتير جدًا في مشاريع .NET:

\`\`\`text
CreateOrderCommand
CreateOrderCommandHandler

GetOrderByIdQuery
GetOrderByIdQueryHandler
\`\`\`

وبعدها:

\`\`\`csharp
await sender.Send(command);
\`\`\`

فتبدأ الأسئلة:

> ليه أعمل Command وHandler بدل ما أنادي Service مباشرة؟

> إيه أصلًا الفرق بين Command وQuery؟

> هل مجرد استخدام MediatR معناه إني بطبق CQRS؟

> هل CQRS معناها لازم يكون عندي Database للـ Read وDatabase تانية للـ Write؟

الإجابة على آخر سؤالين:

# لا.

CQRS فكرته الأساسية هي **فصل مسؤولية تغيير الـ State عن مسؤولية قراءة البيانات**. الـ Commands تغيّر الحالة، والـ Queries تقرأ البيانات ولا يفترض أن تغيّرها. Microsoft تصف CQRS بنفس الفكرة، وتوضح إن الفصل ممكن يبدأ منطقيًا داخل نفس التطبيق ونفس الـ database، ومش لازم تبدأ بقواعد بيانات منفصلة.

أما MediatR فهي مكتبة **In-Process Messaging / Mediator** تساعدك توصل Request للـ Handler المناسب بدون إن الـ caller يعتمد عليه مباشرة، وتدعم Requests، Notifications، Streaming، وPipeline Behaviors. استخدام MediatR لا يجعلك تلقائيًا تستخدم CQRS.

---

# أولًا: يعني إيه Command؟

الـ Command يمثل:

# Intent to change state

يعني المستخدم أو النظام بيقول:

> "اعمل حاجة."

أمثلة:

\`\`\`text
CreateOrder
ConfirmOrder
CancelReservation
ChangeCustomerAddress
PayInvoice
DeactivateUser
\`\`\`

لاحظ إن الأسماء عبارة عن:

**أفعال Business واضحة.**

مش:

\`\`\`text
UpdateOrderTable
SetStatusTo2
ModifyCustomerRecord
\`\`\`

الـ Command المفروض تعبّر عن **نية Business**، وMicrosoft توصي إن Commands تمثل business tasks واضحة بدل low-level data mutations.

---

# مثال Command

\`\`\`csharp
public sealed record ConfirmOrderCommand(
    Guid OrderId
);
\`\`\`

الـ Command هنا مجرد:

\`\`\`text
Data describing an intention
\`\`\`

هي بتقول:

> "أكد الـ Order دي."

لكنها مش المفروض تحتوي تنفيذ العملية نفسها.

---

# مين بينفذ الـ Command؟

الـ Handler.

\`\`\`csharp
public sealed class ConfirmOrderCommandHandler
{
    private readonly IOrderRepository _repository;

    public ConfirmOrderCommandHandler(
        IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        ConfirmOrderCommand command,
        CancellationToken cancellationToken)
    {
        var order =
            await _repository.GetByIdAsync(
                command.OrderId,
                cancellationToken);

        if (order is null)
            throw new OrderNotFoundException();

        order.Confirm();

        await _repository.SaveChangesAsync(
            cancellationToken);
    }
}
\`\`\`

الـ Handler هنا مسؤول عن:

\`\`\`text
Load
↓
Execute use case
↓
Persist
\`\`\`

والـ Business Rule نفسها ممكن تفضل جوه الـ Domain:

\`\`\`csharp
order.Confirm();
\`\`\`

---

# طيب يعني إيه Query؟

الـ Query تمثل:

# Request for information

يعني:

> "هاتلي معلومة."

مثل:

\`\`\`text
GetOrderById
GetCustomerProfile
GetProducts
SearchBookings
GetDashboardStatistics
\`\`\`

الـ Query لا يفترض أن تغيّر الـ state؛ Microsoft تصف Queries في CQRS بأنها read-only operations ترجع DTOs أو projections مناسبة للاستهلاك بدون تعديل البيانات.

---

# مثال Query

\`\`\`csharp
public sealed record GetOrderByIdQuery(
    Guid OrderId
);
\`\`\`

Response:

\`\`\`csharp
public sealed record OrderDto(
    Guid Id,
    string Number,
    decimal Total,
    string Status
);
\`\`\`

Handler:

\`\`\`csharp
public sealed class GetOrderByIdQueryHandler
{
    private readonly AppDbContext _context;

    public GetOrderByIdQueryHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto?> Handle(
        GetOrderByIdQuery query,
        CancellationToken cancellationToken)
    {
        return await _context.Orders
            .AsNoTracking()
            .Where(x => x.Id == query.OrderId)
            .Select(x => new OrderDto(
                x.Id,
                x.Number,
                x.Total,
                x.Status.ToString()))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
\`\`\`

لاحظ الفرق.

الـ Command Side ممكن يحتاج:

\`\`\`text
Aggregate
Business Rules
Repository
Transactions
\`\`\`

لكن الـ Query Side محتاج:

\`\`\`text
Get the data efficiently.
\`\`\`

مش لازم تحمل Aggregate كامل لمجرد عرض Order في شاشة.

وده واحد من أهم أسباب CQRS.

---

# Command vs Query

|                | Command          | Query                   |
| -------------- | ---------------- | ----------------------- |
| الهدف          | تغيير State      | قراءة State             |
| النتيجة        | Side Effect      | Data                    |
| Business Logic | غالبًا نعم       | غالبًا قليلة أو لا توجد |
| مثال           | \`ConfirmOrder\`   | \`GetOrderById\`          |
| Database       | Write operations | Read operations         |
| Model          | Write Model      | Read Model / DTO        |
| Optimization   | Consistency      | Query performance       |

---

# طيب إيه هي CQRS؟

CQRS اختصار:

# Command Query Responsibility Segregation

الفكرة:

بدل ما يكون عندك Model واحدة مسؤولة عن:

\`\`\`text
Read
+
Write
+
Business Rules
+
UI Requirements
+
Reports
\`\`\`

نفصل:

\`\`\`text
Command Side
\`\`\`

عن:

\`\`\`text
Query Side
\`\`\`

Microsoft توضح إن read/write workloads غالبًا لها احتياجات مختلفة في الـ performance والـ scalability وشكل البيانات، وإن فصلهم يسمح بتحسين كل جانب بشكل مستقل.

---

# Architecture تقليدية

ممكن يكون عندك:

\`\`\`text
Controller
    ↓
OrderService
    ↓
OrderRepository
    ↓
Order Entity
\`\`\`

ونفس الـ Service تعمل:

\`\`\`csharp
CreateOrder()

UpdateOrder()

CancelOrder()

GetOrder()

GetOrders()

SearchOrders()

GetReport()
\`\`\`

مع الوقت:

\`\`\`text
OrderService
\`\`\`

تبقى:

\`\`\`text
God Service 😅
\`\`\`

---

# مع CQRS

بدل:

\`\`\`text
OrderService
\`\`\`

عندك Use Cases واضحة:

\`\`\`text
Orders/

├── CreateOrder
├── ConfirmOrder
├── CancelOrder
├── GetOrderById
├── GetOrders
└── SearchOrders
\`\`\`

كل واحدة مسؤولة عن Use Case محددة.

وده يتماشى جدًا مع:

# Vertical Slice Architecture

---

# هل CQRS معناها Database للـ Read وDatabase للـ Write؟

لا.

دي واحدة من أكبر المفاهيم الخاطئة.

CQRS ممكن تبدأ بأبسط صورة:

\`\`\`text
Commands
      ↓
   EF Core
      ↓
SQL Database
      ↑
   Queries
\`\`\`

نفس Database.

لكن:

\`\`\`text
Different code paths
Different models
Different responsibilities
\`\`\`

Microsoft توضح صراحةً إن CQRS ممكن تستخدم **separate read/write models فوق نفس data store**، أو في implementations أكثر تقدمًا تستخدم stores منفصلة.

---

# Level 1 — Logical CQRS

\`\`\`text
Write Model
      ↓
Same Database
      ↑
Read Model
\`\`\`

ده غالبًا كفاية لعدد كبير من التطبيقات.

---

# Level 2 — Separate Models

ممكن الـ Write يستخدم:

\`\`\`text
DDD Aggregates
EF Core
Repositories
\`\`\`

والـ Read يستخدم:

\`\`\`text
Dapper
Raw SQL
EF Core projections
\`\`\`

ليه؟

لأن الاحتياجات مختلفة.

---

# Level 3 — Separate Databases

في systems أكبر:

\`\`\`text
Commands
   ↓
Write Database
   ↓
Events
   ↓
Read Database
   ↑
Queries
\`\`\`

هنا تقدر تعمل:

\`\`\`text
Independent Scaling
Optimized Read Model
Materialized Views
\`\`\`

لكن تبدأ تظهر مشكلة جديدة:

# Eventual Consistency

لأن الـ Write Database ممكن تكون اتحدثت…

لكن الـ Read Model لسه ما وصلهاش الـ Event.

Microsoft توضح إن فصل الـ stores يحتاج synchronization، وغالبًا تُستخدم events لتحديث read model؛ وده قد يؤدي إلى eventual consistency. كما تشير إلى Transactional Outbox لتقليل مشكلة تحديث قاعدة البيانات ونشر الحدث بشكل منفصل.

---

# طيب MediatR دخلت فين؟

لحد دلوقتي إحنا نقدر نطبق CQRS بدون MediatR تمامًا.

مثال:

\`\`\`csharp
public class OrdersController : ControllerBase
{
    private readonly ConfirmOrderCommandHandler _handler;

    public OrdersController(
        ConfirmOrderCommandHandler handler)
    {
        _handler = handler;
    }
}
\`\`\`

ده CQRS.

لكن المشكلة:

Controller لازم يعرف كل Handler.

تخيل Controller عنده:

\`\`\`text
CreateOrderHandler
ConfirmOrderHandler
CancelOrderHandler
RefundOrderHandler
GetOrderHandler
SearchOrdersHandler
\`\`\`

Constructor هتبقى كبيرة.

---

# هنا يظهر Mediator Pattern

بدل ما الـ Controller يعرف Handler نفسها:

\`\`\`text
Controller
    ↓
Handler
\`\`\`

يبقى:

\`\`\`text
Controller
    ↓
Mediator
    ↓
Handler
\`\`\`

Controller تقول:

\`\`\`text
"I have this request."
\`\`\`

والـ Mediator يحدد مين يعالجها.

---

# MediatR

MediatR هي implementation للـ Mediator Pattern داخل .NET، وتوفر in-process request/response وnotifications وstreams.

بدل:

\`\`\`csharp
await _confirmOrderHandler.Handle(command);
\`\`\`

نعمل:

\`\`\`csharp
await _sender.Send(command);
\`\`\`

---

# Command باستخدام MediatR

\`\`\`csharp
public sealed record ConfirmOrderCommand(
    Guid OrderId)
    : IRequest;
\`\`\`

Handler:

\`\`\`csharp
public sealed class ConfirmOrderCommandHandler
    : IRequestHandler<ConfirmOrderCommand>
{
    private readonly IOrderRepository _repository;

    public ConfirmOrderCommandHandler(
        IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        ConfirmOrderCommand request,
        CancellationToken cancellationToken)
    {
        var order =
            await _repository.GetByIdAsync(
                request.OrderId,
                cancellationToken);

        if (order is null)
            throw new OrderNotFoundException();

        order.Confirm();

        await _repository.SaveChangesAsync(
            cancellationToken);
    }
}
\`\`\`

Controller:

\`\`\`csharp
[HttpPost("{id}/confirm")]
public async Task<IActionResult> Confirm(
    Guid id,
    CancellationToken cancellationToken)
{
    await _sender.Send(
        new ConfirmOrderCommand(id),
        cancellationToken);

    return NoContent();
}
\`\`\`

---

# Query باستخدام MediatR

\`\`\`csharp
public sealed record GetOrderByIdQuery(
    Guid Id)
    : IRequest<OrderDto?>;
\`\`\`

Handler:

\`\`\`csharp
public sealed class GetOrderByIdQueryHandler
    : IRequestHandler<GetOrderByIdQuery, OrderDto?>
{
    private readonly AppDbContext _context;

    public GetOrderByIdQueryHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto?> Handle(
        GetOrderByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.Orders
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new OrderDto(
                x.Id,
                x.Number,
                x.Total,
                x.Status.ToString()))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
\`\`\`

Controller:

\`\`\`csharp
[HttpGet("{id}")]
public async Task<IActionResult> Get(
    Guid id,
    CancellationToken cancellationToken)
{
    var result =
        await _sender.Send(
            new GetOrderByIdQuery(id),
            cancellationToken);

    return result is null
        ? NotFound()
        : Ok(result);
}
\`\`\`

---

# ISender vs IMediator

في MediatR عندك interfaces منها:

\`\`\`text
ISender
IPublisher
IMediator
\`\`\`

الـ official registration تسجل الثلاثة، بالإضافة للـ request handlers والnotification handlers.

في Controller لو أنت محتاج فقط:

\`\`\`text
Send Request → Handler
\`\`\`

فـ:

\`\`\`csharp
ISender
\`\`\`

بيعبر عن intent أوضح.

أما:

\`\`\`csharp
IPublisher
\`\`\`

لـ Notifications.

و:

\`\`\`csharp
IMediator
\`\`\`

يجمع قدرات الإرسال والنشر.

---

# Send vs Publish

دي نقطة مهمة جدًا.

## Send

\`\`\`csharp
await sender.Send(command);
\`\`\`

المقصود:

\`\`\`text
Request
↓
One Handler
\`\`\`

مثل:

\`\`\`text
ConfirmOrderCommand
↓
ConfirmOrderCommandHandler
\`\`\`

---

# Publish

\`\`\`csharp
await publisher.Publish(notification);
\`\`\`

المقصود:

\`\`\`text
Notification
        ↓
 ┌──────┼──────┐
 ↓      ↓      ↓
H1      H2      H3
\`\`\`

أكتر من Handler ممكن يتفاعل مع notification.

MediatR تدعم \`INotification\` و\`INotificationHandler<>\` لهذا النوع من in-process publish/subscribe.

---

# مثال

\`\`\`csharp
public sealed record OrderConfirmedNotification(
    Guid OrderId)
    : INotification;
\`\`\`

Handler 1:

\`\`\`csharp
public sealed class SendEmailHandler
    : INotificationHandler<OrderConfirmedNotification>
{
    public Task Handle(
        OrderConfirmedNotification notification,
        CancellationToken cancellationToken)
    {
        // Send email

        return Task.CompletedTask;
    }
}
\`\`\`

Handler 2:

\`\`\`csharp
public sealed class AuditOrderHandler
    : INotificationHandler<OrderConfirmedNotification>
{
    public Task Handle(
        OrderConfirmedNotification notification,
        CancellationToken cancellationToken)
    {
        // Write audit log

        return Task.CompletedTask;
    }
}
\`\`\`

---

# لكن خد بالك 🚨

MediatR:

# In-Process

يعني:

\`\`\`text
Same Application Process
\`\`\`

مش:

\`\`\`text
RabbitMQ
Kafka
Azure Service Bus
\`\`\`

لو الـ process وقع…

MediatR نفسها مش durable message broker.

الـ official project يصفها بأنها **in-process messaging**.

يعني لو عندك:

\`\`\`text
Payment confirmed
\`\`\`

ولازم Event توصل لخدمة تانية بشكل Reliable…

فمحتاج حاجة مثل:

\`\`\`text
Outbox
+
Message Broker
\`\`\`

مش MediatR لوحدها.

---

# Domain Event vs MediatR Notification

أحيانًا نستخدم MediatR لنشر Domain Event داخل نفس application.

مثل:

\`\`\`text
Order.Confirm()
      ↓
OrderConfirmedDomainEvent
      ↓
MediatR Publish
      ↓
Handlers
\`\`\`

ده implementation choice.

لكن مهم تفهم:

\`\`\`text
Domain Event
\`\`\`

هو Business Concept.

أما:

\`\`\`text
INotification
\`\`\`

فهي Mechanism/Contract من MediatR.

الاتنين مش نفس الشيء conceptually.

---

# أهم ميزة في MediatR: Pipeline Behaviors

هنا الموضوع يبدأ يبقى أقوى.

تخيل عندك كل Command Handler محتاجة:

\`\`\`text
Logging
Validation
Performance Monitoring
Authorization
Transaction
\`\`\`

بدل ما تعمل:

\`\`\`text
Handler 1 → Validation
Handler 2 → Validation
Handler 3 → Validation
\`\`\`

ممكن تعمل:

# Pipeline Behavior

الـ MediatR README يدعم تسجيل behaviors وopen generic behaviors ضمن الـ request pipeline.

الـ flow يبقى:

\`\`\`text
Request
   ↓
Logging Behavior
   ↓
Validation Behavior
   ↓
Transaction Behavior
   ↓
Handler
   ↓
Response
\`\`\`

---

# Logging Behavior

\`\`\`csharp
public sealed class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<
        LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(
        ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Handling {Request}",
            typeof(TRequest).Name);

        var response = await next();

        _logger.LogInformation(
            "Handled {Request}",
            typeof(TRequest).Name);

        return response;
    }
}
\`\`\`

---

# التسجيل

\`\`\`csharp
builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssemblyContaining<Program>();

    config.AddOpenBehavior(
        typeof(LoggingBehavior<,>));
});
\`\`\`

صيغة \`RegisterServicesFromAssemblyContaining\` و\`AddOpenBehavior\` موثقة في MediatR الرسمية.

---

# Validation Behavior

Flow:

\`\`\`text
CreateOrderCommand
       ↓
ValidationBehavior
       ↓
Valid?
 ┌─────┴─────┐
 NO          YES
 ↓            ↓
Error       Handler
\`\`\`

وده يخليك تمنع تكرار validation boilerplate في كل Handler.

---

# Transaction Behavior

ممكن للـ Commands فقط تدخل Transaction.

مثلًا:

\`\`\`text
Command
   ↓
Begin Transaction
   ↓
Handler
   ↓
SaveChanges
   ↓
Commit
\`\`\`

لكن Query:

\`\`\`text
Query
↓
Handler
↓
Return DTO
\`\`\`

مش محتاجة Transaction behavior بنفس الشكل.

وهنا ممكن تفرق بين Requests عن طريق marker interfaces.

---

# Marker Interfaces

مثلًا:

\`\`\`csharp
public interface ICommand<TResponse>
    : IRequest<TResponse>
{
}

public interface IQuery<TResponse>
    : IRequest<TResponse>
{
}
\`\`\`

وبعدين:

\`\`\`csharp
public sealed record CreateOrderCommand(...)
    : ICommand<Guid>;
\`\`\`

و:

\`\`\`csharp
public sealed record GetOrderQuery(...)
    : IQuery<OrderDto>;
\`\`\`

ده يسمح لك تعمل behaviors خاصة بالـ Commands أو Queries.

---

# مثال Transaction Behavior للـ Commands

\`\`\`csharp
public sealed class TransactionBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICommand<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Begin transaction

        var response = await next();

        // Commit

        return response;
    }
}
\`\`\`

الـ Query مش هتمر من الـ behavior دي بسبب الـ constraint.

---

# Command بيرجع Data ولا لأ؟

دي نقطة فيها لخبطة.

المبدأ الكلاسيكي CQS يقول إن العملية:

\`\`\`text
إما تغيّر state
أو ترجع data
\`\`\`

لكن في تطبيقات CQRS العملية، Command ممكن ترجع outcome عملي زي:

\`\`\`text
Created Id
Result
Receipt
\`\`\`

مثال:

\`\`\`csharp
public sealed record CreateOrderCommand(...)
    : IRequest<Guid>;
\`\`\`

ده مش معناه إنك حولتها لـ Query.

لأن المسؤولية الأساسية ما زالت:

\`\`\`text
Change State
\`\`\`

لكن حاول متعملش Command ترجع:

\`\`\`text
Huge Dashboard DTO
\`\`\`

لأنك ساعتها بدأت تخلط read concern داخل write concern.

---

# Command Handler vs Service

السؤال الطبيعي:

> طب ما أنا ممكن أحط كل ده في OrderService؟

أيوه.

MediatR مش إجبارية.

مثال Service:

\`\`\`csharp
await orderService.ConfirmAsync(id);
\`\`\`

حل صالح جدًا.

المشكلة تظهر لما Service تبقى:

\`\`\`text
Create
Confirm
Cancel
Refund
Approve
Reject
Get
Search
Report
Export
Import
...
\`\`\`

ساعتها Feature-based handlers ممكن تخلي كل Use Case مستقلة وأوضح.

---

# MediatR مش Business Logic Container

خطأ شائع جدًا:

\`\`\`csharp
public async Task Handle(...)
{
    // 500 lines of business rules
}
\`\`\`

الـ Handler مش المفروض يتحول إلى:

\`\`\`text
New God Service
\`\`\`

في Domain غني:

\`\`\`text
Handler
↓
Load Aggregate
↓
aggregate.DoBusinessOperation()
↓
Save
\`\`\`

مثال:

\`\`\`csharp
order.Confirm();
\`\`\`

مش:

\`\`\`csharp
if (...)
{
    if (...)
    {
        if (...)
        {
            // all business logic here
        }
    }
}
\`\`\`

---

# CQRS + DDD

الاتنين بيشتغلوا كويس مع بعض.

مثال Command Side:

\`\`\`text
ConfirmOrderCommand
        ↓
Handler
        ↓
Order Aggregate
        ↓
Domain Rules
        ↓
Repository
\`\`\`

Query Side:

\`\`\`text
GetOrderDetailsQuery
        ↓
Handler
        ↓
EF Core Projection / Dapper
        ↓
OrderDetailsDto
\`\`\`

وده يخلي:

\`\`\`text
Write Model
\`\`\`

مصمم لحماية الـ Business Invariants.

و:

\`\`\`text
Read Model
\`\`\`

مصمم للعرض والسرعة.

CQRS لا تشترط DDD، لكنها مفيدة خصوصًا لما الـ write side عنده business logic معقدة. Microsoft تشير إلى أن CQRS مناسبة للـ task-based UIs والـ complex domain models، بينما CRUD البسيط غالبًا لا يحتاجها.

---

# CQRS + Vertical Slice

واحدة من أنسب التركيبات:

\`\`\`text
Features/

Orders/

  Create/
    Command.cs
    Handler.cs
    Validator.cs
    Endpoint.cs

  Confirm/
    Command.cs
    Handler.cs

  GetById/
    Query.cs
    Handler.cs
    Response.cs
\`\`\`

الميزة:

بدل ما تجمع حسب:

\`\`\`text
Controllers
Services
Repositories
DTOs
\`\`\`

بتجمع حسب:

# Use Case

وده يخلي التعديل في Feature محدد غالبًا في مكان محدد.

---

# CQRS + Clean Architecture

ممكن يكون عندك:

\`\`\`text
Presentation
      ↓
Application
      ↓
Domain
      ↑
Infrastructure
\`\`\`

وفي Application:

\`\`\`text
Commands/
Queries/
Handlers/
\`\`\`

MediatR هنا مجرد وسيلة Dispatch.

مش هي الـ Architecture نفسها.

---

# هل MediatR Required مع CQRS؟

# لا.

ممكن تعمل CQRS كده:

\`\`\`csharp
public sealed class CreateOrderHandler
{
}

public sealed class GetOrderHandler
{
}
\`\`\`

وتعمل DI عادي.

CQRS = architectural/pattern decision.

MediatR = library/tool.

---

# وهل استخدام MediatR يعني CQRS؟

برضه:

# لا.

ممكن تستخدم MediatR عشان:

\`\`\`text
Notifications
Request/Response
Plugin-style dispatching
Cross-cutting pipelines
\`\`\`

بدون CQRS كاملة.

---

# MediatR ≠ Message Broker

دي تستحق تتكرر:

\`\`\`text
MediatR
\`\`\`

يشتغل:

\`\`\`text
inside the process
\`\`\`

لكن:

\`\`\`text
RabbitMQ
Kafka
Azure Service Bus
\`\`\`

يستخدموا للتواصل:

\`\`\`text
across processes / services
\`\`\`

فماينفعش تقول:

> عندي Microservices بتتكلم باستخدام MediatR.

لو Service A وService B processes منفصلة، MediatR مش هتنقل الرسالة بينهم بنفسها. المشروع الرسمي يصف MediatR بأنها مكتبة in-process.

---

# مثال كامل للـ Flow

عندك endpoint:

\`\`\`http
POST /orders/123/confirm
\`\`\`

الـ flow:

\`\`\`text
HTTP Request
      ↓
Controller / Endpoint
      ↓
ISender.Send()
      ↓
LoggingBehavior
      ↓
ValidationBehavior
      ↓
TransactionBehavior
      ↓
ConfirmOrderHandler
      ↓
Order Aggregate
      ↓
Repository
      ↓
Database
\`\`\`

وبعد الحفظ:

\`\`\`text
Domain Event
      ↓
Notification / Outbox
      ↓
Email / Integration
\`\`\`

---

# Query Flow

\`\`\`http
GET /orders/123
\`\`\`

يبقى:

\`\`\`text
HTTP Request
      ↓
Endpoint
      ↓
ISender.Send()
      ↓
GetOrderQueryHandler
      ↓
EF Core / Dapper
      ↓
Projection
      ↓
OrderDto
      ↓
HTTP Response
\`\`\`

لاحظ:

مفيش سبب لازم يجبر Query إنها تمر بالـ Aggregate.

---

# أشهر الأخطاء في CQRS 🚨

## ❌ 1. اعتبار كل Method Command

لو عندك:

\`\`\`text
GetUserCommand
\`\`\`

ده اسم غلط conceptually.

دي:

\`\`\`text
GetUserQuery
\`\`\`

---

## ❌ 2. Query بتعمل SaveChanges

مثال:

\`\`\`csharp
public async Task<UserDto> Handle(...)
{
    user.LastViewedAt = DateTime.UtcNow;

    await context.SaveChangesAsync();

    return dto;
}
\`\`\`

دلوقتي الـ Query بقت بتغير State.

ده يخالف separation اللي CQRS بتحاول تحققه.

لو تحديث \`LastViewedAt\` مطلوب business-wise، فكر هل هو:

\`\`\`text
Command
Event
Telemetry
\`\`\`

بدل تخبيه داخل Query.

---

## ❌ 3. Handler تنادي Handler

مثال:

\`\`\`text
Handler A
↓
Mediator.Send(Command B)
↓
Handler B
↓
Mediator.Send(Command C)
\`\`\`

بسرعة ممكن تعمل:

# Hidden Control Flow

ويبقى صعب تعرف الـ use case بتعمل إيه.

لو العمليات جزء من Use Case واحدة، غالبًا orchestrate بشكل واضح من Application Service/Handler بدل nesting غير ضروري.

---

## ❌ 4. كل حاجة تتحول MediatR Request

مش لازم تعمل:

\`\`\`text
GetCurrentDateQuery
GetConfigQuery
GetConnectionStringQuery
\`\`\`

😅

استخدمها لما separation تضيف قيمة.

---

## ❌ 5. استخدام CQRS في CRUD بسيط

لو Application عبارة عن:

\`\`\`text
Create Category
Edit Category
Delete Category
List Categories
\`\`\`

بدون business complexity…

ممكن architecture بسيطة تكون أفضل.

Microsoft نفسها تشير إلى أن CQRS قد لا تكون مناسبة لما domain/business rules بسيطة وCRUD كافي.

---

## ❌ 6. فصل Databases من أول يوم

ناس كتير تسمع CQRS وتعمل:

\`\`\`text
Write DB
Read DB
Kafka
Redis
Projection Worker
Outbox
\`\`\`

عشان Admin Panel فيها 5 شاشات 😅

ابدأ من:

\`\`\`text
Logical separation
\`\`\`

وبعدين زوّد complexity لما requirement حقيقية تحتاجها.

---

# فوائد CQRS

## 1️⃣ Separation of Concerns

الـ Write logic مش مختلطة بالـ Read logic.

## 2️⃣ Models أنسب لكل جانب

Write:

\`\`\`text
Business-oriented
\`\`\`

Read:

\`\`\`text
UI-oriented
\`\`\`

## 3️⃣ Independent Optimization

ممكن Query تستخدم:

\`\`\`text
Projection
Dapper
Materialized View
Cache
\`\`\`

والـ Command تستخدم:

\`\`\`text
EF Core
DDD
Transactions
\`\`\`

## 4️⃣ Scalability

لو عندك:

\`\`\`text
95% Reads
5% Writes
\`\`\`

في architecture متقدمة تقدر توسّع جانب القراءة بشكل مستقل. Microsoft تذكر independent scaling كأحد فوائد CQRS عند فصل read/write workloads.

## 5️⃣ Clearer Use Cases

بدل:

\`\`\`text
OrderService.DoSomething()
\`\`\`

عندك:

\`\`\`text
ConfirmOrder
CancelOrder
GetOrderDetails
\`\`\`

وده يخلي intent أوضح.

---

# عيوب CQRS

مش كله فوائد.

CQRS بتضيف:

\`\`\`text
More Classes
More Files
More Abstractions
\`\`\`

ومع advanced CQRS ممكن تضيف:

\`\`\`text
Eventual Consistency
Events
Synchronization
Infrastructure Complexity
\`\`\`

Microsoft توضح إن separation، خصوصًا مع stores منفصلة، يضيف synchronization وconsistency complexity.

---

# عيوب MediatR

MediatR كمان ممكن يساء استخدامها.

بدونها:

\`\`\`text
Controller
↓
Service
\`\`\`

Dependency واضحة.

مع الإفراط في MediatR:

\`\`\`text
Controller
↓
Send(...)
↓
???
\`\`\`

لازم Developer يعرف request بتروح لمين.

كمان ممكن تسبب:

\`\`\`text
Too many tiny classes
Hidden execution flow
Over-abstraction
\`\`\`

لو استخدمتها في مشروع بسيط بدون داعٍ.

---

# نقطة عملية عن MediatR الحديثة

الـ MediatR repository الرسمي الحالي يوثّق إعداد \`LicenseKey\` عند التسجيل، لذلك لو بتستخدم إصدار حديث في مشروع Production راجع شروط الإصدار والترخيص الخاصة بالنسخة اللي هتثبتها بدل الاعتماد على tutorials قديمة.

مثال من الـ API الحالية:

\`\`\`csharp
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<Program>();

    cfg.LicenseKey = "...";
});
\`\`\`

---

# إمتى أستخدم CQRS؟

استخدمها لما يكون عندك:

✅ Business Logic معقدة

✅ اختلاف واضح بين Read وWrite requirements

✅ Features كثيرة

✅ Domain كبير

✅ Read-heavy workload يحتاج optimization

✅ Vertical Slice Architecture

✅ Commands لها Rules وTransactions واضحة

✅ فريق يحتاج boundaries أوضح

Microsoft توصي بالنظر إلى CQRS في task-based interfaces، complex domains، read/write workloads المختلفة، والأنظمة التي تحتاج optimization أو scaling مستقل.

---

# إمتى ما تستخدمهاش؟

لو المشروع:

\`\`\`text
Simple CRUD
Small Admin Tool
Prototype
Very Small API
\`\`\`

وكل العملية:

\`\`\`text
Controller
↓
DbContext
↓
Database
\`\`\`

واضحة وقابلة للصيانة…

متضيفش CQRS عشان شكل المشروع يبقى Enterprise 😅

---

# وإمتى أستخدم MediatR؟

MediatR ممكن تكون مفيدة لما:

✅ عندك عدد كبير من Use Cases

✅ بتستخدم Vertical Slices

✅ محتاج decouple sender عن handler

✅ محتاج Pipeline Behaviors

✅ محتاج in-process notifications

✅ عايز consistent request/response dispatching

لكن لو المشروع صغير، calling application services مباشرة ممكن يكون أبسط وأوضح.

---

# اختيار عملي سريع

| السيناريو                       | غالبًا استخدم               |
| ------------------------------- | --------------------------- |
| CRUD بسيط                       | Services / DbContext مباشرة |
| Business Use Cases كثيرة        | CQRS                        |
| CQRS بدون حاجة mediator         | Handlers + DI               |
| CQRS + Vertical Slice           | MediatR ممكن تكون مناسبة    |
| Logging/Validation لكل requests | Pipeline Behaviors          |
| In-process one-to-one request   | \`Send\`                      |
| In-process one-to-many event    | \`Publish\`                   |
| Cross-service messaging         | Message Broker              |
| Complex reads                   | Separate Query Model        |
| Independent read scaling        | Advanced CQRS               |
| Guaranteed external messaging   | Outbox + Broker             |

---

# القاعدة الأهم 🧠

اسأل نفسك:

\`\`\`text
هل العملية بتطلب تغيير حاجة؟
\`\`\`

لو نعم:

# Command

ولو بتطلب معلومة فقط:

# Query

وبعدين اسأل:

\`\`\`text
هل فصل الاتنين هيحل Complexity حقيقية؟
\`\`\`

لو لأ…

مش لازم CQRS.

وبعدين:

\`\`\`text
هل محتاج Mediator يساعدني في dispatching
والـ cross-cutting concerns؟
\`\`\`

لو نعم…

MediatR ممكن تكون أداة ممتازة.

---

# الخلاصة 🚀

احفظ الأربع جمل دول:

## Command

**اطلب من النظام يعمل حاجة تغير State.**

## Query

**اسأل النظام عن حاجة بدون تغيير State.**

## CQRS

**افصل مسؤولية الـ Commands عن الـ Queries لما الفصل يضيف قيمة حقيقية.**

## MediatR

**أداة In-Process تساعدك توصل Requests للـ Handlers وتبني Pipeline حولها، لكنها ليست CQRS نفسها.**

يعني:

\`\`\`text
CQRS without MediatR ✅

MediatR without CQRS ✅

CQRS + MediatR ✅

MediatR = CQRS ❌
\`\`\`

وأفضل Architecture مش اللي فيها:

\`\`\`text
Command
Query
Handler
Behavior
Event
Repository
\`\`\`

أكتر.

أفضل Architecture هي اللي تخلي كل Use Case:

**واضحة، مستقلة، سهلة الاختبار، ومفهومة لأي Developer يدخل المشروع بعدك.**

لأن الهدف مش إن الـ Controller يبقى سطرين.

الهدف إن:

# كل جزء في النظام يعرف مسؤوليته بالضبط. 🚀
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-23',
  category: 'Backend',
  readTime: '14 min read',
  image: cqrsMediatrImage,
  featured: true,
};
