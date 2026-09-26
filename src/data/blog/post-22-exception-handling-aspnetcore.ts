import type { BlogPost } from '@/modules/blog/types';
import exceptionHandlingImage from '@/assets/blog/exception-handling-aspnetcore.jpg';

export const post: BlogPost = {
  id: 22,
  title: 'Exception Handling in ASP.NET Core — مين يمسك الـ Exception وفين؟',
  excerpt:
    'من أكتر الحاجات اللي بتتلخبط عند Backend Developers: لما يحصل Exception… مين المفروض يمسكها؟ Middleware vs IExceptionHandler vs Exception Filter vs try/catch — دليلك الشامل لمعرفة المسؤوليات وأفضل ممارسات الـ Production.',
  content: `# 🚨 Exception Handling in ASP.NET Core

## Middleware vs IExceptionHandler vs Exception Filter vs try/catch — مين يمسك الـ Exception وفين؟

من أكتر الحاجات اللي بتتلخبط عند Backend Developers في ASP.NET Core هي:

لما يحصل Exception…

**مين المفروض يمسكها؟**

هل أعمل:

\`\`\`csharp
try
{
}
catch
{
}
\`\`\`

داخل كل Service؟

ولا Controller؟

ولا أستخدم:

\`\`\`csharp
Exception Filter
\`\`\`

ولا:

\`\`\`csharp
Exception Handling Middleware
\`\`\`

ولا في .NET الحديث أستخدم:

\`\`\`csharp
IExceptionHandler
\`\`\`

وإيه علاقة كل ده بـ:

\`\`\`text
ProblemDetails
StatusCodePages
DeveloperExceptionPage
Validation Errors
Endpoint Filters
\`\`\`

الموضوع مش إن واحدة منهم "أفضل" بشكل مطلق.

الموضوع إن:

# كل Mechanism ليها Scope مختلف ومسؤولية مختلفة.

ASP.NET Core نفسه بيفرّق بين الـ middleware pipeline والـ MVC filter pipeline، وMicrosoft توصي عمومًا باستخدام middleware للـ global exception handling، بينما Exception Filters مفيدة لما التعامل مع الخطأ يعتمد تحديدًا على Controller أو Action معينة.

---

# أولًا: Exception أصلًا معناها إيه؟

قبل ما نتكلم عن Handling، لازم نفرّق بين:

\`\`\`text
Exception
\`\`\`

و:

\`\`\`text
HTTP Error Response
\`\`\`

الاتنين مش نفس الحاجة.

Exception معناها إن execution حصل فيه failure أثناء تنفيذ الكود.

مثلًا:

\`\`\`csharp
throw new InvalidOperationException(
    "Order is already paid."
);
\`\`\`

لكن:

\`\`\`http
404 Not Found
\`\`\`

مش لازم يكون حصل بسببه Exception.

ممكن Endpoint ببساطة يعمل:

\`\`\`csharp
return NotFound();
\`\`\`

وكذلك:

\`\`\`http
400 Bad Request
\`\`\`

قد يكون ناتج عن Validation عادية بدون أي Exception. ASP.NET Core عند استخدام \`[ApiController]\` يقدر يرجع ValidationProblemDetails تلقائيًا عندما يفشل model validation، بدون الحاجة لرمي exception.

إذن:

\`\`\`text
Exception ≠ HTTP Error
\`\`\`

ودي من أهم النقاط في الموضوع كله.

---

# الـ Flow الطبيعي للـ Exception

تخيل عندك:

\`\`\`text
Controller
    ↓
Application Service
    ↓
Domain
    ↓
Repository
    ↓
Database
\`\`\`

وحصل:

\`\`\`text
DbUpdateException
\`\`\`

في Repository.

لو محدش عمل لها catch:

\`\`\`text
Repository
    ↑
Service
    ↑
Controller
    ↑
MVC
    ↑
Middleware Pipeline
\`\`\`

الـ Exception بتطلع لفوق في الـ Call Stack لحد ما تلاقي Handler يقدر يمسكها، أو تفضل Unhandled. .NET نفسه بيمرر الـ exception لأعلى الـ call stack بحثًا عن handler مناسب.

السؤال الحقيقي بقى:

> فين المكان الصح اللي يمسكها؟

---

# 1️⃣ try / catch — Local Exception Handling

أبسط طريقة.

\`\`\`csharp
try
{
    await paymentGateway.ChargeAsync();
}
catch (PaymentTimeoutException ex)
{
    // handle
}
\`\`\`

لكن المشكلة مش في \`try/catch\`.

المشكلة في:

# إمتى تستخدمها؟

Microsoft توصي إنك تعمل catch لما تقدر تعمل **Recovery حقيقي** أو تسيب التطبيق في حالة معروفة؛ لو المكان نفسه مش قادر يتعامل مع الخطأ، الأفضل مايمسكوش ويسيب مستوى أعلى يتعامل معاه.

---

# مثال صحيح لـ try/catch

تخيل إنك بتعمل File Processing.

لو الملف مش موجود:

\`\`\`csharp
try
{
    return await File.ReadAllTextAsync(path);
}
catch (FileNotFoundException)
{
    return await LoadDefaultFileAsync();
}
\`\`\`

هنا حصل:

\`\`\`text
Failure
↓
Recovery
↓
Continue safely
\`\`\`

يبقى الـ catch ليها معنى.

---

# مثال تاني: Compensation

تخيل Bank Transfer:

\`\`\`text
Withdraw
↓
Deposit
\`\`\`

تم السحب…

لكن الإيداع فشل.

هنا ممكن تحتاج:

\`\`\`csharp
var transactionId = accountA.Withdraw(amount);

try
{
    accountB.Deposit(amount);
}
catch
{
    accountA.Rollback(transactionId);

    throw;
}
\`\`\`

هنا \`catch\` عملت حاجة فعلية:

\`\`\`text
Compensation
\`\`\`

وبعدها رجّعت الـ exception لفوق باستخدام:

\`\`\`csharp
throw;
\`\`\`

Microsoft توصي باستخدام \`throw;\` عند إعادة رمي نفس exception لأنه يحافظ على الـ original stack trace، بينما \`throw ex;\` يعيد بداية الـ stack trace من المكان الحالي ويفقد جزءًا من المعلومات التشخيصية.

---

# ❌ المثال الشهير الغلط

\`\`\`csharp
try
{
    await service.DoWorkAsync();
}
catch (Exception ex)
{
    logger.LogError(ex, "Failed");

    throw;
}
\`\`\`

لو بتكرر ده في كل Controller وService…

أنت غالبًا بتعمل:

\`\`\`text
Logging Everywhere
+
No Recovery
+
Lots of Boilerplate
\`\`\`

وممكن كمان تسجل نفس exception أكتر من مرة.

لو مفيش حاجة Local محتاجة تتعمل:

**سيب Global Handler يتعامل معاها.**

---

# finally

\`finally\` بيتنفذ غالبًا سواء حصل Exception أو لأ، ويُستخدم لتنظيف resources لما تحتاج cleanup صريح. Microsoft توصي باستخدام \`using\` مع \`IDisposable\` لما يكون مناسب، واستخدام \`finally\` للحالات اللي محتاجة cleanup يدوي.

مثال:

\`\`\`csharp
try
{
    connection.Open();
}
finally
{
    connection.Close();
}
\`\`\`

لكن لو الـ resource بيدعم \`IDisposable\` غالبًا:

\`\`\`csharp
using var connection = new SqlConnection(...);
\`\`\`

أنظف.

---

# Catch Specific Exceptions

بدل:

\`\`\`csharp
catch (Exception)
\`\`\`

الأفضل غالبًا:

\`\`\`csharp
catch (TimeoutException)
\`\`\`

أو:

\`\`\`csharp
catch (HttpRequestException)
\`\`\`

لأنك كده عارف بالضبط إنت بتتعامل مع إيه.

ولو عندك أكتر من catch:

الأكثر Specific لازم ييجي قبل الأكثر General، لأن C# تختار أول handler مناسب.

---

# Exception Filters في C#

خلي بالك من الاسم هنا.

في C# نفسها عندنا:

\`\`\`csharp
catch (HttpRequestException ex)
    when (ex.StatusCode == HttpStatusCode.NotFound)
{
}
\`\`\`

دي اسمها:

\`\`\`text
Exception Filter Expression
\`\`\`

باستخدام:

\`\`\`csharp
when
\`\`\`

ودي مختلفة تمامًا عن:

\`\`\`text
ASP.NET Core Exception Filter
\`\`\`

الاتنين اسمهم Filter بس حاجتين مختلفتين.

---

# 2️⃣ Exception Handling Middleware

دلوقتي وصلنا للـ Global Handling.

الـ Middleware موجودة على مستوى:

\`\`\`text
HTTP Request Pipeline
\`\`\`

والـ exception-handling middleware تقدر تمسك exceptions الخارجة من الـ middleware/components اللي بعدها في الـ pipeline. ترتيب الـ middleware مهم، وMicrosoft تعرض \`UseExceptionHandler\` في بداية الـ production pipeline عشان يقدر يلف بقية الـ pipeline ويمسك أخطاءها.

مثال:

\`\`\`csharp
app.UseExceptionHandler();
\`\`\`

مع:

\`\`\`csharp
builder.Services.AddProblemDetails();
\`\`\`

ASP.NET Core يقدر بعدها ينتج ProblemDetails للـ unhandled exceptions.

---

# الـ Flow

\`\`\`text
Request
   ↓
Exception Middleware
   ↓
Authentication
   ↓
Authorization
   ↓
Controller / Endpoint
   ↓
Service
   ↓
Database
\`\`\`

لو Service عملت:

\`\`\`text
throw
\`\`\`

الـ Exception ترجع:

\`\`\`text
Database
↑
Service
↑
Controller
↑
Exception Middleware
\`\`\`

وهناك يتم تحويلها إلى Response.

---

# ليه Middleware قوية؟

لأنها:

\`\`\`text
Global
\`\`\`

ومش مرتبطة فقط بـ MVC Controllers.

يعني ممكن تمسك errors خارجة من أجزاء لاحقة في الـ HTTP pipeline، بينما Exception Filters تعمل داخل MVC action/filter pipeline ونطاقها أضيق.

---

# Custom Exception Middleware

قبل ظهور \`IExceptionHandler\` ناس كتير كانت تعمل حاجة زي:

\`\`\`csharp
public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            context.Response.StatusCode = 404;

            await context.Response.WriteAsJsonAsync(new
            {
                error = ex.Message
            });
        }
        catch (Exception)
        {
            context.Response.StatusCode = 500;
        }
    }
}
\`\`\`

وبعدين:

\`\`\`csharp
app.UseMiddleware<ExceptionMiddleware>();
\`\`\`

ده شغال، وASP.NET Core يسمح بكتابة custom middleware لأي cross-cutting behavior في الـ request pipeline.

لكن في ASP.NET Core الحديث عندنا abstraction أنظف للـ exception handling:

# \`IExceptionHandler\`

---

# 3️⃣ IExceptionHandler

\`IExceptionHandler\` ظهر كـ structured mechanism للتعامل مع exceptions بشكل مركزي، وهو مدعوم في ASP.NET Core 8 و9 و10. الـ interface فيها method أساسية:

\`\`\`csharp
TryHandleAsync(
    HttpContext httpContext,
    Exception exception,
    CancellationToken cancellationToken)
\`\`\`

وتستخدمها ExceptionHandlerMiddleware نفسها.

---

# تسجيل Handler

\`\`\`csharp
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddProblemDetails();
\`\`\`

وبعدين:

\`\`\`csharp
app.UseExceptionHandler();
\`\`\`

تسجيل \`IExceptionHandler\` لوحده مش كفاية؛ الـ handlers يتم استدعاؤها من ExceptionHandlerMiddleware، لذلك لازم تضيف \`UseExceptionHandler\`. ولو سجلت أكتر من handler، بيتم تجربتهم بالترتيب لحد ما واحد يرجع \`true\`.

---

# مثال عملي

\`\`\`csharp
public sealed class GlobalExceptionHandler
    : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService;

    public GlobalExceptionHandler(
        IProblemDetailsService problemDetailsService)
    {
        _problemDetailsService = problemDetailsService;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var statusCode = exception switch
        {
            NotFoundException =>
                StatusCodes.Status404NotFound,

            ValidationException =>
                StatusCodes.Status400BadRequest,

            ConflictException =>
                StatusCodes.Status409Conflict,

            TimeoutException =>
                StatusCodes.Status503ServiceUnavailable,

            _ =>
                StatusCodes.Status500InternalServerError
        };

        httpContext.Response.StatusCode = statusCode;

        return await _problemDetailsService.TryWriteAsync(
            new ProblemDetailsContext
            {
                HttpContext = httpContext,
                ProblemDetails =
                {
                    Status = statusCode,
                    Title = GetTitle(exception)
                },
                Exception = exception
            });
    }

    private static string GetTitle(Exception exception)
        => exception switch
        {
            NotFoundException => "Resource not found",
            ValidationException => "Validation failed",
            ConflictException => "Conflict",
            _ => "Unexpected server error"
        };
}
\`\`\`

---

# ليه IExceptionHandler ممتاز؟

لأنه بيفصل:

\`\`\`text
Exception Detection
\`\`\`

عن:

\`\`\`text
Exception Mapping
\`\`\`

عن:

\`\`\`text
Response Formatting
\`\`\`

وكمان تقدر تعمل أكتر من Handler.

مثال:

\`\`\`text
ValidationExceptionHandler

DomainExceptionHandler

InfrastructureExceptionHandler

FallbackExceptionHandler
\`\`\`

ويتم استدعاؤهم بالترتيب حتى يقوم أحدهم بمعالجة الـ exception ويرجع \`true\`.

---

# مثال Multi Handler

\`\`\`csharp
builder.Services.AddExceptionHandler<ValidationExceptionHandler>();

builder.Services.AddExceptionHandler<DomainExceptionHandler>();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
\`\`\`

Flow:

\`\`\`text
ValidationException
      ↓
ValidationExceptionHandler
      ↓
handled = true
      ↓
Stop
\`\`\`

لكن:

\`\`\`text
Unknown Exception
      ↓
Validation Handler → false
      ↓
Domain Handler → false
      ↓
Global Handler → true
\`\`\`

وده Pattern نظيف جدًا للـ APIs الكبيرة.

---

# نقطة مهمة في .NET 10

ابتداءً من ASP.NET Core في .NET 10، لو \`IExceptionHandler.TryHandleAsync\` رجع \`true\`، الـ exception-handler middleware ما بيسجلش diagnostics الخاصة بالـ handled exception بشكل افتراضي. تقدر تغير السلوك ده من خلال \`ExceptionHandlerOptions.SuppressDiagnosticsCallback\`.

مثال لو عايز تفضل تسجلها:

\`\`\`csharp
app.UseExceptionHandler(new ExceptionHandlerOptions
{
    SuppressDiagnosticsCallback = context => false
});
\`\`\`

دي نقطة مهمة جدًا لو عندك:

\`\`\`text
Application Insights
OpenTelemetry
Seq
ELK
\`\`\`

وبتتساءل ليه handled exceptions اختفت من telemetry بعد التحديث.

---

# 4️⃣ Exception Filter في ASP.NET Core MVC

دلوقتي ندخل MVC Filter Pipeline.

Exception Filter بتطبق:

\`\`\`csharp
IExceptionFilter
\`\`\`

أو:

\`\`\`csharp
IAsyncExceptionFilter
\`\`\`

وتقدر تمسك exceptions داخل نطاق MVC/Controller execution. Microsoft توضح إن exception filters لها نطاق أضيق من middleware، ولا تلتقط exceptions الخارجة من كل مراحل الـ request pipeline؛ ولهذا توصي باستخدام middleware للـ general error handling، والـ filters لما التعامل يختلف حسب الـ action.

---

# مثال

\`\`\`csharp
public sealed class ApiExceptionFilter
    : IExceptionFilter
{
    public void OnException(
        ExceptionContext context)
    {
        if (context.Exception is NotFoundException ex)
        {
            context.Result =
                new NotFoundObjectResult(
                    new ProblemDetails
                    {
                        Status = 404,
                        Title = ex.Message
                    });

            context.ExceptionHandled = true;
        }
    }
}
\`\`\`

تسجيله Globally:

\`\`\`csharp
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ApiExceptionFilter>();
});
\`\`\`

أو ممكن تطبقه على Controller/Action حسب نوع التسجيل والـ attribute/filter factory المناسب.

---

# Exception Filter بتشتغل فين؟

تقريبًا:

\`\`\`text
Middleware
    ↓
Routing
    ↓
MVC
    ↓
Filters
    ↓
Controller Action
\`\`\`

فالـ Exception Filter موجودة:

\`\`\`text
جوه MVC
\`\`\`

مش حوالي الـ Pipeline كلها.

Microsoft توضح إن exception filters لا تلتقط exceptions من middleware execution أو routing، ولها execution boundaries محددة داخل MVC.

---

# أفضل Scenario للـ Exception Filter

تخيل System فيه:

\`\`\`text
API Controllers
+
MVC Views
\`\`\`

ومحتاج:

API Actions:

\`\`\`text
JSON ProblemDetails
\`\`\`

لكن MVC Actions:

\`\`\`text
HTML Error Page
\`\`\`

هنا Action/Controller-specific behavior ممكن يخلي Exception Filter منطقية.

Microsoft نفسها تستخدم السيناريو ده كمثال على الحالات المناسبة للـ Exception Filters.

---

# Middleware vs Exception Filter

الفرق الأساسي:

|                          | Exception Middleware    | Exception Filter              |
| ------------------------ | ----------------------- | ----------------------------- |
| المكان                   | HTTP Pipeline           | MVC Filter Pipeline           |
| Scope                    | أوسع                    | Controller / Action           |
| Minimal APIs             | نعم                     | لا كـ MVC Exception Filter    |
| Controllers              | نعم                     | نعم                           |
| Middleware Exceptions    | ممكن لو حصلت downstream | لا                            |
| Action-specific behavior | ممكن لكن أقل أناقة      | ممتاز                         |
| Global API Handling      | ممتاز                   | أقل مرونة                     |
| توصية Microsoft          | الخيار العام المفضل     | عند اختلاف التعامل حسب Action |

Microsoft تنص صراحةً على أن middleware أكثر مرونة، وتوصي بها عمومًا للـ exception handling، مع استخدام Exception Filters عندما يختلف error handling حسب الـ action.

---

# 5️⃣ Endpoint Filters

في Minimal APIs عندنا:

\`\`\`text
Endpoint Filters
\`\`\`

تقدر تشغل code:

\`\`\`text
Before Endpoint
After Endpoint
\`\`\`

وتفحص arguments أو تعدل النتيجة.

هي مفيدة في:

\`\`\`text
Validation
Logging
API Version Checks
Endpoint-specific cross-cutting logic
\`\`\`

Microsoft توضح إن Minimal API endpoint filters معمولة لتنفيذ logic قبل وبعد endpoint handler وفحص/تعديل parameters والresponse behavior.

مثال:

\`\`\`csharp
app.MapPost("/orders",
    async (CreateOrderRequest request) =>
    {
        // ...
    })
.AddEndpointFilter(async (context, next) =>
{
    // before

    var result = await next(context);

    // after

    return result;
});
\`\`\`

---

# هل نستخدم Endpoint Filter كـ Global Exception Handler؟

ممكن technically تعمل:

\`\`\`csharp
try
{
    return await next(context);
}
catch
{
}
\`\`\`

لكن ده مش الاختيار العام الأفضل.

توثيق Microsoft عند الانتقال من Controllers إلى Minimal APIs يقترح استبدال Exception Filters بـ **exception handling middleware**، بينما Endpoint Filters أقرب للـ action filters والـ endpoint-specific behavior.

---

# 6️⃣ ProblemDetails

واحدة من أكتر الحاجات اللي بتتلخبط:

\`\`\`text
ProblemDetails
\`\`\`

مش Exception Handler.

هي:

# Standard Error Response Format

يعني بعد ما تقرر:

\`\`\`text
Exception → 404
\`\`\`

أو:

\`\`\`text
Exception → 409
\`\`\`

إزاي شكل الـ response يكون؟

ASP.NET Core يوفر \`ProblemDetails\` و\`IProblemDetailsService\` لتوليد responses منظمة لأخطاء HTTP، ويمكن تفعيل الخدمة باستخدام \`AddProblemDetails\`.

---

# مثال Response

\`\`\`json
{
  "type": "https://api.example.com/errors/order-not-found",
  "title": "Order not found",
  "status": 404,
  "detail": "Order 500 does not exist.",
  "instance": "/orders/500",
  "traceId": "..."
}
\`\`\`

ده أحسن من:

\`\`\`json
{
  "error": "something went wrong"
}
\`\`\`

لأن الـ client عنده Contract واضح.

---

# Setup

\`\`\`csharp
builder.Services.AddProblemDetails();

app.UseExceptionHandler();

app.UseStatusCodePages();
\`\`\`

ASP.NET Core يقدر يستخدم \`IProblemDetailsService\` مع ExceptionHandlerMiddleware وStatusCodePagesMiddleware لتوليد ProblemDetails responses.

---

# Customize ProblemDetails

ممكن تضيف:

\`\`\`csharp
builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions["traceId"]
            = context.HttpContext.TraceIdentifier;
    };
});
\`\`\`

ASP.NET Core يسمح بتخصيص ProblemDetails عبر \`CustomizeProblemDetails\` أو custom \`IProblemDetailsWriter\`.

---

# ProblemDetailsFactory

لو بتستخدم MVC Controllers، عندك كمان:

\`\`\`text
ProblemDetailsFactory
\`\`\`

MVC بتستخدمها لإنشاء:

\`\`\`text
ProblemDetails
ValidationProblemDetails
\`\`\`

في حالات client errors وvalidation failures و\`ControllerBase.Problem()\`.

دي useful لو عايز customization عميق خاص بالـ MVC.

---

# 7️⃣ Status Code Pages

تخيل:

\`\`\`csharp
return NotFound();
\`\`\`

مفيش Exception حصلت.

الـ response status:

\`\`\`text
404
\`\`\`

لكن الـ body فاضي.

هنا:

\`\`\`csharp
app.UseStatusCodePages();
\`\`\`

تقدر تولد Body مناسب للـ 4xx و5xx responses اللي مفيهاش body.

Status Code Pages Middleware تتعامل مع responses بين 400 و599 اللي لم يُكتب لها body، وتقدر تستخدم ProblemDetails تلقائيًا لو service متاحة.

إذن:

\`\`\`text
ExceptionHandler
\`\`\`

لـ Exceptions.

لكن:

\`\`\`text
StatusCodePages
\`\`\`

لـ Error Status Codes اللي ممكن ميبقاش وراها Exception أصلًا.

فرق مهم جدًا.

---

# 8️⃣ DeveloperExceptionPage

أثناء Development، محتاج تشوف:

\`\`\`text
Stack Trace
Exception Details
Request Information
\`\`\`

هنا:

\`\`\`csharp
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
\`\`\`

Developer Exception Page مخصصة للتطوير وعرض تفاصيل runtime exceptions. في Production لازم ما تعرضش sensitive exception details للمستخدم.

---

# 9️⃣ Validation Errors

واحدة من أكبر الأخطاء المعمارية:

User يبعث:

\`\`\`text
Email = ""
\`\`\`

فتعمل:

\`\`\`csharp
throw new ValidationException();
\`\`\`

في كل Validation.

مش لازم.

Validation Failure المتوقع غالبًا جزء طبيعي من Request lifecycle.

لو عندك:

\`\`\`csharp
[ApiController]
\`\`\`

ASP.NET Core Controllers تقدر تعمل automatic model validation وترجع \`400 Bad Request\` مع \`ValidationProblemDetails\`.

مثال:

\`\`\`csharp
public sealed record CreateUserRequest(
    [Required] string Email);
\`\`\`

لو Email ناقصة:

\`\`\`text
400
\`\`\`

بدون رمي Exception.

---

# Exception vs Validation Result

فكر كده:

\`\`\`text
Expected invalid input
\`\`\`

غالبًا:

\`\`\`text
Validation Result
\`\`\`

لكن:

\`\`\`text
Unexpected failure during execution
\`\`\`

غالبًا:

\`\`\`text
Exception
\`\`\`

.NET guidance نفسها تنصح بتجنب استخدام exceptions في الحالات الطبيعية والمتوقعة قدر الإمكان، واستخدامها للحالات exceptional بدل flow control العادي.

---

# 10️⃣ Custom Exceptions

Custom Exceptions مفيدة لما عندك Concept مهم في الـ Domain.

مثل:

\`\`\`csharp
public sealed class OrderAlreadyPaidException
    : Exception
{
    public OrderAlreadyPaidException(Guid orderId)
        : base($"Order '{orderId}' is already paid.")
    {
    }
}
\`\`\`

أو:

\`\`\`csharp
InsufficientBalanceException
\`\`\`

لكن متعملش Custom Exception لكل Error صغير.

.NET guidelines توصي باستخدام exception types الموجودة مسبقًا لما تكون مناسبة، وإنشاء custom type لما existing types لا تعبر عن المشكلة بشكل مناسب.

---

# Domain Exception ولا Result Pattern؟

دي Architecture Decision.

ممكن الـ Domain يعمل:

\`\`\`csharp
throw new InsufficientBalanceException();
\`\`\`

وممكن يعمل:

\`\`\`csharp
return Result.Failure(
    Error.InsufficientBalance);
\`\`\`

مفيش حل عالمي واحد.

لو الـ Business failure:

\`\`\`text
Expected frequently
\`\`\`

زي:

\`\`\`text
Coupon expired
Balance insufficient
Seat unavailable
\`\`\`

فـ Result Pattern أحيانًا يكون أوضح لأنه بيخلي failure جزء من الـ method contract.

لكن لو failure فعلًا exceptional بالنسبة للعملية:

Exception ممكن تكون منطقية.

المهم:

# متستخدمش Exceptions كـ if/else مكلفة.

---

# 11️⃣ Exception Mapping إلى HTTP

واحدة من أهم مسؤوليات Global Handler:

\`\`\`text
Domain / Application Error

↓

HTTP Semantics
\`\`\`

مثلًا:

| الحالة                             | Response محتمل |
| ---------------------------------- | -------------: |
| Invalid request                    |            400 |
| Unauthenticated                    |            401 |
| Authenticated but forbidden        |            403 |
| Resource missing                   |            404 |
| Real state conflict                |            409 |
| Dependency temporarily unavailable |            503 |
| Unexpected bug                     |            500 |

المهم جدًا:

\`409 Conflict\`

مش معناها:

> أي Exception حصلت وأنا بعمل Update.

409 تستخدم لما فيه conflict حقيقي في حالة الـ resource/request.

لو Redis وقع مثلًا…

دي:

\`\`\`text
Infrastructure Failure
\`\`\`

مش:

\`\`\`text
Business Conflict
\`\`\`

---

# مثال Handler أنضف

\`\`\`csharp
public sealed class DomainExceptionHandler
    : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetails;

    public DomainExceptionHandler(
        IProblemDetailsService problemDetails)
    {
        _problemDetails = problemDetails;
    }

    public ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var result = exception switch
        {
            OrderNotFoundException =>
                (404, "Order not found"),

            OrderAlreadyPaidException =>
                (409, "Order already paid"),

            InsufficientBalanceException =>
                (409, "Insufficient balance"),

            _ => (0, string.Empty)
        };

        if (result.Item1 == 0)
            return ValueTask.FromResult(false);

        context.Response.StatusCode = result.Item1;

        return _problemDetails.TryWriteAsync(
            new ProblemDetailsContext
            {
                HttpContext = context,
                Exception = exception,
                ProblemDetails =
                {
                    Status = result.Item1,
                    Title = result.Item2
                }
            });
    }
}
\`\`\`

لو مش Domain Exception:

\`\`\`text
return false
\`\`\`

وتسيب Handler بعدها يحاول.

---

# 12️⃣ ExceptionHandlerOptions.StatusCodeSelector

في ASP.NET Core الحديث تقدر تعمل mapping بسيط للـ exception إلى status code من \`ExceptionHandlerOptions.StatusCodeSelector\`.

مثلًا:

\`\`\`csharp
app.UseExceptionHandler(new ExceptionHandlerOptions
{
    StatusCodeSelector = exception =>
        exception is TimeoutException
            ? StatusCodes.Status503ServiceUnavailable
            : StatusCodes.Status500InternalServerError
});
\`\`\`

مناسب لما الـ mapping بسيط.

لكن لو عندك:

\`\`\`text
Multiple Exception Types
Logging Rules
Problem Details Extensions
Domain-specific handling
\`\`\`

\`IExceptionHandler\` غالبًا أوضح.

---

# 13️⃣ Authentication & Authorization Errors

دي نقطة مهمة:

مش كل:

\`\`\`text
401
403
\`\`\`

لازم يطلع Exception.

Authentication / Authorization middleware والـ policies بتتعامل مع ده كجزء من الـ pipeline الطبيعي.

مثال:

\`\`\`text
No valid identity
→ 401

Identity exists but lacks permission
→ 403
\`\`\`

متعملش:

\`\`\`csharp
throw new UnauthorizedAccessException();
\`\`\`

عشان تستخدمه بدل authorization system الطبيعي لمجرد إن المستخدم مش مسموح له بالـ endpoint.

---

# 14️⃣ Cancellation مش Failure عادي

تخيل Client عمل:

\`\`\`text
Cancel Request
\`\`\`

أو قفل الاتصال.

وقد ينتج:

\`\`\`text
OperationCanceledException
TaskCanceledException
\`\`\`

.NET guidance بتتعامل مع cancellation بشكل منفصل، وبتوصي بالتعامل معها باعتبارها cancellation semantics بدل ما تتعامل معاها تلقائيًا كـ unexpected server bug.

مثلًا:

\`\`\`csharp
catch (OperationCanceledException)
    when (cancellationToken.IsCancellationRequested)
{
    throw;
}
\`\`\`

متروحش تسجل كل client cancellation:

\`\`\`text
Critical Error 🚨
\`\`\`

بدون تمييز.

---

# 15️⃣ BackgroundService Exceptions

كل اللي فات متعلق أساسًا بـ:

\`\`\`text
HTTP Pipeline
\`\`\`

لكن لو Exception حصلت جوه:

\`\`\`text
BackgroundService
Worker
Message Consumer
Hangfire Job
Queue Handler
\`\`\`

Exception Middleware مش هتمسكها؛ لأنها مش جوه HTTP Request Pipeline.

هنا لازم الـ Worker نفسه أو framework المسؤول عن الـ background jobs يكون عنده strategy لـ:

\`\`\`text
Retries
Dead Letter Queue
Logging
Recovery
Idempotency
\`\`\`

ودي Architecture مختلفة تمامًا عن HTTP exception handling.

---

# 16️⃣ Exception Filter vs Action Filter

Exception Filter:

\`\`\`text
Exception حصلت
↓
Handle Exception
\`\`\`

Action Filter:

\`\`\`text
Before Action
↓
Action
↓
After Action
\`\`\`

Action filters تقدر تشوف exception خارجة من action execution في سياقها، لكن الـ Exception Filter معمولة تحديدًا لسياسات exceptions داخل MVC. ASP.NET Core يوفر أنواع filters متعددة لكل stage، والـ exception filters لها stage خاص بها.

---

# 17️⃣ Resource Filter و Result Filter

Resource Filter:

مفيد لحاجات زي:

\`\`\`text
Caching
Short Circuiting
\`\`\`

قبل معظم الـ MVC pipeline.

Result Filter:

يشتغل حوالين:

\`\`\`text
IActionResult execution
\`\`\`

ومش معمول أساسًا عشان global exception handling.

ASP.NET Core يحدد لكل filter stage دور مختلف؛ Result Filters مثلًا تحيط بتنفيذ الـ Action Result، بينما Resource Filters تلف معظم الـ filter pipeline.

---

# 18️⃣ Logging — أسجل فين؟

مشكلة مشهورة:

Repository:

\`\`\`text
Log Error
\`\`\`

Service:

\`\`\`text
Log Error
\`\`\`

Controller:

\`\`\`text
Log Error
\`\`\`

Middleware:

\`\`\`text
Log Error
\`\`\`

نفس Exception:

\`\`\`text
4 Logs 😅
\`\`\`

الأفضل يكون عندك Ownership واضح.

Global unexpected exception:

غالبًا Global Handler أو observability pipeline تسجلها مرة بمعلومات:

\`\`\`text
TraceId
Request Path
Exception Type
Correlation Id
\`\`\`

لكن لو Local Layer عندها Context فريد ومهم لا يمكن إضافته في الأعلى، ممكن تضيف structured contextual logging ثم تعيد الرمي.

وفي .NET 10 خليك واعي إن handled \`IExceptionHandler\` exceptions يتم suppress diagnostics لها افتراضيًا كما ذكرنا فوق.

---

# 19️⃣ ما تبعتش Exception Message للـ Client عمياني

خطأ:

\`\`\`csharp
Detail = exception.ToString();
\`\`\`

Production response ممكن يكشف:

\`\`\`text
Database details
File paths
Stack traces
Connection information
Internal class names
\`\`\`

المستخدم يحتاج:

\`\`\`text
Safe Error Contract
\`\`\`

والـ developer يحتاج التفاصيل في:

\`\`\`text
Logs / Traces
\`\`\`

دول حاجتين مختلفتين.

DeveloperExceptionPage معمولة للتطوير، بينما Production exception handling المفروض ينتج response آمن بدل تفاصيل runtime الداخلية.

---

# 20️⃣ أفضل Architecture لمشروع ASP.NET Core API حديث

في أغلب APIs المتوسطة والكبيرة، أنا أفضل Structure زي:

\`\`\`text
Domain
   ↓
throws meaningful domain exceptions
or returns Result

Application
   ↓
orchestrates use cases

Infrastructure
   ↓
may throw technical exceptions

API
   ↓
IExceptionHandler
   ↓
ProblemDetails
   ↓
HTTP Response
\`\`\`

مع:

\`\`\`csharp
builder.Services.AddProblemDetails();

builder.Services.AddExceptionHandler<DomainExceptionHandler>();

builder.Services.AddExceptionHandler<InfrastructureExceptionHandler>();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
\`\`\`

ثم:

\`\`\`csharp
app.UseExceptionHandler();

app.UseStatusCodePages();

app.MapControllers();
\`\`\`

\`IExceptionHandler\` يتم تشغيلها من ExceptionHandlerMiddleware بالترتيب الذي تم تسجيلها به، و\`AddProblemDetails\` يوفر service موحدة لبناء HTTP error responses.

---

# Example كامل

## Domain

\`\`\`csharp
public sealed class Order
{
    public bool IsPaid { get; private set; }

    public void Pay()
    {
        if (IsPaid)
            throw new OrderAlreadyPaidException();

        IsPaid = true;
    }
}
\`\`\`

## Controller

\`\`\`csharp
[HttpPost("{id}/pay")]
public async Task<IActionResult> Pay(
    Guid id,
    CancellationToken cancellationToken)
{
    await _orderService.PayAsync(
        id,
        cancellationToken);

    return NoContent();
}
\`\`\`

لاحظ:

مفيش:

\`\`\`csharp
try/catch
\`\`\`

في Controller.

---

## Service

\`\`\`csharp
public async Task PayAsync(
    Guid id,
    CancellationToken cancellationToken)
{
    var order =
        await _repository.GetByIdAsync(
            id,
            cancellationToken);

    if (order is null)
        throw new OrderNotFoundException(id);

    order.Pay();

    await _repository.SaveChangesAsync(
        cancellationToken);
}
\`\`\`

برضه مفيش:

\`\`\`text
catch → return 404
\`\`\`

لأن Service مش المفروض تعرف:

\`\`\`text
HTTP 404
\`\`\`

دي مسؤولية API Layer.

---

## Handler

\`\`\`csharp
public sealed class DomainExceptionHandler
    : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetails;

    public DomainExceptionHandler(
        IProblemDetailsService problemDetails)
    {
        _problemDetails = problemDetails;
    }

    public ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var response = exception switch
        {
            OrderNotFoundException =>
                new ProblemDetails
                {
                    Status = 404,
                    Title = "Order not found"
                },

            OrderAlreadyPaidException =>
                new ProblemDetails
                {
                    Status = 409,
                    Title = "Order is already paid"
                },

            _ => null
        };

        if (response is null)
            return ValueTask.FromResult(false);

        context.Response.StatusCode =
            response.Status!.Value;

        return _problemDetails.TryWriteAsync(
            new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = response,
                Exception = exception
            });
    }
}
\`\`\`

---

# السيناريو النهائي

\`\`\`text
POST /orders/10/pay
        ↓
Controller
        ↓
Application Service
        ↓
Order.Pay()
        ↓
OrderAlreadyPaidException
        ↑
Application
        ↑
Controller
        ↑
ExceptionHandlerMiddleware
        ↓
DomainExceptionHandler
        ↓
409 Conflict
        ↓
ProblemDetails
\`\`\`

الـ Domain:

\`\`\`text
لا يعرف HTTP
\`\`\`

الـ Controller:

\`\`\`text
لا يعمل try/catch everywhere
\`\`\`

والـ API Layer:

\`\`\`text
مسؤولة عن Translation
Domain → HTTP
\`\`\`

وده Separation نظيف.

---

# طب أستخدم إيه في كل حالة؟

| السيناريو                             | الاختيار الأنسب غالبًا                       |
| ------------------------------------- | -------------------------------------------- |
| تقدر تعمل Recovery في نفس المكان      | \`try/catch\`                                  |
| محتاج rollback / compensation         | \`try/catch + throw;\`                         |
| Global exception handling للـ API     | \`UseExceptionHandler + IExceptionHandler\`    |
| Mapping exceptions لـ ProblemDetails  | \`IExceptionHandler + IProblemDetailsService\` |
| كل Controllers محتاجة نفس handling    | Middleware / \`IExceptionHandler\`             |
| Action معينة لها error behavior مختلف | Exception Filter                             |
| Minimal API endpoint-specific logic   | Endpoint Filter                              |
| 404/400 Response بدون Exception       | StatusCodePages / Results                    |
| Model validation                      | Validation / \`[ApiController]\`               |
| Development diagnostics               | DeveloperExceptionPage                       |
| Background Worker                     | Worker-specific retry/error strategy         |
| Normal expected business failure      | Result Pattern أحيانًا أفضل                  |
| Unexpected system failure             | Exception + global handler                   |

---

# أخطاء شائعة جدًا 🚨

أول خطأ هو إنك تعمل:

\`\`\`csharp
try
{
}
catch (Exception ex)
{
    return BadRequest(ex.Message);
}
\`\`\`

في كل Controller.

ده بيحوّل:

\`\`\`text
Database Failure
NullReferenceException
Bug
Timeout
\`\`\`

كلهم إلى:

\`\`\`text
400 Bad Request
\`\`\`

وده غلط Semantically.

الـ Client مش هو السبب في كل حاجة.

---

الخطأ الثاني:

\`\`\`text
catch Exception
→ ignore
→ continue
\`\`\`

ده ممكن يسيب التطبيق في State غير معروفة. .NET guidance صريحة إنك ما تمسكش exception إلا لو تقدر تتعامل معها وتحافظ على state معروفة.

---

الخطأ الثالث:

\`\`\`csharp
catch (Exception ex)
{
    throw ex;
}
\`\`\`

الأصح:

\`\`\`csharp
throw;
\`\`\`

عشان تحافظ على الـ stack trace الأصلي.

---

الخطأ الرابع:

استخدام Exception لكل Validation.

\`\`\`text
Name required
Email invalid
Password too short
\`\`\`

دي failures متوقعة.

مش لازم تعمل exception flow كامل لكل واحدة.

---

الخطأ الخامس:

كل Infrastructure Error يتحول:

\`\`\`text
409 Conflict
\`\`\`

لو Redis وقع أو Database timeout حصل:

دي مش Business Conflict.

---

# Rule of Thumb 🧠

ممكن تحفظها بالشكل ده:

\`\`\`text
Can I recover here?
        │
       YES
        ↓
    try/catch

       NO
        ↓
Let it bubble up
        ↓
Global Exception Handler
        ↓
Map exception
        ↓
ProblemDetails
        ↓
HTTP Response
\`\`\`

ولو مفيش Exception أصلًا:

\`\`\`text
Expected Validation / Not Found / Forbidden
        ↓
Return Result / HTTP Response normally
\`\`\`

---

# الخلاصة

أهم حاجة تخرج بيها إن:

\`\`\`text
Exception
\`\`\`

هي المشكلة اللي حصلت.

لكن:

\`\`\`text
try/catch
Exception Filter
Exception Middleware
IExceptionHandler
\`\`\`

دي أماكن وآليات مختلفة للتعامل معاها.

\`try/catch\` استخدمها لما تقدر تعمل **Recovery حقيقي**.

\`Exception Filter\` استخدمها لما الـ handling مرتبط بـ **Controller أو Action معينة**.

\`Exception Handling Middleware\` هي الطبقة العامة اللي بتحيط بالـ HTTP pipeline.

\`IExceptionHandler\` هي طريقة منظمة وحديثة لبناء **Global Exception Handling** فوق ExceptionHandlerMiddleware في ASP.NET Core الحديث.

\`ProblemDetails\` مش Handler…

هي:

**شكل الـ Error Response.**

و\`StatusCodePages\` مش للـ Exceptions فقط…

هي للـ HTTP Error Status Codes اللي مفيهاش Body.

أما Validation Errors فلازم تسأل نفسك الأول:

> هل ده فعلًا Exception؟

ولا مجرد:

\`\`\`text
Expected invalid request?
\`\`\`

أفضل Error Handling Architecture مش اللي فيها أكبر عدد من:

\`\`\`text
try/catch
\`\`\`

لكن اللي تعرف بوضوح:

# مين مسؤول عن الخطأ… وفين يتحول من Technical Failure إلى Meaningful Response.

لأن الـ Production System الجيد مش النظام اللي مفيهوش Exceptions.

هو النظام اللي لما Exception تحصل…

**يعرف يتعامل معاها في المكان الصح، يسجلها بالشكل الصح، ويرجع للـ Client المعنى الصح.** 🚀
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-23',
  category: 'Backend',
  readTime: '15 min read',
  image: exceptionHandlingImage,
  featured: true,
};
