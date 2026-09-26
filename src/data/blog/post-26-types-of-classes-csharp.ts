import type { BlogPost } from '@/modules/blog/types';
import classTypesImage from '@/assets/blog/types-of-classes-in-csharp.jpg';

export const post: BlogPost = {
  id: 26,
  title: 'Types of Classes in C# — مش كل Class ينفع تعمل منها Object',
  excerpt:
    'لما تبدأ تتعلم OOP بتسمع إن الـ Class عبارة عن Blueprint لإنشاء Objects.. لكن هل كل Class ينفع تعمل منها new()؟ دليلك الشامل لجميع أنواع الـ Classes في C# ومتى تستخدم Concrete, Abstract, Static, Sealed, Partial, Nested, Generic, و Record Classes.',
  content: `# 🧱 Types of Classes in C#

## مش كل \`class\` في C# ينفع تعمل منها \`object\`

لما تبدأ تتعلم OOP غالبًا أول تعريف تسمعه للـ Class هو:

> الـ Class عبارة عن Blueprint بنستخدمها لإنشاء Objects.

وده صحيح… لكن **مش كامل**.

لأن في C# ممكن تكتب:

\`\`\`csharp
public class Student
{
    public string Name { get; set; }
}
\`\`\`

وتعمل:

\`\`\`csharp
var student = new Student();
\`\`\`

لكن ممكن تكتب:

\`\`\`csharp
public abstract class Animal
{
}
\`\`\`

وتحاول:

\`\`\`csharp
var animal = new Animal();
\`\`\`

فتاخد Compile Error.

وممكن كمان:

\`\`\`csharp
public static class Calculator
{
}
\`\`\`

وبرضه:

\`\`\`csharp
var calculator = new Calculator();
\`\`\`

مش هينفع.

فالسؤال الحقيقي مش:

> هل دي Class؟

لكن:

> **إيه طبيعة الـ Class دي؟ وإيه الغرض اللي اتصممت عشانه؟**

---

# أولًا: إمتى أصلًا ينفع أعمل Object من Class؟

عشان تقدر تعمل:

\`\`\`csharp
new MyClass();
\`\`\`

لازم عدة شروط تتحقق.

أهمهم:

\`\`\`text
Class ليست Abstract
Class ليست Static
Constructor مناسب ومتاح
Generic Type مكتمل لو كانت Generic
\`\`\`

يعني حتى:

# Concrete Class

مش معناها دائمًا إن أي مكان في البرنامج يقدر يعمل منها \`new\`.

خلينا نشوف ليه.

---

# 1. Concrete Class

دي الـ Class العادية اللي عندها implementation كاملة ويمكن إنشاء instances منها **إذا كان عندها constructor متاح**.

مثال:

\`\`\`csharp
public class Student
{
    public string Name { get; set; } = string.Empty;

    public void Study()
    {
        Console.WriteLine($"\${Name} is studying.");
    }
}
\`\`\`

نقدر:

\`\`\`csharp
var student = new Student
{
    Name = "Ahmed"
};

student.Study();
\`\`\`

هنا:

\`\`\`text
Student
   ↓
Blueprint
   ↓
student
\`\`\`

والـ \`student\` عبارة عن:

# Instance / Object

من \`Student\`.

---

# هل Concrete كلمة موجودة في C#؟

لا.

مش هتكتب:

\`\`\`csharp
concrete class Student
\`\`\`

😄

\`Concrete Class\` مجرد وصف بنستخدمه عشان نقول:

> Class يمكن إنشاء instance منها وليست abstract.

---

# لكن خد بالك 🚨

ممكن Class تكون Concrete ومع ذلك:

\`\`\`csharp
new User();
\`\`\`

مينفعش من خارجها.

مثال:

\`\`\`csharp
public class User
{
    private User()
    {
    }
}
\`\`\`

لو عملت:

\`\`\`csharp
var user = new User();
\`\`\`

من Class أخرى:

\`\`\`text
Compile Error
\`\`\`

ليه؟

مش لأنها Abstract.

لكن لأن:

\`\`\`text
Constructor = private
\`\`\`

---

# مثال Factory Method

ممكن الـ Class تتحكم بنفسها في طريقة إنشاء Objects:

\`\`\`csharp
public class User
{
    public string Name { get; }

    private User(string name)
    {
        Name = name;
    }

    public static User Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(
                "Name is required.");

        return new User(name);
    }
}
\`\`\`

الاستخدام:

\`\`\`csharp
var user = User.Create("Ahmed");
\`\`\`

بدل:

\`\`\`csharp
new User("Ahmed");
\`\`\`

وده Pattern شائع جدًا في Domain-Driven Design لما تكون عايز تحافظ على:

\`\`\`text
Business Invariants
\`\`\`

أثناء إنشاء الـ Object.

إذن:

> **Concrete ≠ constructor متاح للجميع.**

---

# 2. Abstract Class

الـ Abstract Class عبارة عن Class مصممة عشان تكون:

# Base Class

لكلاسات أخرى.

مثال:

\`\`\`csharp
public abstract class Animal
{
    public string Name { get; set; } = string.Empty;

    public abstract void MakeSound();
}
\`\`\`

مينفعش:

\`\`\`csharp
var animal = new Animal();
\`\`\`

لأن:

\`\`\`text
Animal
\`\`\`

Concept عام.

لكن ممكن:

\`\`\`csharp
public class Dog : Animal
{
    public override void MakeSound()
    {
        Console.WriteLine("Woof");
    }
}
\`\`\`

ثم:

\`\`\`csharp
Animal animal = new Dog();

animal.MakeSound();
\`\`\`

---

# Abstract Method

لما نكتب:

\`\`\`csharp
public abstract void MakeSound();
\`\`\`

إحنا بنقول للـ derived classes:

> لازم توفر Implementation للعملية دي.

مثل:

\`\`\`csharp
public class Cat : Animal
{
    public override void MakeSound()
    {
        Console.WriteLine("Meow");
    }
}
\`\`\`

---

# لكن Abstract Class مش كلها Abstract Members

خطأ شائع:

> Abstract Class معناها كل methods لازم تكون abstract.

لا.

ممكن تحتوي:

\`\`\`text
Fields
Properties
Constructors
Normal Methods
Virtual Methods
Abstract Methods
Protected Members
\`\`\`

مثال:

\`\`\`csharp
public abstract class Employee
{
    protected Employee(string name)
    {
        Name = name;
    }

    public string Name { get; }

    public void PrintName()
    {
        Console.WriteLine(Name);
    }

    public abstract decimal CalculateSalary();
}
\`\`\`

ثم:

\`\`\`csharp
public class FullTimeEmployee : Employee
{
    public FullTimeEmployee(string name)
        : base(name)
    {
    }

    public override decimal CalculateSalary()
    {
        return 10_000;
    }
}
\`\`\`

---

# Abstract Class لها Constructor؟

نعم.

ناس كتير تستغرب:

> طالما مش بعمل منها Object، ليه عندها Constructor؟

لأن Constructor بتاعها بيتنفذ أثناء إنشاء Derived Class.

\`\`\`text
new FullTimeEmployee()
        ↓
Employee Constructor
        ↓
FullTimeEmployee Constructor
\`\`\`

---

# إمتى أستخدم Abstract Class؟

لما يكون عندك:

\`\`\`text
عدة Types
\`\`\`

بينهم:

\`\`\`text
Shared State
+
Shared Behavior
+
Common Contract
\`\`\`

مثال:

\`\`\`text
PaymentMethod
        ↑
 ┌──────┼──────┐
Card   Wallet   BankTransfer
\`\`\`

ممكن:

\`\`\`csharp
public abstract class PaymentMethod
{
    public Guid Id { get; protected set; }

    public abstract Task PayAsync(
        decimal amount);
}
\`\`\`

---

# Abstract Class vs Interface

دي نقطة مهمة.

لو محتاج مجرد:

# Contract

غالبًا Interface مناسبة.

\`\`\`csharp
public interface IPaymentGateway
{
    Task PayAsync(decimal amount);
}
\`\`\`

لكن لو محتاج:

\`\`\`text
Shared State
Shared Fields
Constructors
Shared Implementation
\`\`\`

Abstract Class ممكن تكون أنسب.

بشكل مبسط:

| Abstract Class | Interface |
| --- | --- |
| يمكن تحتوي State | غالبًا Contract للسلوك |
| Constructors | لا تستخدم Constructors كـ Class |
| Fields | لا تمثل instance fields كـ Class |
| Single class inheritance | class يمكن implement interfaces كثيرة |
| Shared implementation | Contract/Capabilities |

لكن الاختيار مش قاعدة ميكانيكية.

---

# 3. Static Class

مثال:

\`\`\`csharp
public static class Calculator
{
    public static int Add(
        int x,
        int y)
    {
        return x + y;
    }
}
\`\`\`

الاستخدام:

\`\`\`csharp
var result =
    Calculator.Add(10, 20);
\`\`\`

مش:

\`\`\`csharp
var calculator =
    new Calculator();
\`\`\`

لأن Static Class:

\`\`\`text
لا يتم إنشاء Objects منها
\`\`\`

---

# Static Class معمولة لإيه؟

لـ functionality مش مرتبطة بـ instance معين.

مثل:

\`\`\`text
Math
Utility Functions
Extension Methods
Stateless Helpers
\`\`\`

مثال:

\`\`\`csharp
public static class StringExtensions
{
    public static bool IsEmpty(
        this string? value)
    {
        return string.IsNullOrWhiteSpace(value);
    }
}
\`\`\`

الاستخدام:

\`\`\`csharp
if (name.IsEmpty())
{
}
\`\`\`

---

# Static Class وكل أعضائها

بشكل عام، العمليات والبيانات المعرفة عليها لازم تكون static.

مثل:

\`\`\`csharp
public static class Calculator
{
    public static int Version = 1;

    public static int Add(
        int x,
        int y)
    {
        return x + y;
    }
}
\`\`\`

لكن فيه تفاصيل لغوية زي nested types ممكن تكون داخل static class، لذلك الأفضل نفكر فيها ببساطة كالتالي:

> لا يوجد instance state للـ Static Class.

---

# إمتى Static Class تكون اختيار سيئ؟

دي نقطة مهمة جدًا.

بعض المشاريع تتحول لـ:

\`\`\`text
UserHelper
OrderHelper
PaymentHelper
DatabaseHelper
EmailHelper
FileHelper
EverythingHelper
\`\`\`

😄

وكلهم Static Classes.

المشكلة تظهر لو الـ class تحتاج dependencies.

مثلًا:

\`\`\`csharp
public static class EmailHelper
{
    public static Task SendEmail()
    {
        // SMTP
        // Configuration
        // Logging
        // External Service
    }
}
\`\`\`

ساعتها الاختبار والتبديل والـ Dependency Injection يبقوا أصعب.

الأفضل غالبًا:

\`\`\`csharp
public interface IEmailService
{
    Task SendAsync();
}
\`\`\`

و:

\`\`\`csharp
public class EmailService
    : IEmailService
{
}
\`\`\`

ثم Dependency Injection.

---

# قاعدة عملية

لو عندك:

\`\`\`text
Pure Function
No external dependencies
No state
\`\`\`

Static ممكن تكون ممتازة.

لكن لو عندك:

\`\`\`text
Database
HTTP
Configuration
Logging
Clock
External APIs
\`\`\`

غالبًا Service عن طريق DI تكون أفضل.

---

# 4. Sealed Class

الـ Sealed Class:

> Class مسموح تعمل منها Objects، لكن ممنوع Class أخرى تورث منها.

مثال:

\`\`\`csharp
public sealed class DatabaseConnection
{
}
\`\`\`

ده ينفع:

\`\`\`csharp
var connection =
    new DatabaseConnection();
\`\`\`

لكن ده مينفعش:

\`\`\`csharp
public class CustomConnection
    : DatabaseConnection
{
}
\`\`\`

لأن:

\`\`\`text
DatabaseConnection
=
sealed
\`\`\`

---

# ليه نمنع الوراثة أصلًا؟

أحيانًا تصميم الـ Class مش معمول عشان يتوسع بالـ inheritance.

مثلًا عايز تقول:

> Behavior بتاعة الـ Class دي كاملة ومش عايز subclasses تغير assumptions الداخلية.

Sealing ممكن يساعد في:

\`\`\`text
Protecting invariants
Explicit design intent
Preventing unsupported inheritance
\`\`\`

---

# Sealed مش معناها Immutable

دي لخبطة بتحصل أحيانًا.

ممكن:

\`\`\`csharp
public sealed class User
{
    public string Name { get; set; }
}
\`\`\`

الـ Class:

\`\`\`text
Sealed ✅
Immutable ❌
\`\`\`

لأن \`Name\` لسه تتغير.

---

# Immutable Class

مثلًا:

\`\`\`csharp
public sealed class User
{
    public User(string name)
    {
        Name = name;
    }

    public string Name { get; }
}
\`\`\`

هنا أقرب لـ immutable design.

لكن:

\`\`\`text
sealed
\`\`\`

و:

\`\`\`text
immutable
\`\`\`

مفهومين مختلفين.

---

# هل sealed أفضل للأداء؟

JIT في بعض السيناريوهات ممكن يستفيد من معرفة إن type مش هيتورث منها في optimizations زي devirtualization.

لكن:

> ما تستخدمش \`sealed\` فقط عشان micro-optimization.

استخدمها أولًا كـ:

\`\`\`text
Design decision.
\`\`\`

---

# 5. Partial Class

الـ Partial Class تسمح لك تقسّم تعريف نفس الـ Class على أكثر من File.

File:

\`\`\`text
User.cs
\`\`\`

\`\`\`csharp
public partial class User
{
    public string Name { get; set; }
}
\`\`\`

File:

\`\`\`text
User.Authentication.cs
\`\`\`

\`\`\`csharp
public partial class User
{
    public void Login()
    {
    }
}
\`\`\`

وقت الـ Compilation الاتنين يتحولوا إلى:

\`\`\`text
One User Type
\`\`\`

مش Objectين.

مش Classين.

هي Class واحدة.

---

# ليه Partial موجودة؟

من أشهر استخداماتها:

\`\`\`text
Generated Code
Source Generators
WinForms
Designer Files
Scaffolding
Large generated models
\`\`\`

مثلًا:

\`\`\`text
Customer.Generated.cs
Customer.cs
\`\`\`

Generator يكتب جزء.

وأنت تكتب الجزء الخاص بيك.

---

# فايدة مهمة جدًا

بدل ما تعدل Generated Code:

\`\`\`text
Generated File
↓
You edit it
↓
Generator runs again
↓
Your changes disappear 😭
\`\`\`

تعمل:

\`\`\`text
Generated Partial Class
+
Your Partial Class
\`\`\`

---

# هل Partial كويسة لتقسيم God Class؟

مش بالضرورة.

تخيل:

\`\`\`text
Order.Part1.cs
Order.Part2.cs
Order.Part3.cs
Order.Part4.cs
Order.Part5.cs
\`\`\`

والـ Class فيها:

\`\`\`text
4,000 lines
\`\`\`

إنت هنا غالبًا:

> قسمت المشكلة على خمس ملفات بدل ما تحلها.

لو Class عندها Responsibilities كثيرة:

\`\`\`text
Split responsibilities
\`\`\`

بدل:

\`\`\`text
Split files only.
\`\`\`

---

# Partial مش بديل للـ Architecture

قاعدة مهمة:

\`\`\`text
Partial
=
Physical code organization
\`\`\`

مش:

\`\`\`text
Separation of Responsibilities.
\`\`\`

---

# 6. Nested Class

Nested Class هي Class متعرفة داخل Class أخرى.

مثال:

\`\`\`csharp
public class Order
{
    private class OrderValidator
    {
    }
}
\`\`\`

هنا:

\`\`\`text
Order
    └── OrderValidator
\`\`\`

---

# ليه نستخدم Nested Class؟

لما Type يكون:

\`\`\`text
Closely related
\`\`\`

بالـ containing class ومش منطقي يظهر لباقي التطبيق.

مثل:

\`\`\`csharp
public class Cache
{
    private sealed class CacheEntry
    {
        public string Key { get; init; }
        public object Value { get; init; }
    }
}
\`\`\`

\`CacheEntry\` implementation detail داخل \`Cache\`.

مش محتاج باقي السيستم يعرفها.

---

# Nested Classes والـ Access Modifiers

Nested Class تقدر تكون:

\`\`\`text
private
protected
internal
public
\`\`\`

حسب السياق.

مثال:

\`\`\`csharp
public class Outer
{
    private class Inner
    {
    }
}
\`\`\`

وهنا \`Inner\` لا تظهر خارج \`Outer\`.

---

# Nested Class مش Object جوه Object تلقائيًا

لو عندك:

\`\`\`csharp
public class Outer
{
    public class Inner
    {
    }
}
\`\`\`

تقدر:

\`\`\`csharp
var inner =
    new Outer.Inner();
\`\`\`

مش لازم تعمل:

\`\`\`csharp
var outer =
    new Outer();
\`\`\`

الأول.

وده بيفرق C# عن بعض اللغات اللي عندها مفهوم inner classes مرتبط تلقائيًا بالـ outer instance.

---

# 7. Generic Class

دي كمان مهمة جدًا وكان ناقص المقال الأصلي يذكرها.

Generic Class تعمل Class قابلة لإعادة الاستخدام مع Types مختلفة.

مثال:

\`\`\`csharp
public class Repository<T>
{
    public void Add(T entity)
    {
    }
}
\`\`\`

الاستخدام:

\`\`\`csharp
var userRepository =
    new Repository<User>();

var orderRepository =
    new Repository<Order>();
\`\`\`

بدل:

\`\`\`text
UserRepositoryBaseLogic
OrderRepositoryBaseLogic
ProductRepositoryBaseLogic
\`\`\`

وتكرار نفس الكود.

---

# Open Generic vs Closed Generic

دي نقطة لطيفة.

ده:

\`\`\`csharp
Repository<T>
\`\`\`

يسمى Conceptually:

\`\`\`text
Open Generic Type
\`\`\`

لأن \`T\` لم يتم تحديدها.

مينفعش تعمل:

\`\`\`csharp
new Repository<T>();
\`\`\`

من مكان لا يعرف \`T\`.

لكن:

\`\`\`csharp
Repository<User>
\`\`\`

دي:

\`\`\`text
Closed Generic Type
\`\`\`

ويمكن إنشاء Object منها.

---

# Generic Constraints

ممكن تقول:

\`\`\`csharp
public class Repository<T>
    where T : Entity
{
}
\`\`\`

يعني:

\`\`\`text
T must derive from Entity
\`\`\`

أو:

\`\`\`csharp
where T : class
\`\`\`

أو:

\`\`\`csharp
where T : new()
\`\`\`

حسب احتياج التصميم.

---

# 8. Record Class

في C# الحديثة عندنا:

\`\`\`csharp
public record User(
    Guid Id,
    string Name);
\`\`\`

والـ \`record\` هنا reference type افتراضيًا.

وتقدر تكتب بوضوح:

\`\`\`csharp
public record class User(
    Guid Id,
    string Name);
\`\`\`

الميزة الأساسية في records إنها مصممة أكثر لسيناريوهات:

\`\`\`text
Data-centric models
Value-based equality
Immutable-style design
with expressions
\`\`\`

مثال:

\`\`\`csharp
var user1 =
    new User(
        Guid.Empty,
        "Ahmed");

var user2 =
    new User(
        Guid.Empty,
        "Ahmed");

Console.WriteLine(
    user1 == user2);
\`\`\`

في records equality behavior مختلف عن class التقليدية ويعتمد على القيم.

---

# Class vs Record Class

Class التقليدية غالبًا:

\`\`\`text
Identity-oriented objects
Mutable entities
Behavior-rich objects
\`\`\`

Record غالبًا ممتازة في:

\`\`\`text
DTOs
Commands
Queries
Responses
Value-like data
\`\`\`

زي اللي شفناه في CQRS:

\`\`\`csharp
public sealed record CreateOrderCommand(
    Guid CustomerId,
    decimal Total);
\`\`\`

---

# هل Record بديل لكل Class؟

لا.

لو عندك Entity مثل:

\`\`\`text
Order
Customer
Invoice
\`\`\`

عندها identity ودورة حياة وbusiness behavior، Class عادية ممكن تكون الأنسب.

Records ممتازة جدًا لكن مش:

\`\`\`text
Use everywhere.
\`\`\`

---

# 9. Base Class وDerived Class

دي مش modifiers لكن مفاهيم أساسية.

\`\`\`csharp
public class Vehicle
{
}
\`\`\`

ثم:

\`\`\`csharp
public class Car : Vehicle
{
}
\`\`\`

هنا:

\`\`\`text
Vehicle
=
Base Class

Car
=
Derived Class
\`\`\`

العلاقة:

\`\`\`text
Car IS-A Vehicle
\`\`\`

---

# لكن inheritance استخدمها بحذر

مش لمجرد إن عندك Classes شبه بعض تعمل:

\`\`\`text
Inheritance everywhere.
\`\`\`

مثال:

\`\`\`text
EmailService
SmsService
NotificationService
\`\`\`

مش معناها لازم تعمل hierarchy ضخمة.

في حالات كثيرة:

# Composition

أفضل من Inheritance.

---

# Composition مثال

بدل:

\`\`\`text
SuperBaseNotificationManager
      ↑
EmailNotification
      ↑
SpecialEmailNotification
\`\`\`

ممكن:

\`\`\`csharp
public class NotificationService
{
    private readonly IMessageSender _sender;
}
\`\`\`

وتحقن implementation مختلفة.

ده عادة أكثر مرونة.

---

# 10. Access Modifiers للـ Classes

مش كل Class لازم:

\`\`\`csharp
public class
\`\`\`

عندك top-level types مثلًا ممكن تكون:

\`\`\`text
public
internal
file
\`\`\`

حسب السيناريو.

---

# public

\`\`\`csharp
public class OrderService
{
}
\`\`\`

متاحة من assemblies أخرى لو reference يسمح.

---

# internal

\`\`\`csharp
internal class OrderCalculator
{
}
\`\`\`

متاحة داخل نفس Assembly فقط.

وده ممتاز لـ implementation details.

مش كل Class في مشروعك لازم تكون:

\`\`\`text
public
\`\`\`

---

# file

في C# الحديثة عندك file-local types:

\`\`\`csharp
file class OrderMapper
{
}
\`\`\`

ودي visibility بتاعتها محدودة للـ source file نفسه.

مفيدة جدًا في implementation helpers اللي مش عايزها تنتشر حتى داخل Assembly.

---

# 11. ممكن Class تكون أكتر من حاجة في نفس الوقت؟

ودي واحدة من أهم النقاط.

القائمة:

\`\`\`text
Abstract
Sealed
Partial
Nested
Generic
\`\`\`

مش كلها categories متعارضة.

مثلًا ممكن تعمل:

\`\`\`csharp
public abstract partial class Entity
{
}
\`\`\`

يعني:

\`\`\`text
Abstract
+
Partial
\`\`\`

وممكن:

\`\`\`csharp
public sealed partial class User
{
}
\`\`\`

يعني:

\`\`\`text
Sealed
+
Partial
+
Concrete
\`\`\`

وممكن:

\`\`\`csharp
public sealed class Container
{
    private sealed class Item
    {
    }
}
\`\`\`

\`Item\`:

\`\`\`text
Nested
+
Sealed
+
Concrete
\`\`\`

وممكن:

\`\`\`csharp
public sealed class Repository<T>
{
}
\`\`\`

دي:

\`\`\`text
Generic
+
Sealed
+
Concrete
\`\`\`

إذن فكرة:

> "عندي 6 أنواع Classes منفصلة."

مش دقيقة تمامًا.

الأصح:

> عندنا مجموعة **modifiers وخصائص وأشكال تصميم** ممكن تتداخل مع بعض.

---

# 12. Static vs Singleton

لخبطة مشهورة جدًا.

Static:

\`\`\`csharp
public static class AppSettings
{
}
\`\`\`

معناها:

\`\`\`text
No instances.
\`\`\`

لكن Singleton:

\`\`\`csharp
public class CacheService
{
}
\`\`\`

هي Class عادية عندها:

\`\`\`text
One instance
\`\`\`

داخل lifecycle معينة.

في ASP.NET Core:

\`\`\`csharp
builder.Services
    .AddSingleton<CacheService>();
\`\`\`

هنا:

\`\`\`text
CacheService = normal class
\`\`\`

لكن DI Container يحتفظ Instance واحدة.

إذن:

\`\`\`text
Static
≠
Singleton
\`\`\`

فرق مهم جدًا.

---

# Singleton تقدر تعملها Interface

مثلًا:

\`\`\`csharp
builder.Services
    .AddSingleton<ICache, RedisCache>();
\`\`\`

وده يسمح:

\`\`\`text
Mocking
Testing
Replacing implementation
Dependency Injection
\`\`\`

بينما static class أصعب في السيناريوهات دي.

---

# 13. Abstract vs Static

فرق مهم:

## Abstract

تقول:

> لا تعمل مني Object، اعمل Derived Class.

\`\`\`text
Abstract
     ↑
Derived Classes
\`\`\`

## Static

تقول:

> لا توجد Objects أصلًا.

\`\`\`text
Static
↓
Call members directly
\`\`\`

مثال:

\`\`\`csharp
Animal animal =
    new Dog();
\`\`\`

ممكن.

لكن:

\`\`\`csharp
Calculator calculator =
    new SomeCalculator();
\`\`\`

مش مفهوم لأن Static Class أصلًا لا تدخل في inheritance بالطريقة دي.

---

# 14. Abstract vs Sealed

تقريبًا عكس بعض من ناحية inheritance.

Abstract:

\`\`\`text
مصممة ليتم الوراثة منها
\`\`\`

Sealed:

\`\`\`text
ممنوع الوراثة منها
\`\`\`

عشان كده ده غير منطقي:

\`\`\`csharp
abstract sealed class Something
\`\`\`

كـ class عادية في C#.

لأنك بتقول:

\`\`\`text
لازم تورث مني
+
ممنوع تورث مني
\`\`\`

😄

---

# 15. Static Class وكأنها Sealed؟

من ناحية الاستخدام:

\`\`\`text
Static Class
\`\`\`

لا يمكن الوراثة منها.

لكن مش محتاج تكتب:

\`\`\`csharp
static sealed class
\`\`\`

الـ language نفسها بتفرض القيود المناسبة على static class.

---

# 16. Constructor Types

عشان نفهم Objects أكتر، مهم نعرف إن الـ constructor نفسها ممكن تغيّر طريقة إنشاء الـ Object.

## Parameterless

\`\`\`csharp
public User()
{
}
\`\`\`

---

## Parameterized

\`\`\`csharp
public User(string name)
{
    Name = name;
}
\`\`\`

---

## Private

\`\`\`csharp
private User()
{
}
\`\`\`

تمنع الإنشاء المباشر من الخارج.

---

## Protected

\`\`\`csharp
protected User()
{
}
\`\`\`

مناسب لما الإنشاء يكون من Derived Classes.

---

# 17. Abstract Class مع DI

في ASP.NET Core لو عندك:

\`\`\`csharp
public abstract class PaymentGateway
{
}
\`\`\`

مينفعش DI Container تعمل:

\`\`\`text
new PaymentGateway()
\`\`\`

لازم تربطها بـ implementation:

\`\`\`csharp
public sealed class StripePaymentGateway
    : PaymentGateway
{
}
\`\`\`

ثم:

\`\`\`csharp
builder.Services
    .AddScoped<
        PaymentGateway,
        StripePaymentGateway>();
\`\`\`

دلوقتي:

\`\`\`text
PaymentGateway requested
        ↓
DI Container
        ↓
StripePaymentGateway
\`\`\`

---

# 18. Static Class مع Dependency Injection

مفيش معنى تعمل:

\`\`\`csharp
builder.Services.AddScoped<Calculator>();
\`\`\`

لو \`Calculator\`:

\`\`\`csharp
public static class Calculator
\`\`\`

لأن DI بتدير:

\`\`\`text
Object Instances
\`\`\`

والـ static class:

\`\`\`text
No instance.
\`\`\`

---

# 19. Sealed Class مع DI

عادي جدًا.

\`\`\`csharp
public sealed class OrderService
{
}
\`\`\`

ممكن:

\`\`\`csharp
builder.Services
    .AddScoped<OrderService>();
\`\`\`

\`sealed\` تمنع inheritance.

مش تمنع:

\`\`\`text
Instantiation
Dependency Injection
\`\`\`

---

# 20. أشهر الأخطاء

## ❌ كل Shared Code يتحط Static

مش كل حاجة مشتركة معناها static.

لو فيها dependencies أو state أو business behavior، Service غالبًا أنسب.

---

## ❌ Abstract Class لكل حاجة

لو محتاج Contract فقط:

\`\`\`text
Interface
\`\`\`

غالبًا أبسط.

---

## ❌ Inheritance عشان إعادة استخدام الكود فقط

Inheritance المفروض تمثل:

\`\`\`text
IS-A relationship
\`\`\`

مش:

> عندي 20 سطر مشابهين.

---

## ❌ Partial عشان Class ضخمة

\`\`\`text
4000 lines
\`\`\`

مقسمة على 8 files…

لسه:

\`\`\`text
4000-line class.
\`\`\`

---

## ❌ Sealed معناها Immutable

لا.

---

## ❌ Static معناها Singleton

لا.

---

## ❌ Abstract Class لا تحتوي implementation

غير صحيح.

---

## ❌ Nested Classes في كل مكان

لو nested type بقى كبير ومستخدم في أماكن كثيرة، غالبًا يستحق Type مستقل.

---

# 21. إمتى أستخدم كل واحدة؟

| الاحتياج | الاختيار |
| --- | --- |
| عايز Objects عادية | Concrete Class |
| Base فيها shared behavior/state | Abstract Class |
| Contract فقط | Interface غالبًا |
| Pure utility/stateless functions | Static Class |
| عايز تمنع inheritance | Sealed Class |
| Generated + handwritten code | Partial Class |
| Type خاص جدًا بـ containing class | Nested Class |
| نفس behavior مع Types مختلفة | Generic Class |
| DTO / Command / Query / value-like data | Record غالبًا مناسب |
| Class لا تظهر خارج Assembly | internal |
| Helper لا يظهر خارج نفس الملف | file-local type |

---

# 22. مثال من مشروع حقيقي

تخيل E-Commerce.

ممكن عندك:

\`\`\`csharp
public abstract class PaymentMethod
{
    public abstract Task PayAsync();
}
\`\`\`

دي:

\`\`\`text
Abstract
\`\`\`

ثم:

\`\`\`csharp
public sealed class CreditCardPayment
    : PaymentMethod
{
    public override Task PayAsync()
    {
        // Payment logic
        return Task.CompletedTask;
    }
}
\`\`\`

دي:

\`\`\`text
Concrete
+
Sealed
\`\`\`

وعندك:

\`\`\`csharp
public static class MoneyExtensions
{
    public static string ToCurrency(
        this decimal amount)
    {
        return amount.ToString("C");
    }
}
\`\`\`

دي:

\`\`\`text
Static
\`\`\`

وعندك:

\`\`\`csharp
public partial class Order
{
    public Guid Id { get; private set; }
}
\`\`\`

وجزء generated:

\`\`\`csharp
public partial class Order
{
    // Generated members
}
\`\`\`

دي:

\`\`\`text
Partial
\`\`\`

وعندك:

\`\`\`csharp
public sealed record OrderDto(
    Guid Id,
    decimal Total);
\`\`\`

دي:

\`\`\`text
Record
+
Sealed
\`\`\`

وعندك:

\`\`\`csharp
public class Repository<T>
{
}
\`\`\`

دي:

\`\`\`text
Generic
\`\`\`

---

# 23. أهم سؤال قبل اختيار نوع الـ Class

متسألش:

> إيه Modifier اللي شكله Professional أكتر؟

😄

اسأل:

\`\`\`text
هل محتاج Objects؟
\`\`\`

ثم:

\`\`\`text
هل النوع ده المفروض يتم توريثه؟
\`\`\`

ثم:

\`\`\`text
هل عندي shared state/behavior؟
\`\`\`

ثم:

\`\`\`text
هل functionality stateless تمامًا؟
\`\`\`

ثم:

\`\`\`text
هل لازم أمنع inheritance؟
\`\`\`

ثم:

\`\`\`text
هل الكود generated؟
\`\`\`

ثم:

\`\`\`text
هل النوع Implementation Detail؟
\`\`\`

---

# Decision Flow سريع

\`\`\`text
Do I need an object?
        │
   ┌────┴────┐
   │         │
  No        Yes
   │         │
Static?      ↓
          Should users instantiate it?
               │
        ┌──────┴──────┐
        │             │
       No            Yes
        │             │
Abstract /           Concrete
Private ctor
                      ↓
              Should inheritance be blocked?
                      │
                 ┌────┴────┐
                Yes        No
                 │          │
               Sealed     Normal
\`\`\`

وبشكل مستقل:

\`\`\`text
Need multiple files?
        ↓
      Partial

Need type parameter?
        ↓
      Generic

Only belongs inside another type?
        ↓
      Nested
\`\`\`

---

# الخلاصة

الـ Class في C# مش مجرد:

\`\`\`text
Blueprint → new Object
\`\`\`

الموضوع أوسع.

عندك Classes هدفها إنشاء Objects:

\`\`\`text
Concrete
\`\`\`

Classes معمولة عشان تكون أساس للوراثة:

\`\`\`text
Abstract
\`\`\`

Classes مفيش منها Instances أصلًا:

\`\`\`text
Static
\`\`\`

Classes تمنع inheritance:

\`\`\`text
Sealed
\`\`\`

Classes تعريفها موزع على أكتر من ملف:

\`\`\`text
Partial
\`\`\`

Classes موجودة داخل Classes أخرى:

\`\`\`text
Nested
\`\`\`

Classes تعمل مع Types مختلفة:

\`\`\`text
Generic
\`\`\`

وعندك:

\`\`\`text
Record Classes
\`\`\`

لـ data-centric/value-like models.

لكن أهم حاجة تفهمها:

# التصنيفات دي مش كلها متعارضة.

ممكن Class واحدة تكون:

\`\`\`text
Concrete
+
Sealed
+
Partial
+
Generic
+
Nested
\`\`\`

حسب التصميم.

والاختيار الصح مش بيبدأ من:

> أستخدم \`static\` ولا \`abstract\`؟

لكن من:

> **إيه مسؤولية الـ Type دي؟ مين المفروض ينشئها؟ هل المفروض تتورث؟ وهل عندها State أو Dependencies؟**

لما تجاوب الأسئلة دي، نوع الـ Class غالبًا هيبقى واضح لوحده.

**اختيار نوع الـ Class مش Syntax فقط؛ ده جزء من تصميم الـ Object Model نفسه.**
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-25',
  category: 'Backend',
  readTime: '14 min read',
  image: classTypesImage,
  featured: true,
};
