import type { BlogPost } from '@/modules/blog/types';
import cookieSecurityImage from '@/assets/blog/csrf-when-browser-works.jpg';

export const post: BlogPost = {
  id: 11,
  title: 'CSRF: HttpOnly Cookie مش حماية كافية',
  excerpt:
    'ممكن تعمل Authentication بـ HttpOnly وSecure وSession Cookie، وبرضه يتنفذ باسم المستخدم Request هو عمره ما طلبه. CSRF مش سرقة للـ Cookie — ده استغلال إن المتصفح بيستخدمها أوتوماتيك.',
  content: `# CSRF: لما المتصفح ينفّذ طلب أنت ما طلبتوش

ممكن تكون عامل Authentication بـ:

- HttpOnly
- Secure
- Session Cookie

وبرضه يتنفذ باسم الـ User Request هو عمره ما طلبه.

**إزاي؟**

هنا بنوصل لواحد من أشهر المخاطر المرتبطة بالـ Cookie-Based Authentication: **CSRF — Cross-Site Request Forgery**.

---

## الميزة… والمشكلة في نفس الوقت

بعد ما الـ User يعمل Login على \`myapp.com\`، الـ Server ممكن يرجع Session Cookie:

\`session=abc123\`

والـ Browser يحتفظ بيها.

الميزة — والمشكلة في نفس الوقت — إن الـ Browser ممكن يضيف الـ Cookies المناسبة للـ Request **أوتوماتيك**.

يعني الـ Attacker مش لازم يعرف \`session=abc123\`. ومش لازم يسرق الـ Cookie أصلًا.

هو محتاج في بعض السيناريوهات يخلي **Browser الضحية نفسه** يبعت Request للـ Application.

---

## جوهر CSRF

تخيل إنك عامل Login على \`myapp.com\`. وبعدها فتحت \`evil.com\`.

الموقع الخبيث يحاول يخلي الـ Browser يبعت Request زي:

\`POST /users/55/deactivate\`

المستخدم نفسه ما طلبش Deactivate للـ Account.

لكن لو إعدادات الـ Cookies والتطبيق سمحت بإرسال الـ Session Cookie مع الـ Cross-Site Request، فالـ Server قد يستقبل:

- Session صحيحة
- User authenticated
- Request عليها الـ Cookie الأصلية

ويتعامل مع الـ Request كأن المستخدم هو اللي طلبها.

**وده هو جوهر CSRF.**

المهاجم مش محتاج يسرق الـ Authentication Cookie. هو بيحاول يخلي **Browser الضحية يستخدم الـ Authentication الموجودة عنده نيابةً عنه**.

---

## طب وHttpOnly؟

\`HttpOnly\` مهمة جدًا. لأنها تمنع JavaScript من قراءة الـ Session Cookie مباشرة باستخدام APIs زي \`document.cookie\`.

لكن: **HttpOnly ≠ CSRF Protection**.

لأن مشكلة CSRF مش إن الـ Attacker قرأ الـ Cookie. المشكلة إن الـ Browser ممكن يستخدمها تلقائيًا في Requests مسموح لها تحملها.

---

## طب وSameSite؟

هنا فيه تفصيلة مهمة جدًا. \`SameSite\` نفسها واحدة من أهم وسائل تقليل CSRF.

- **SameSite=Strict:** الـ Cookie لا تُرسل في Cross-Site requests.
- **SameSite=Lax:** أكثر مرونة، لكنها تمنع الـ Cookie في معظم Cross-Site requests الخطيرة مثل \`POST\` التقليدي، مع السماح ببعض الـ top-level navigations الآمنة مثل \`GET\`.
- **SameSite=None:** يسمح بإرسال الـ Cookie في Cross-Site requests، ويجب استخدامه مع \`Secure\`.

يعني السيناريو التقليدي بتاع \`evil.com → POST → myapp.com\` مش المفروض نفترض إن الـ Cookie هتتبعت في كل الحالات. ده بيعتمد على سياسة \`SameSite\` وتصميم التطبيق.

وعشان كده: **SameSite طبقة دفاع مهمة جدًا، لكنها مش دايمًا الدفاع الوحيد اللي تعتمد عليه.**

---

## وهنا ييجي الـ CSRF Token

واحدة من أشهر طرق الحماية هي **Synchronizer CSRF Token**.

لما الـ Server ينشئ Session للـ User، يولد Token عشوائي وغير قابل للتوقع، مثلًا \`csrfToken = X7K9...\`، ويحتفظ بيه مرتبط بالـ Session.

بعدها الـ Frontend يحصل على الـ Token بطريقة آمنة. ومع كل Request بتغير State زي \`POST\` و\`PUT\` و\`PATCH\` و\`DELETE\`، يبعت الـ Token — ويفضل في Custom Header مثلًا:

\`X-CSRF-Token: X7K9...\`

لما الـ Request توصل للـ Server:

1. يحدد الـ Session من الـ Cookie.
2. يقرأ الـ CSRF Token المرسل مع الـ Request.
3. يقارنه بالقيمة المتوقعة للـ Session.

لو القيمة صحيحة: يكمل الـ Request.

لو الـ Token ناقص، أو غلط، أو مش مرتبط بالـ Session: الـ Request تترفض.

---

## ليه الـ Attacker مش يعمل نفس الكلام؟

لأن الموقع الخبيث قد يقدر يحاول إجبار الـ Browser على إرسال Request… لكن بسبب قيود الـ Browser والـ Same-Origin Policy، مش المفروض يقدر ببساطة يقرأ الـ CSRF Token الخاص بتطبيقك ويحطه في Custom Header بالقيمة الصحيحة.

فأنت بقيت محتاج حاجتين مع بعض:

- **Session Authentication**
- **CSRF Token صحيح**

وده بيصعب جدًا تنفيذ الـ Request من Website خارجي.

---

## CSRF Token مش علاج للـ XSS

لو الـ Attacker قدر يشغّل JavaScript جوه الـ Origin بتاع تطبيقك بسبب XSS، ممكن في بعض السيناريوهات يستخدم نفس صلاحيات الـ Frontend ويقرأ أو يرسل الـ Token.

عشان كده:

- XSS Protection ≠ CSRF Protection
- HttpOnly ≠ CSRF Protection
- Secure ≠ CSRF Protection

كل Security Control بيعالج Threat مختلف.

---

## في Production: فكر في CSRF كـ Layers

الأفضل إنك تفكر في CSRF كطبقات، مش كـ checkbox واحد:

- \`SameSite\` مضبوط حسب احتياجات التطبيق
- CSRF Token للـ State-Changing Requests عند الحاجة
- التحقق من \`Origin\` أو \`Referer\` كـ Defense in Depth
- عدم استخدام \`GET\` في عمليات تغير State
- حماية قوية ضد XSS

لأن Security مش Checkbox بتحطه مرة وخلاص. **هي Layers، وكل Layer بتقلل مساحة الهجوم بشكل مختلف.**

---

## أهم فكرة

الـ Cookie بتثبت إن الـ Browser عنده Session صالحة.

لكن ده **مش معناه تلقائيًا إن المستخدم نفسه كان يقصد تنفيذ الـ Request دي.**

وده بالضبط السبب اللي CSRF Protection موجودة عشانه.

لو عايز تتعمّق في Concepts زي دي تخص User Management وAuthentication: [سلسلة User Management & Authentication](https://lnkd.in/eM4Yevij)`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '9 min read',
  image: cookieSecurityImage,
  featured: true,
};
