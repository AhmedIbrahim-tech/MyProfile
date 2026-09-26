import type { BlogPost } from '@/modules/blog/types';
import authCoverImage from '@/assets/blog/auth-cookies-jwt-oauth-oidc.jpg';
import authInfographicImage from '@/assets/blog/auth-cookies-jwt-oauth-oidc-infographic.jpg';

export const post: BlogPost = {
  id: 24,
  title: 'Authentication & Authorization — Cookies vs JWT vs OAuth 2.0 vs OpenID Connect',
  excerpt:
    'الفرق الحقيقي بين Authentication وAuthorization، وليه Cookies وJWT وOAuth 2.0 وOpenID Connect مش بدائل لبعض، مع أمثلة عملية وسيناريوهات التكامل في ASP.NET Core وReact / Next.js.',
  content: `# 🔐 Authentication & Authorization

## Cookies vs JWT vs OAuth 2.0 vs OpenID Connect في ASP.NET Core + React / Next.js

من أكتر الجمل اللي بتتقال في المشاريع:

> "هنعمل Authentication بالـ JWT."

أو:

> "بدل JWT نستخدم OAuth."

أو:

> "إحنا بنستخدم Cookies، يبقى مش محتاجين Tokens."

المشكلة إن الأربع كلمات دول مش Alternatives لبعض أصلًا.

\`\`\`text
Cookie
JWT
OAuth 2.0
OpenID Connect
\`\`\`

كل واحدة بتحل جزء مختلف من المشكلة.

ولو فهمت الفرق بينهم صح، حاجات كتير جدًا في Authentication هتبدأ تركب مكانها.

---

# 1. Authentication vs Authorization

نبدأ بالفرق الأساسي.

## Authentication

السؤال:

\`\`\`text
Who are you?
\`\`\`

يعني:

> هل المستخدم فعلًا هو الشخص اللي بيقول إنه هو؟

مثلًا:

\`\`\`text
Email + Password
Google Login
Microsoft Login
Passkey
Certificate
\`\`\`

بعد نجاح Authentication، السيستم يعرف Identity المستخدم.

Microsoft وNext.js بيفرقوا بوضوح بين Authentication باعتبارها إثبات الهوية، وAuthorization باعتبارها تحديد ما الذي يسمح لهذه الهوية بفعله.

---

# Authorization

بعد ما عرفنا أنت مين، السؤال بقى:

\`\`\`text
What are you allowed to do?
\`\`\`

مثال:

\`\`\`text
Ahmed
Authenticated ✅

Can view orders? ✅
Can create orders? ✅
Can refund orders? ❌
Can access admin panel? ❌
\`\`\`

يعني:

\`\`\`text
Authentication
      ↓
Who are you?

Authorization
      ↓
What can you do?
\`\`\`

الاتنين مرتبطين، لكن مش نفس الحاجة.

---

# مثال بسيط

عندك:

\`\`\`http
GET /api/orders
\`\`\`

لو المستخدم مش عامل Login أصلًا:

\`\`\`http
401 Unauthorized
\`\`\`

والاسم هنا مضلل شوية تاريخيًا؛ عمليًا \`401\` غالبًا معناها:

> Authentication required/failed.

لكن لو المستخدم Authenticated، بس معندوش Permission:

\`\`\`http
403 Forbidden
\`\`\`

ASP.NET Core documentation تفرق بين invalid/missing authentication الذي يؤدي عادة إلى \`401\`، وبين المستخدم authenticated لكن غير مسموح له بالعملية والذي يؤدي إلى \`403\`.

---

# 2. Authentication Flow بشكل عام

أي Authentication System تقريبًا بيمر بمراحل شبيهة:

\`\`\`text
User
 ↓
Login
 ↓
Verify Identity
 ↓
Create authenticated session / tokens
 ↓
Client sends credential
 ↓
Server validates credential
 ↓
Create ClaimsPrincipal
 ↓
Authorization
 ↓
Endpoint
\`\`\`

الاختلاف الحقيقي:

> إيه الـ credential اللي بنستخدمها بعد Login؟

ممكن تكون:

\`\`\`text
Cookie
Bearer Access Token
Certificate
API Key
...
\`\`\`

---

# 3. يعني إيه Cookie Authentication؟

في Web Application تقليدية، السيناريو ممكن يكون:

\`\`\`text
Browser
   │
   │ POST /login
   ▼
ASP.NET Core
   │
   │ Validate email/password
   ▼
Authentication succeeds
   │
   │ Set-Cookie
   ▼
Browser stores Cookie
\`\`\`

بعد كده كل Request:

\`\`\`text
Browser
   ↓
Cookie
   ↓
ASP.NET Core
   ↓
Authenticate User
\`\`\`

الـ Browser بيبعت Cookie تلقائيًا حسب إعدادات الـ cookie والـ domain/path والسياسات الأمنية.

---

# ASP.NET Core Cookie Authentication

مثال مبسط:

\`\`\`csharp
builder.Services
    .AddAuthentication("Cookies")
    .AddCookie("Cookies", options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy =
            CookieSecurePolicy.Always;

        options.LoginPath = "/account/login";
        options.AccessDeniedPath =
            "/account/access-denied";
    });
\`\`\`

ثم:

\`\`\`csharp
app.UseAuthentication();
app.UseAuthorization();
\`\`\`

وبعد نجاح Login:

\`\`\`csharp
var claims = new[]
{
    new Claim(
        ClaimTypes.NameIdentifier,
        user.Id.ToString()),

    new Claim(
        ClaimTypes.Name,
        user.Name)
};

var identity =
    new ClaimsIdentity(
        claims,
        "Cookies");

var principal =
    new ClaimsPrincipal(identity);

await HttpContext.SignInAsync(
    "Cookies",
    principal);
\`\`\`

ASP.NET Core يقوم بإنشاء Authentication Cookie وتشفيرها/حمايتها من خلال منظومة Data Protection الخاصة به.

---

# هل Cookie معناها Session في Database؟

مش بالضرورة.

دي نقطة مهمة.

ناس كتير بتفتكر:

\`\`\`text
Cookie Authentication
=
Session ID in Database
\`\`\`

مش لازم.

الـ Cookie نفسها ممكن تحتوي Authentication Ticket محمية ومشفرة.

وفي architectures أخرى ممكن تكون Cookie مجرد identifier لـ server-side session.

إذن:

\`\`\`text
Cookie
\`\`\`

هي وسيلة browser لتخزين وإرسال credential/session information.

مش Authentication Protocol في حد ذاتها.

---

# 4. أهم خصائص Authentication Cookie

في Cookies عندنا settings مهمة جدًا.

## HttpOnly

\`\`\`text
HttpOnly
\`\`\`

يعني JavaScript في الصفحة ما يقدرش يقرأ الـ Cookie مباشرة.

مثلًا:

\`\`\`javascript
document.cookie
\`\`\`

مش هيقدر يشوف Cookie معمولة \`HttpOnly\`.

وده يقلل خطر سرقة session credential مباشرة بواسطة JavaScript في حالة XSS، رغم إنه مش بيلغي خطر XSS نفسه.

---

# Secure

\`\`\`text
Secure
\`\`\`

يعني Cookie تُرسل عبر HTTPS فقط.

في Production:

\`\`\`text
Secure = true
\`\`\`

مهم جدًا.

---

# SameSite

بتحدد إمتى الـ Browser يرسل Cookie في cross-site requests.

القيم المعروفة:

\`\`\`text
Strict
Lax
None
\`\`\`

ولو:

\`\`\`text
SameSite=None
\`\`\`

عادة لازم:

\`\`\`text
Secure
\`\`\`

برضه.

اختيار SameSite له علاقة مباشرة بالـ CSRF والـ login flows والـ frontend/backend topology.

---

# 5. مشكلة Cookies: CSRF

لأن Browser بيرسل Cookie تلقائيًا، مهاجم ممكن يحاول يخلي Browser المستخدم يبعت request للسيرفر.

مثلًا المستخدم logged in على:

\`\`\`text
bank.com
\`\`\`

وموقع خبيث يخليه ينفذ:

\`\`\`http
POST bank.com/transfer
\`\`\`

Browser ممكن يرفق الـ Cookie تلقائيًا حسب سياسة الـ cookie.

هنا تظهر:

# CSRF

وعشان كده Cookie Authentication تحتاج استراتيجية CSRF صحيحة للعمليات اللي تغير state، بالإضافة لإعدادات SameSite المناسبة.

وده مختلف عن XSS.

---

# 6. يعني إيه JWT؟

JWT اختصار:

# JSON Web Token

ودي نقطة مهمة جدًا:

> JWT مش Authentication Protocol.

JWT عبارة عن **Token Format**.

شكل JWT غالبًا:

\`\`\`text
xxxxx.yyyyy.zzzzz
\`\`\`

ثلاث أجزاء:

\`\`\`text
Header
.
Payload
.
Signature
\`\`\`

مثال conceptual:

\`\`\`json
{
  "sub": "123",
  "name": "Ahmed",
  "role": "Admin"
}
\`\`\`

لكن الجزء ده:

\`\`\`text
Payload
\`\`\`

مش معناه إنه encrypted.

JWT العادية غالبًا:

\`\`\`text
Encoded + Signed
\`\`\`

مش encrypted.

يعني متحطش فيها:

\`\`\`text
Password
Credit Card
Secret
Sensitive private data
\`\`\`

---

# JWT Signature بتعمل إيه؟

لو Token Signed:

\`\`\`text
Header
+
Payload
+
Signing Key
     ↓
Signature
\`\`\`

السيرفر يقدر يعرف:

\`\`\`text
هل Token اتغيرت؟
هل المصدر اللي وقّعها موثوق؟
\`\`\`

لكن Signature:

\`\`\`text
Does NOT hide the payload.
\`\`\`

---

# 7. JWT ≠ Access Token

دي كمان مهمة جدًا.

ناس كتير تقول:

\`\`\`text
JWT Token
\`\`\`

وكأن عندنا Token واحدة في الدنيا.

لكن JWT مجرد Format.

ممكن:

\`\`\`text
Access Token → JWT
ID Token → JWT
\`\`\`

بينما Refresh Token:

\`\`\`text
قد يكون opaque string
\`\`\`

ومش لازم يكون JWT.

Microsoft توضح إن Access Token ليست مضطرة أصلًا تكون JWT؛ الـ client المفروض يعامل Access Token كـ opaque credential مخصصة للـ API، بينما ID Token في OIDC تكون JWT وتستخدم لإثبات تسجيل دخول المستخدم، وليس لاستدعاء API.

---

# 8. يعني إيه Bearer Token؟

لما تبعت:

\`\`\`http
Authorization: Bearer eyJ...
\`\`\`

الفكرة:

> اللي ماسك الـ Token يقدر يستخدمها.

ومن هنا الاسم:

\`\`\`text
Bearer
\`\`\`

يعني امتلاك الـ token نفسها كافي غالبًا لاستخدامها.

وده سبب إن سرقة Access Token مشكلة خطيرة.

---

# ASP.NET Core JWT Bearer

API ممكن تعمل:

\`\`\`csharp
builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority =
            "https://identity.example.com";

        options.Audience =
            "orders-api";
    });
\`\`\`

ثم ASP.NET Core يتحقق من Access Token.

التحقق الصح يشمل عادة:

\`\`\`text
Signature
Issuer
Audience
Expiration
\`\`\`

Microsoft تنص على ضرورة التحقق من signature وissuer وaudience وexpiration للـ bearer access tokens.

---

# 9. يعني إيه OAuth 2.0؟

هنا أكبر نقطة لخبطة.

# OAuth 2.0 ليس Login Protocol أساسًا.

OAuth مصمم أساسًا لـ:

# Authorization

يعني:

> تطبيق يأخذ Permission للوصول إلى Resource معينة.

مثال مشهور:

عندك تطبيق اسمه:

\`\`\`text
PhotoPrinter
\`\`\`

وتريده يقرأ صور المستخدم من خدمة تانية.

المستخدم لا يعطي:

\`\`\`text
Google Password
\`\`\`

لـ PhotoPrinter.

بدل كده:

\`\`\`text
User
 ↓
Authorization Server
 ↓
Consent
 ↓
PhotoPrinter gets Access Token
 ↓
PhotoPrinter calls Photo API
\`\`\`

إذن:

\`\`\`text
OAuth
\`\`\`

بيحل مشكلة:

> Delegated Access.

---

# OAuth Actors

بشكل مبسط:

\`\`\`text
Resource Owner
      ↓
Client
      ↓
Authorization Server
      ↓
Access Token
      ↓
Resource Server / API
\`\`\`

مثال:

\`\`\`text
User
        = Resource Owner

React App
        = Client

Identity Provider
        = Authorization Server

Orders API
        = Resource Server
\`\`\`

---

# 10. طب لو OAuth Authorization، بنعمل Login إزاي؟

هنا يأتي:

# OpenID Connect

أو:

\`\`\`text
OIDC
\`\`\`

OpenID Connect مبني فوق OAuth 2.0 ويضيف Authentication/Identity layer، بما فيها \`ID Token\`. Microsoft تصفه بأنه extension لـ OAuth 2.0 لاستخدامه كـ authentication protocol وتمكين سيناريوهات sign-in وSSO.

باختصار:

\`\`\`text
OAuth 2.0
    ↓
Authorization

OpenID Connect
    ↓
Authentication
+
Identity
\`\`\`

---

# 11. Access Token vs ID Token

ودي نقطة لازم تتثبت.

## Access Token

موجهة إلى:

\`\`\`text
API
\`\`\`

مثال:

\`\`\`http
Authorization: Bearer ACCESS_TOKEN
\`\`\`

وتعني:

> هذا الـ client لديه صلاحية لاستدعاء هذا الـ resource ضمن permissions معينة.

---

## ID Token

موجهة إلى:

\`\`\`text
Client Application
\`\`\`

وهدفها:

> إثبات إن عملية Authentication تمت وإعطاء معلومات identity للـ client.

Microsoft تحذر من استخدام ID Token لاستدعاء APIs؛ الـ API المفروض تستقبل Access Token.

يعني:

\`\`\`text
ID Token
    ❌
Orders API
\`\`\`

لكن:

\`\`\`text
Access Token
    ✅
Orders API
\`\`\`

---

# 12. Login with Google مثلًا

لما المستخدم يقول:

\`\`\`text
Continue with Google
\`\`\`

غالبًا مش مجرد OAuth.

لو التطبيق عايز يعرف:

\`\`\`text
مين المستخدم؟
\`\`\`

فغالبًا بنستخدم:

\`\`\`text
OpenID Connect
\`\`\`

والـ flow conceptual:

\`\`\`text
App
 ↓
Google / Identity Provider
 ↓
User Authentication
 ↓
Authorization Code
 ↓
Token Endpoint
 ↓
ID Token
+
Access Token
\`\`\`

---

# 13. Authorization Code Flow + PKCE

من أهم الـ flows الحديثة للتطبيقات التفاعلية:

\`\`\`text
Authorization Code Flow
+
PKCE
\`\`\`

بشكل مبسط:

\`\`\`text
Browser
   ↓
Authorization Endpoint
   ↓
Login
   ↓
Authorization Code
   ↓
Application exchanges Code
   ↓
Token Endpoint
   ↓
Tokens
\`\`\`

PKCE يربط بداية الـ flow بعملية استبدال Authorization Code ويقلل مخاطر سرقة الـ code.

Microsoft توصي باستخدام OIDC code flow مع PKCE في تطبيقات الويب الحديثة، وفي الـ confidential web clients يكون الجزء الحساس من token exchange على backend.

---

# 14. إذن الفرق الحقيقي

| Concept        | هو إيه؟                              | وظيفته                                  |
| -------------- | ------------------------------------ | --------------------------------------- |
| Cookie         | Browser credential/session mechanism | حفظ وإرسال session/authentication state |
| JWT            | Token format                         | تمثيل signed claims                     |
| Access Token   | Credential للـ API                   | الوصول إلى resource                     |
| ID Token       | Identity token                       | إثبات Authentication للـ client         |
| OAuth 2.0      | Authorization framework              | Delegated/API access                    |
| OpenID Connect | Identity protocol فوق OAuth          | Login / Authentication                  |
| Refresh Token  | Credential لتجديد tokens             | الحصول على Access Token جديدة           |

أهم سطر:

\`\`\`text
JWT != OAuth != OIDC != Cookie
\`\`\`

دول مستويات مختلفة من الـ problem.

---

# 15. Authentication في ASP.NET Core

ASP.NET Core مبني حوالين فكرة:

\`\`\`text
Authentication Scheme
\`\`\`

ممكن يكون عندك:

\`\`\`text
Cookie
JWT Bearer
OpenID Connect
Certificate
...
\`\`\`

ثم:

\`\`\`csharp
builder.Services.AddAuthentication(...);
\`\`\`

وبعدها Middleware:

\`\`\`csharp
app.UseAuthentication();
app.UseAuthorization();
\`\`\`

الترتيب مهم:

\`\`\`text
Authentication
      ↓
Authorization
\`\`\`

لأن Authorization محتاجة تعرف الأول مين المستخدم.

---

# 16. ClaimsPrincipal

بعد نجاح Authentication، ASP.NET Core غالبًا يمثل المستخدم كـ:

\`\`\`csharp
ClaimsPrincipal
\`\`\`

مثل:

\`\`\`csharp
User.Identity?.Name
\`\`\`

وممكن Claims تكون:

\`\`\`text
sub = 123
name = Ahmed
email = ...
role = Admin
department = Finance
permission = orders.refund
\`\`\`

الفكرة:

\`\`\`text
Identity
+
Claims
=
ClaimsPrincipal
\`\`\`

---

# Claims مش Permissions دائمًا

Claim مجرد:

\`\`\`text
Statement about identity
\`\`\`

مثلًا:

\`\`\`text
country = Egypt
department = Finance
\`\`\`

والـ Authorization Policy تقرر تستخدمها إزاي.

---

# 17. Role-Based Authorization

مثال:

\`\`\`csharp
[Authorize(Roles = "Admin")]
public IActionResult DeleteUser(...)
{
}
\`\`\`

ده بسيط.

لكن المشاريع الكبيرة غالبًا ماينفعش كل authorization فيها تتحول:

\`\`\`text
Admin
SuperAdmin
MegaAdmin
UltraAdmin
\`\`\`

😄

مع الوقت الأفضل في حالات كثيرة استخدام:

\`\`\`text
Policy-Based Authorization
\`\`\`

---

# 18. Policy-Based Authorization

مثلًا:

\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(
        "CanRefundOrders",
        policy =>
        {
            policy.RequireClaim(
                "permission",
                "orders.refund");
        });
});
\`\`\`

ثم:

\`\`\`csharp
[Authorize(Policy = "CanRefundOrders")]
[HttpPost("{id}/refund")]
public IActionResult Refund(Guid id)
{
}
\`\`\`

هنا الـ endpoint لا يهتم:

\`\`\`text
هل المستخدم Admin؟
\`\`\`

بل يهتم:

\`\`\`text
هل عنده permission المطلوبة؟
\`\`\`

وده أكثر مرونة في systems كبيرة.

---

# 19. Authentication vs Authorization في Architecture

Flow جيد:

\`\`\`text
Request
   ↓
Authentication
   ↓
Who is this?
   ↓
Authorization
   ↓
Can they do this?
   ↓
Application Use Case
   ↓
Domain
\`\`\`

مش:

\`\`\`text
Controller
   ↓
if(user.Role == "Admin")
   ↓
Service
   ↓
if(user.Role == "Admin")
   ↓
Repository
\`\`\`

ما تشتتش authorization logic عشوائيًا في كل layers.

---

# 20. Cookies vs Bearer Tokens

خلينا نقارن عمليًا.

|                                | Cookie             | Bearer Access Token             |
| ------------------------------ | ------------------ | ------------------------------- |
| Browser sends automatically    | غالبًا نعم         | عادة التطبيق يضيفه              |
| مناسب Web Sessions             | جدًا               | ممكن                            |
| مناسب APIs بين services        | لا غالبًا          | جدًا                            |
| CSRF concern                   | مهم                | يعتمد على طريقة التخزين/الإرسال |
| XSS concern                    | موجود              | شديد لو token متاحة لـ JS       |
| Can call different API domains | بقيود cookies/CORS | أسهل                            |
| HttpOnly protection            | نعم                | لو token داخل JS storage لا     |
| Native browser behavior        | قوي                | التطبيق يدير الـ token          |

---

# 21. React + ASP.NET Core

تخيل:

\`\`\`text
React SPA
   ↓
ASP.NET Core API
\`\`\`

عندك أكثر من تصميم ممكن.

## Design A — Cookie Authentication

\`\`\`text
React
  ↓
HttpOnly Cookie
  ↓
ASP.NET Core
\`\`\`

React نفسها مش محتاجة تقرأ credential.

Browser يرسلها.

مثال:

\`\`\`javascript
fetch("https://api.example.com/orders", {
  credentials: "include"
});
\`\`\`

لو frontend/backend cross-origin، لازم تظبط:

\`\`\`text
CORS
Cookies
SameSite
Secure
CSRF
\`\`\`

صح.

---

# Design B — Browser holds Access Token

\`\`\`text
React
 ↓
Access Token
 ↓
Authorization: Bearer ...
 ↓
ASP.NET Core API
\`\`\`

ده موجود وممكن يكون مطلوب في بعض architectures، لكنه يزيد مسؤولية حماية tokens داخل browser.

Microsoft الحالية تحذر تحديدًا من تخزين access tokens مباشرة في browser storage مثل \`localStorage\` أو \`sessionStorage\` للتطبيقات web الآمنة، وتوصي في secure web apps بتصميم backend يحتفظ بالـ tokens ويشارك browser فقط session cookie آمنة \`HttpOnly\`.

---

# 22. المشكلة مع localStorage

بتشوف كتير:

\`\`\`javascript
localStorage.setItem(
    "accessToken",
    token
);
\`\`\`

وبعدين:

\`\`\`javascript
const token =
    localStorage.getItem(
        "accessToken"
    );
\`\`\`

المشكلة:

أي JavaScript شغالة في origin ده تقدر توصل للـ localStorage.

لو عندك XSS:

\`\`\`text
Attacker JS
   ↓
localStorage
   ↓
Access Token stolen
\`\`\`

وعشان Bearer Token:

\`\`\`text
Whoever has it
can potentially use it
\`\`\`

Microsoft guidance الحالية تنصح بعدم وضع access tokens في browser storage في secure web architectures.

---

# 23. HttpOnly Cookie بتحل XSS؟

لا.

دي نقطة لازم نكون دقيقين فيها.

\`HttpOnly\` تمنع JavaScript من قراءة Cookie مباشرة.

لكن لو عندك XSS، المهاجم ممكن يعمل أضرار أخرى من داخل الـ browser.

فـ:

\`\`\`text
HttpOnly
\`\`\`

ليست:

\`\`\`text
XSS solved ✅
\`\`\`

هي فقط تقلل مساحة هجوم مهمة، خصوصًا سرقة الـ credential مباشرة.

---

# 24. Next.js غير React SPA التقليدية

دي نقطة مهمة جدًا.

Next.js عندها Server Side capabilities:

\`\`\`text
Server Components
Route Handlers
Server Actions
Middleware/Proxy layer
\`\`\`

فممكن تعمل Architecture أقرب إلى:

# BFF — Backend For Frontend

بدل:

\`\`\`text
Browser
  ↓
Access Token
  ↓
ASP.NET API
\`\`\`

نعمل:

\`\`\`text
Browser
   ↓
HttpOnly Session Cookie
   ↓
Next.js Server / BFF
   ↓
Access Token
   ↓
ASP.NET Core API
\`\`\`

الـ Access Token تفضل على Server Side.

وده يقلل exposure للـ browser.

Microsoft documentation الخاصة بـ JWT authentication تشير إلى BFF كأحد التصاميم المناسبة للويب حيث الـ backend يدير access credentials بدل كشفها مباشرة للـ UI.

---

# 25. BFF Flow

مثلًا:

\`\`\`text
Browser
   ↓
GET /orders
   ↓
Next.js
   ↓
Session Cookie validated
   ↓
Server gets Access Token
   ↓
ASP.NET Core API
   ↓
Response
   ↓
Next.js
   ↓
Browser
\`\`\`

المستخدم لا يحتاج يرى:

\`\`\`text
Access Token
\`\`\`

أصلًا.

---

# 26. هل BFF دائمًا أفضل؟

لا.

كل Architecture لها trade-offs.

BFF بتضيف:

\`\`\`text
Extra server hop
Infrastructure
Server-side session/token management
More backend responsibility
\`\`\`

لكن في applications الحساسة، إزالة الـ access token من browser JavaScript قد تكون ميزة أمنية كبيرة.

---

# 27. React SPA منفصلة تمامًا

لو عندك:

\`\`\`text
app.example.com
\`\`\`

و:

\`\`\`text
api.example-api.com
\`\`\`

ممكن تبني SPA تعتمد على OIDC.

لكن المهم:

ما تعملش Authentication Protocol بنفسك من الصفر.

يعني تجنب flow من نوع:

\`\`\`text
POST email/password
↓
I'll invent my own JWT system
↓
Done
\`\`\`

خصوصًا لو عندك Identity Provider أو authentication requirements معقدة.

Microsoft الحالية توصي باستخدام OAuth/OIDC standards للحصول على access tokens بدل اختراع token flows مخصصة للإنتاج.

---

# 28. Password → JWT مباشرة؟

Tutorials كتير بتعمل:

\`\`\`text
POST /login

{
  email,
  password
}
\`\`\`

ثم السيرفر:

\`\`\`text
new JwtSecurityToken(...)
\`\`\`

وده ممكن يظهر في:

\`\`\`text
Learning
Internal/closed systems
Simple controlled scenarios
\`\`\`

لكن في Identity Architecture حقيقية، الموضوع فيه أكثر من مجرد إنشاء JWT:

\`\`\`text
Key rotation
Token revocation
MFA
Password reset
Account lockout
Device/session management
Refresh token security
OIDC metadata
Signing keys
Consent
Federation
SSO
Token replay
Audit
\`\`\`

عشان كده production identity يفضل يعتمد على well-established standards والـ identity infrastructure المناسبة بدل implementation منزلية غير مكتملة. Microsoft تقول صراحةً إن self-created access/ID tokens خارج المعايير قد تسبب ثغرات، وتوصي باستخدام OAuth/OIDC standards.

---

# 29. Authentication Server / Identity Provider

في systems أكبر غالبًا عندك جهة مسؤولة عن Identity.

مثل:

\`\`\`text
Microsoft Entra ID
Auth0
Keycloak
Duende IdentityServer
Other OIDC providers
\`\`\`

Application تقول:

\`\`\`text
أنا مش هتعامل بنفسي مع كل تفاصيل Login.
\`\`\`

بل تعتمد على:

\`\`\`text
Identity Provider
\`\`\`

---

# 30. OpenID Connect Discovery

OIDC providers غالبًا تعرض:

\`\`\`text
/.well-known/openid-configuration
\`\`\`

الـ application تقدر تعرف منها:

\`\`\`text
Authorization endpoint
Token endpoint
Issuer
JWKS/signing keys
Supported features
\`\`\`

وده جزء أساسي من interoperable OIDC systems. Microsoft توثق الـ discovery endpoint كجزء من OIDC implementation.

---

# 31. Signing Keys

لو Identity Provider بيصدر JWT:

\`\`\`text
Private Key
    ↓
Sign Token
\`\`\`

والـ API تستخدم:

\`\`\`text
Public Key
    ↓
Verify Signature
\`\`\`

ميزة asymmetric signing:

الـ API محتاجة verification key فقط.

مش السر اللي يسمح بإصدار tokens.

Microsoft توصي باستخدام asymmetric keys عند إنشاء access tokens ضمن هذه architectures.

---

# 32. Claims vs Roles vs Permissions

تخيل User:

\`\`\`text
Ahmed
\`\`\`

Claims:

\`\`\`text
sub = 985
email = ...
department = Finance
country = EG
\`\`\`

Role:

\`\`\`text
Accountant
\`\`\`

Permissions:

\`\`\`text
invoice.read
invoice.create
invoice.approve
\`\`\`

في system صغيرة:

\`\`\`text
Roles
\`\`\`

ممكن تكون كفاية.

في system كبيرة:

\`\`\`text
Policies + Permissions
\`\`\`

غالبًا تديك Granularity أفضل.

---

# 33. Authentication مش لازم كل Endpoint يعملها

ممكن تعمل application policy تقول:

\`\`\`text
Everything requires Authentication
unless explicitly marked public.
\`\`\`

في ASP.NET Core:

\`\`\`csharp
var policy =
    new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

builder.Services
    .AddAuthorizationBuilder()
    .SetFallbackPolicy(policy);
\`\`\`

ثم فقط endpoints العامة:

\`\`\`csharp
[AllowAnonymous]
\`\`\`

ده يقلل احتمال إن developer ينسى \`[Authorize]\` على endpoint حساسة.

ASP.NET Core تدعم fallback authorization policy لهذا السيناريو.

---

# 34. Access Token لازم API تتحقق منها كويس

مش كفاية:

\`\`\`text
Token is a valid JWT
\`\`\`

ممكن Token تكون:

\`\`\`text
Validly signed
\`\`\`

لكن موجهة إلى API مختلفة.

عشان كده:

\`\`\`text
Issuer
Audience
Signature
Expiration
\`\`\`

كلهم مهمين.

مثال:

\`\`\`text
aud = payments-api
\`\`\`

مينفعش:

\`\`\`text
orders-api
\`\`\`

تقبلها عشوائيًا.

---

# 35. 401 vs 403

احفظها بالشكل ده:

\`\`\`text
401
↓
I don't have a valid authenticated identity.

403
↓
I know who you are,
but you can't do this.
\`\`\`

مثلًا:

\`\`\`http
GET /admin/users
\`\`\`

No valid token:

\`\`\`http
401
\`\`\`

Valid user، لكن User role:

\`\`\`http
403
\`\`\`

---

# 36. CORS مش Security Mechanism للـ API

واحدة من الأخطاء المتكررة:

> "أنا عامل CORS يسمح بس للـ React domain، يبقى API secure."

لا.

CORS أساسًا browser security policy.

مهاجم يقدر يعمل:

\`\`\`text
curl
Postman
Backend script
\`\`\`

وCORS مش هتوقفه.

الحماية الحقيقية:

\`\`\`text
Authentication
Authorization
Validation
Rate limiting
etc.
\`\`\`

---

# 37. Authentication Cookie vs Authorization Header

Cookie:

\`\`\`http
Cookie:
auth=...
\`\`\`

Bearer:

\`\`\`http
Authorization:
Bearer eyJ...
\`\`\`

مكان نقل الـ credential مختلف.

لكن السؤال الأهم مش:

> Cookie ولا Header؟

السؤال:

> Architecture بتاعتي إيه؟
> مين الـ client؟
> مين الـ API؟
> هل browser لازم تشوف token؟
> هل في cross-domain APIs؟
> هل في mobile app؟
> هل في services؟
> هل محتاج SSO؟

---

# 38. Web App Scenario

لو عندك:

\`\`\`text
Next.js Web Application
+
ASP.NET Core Backend
\`\`\`

وسيناريو Web فقط، architecture قوية في حالات كثيرة:

\`\`\`text
Browser
       ↓
Secure HttpOnly Cookie
       ↓
Next.js / BFF
       ↓
Access Token server-side
       ↓
ASP.NET Core API
\`\`\`

خصوصًا لما security requirement عالية.

---

# 39. Mobile App Scenario

Mobile app مش عندها browser session model بنفس طريقة Web App.

هنا غالبًا:

\`\`\`text
Mobile App
   ↓
OIDC / OAuth
   ↓
Authorization Code + PKCE
   ↓
Access Token
   ↓
API
\`\`\`

الـ token تتخزن باستخدام secure storage المناسب للـ platform، مش browser localStorage.

---

# 40. Machine-to-Machine

لو مفيش User أصلًا:

\`\`\`text
Billing Service
     ↓
Orders API
\`\`\`

هنا Login بتاع شخص مش منطقي.

OAuth عندها:

\`\`\`text
Client Credentials Flow
\`\`\`

الـ application نفسها تتم Authentication وتحصل على application access token.

Microsoft توصي بـ Client Credentials عندما لا يكون هناك user في الـ flow.

---

# 41. User Delegation

لكن لو:

\`\`\`text
User
 ↓
Frontend
 ↓
API A
 ↓
API B
\`\`\`

ومحتاج API B تعرف إن العملية تتم نيابة عن User:

\`\`\`text
Delegated Access
\`\`\`

وده مختلف عن:

\`\`\`text
API A
uses its own application identity.
\`\`\`

اختيار النوعين له أثر أمني كبير.

---

# 42. Refresh Token

هنعمل لها مقالة كاملة بعدين، لكن الصورة العامة:

\`\`\`text
Access Token
↓
Short-lived credential
↓
Expires
\`\`\`

ثم:

\`\`\`text
Refresh Token
↓
Token Endpoint
↓
New Access Token
\`\`\`

Microsoft تصف Refresh Token بأنها credential يستخدمها client للحصول على Access Tokens جديدة عندما تنتهي الحالية.

لكن Refresh Token غالبًا أخطر من Access Token بسبب قدرتها على إبقاء session مستمرة.

عشان كده:

\`\`\`text
Storage
Rotation
Revocation
Reuse Detection
\`\`\`

مهمين جدًا.

---

# 43. ما تحطش Authorization Logic في Frontend بس

مثلًا:

\`\`\`javascript
if (user.role === "Admin") {
    showDeleteButton();
}
\`\`\`

ده:

\`\`\`text
UI Authorization
\`\`\`

لكن مش Security Boundary.

مهاجم ممكن ينادي API مباشرة.

لازم Backend تعمل:

\`\`\`text
Actual Authorization
\`\`\`

Frontend فقط:

\`\`\`text
UX convenience.
\`\`\`

---

# 44. Hiding Button ≠ Authorization

دي قاعدة تستحق تتكتب لوحدها:

\`\`\`text
Hide button ❌ Security

Protect endpoint ✅ Security
\`\`\`

لو المستخدم ملوش Permission:

\`\`\`http
DELETE /users/123
\`\`\`

لازم Backend ترفض حتى لو المستخدم عرف endpoint بنفسه.

---

# 45. Authentication Data في React

خطأ شائع:

\`\`\`javascript
const isAuthenticated =
  !!localStorage.getItem("token");
\`\`\`

ده لا يعني:

\`\`\`text
Authenticated.
\`\`\`

ده يعني فقط:

\`\`\`text
There is a string in localStorage.
\`\`\`

الـ server هو اللي يحدد إذا credential:

\`\`\`text
Valid
Expired
Revoked
Correct audience
Correct issuer
Authorized
\`\`\`

---

# 46. Next.js Authorization

في Next.js ممكن تعمل UI guard:

\`\`\`text
Server Component
↓
Check session
↓
redirect("/login")
\`\`\`

لكن لو عندك ASP.NET Core API:

\`\`\`text
API authorization
\`\`\`

لازم تفضل موجودة.

يعني ممكن يبقى عندك:

\`\`\`text
Frontend authorization
+
Backend authorization
\`\`\`

لكن لأهداف مختلفة.

Frontend:

\`\`\`text
UX
Navigation
Visibility
\`\`\`

Backend:

\`\`\`text
Security boundary
\`\`\`

---

# 47. Secrets لا تروح Browser

أي حاجة وصلت Browser تعتبر:

\`\`\`text
Public to the user.
\`\`\`

حتى لو:

\`\`\`javascript
const SECRET = process.env.NEXT_PUBLIC_SECRET;
\`\`\`

😅

كلمة:

\`\`\`text
NEXT_PUBLIC
\`\`\`

تعني إن القيمة يمكن تضمينها في client-side bundle.

Client Secret:

\`\`\`text
NEVER
\`\`\`

يبقى في browser.

في OIDC confidential web app، client secret أو client assertion يفضل server-side. Microsoft توضح ذلك في توثيق confidential OIDC clients.

---

# 48. Authentication ≠ User Database فقط

Authentication System حقيقية ممكن تحتاج:

\`\`\`text
Password hashing
MFA
Email verification
Account lockout
Password reset
Session management
Device management
Social login
SSO
Audit
Token revocation
Security events
Breached credential handling
\`\`\`

عشان كده Identity غالبًا subsystem كاملة.

---

# 49. Password Storage

ممنوع:

\`\`\`text
Password
↓
Database as plain text
\`\`\`

وممنوع تعامل Password كأنها data عادية تتشفر وتتفك.

Passwords عادة يتم التعامل معها باستخدام:

\`\`\`text
Strong password hashing
+
Salt
\`\`\`

مثل algorithms مصممة لتخزين كلمات المرور.

ولو بتستخدم ASP.NET Core Identity، خليه يدير الـ password hashing بدل اختراع implementation من الصفر.

---

# 50. Authentication Failure Logging

محتاج تسجل أحداث مثل:

\`\`\`text
Failed login
Account lockout
Suspicious refresh attempts
Authorization failure
Token validation problems
\`\`\`

لكن ما تسجلش:

\`\`\`text
Passwords ❌
Access Tokens ❌
Refresh Tokens ❌
Authorization headers ❌
Sensitive claims unnecessarily ❌
\`\`\`

لأن Logs نفسها ممكن تتحول لثغرة.

---

# 51. Logout مش دايمًا "امسح Token"

مع Cookie session:

\`\`\`text
SignOut
↓
Cookie invalidated/removed
\`\`\`

لكن في distributed identity system الموضوع ممكن يشمل:

\`\`\`text
Local session
Identity Provider session
Refresh token
Other devices
Other applications
\`\`\`

عشان كده عند OIDC عندك concepts مثل:

\`\`\`text
Sign-out
Single Sign-Out
Front-channel logout
\`\`\`

Microsoft OIDC documentation توثق sign-out وsingle sign-out كجزء من protocol behavior.

---

# 52. Session Lifetime vs Token Lifetime

الاتنين مش لازم يكونوا نفس الشيء.

ممكن:

\`\`\`text
Access Token
15 minutes
\`\`\`

لكن:

\`\`\`text
User session
8 hours
\`\`\`

والـ backend يجدد access credentials حسب design.

عشان كده:

\`\`\`text
Token lifetime
\`\`\`

مش هي نفسها:

\`\`\`text
Login session lifetime
\`\`\`

---

# 53. مثال Architecture كاملة

خلينا ناخد:

\`\`\`text
Next.js
+
ASP.NET Core
+
OIDC Provider
\`\`\`

Flow:

\`\`\`text
1. User opens Next.js
        ↓
2. User clicks Login
        ↓
3. Redirect to Identity Provider
        ↓
4. User authenticates
        ↓
5. Authorization Code returned
        ↓
6. Backend exchanges Code
        ↓
7. ID Token + Access Token
        ↓
8. Backend creates secure session
        ↓
9. Browser gets HttpOnly Cookie
        ↓
10. Browser requests Orders
        ↓
11. Next/BFF gets Access Token
        ↓
12. Calls ASP.NET Core API
        ↓
13. API validates Access Token
        ↓
14. Authorization Policy executes
        ↓
15. Endpoint executes
\`\`\`

دي architecture مفهومة وقابلة للتأمين أكتر من:

\`\`\`text
login
↓
put everything in localStorage
↓
hope for the best
\`\`\`

😄

---

# 54. ASP.NET Core API

API side:

\`\`\`csharp
builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority =
            builder.Configuration["Auth:Authority"];

        options.Audience =
            "orders-api";
    });

builder.Services
    .AddAuthorization(options =>
    {
        options.AddPolicy(
            "CanRefundOrders",
            policy =>
            {
                policy.RequireClaim(
                    "permission",
                    "orders.refund");
            });
    });
\`\`\`

Endpoint:

\`\`\`csharp
[Authorize(Policy = "CanRefundOrders")]
[HttpPost("{id}/refund")]
public async Task<IActionResult> Refund(
    Guid id,
    CancellationToken cancellationToken)
{
    // Execute use case

    return NoContent();
}
\`\`\`

الـ Controller مش بتعمل:

\`\`\`text
Decode JWT manually
\`\`\`

ولا:

\`\`\`text
check signature manually
\`\`\`

Authentication Handler تعمل ده.

---

# 55. حاجات لازم تتجنبها

أهم الأخطاء اللي لازم نخلي بالنا منها:

1. اعتبار JWT هي Authentication architecture كلها.
2. اختراع OAuth/OIDC-like protocol خاص بك بدون داعٍ.
3. استخدام ID Token للوصول إلى API.
4. وضع access/refresh tokens الحساسة في مكان browser JavaScript يقدر يقرأه بدون دراسة المخاطر.
5. الاعتماد على إخفاء Buttons كـ Authorization.
6. التحقق من signature فقط ونسيان issuer/audience/expiry.
7. تخزين passwords بطريقة غير آمنة.
8. إرسال Client Secret للـ frontend.
9. تسجيل tokens/passwords في Logs.
10. اعتبار CORS بديلًا عن Authentication.
11. جعل كل مستخدم تقريبًا \`Admin\`.
12. خلط business permissions مع UI roles بشكل غير قابل للتوسع.
13. نسيان CSRF عند استخدام Cookies.
14. استخدام HTTP بدل HTTPS في Production.
15. بناء Authentication System معقدة بنفسك بينما Identity Provider موثوق يحل المشكلة أصلًا.

---

# 56. أختار إيه؟

## Web App بسيطة على نفس Backend

مثل:

\`\`\`text
ASP.NET Core MVC
\`\`\`

غالبًا:

\`\`\`text
Cookie Authentication
\`\`\`

حل طبيعي جدًا.

---

## React + ASP.NET Core

عندك أكثر من تصميم.

لو secure web application وarchitecture تسمح:

\`\`\`text
HttpOnly Cookie
+
BFF
\`\`\`

اختيار قوي.

لو SPA تحتاج تتعامل مباشرة مع APIs:

\`\`\`text
OIDC/OAuth
+
Authorization Code + PKCE
+
Access Tokens
\`\`\`

مع token management مدروس بعناية.

---

## Next.js + ASP.NET Core

استغل Server Side capabilities بتاعة Next.js.

في تطبيقات كثيرة:

\`\`\`text
Browser
↓
HttpOnly Session Cookie
↓
Next.js BFF
↓
Access Token
↓
ASP.NET Core
\`\`\`

يكون تصميم ممتاز.

---

## Mobile Application

غالبًا:

\`\`\`text
OIDC
+
Authorization Code
+
PKCE
\`\`\`

---

## Service to Service

غالبًا:

\`\`\`text
OAuth Client Credentials
\`\`\`

أو mechanisms أخرى مثل:

\`\`\`text
Managed Identity
Certificates
\`\`\`

حسب البيئة.

---

# 57. أهم Mental Model

بدل ما تسأل:

> أستخدم JWT ولا OAuth؟

السؤال نفسه غلط.

فكر بالشكل ده:

\`\`\`text
How do I authenticate the user?
        ↓
OpenID Connect / Session / ...

How do I authorize access to an API?
        ↓
OAuth Access Token / Session

How is the credential transported?
        ↓
Cookie / Authorization Header

What format is the token?
        ↓
JWT / Opaque Token

How do I authorize the operation?
        ↓
Claims / Roles / Policies / Permissions
\`\`\`

دلوقتي كل concept في مكانها.

---

![Authentication vs Authorization Infographic](${authInfographicImage})

---

# 58. الخلاصة

احفظ الخريطة دي:

\`\`\`text
Authentication
     │
     │ Who are you?
     ▼
OpenID Connect
     │
     ├── ID Token
     │
     ▼
Authenticated User


Authorization
     │
     │ What can you access?
     ▼
OAuth 2.0
     │
     ├── Access Token
     │
     ▼
Protected API


JWT
     ↓
Possible token format


Cookie
     ↓
Possible browser session/
credential transport
\`\`\`

وأهم أربع جمل في المقالة:

\`\`\`text
JWT is a token format.

OAuth 2.0 is mainly about authorization.

OpenID Connect adds authentication/identity.

Cookies are a browser credential/session mechanism.
\`\`\`

ولما نبني ASP.NET Core + React/Next system، الهدف مش:

> "نحط JWT وخلاص."

الهدف إننا نصمم:

\`\`\`text
Identity
   ↓
Authentication
   ↓
Session / Token lifecycle
   ↓
Authorization
   ↓
Secure Frontend
   ↓
Secure API
\`\`\`

بطريقة تمنع إن الـ Browser ياخد Secrets مش محتاجها، والـ API تثق فقط في Credentials تم التحقق منها، وكل Endpoint تحمي الـ business operation المطلوبة فعلًا.

**Authentication تقول أنت مين.
Authorization تقول مسموح لك تعمل إيه.
أما اختيار Cookie أو Access Token أو OIDC، فده قرار Architecture وأمان، مش مجرد preference في الكود.**
`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-23',
  category: 'Security',
  readTime: '18 min read',
  image: authCoverImage,
  featured: true,
};
