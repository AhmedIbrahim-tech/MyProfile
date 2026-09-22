import type { BlogPost } from '@/modules/blog/types';
import efCoreTimestampsImage from '@/assets/blog/ef-core-timestamps.jpg';

export const post: BlogPost = {
  id: 22,
  title: 'Automating Timestamps with EF Core ChangeTracker',
  excerpt:
    'CreatedAt وUpdatedAt مش Business Logic. خلي ChangeTracker والـ Interceptor يكتبوا الـ Timestamps مرة واحدة، بدل ما كل Service تكرر نفس الكود وتنساه.',
  content: `# Automating Timestamps with EF Core ChangeTracker

في أي Backend Application تقريبًا هتلاقي نفسك محتاج تحفظ معلومات زي: إمتى الـ Record اتعمل؟ آخر مرة اتعدل فيها إمتى؟ مين عدله؟ هل هو Deleted ولا لأ؟

في البداية أغلبنا بيعمل حاجة زي:

\`\`\`csharp
product.CreatedAt = DateTime.UtcNow;
product.UpdatedAt = DateTime.UtcNow;
\`\`\`

داخل كل Service. الكود هيشتغل… لكن مع الوقت هتظهر مشكلة: كل Entity جديدة تحتاج نفس الـ Logic. كل Developer ممكن ينسى يحط \`UpdatedAt\` في مكان معين. وبعد فترة تلاقي الـ Audit Data ناقصة.

Repeated code. Easy to forget. Inconsistent. Not maintainable as the project grows.

---

## المشكلة الحقيقية

تخيل عندك Products وOrders وCustomers وInvoices وPayments. وكل واحدة تحتاج \`CreatedAt\` و\`UpdatedAt\`.

هل منطقي إن كل Service تعمل \`entity.UpdatedAt = DateTime.UtcNow;\` بنفسها؟ غالبًا لا. لأن دي مش Business Logic. دي **Infrastructure Concern**.

---

## هنا يأتي دور EF Core ChangeTracker

واحدة من أقوى Features في EF Core هي **ChangeTracker**: الجزء المسؤول عن متابعة حالة الـ Entities داخل الـ DbContext.

EF Core يعرف هل الـ Entity \`Added\` أو \`Modified\` أو \`Deleted\` أو \`Unchanged\`.

\`\`\`csharp
_context.Products.Update(product);
\`\`\`

قبل \`SaveChanges()\`، EF Core يسجل: Product State = Modified.

التدفق:

Entity Change → ChangeTracker يكتشف اللي اتغير → SaveChanges Interceptor يعدّل الـ Timestamps قبل الحفظ → Database بتتحفظ بالبيانات الصحيحة.

---

## الفكرة

بدل ما كل مكان يعدل الـ Timestamp، نخلي مكان واحد فقط مسؤول عن ذلك.

قبل حفظ البيانات نمر على كل الـ Entities التي تم تغييرها:

- **Added:** \`CreatedAt = now\` و\`UpdatedAt = now\`
- **Modified:** \`UpdatedAt = now\`

---

## الطريقة الأولى: Override SaveChanges

أبسط طريقة: تعمل Override داخل DbContext. ولو بتستخدم Async، غطّي الاتنين.

\`\`\`csharp
public override int SaveChanges()
{
    UpdateTimestamps();
    return base.SaveChanges();
}

public override Task<int> SaveChangesAsync(
    CancellationToken cancellationToken = default)
{
    UpdateTimestamps();
    return base.SaveChangesAsync(cancellationToken);
}

private void UpdateTimestamps()
{
    var entries = ChangeTracker.Entries<IAuditableEntity>();

    foreach (var entry in entries)
    {
        if (entry.State == EntityState.Added)
        {
            entry.Entity.CreatedAt = DateTime.UtcNow;
            entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        else if (entry.State == EntityState.Modified)
        {
            entry.Entity.UpdatedAt = DateTime.UtcNow;
            entry.Property(x => x.CreatedAt).IsModified = false;
        }
    }
}
\`\`\`

أي Entity تنفّذ \`IAuditableEntity\` تحصل على Timestamp تلقائيًا. بدون تكرار.

للمشاريع الصغيرة: ممتاز. لكن في الأنظمة الكبيرة يوجد حل أنظف.

---

## EF Core SaveChanges Interceptor

EF Core يوفر \`SaveChangesInterceptor\`. يسمح لك بالتدخل قبل أو بعد \`SaveChanges\` و\`SaveChangesAsync\` بدون وضع Logic داخل DbContext نفسه.

\`\`\`csharp
public class AuditingInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static void ApplyAudit(DbContext? context)
    {
        if (context is null) return;

        foreach (var entry in context.ChangeTracker.Entries<IAuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
\`\`\`

التسجيل:

\`\`\`csharp
services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
    options.AddInterceptors(new AuditingInterceptor());
});
\`\`\`

---

## لماذا Interceptor أفضل أحيانًا؟

لأنه يفصل DbContext عن Audit Logic.

DbContext مسؤول عن Database Access. Interceptor مسؤول عن Timestamps وAudit Logs وSoft Delete وUser Tracking. وده أقرب لمبدأ **Single Responsibility**.

---

## مثال Production أكثر

عادة يكون عندك Contract واضح:

\`\`\`csharp
public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
    string? CreatedBy { get; set; }
    string? UpdatedBy { get; set; }
    bool IsDeleted { get; set; }
}
\`\`\`

ثم الـ Interceptor يعرف المستخدم الحالي من \`CurrentUserService\` ويعمل \`CreatedBy\` و\`UpdatedBy\` تلقائيًا.

نفس الآلية تقدر تستخدمها لـ Soft Delete، وAudit Logs بالقيم القديمة والجديدة، وMulti-tenant، ومن غير ما تربطها بـ Entity واحدة بس.

---

## نقطة مهمة: استخدم UTC

غلط شائع: \`DateTime.Now\`. لأن السيرفر ممكن يكون UTC أو Time Zone مختلفة أو Cloud Region مختلفة.

الأفضل: \`DateTime.UtcNow\`. وخلي الـ Presentation Layer تحول الوقت للمستخدم.

---

## ماذا عن UpdatedAt عند الـ Query؟

بعض الناس تعمل \`UpdatedAt = DateTime.Now\` داخل الـ Entity Setter. لكن المشكلة: ليس كل تعديل يعني Database Update. ممكن تغير قيمة مؤقتة.

الأصح أن التحديث يحدث وقت Persistence: يعني قبل \`SaveChanges\`.

---

## ChangeTracker و Soft Delete

نفس الفكرة تستخدم في Soft Delete. بدل \`DELETE FROM Products\` تعمل \`IsDeleted = true\`.

قبل الحفظ: لو Entity حالتها \`EntityState.Deleted\`، حولها إلى \`EntityState.Modified\` وضع \`IsDeleted = true\`.

---

## ChangeTracker و Audit Logs

تستطيع تسجيل من غير ما تعدل كل Service. قبل الحفظ اقرأ \`ChangeTracker.Entries()\` وسجّل UserId وEntityName وOldValue وNewValue وChangedAt في جدول AuditLogs.

---

## انتبه لمشكلة مهمة

ChangeTracker يتابع فقط الـ Entities الموجودة داخل الـ DbContext الحالي.

يعني لو استخدمت \`ExecuteUpdate()\` أو \`ExecuteDelete()\` في EF Core، هذه العمليات تتخطى ChangeTracker. لذلك لا تعتمد عليه لكل أنواع التعديلات، واعرف متى تستخدم Bulk Operations.

خلي Auditing في الـ Infrastructure، مش جوّه Domain Entities.

---

## هل نضع كل شيء داخل BaseEntity؟

ليس دائمًا. \`CreatedAt\` و\`UpdatedAt\` غالبًا مناسبة لكل Entities. لكن \`CreatedBy\` و\`ApprovedBy\` و\`DeletedBy\` قد تكون Business Requirements وليس مجرد Audit.

لا تخلط Business Data مع Technical Audit Data بدون تفكير.

---

## Architecture مقترحة

في مشروع متوسط أو كبير:

\`\`\`text
Domain
 └── Entities

Infrastructure
 └── Persistence
      └── Interceptors
           └── AuditingInterceptor

Application
 └── Services
\`\`\`

الـ Domain لا يعرف EF Core ولا ChangeTracker ولا Database.

---

## الخلاصة

EF Core ChangeTracker ليس مجرد Feature لمتابعة التغييرات. هو نقطة قوية جدًا لبناء Automatic Timestamps وAuditing وSoft Delete وUser Tracking بدون تكرار الكود في كل مكان.

لكن استخدمه في المكان الصحيح. لا تجعل الـ Entities تهتم بتفاصيل الـ Database. ولا تجعل كل Service تكرر نفس الـ Infrastructure Logic.

خلي الـ Application تركز على Business Rules… وخلي EF Core Infrastructure تهتم بالتفاصيل التقنية.

لأن الهدف الحقيقي ليس فقط أن الـ \`CreatedAt\` يتسجل. الهدف: **أن النظام يظل نظيفًا وقابلًا للتوسع عندما يكبر.**`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '10 min read',
  image: efCoreTimestampsImage,
};
