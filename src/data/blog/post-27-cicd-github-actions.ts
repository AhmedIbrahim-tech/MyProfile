import type { BlogPost } from '@/modules/blog/types';
import cicdImage from '@/assets/blog/cicd-github-actions.jpg';

export const post: BlogPost = {
  id: 27,
  title: 'CI/CD & GitHub Actions — إزاي الكود ينتقل من git push إلى Production بشكل آمن؟',
  excerpt:
    'من الحاجات اللي بتفرق بين مشروع شغال على جهازك وSoftware System حقيقي في Production: إزاي التغيير بيوصل بأمان؟ دليلك الشامل لفهم CI/CD وGitHub Actions خطوة بخطوة.',
  content: `# CI/CD & GitHub Actions — إزاي الكود ينتقل من git push إلى Production بشكل آمن؟

من الحاجات اللي بتفرق جدًا بين مشروع شغال عند Developer على جهازه…

وبين Software System حقيقي شغال في Production:

**إزاي التغيير بيوصل من الكود إلى المستخدم؟**

في مشروع صغير ممكن تعمل:

\`\`\`text
Write Code
    ↓
Build Locally
    ↓
Publish
    ↓
Copy Files to Server
    ↓
Restart Application
\`\`\`

وفي أول المشروع الموضوع ممكن يبدو عادي.

لكن تخيل فريق فيه 10 Developers، وكل يوم عشرات التغييرات:

- مين هيعمل Build؟
- مين هيتأكد إن Tests نجحت؟
- مين هيعمل Deployment؟
- وماذا لو Developer نسي خطوة؟
- وماذا لو الـ Build اللي اتعمل Deploy مختلف عن الـ Build اللي اتعمل Test عليه؟
- وماذا لو Deployment فشل في المنتصف؟

هنا بنوصل لمفهوم مهم جدًا: **CI/CD**.

والفكرة الأساسية بسيطة:

> **خلي الـ Software Pipeline نفسها مسؤولة عن التحقق والبناء والتجهيز والنشر بدل الاعتماد على خطوات يدوية معرضة للخطأ.**

---

## أولًا: يعني إيه CI؟

CI اختصار: **Continuous Integration**

تخيل فريق عنده:

\`\`\`text
Developer A
Developer B
Developer C
Developer D
\`\`\`

وكل واحد بيعدل في نفس المشروع.

بدون CI ممكن يحصل:

\`\`\`text
Developer pushes code
        ↓
Code looks fine
        ↓
Merged
        ↓
Production
        ↓
💥 Build fails
\`\`\`

أو:

\`\`\`text
Build succeeds
Tests fail
\`\`\`

لكن محدش اكتشف ده قبل الـ Merge.

الـ CI هدفها إن كل تغيير يمر بمجموعة Checks تلقائية.

مثلًا:

\`\`\`text
Push / Pull Request
        ↓
Restore Dependencies
        ↓
Build
        ↓
Run Tests
        ↓
Static Analysis
        ↓
Security Checks
        ↓
✅ Ready to Merge
\`\`\`

يعني بدل ما Developer يقول:

> "الكود عندي شغال."

الـ Pipeline تقول:

> "الكود اتبنى واختباراته نجحت في Environment نظيفة."

---

## مثال CI في مشروع .NET

أنت عملت:

\`\`\`bash
git push
\`\`\`

GitHub Actions تبدأ Workflow.

مثلًا:

\`\`\`text
Checkout Code
     ↓
Setup .NET
     ↓
dotnet restore
     ↓
dotnet build
     ↓
dotnet test
\`\`\`

لو أي Step فشلت:

\`\`\`text
❌ Pipeline Failed
\`\`\`

فالـ Pull Request تعرف إن فيه مشكلة قبل الوصول إلى Production.

---

## طيب يعني إيه CD؟

هنا فيه نقطة ناس كتير بتخلط فيها. \`CD\` ممكن تشير إلى مفهومين مختلفين:

1. **Continuous Delivery**
2. **Continuous Deployment**

والفرق بينهم مهم جدًا.

---

### Continuous Delivery

بعد ما:

\`\`\`text
Build ✅
Tests ✅
Package ✅
\`\`\`

الـ Application تكون جاهزة للـ Deployment. لكن Production Deployment قد يحتاج: **Manual Approval**

يعني:

\`\`\`text
Commit
  ↓
CI
  ↓
Build Artifact
  ↓
Deploy Staging
  ↓
Approval
  ↓
Production
\`\`\`

---

### Continuous Deployment

هنا العملية تذهب خطوة أبعد. أي تغيير ينجح في كل الـ Checks المطلوبة يمكن أن يصل إلى Production أوتوماتيك.

مثلًا:

\`\`\`text
Merge to main
     ↓
Build
     ↓
Tests
     ↓
Security Checks
     ↓
Deploy
     ↓
Production
\`\`\`

بدون Deployment يدوي.

---

## إذن CI/CD مش Tool… دي Practices

دي نقطة مهمة. CI/CD هي: **Development & Delivery Practices**

أما أدوات تنفيذها فمتعددة، مثل:

- **GitHub Actions**
- **Azure DevOps**
- **GitLab CI/CD**
- **Jenkins**
- **CircleCI**
- **TeamCity**

وفي المقالة دي هنركز على: **GitHub Actions**.

---

## ما هي GitHub Actions؟

GitHub Actions هي Automation Platform داخل GitHub. تقدر تستخدمها لتنفيذ:

- Build
- Test
- Package
- Deploy
- Security Scanning
- Scheduled Jobs
- Repository Automation

الـ Workflow بتتكتب في ملفات \`YAML\` داخل المسار:

\`\`\`text
.github/workflows/
\`\`\`

مثل:

\`\`\`text
.github/
└── workflows/
    ├── ci.yml
    └── deploy.yml
\`\`\`

---

## أهم Concepts في GitHub Actions

قبل ما نكتب Pipeline لازم نفهم المصطلحات الأساسية:

1. **Workflow**: الـ Automation Process بالكامل (مثل: Build & Test Application أو Deploy Production).
2. **Event / Trigger**: متى تشتغل الـ Workflow؟ (Push, Pull Request, Release, Schedule, Manual).
3. **Job**: مجموعة Steps تُنفذ على Runner واحد. والـ Jobs المستقلة يمكن أن تعمل بالتوازي.
4. **Runner**: السيرفر أو الجهاز اللي بينفذ الـ Job (سواء GitHub-hosted مثل Ubuntu/Windows/macOS أو Self-Hosted Runner).
5. **Step**: مهمة فردية داخل الـ Job (أمر Bash أو تشغيل Action).
6. **Action**: مكون جاهز قابل لإعادة الاستخدام (مثل \`actions/checkout\` أو \`actions/setup-dotnet\`).

---

### 1️⃣ Workflow

الـ Workflow هي عملية الأتمتة الكاملة، وتُعرّف داخل ملف YAML:

\`\`\`yaml
name: CI
\`\`\`

---

### 2️⃣ Event / Trigger

إمتى الـ Workflow تشتغل؟

\`\`\`yaml
on:
  push:
    branches:
      - main
\`\`\`

يعني لما يحصل Push على \`main\` شغّل الـ Workflow.

وممكن أيضًا للـ Pull Requests:

\`\`\`yaml
on:
  pull_request:
    branches:
      - main
\`\`\`

---

### 3️⃣ Job

الـ Workflow تتكون من Job أو أكثر:

\`\`\`yaml
jobs:
  build:
    runs-on: ubuntu-latest
\`\`\`

---

### 4️⃣ Runner

الـ Machine اللي ستنفذ عليها الـ Job:

\`\`\`yaml
runs-on: ubuntu-latest
\`\`\`

أو جهازك الخاص في حالة: **Self-Hosted Runner**.

---

### 5️⃣ Step

كل Job تتكون من خطوات متتالية:

\`\`\`yaml
steps:
  - name: Build
    run: dotnet build
\`\`\`

---

### 6️⃣ Action

مكون جاهز لإعادة الاستخدام يختصر عليك كتابة الأوامر الطويلة:

\`\`\`yaml
uses: actions/checkout@v7
uses: actions/setup-dotnet@v6
\`\`\`

---

## نبني أول CI Pipeline لـ ASP.NET Core

تخيل المشروع بهيكل:

\`\`\`text
MyApplication
├── src
│   └── MyApi
└── tests
    └── MyApi.Tests
\`\`\`

ننشئ الملف: \`.github/workflows/ci.yml\`

\`\`\`yaml
name: CI

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v7

      - name: Setup .NET
        uses: actions/setup-dotnet@v6
        with:
          dotnet-version: '10.0.x'

      - name: Restore dependencies
        run: dotnet restore

      - name: Build
        run: dotnet build --no-restore --configuration Release

      - name: Run tests
        run: dotnet test --no-build --configuration Release
\`\`\`

خلينا نفهم مكوناتها:

- **Trigger**: أي Push لـ \`main\` أو \`develop\`، أو أي Pull Request موجهة لـ \`main\`.
- **Checkout**: بنستخدم \`actions/checkout@v7\` لأن الـ Runner يبدأ نظيفاً ولا يحتوي على كود الـ Repository حتى نسحبه للـ Workspace.
- **Setup .NET**: بنحدد الـ SDK المطلوبة (مثلاً \`10.0.x\`) لضمان أن بيئة البناء مطابقة للمطلوب تماماً.
- **dotnet restore**: تحميل حزم الـ NuGet اللازمة.
- **dotnet build**: التحقق من أن المشروع يبنى بدون أخطاء ترجمة (Compilation Errors).
- **dotnet test**: تشغيل الاختبارات بالكامل. لو فشل أي Test تفشل الـ Pipeline ويتم إيقاف الدمج.

---

### ليه نستخدم --no-restore؟

لأننا نفّذنا بالفعل خطوة \`dotnet restore\` في الخطوة السابقة، فمش محتاجين أن تعيد عملية الـ Build تحميل الحزم من الصفر مرة أخرى.

---

### وليه --no-build في Tests؟

لأن الـ Build تم بالفعل بنجاح في الخطوة السابقة، فتستفيد الـ Tests من الـ Output الموجود بدلاً من إضاعة الوقت في إعادة البناء.

---

## Build ≠ Artifact: ما هو الـ Artifact؟

بعد البناء، قد ترغب في الاحتفاظ بناتج الـ Build:

- DLLs والملفات التنفيذية
- تطبيق منشور (Published Application)
- Docker Image
- نتائج الاختبارات وتقارير التغطية (Coverage Reports)

وهنا يظهر مفهوم: **Artifact**.

\`\`\`text
Source Code
    ↓
Build
    ↓
Publish
    ↓
Artifact
    ↓
Deploy Staging
    ↓
Deploy Production
\`\`\`

الميزة الذهبية: **نفس الـ Build الذي اختبرته هو الذي تنشره في Production بدون إعادة بناء.**

---

### مثال Publish ورفع Artifact

\`\`\`yaml
- name: Publish API
  run: >
    dotnet publish
    src/MyApi/MyApi.csproj
    --configuration Release
    --no-build
    --output ./publish

- name: Upload artifact
  uses: actions/upload-artifact@v7
  with:
    name: api
    path: ./publish
\`\`\`

---

## الفرق الجوهري: Artifacts vs Cache

كثيرون يخلطون بين الاثنين:

- **Artifact**: ناتج أنت صنعته وأنتجته (Build output, Packages, Logs) وتريد الاحتفاظ به أو تمريره لـ Job أخرى أو نشره.
- **Cache**: ملفات خارجية يعاد تنزيلها بشكل متكرر (NuGet packages, npm node_modules) والهدف من تخزينها المؤقت هو **تسريع زمن تنفيذ الـ Pipeline** فقط.

> **Artifact = Output**  
> **Cache = Optimization**

---

## Jobs Dependencies: تنظيم الاعتماديات باستخدام \`needs\`

لو مش عاوز الـ Deploy يبدأ إلا بعد نجاح الـ Build والـ Tests:

\`\`\`yaml
jobs:
  ci:
    runs-on: ubuntu-latest

  deploy:
    needs: ci
    runs-on: ubuntu-latest
\`\`\`

بدون استخدام \`needs\`، تعمل الـ Jobs المستقلة **بالتوازي (In Parallel)**، وهو أمر ممتاز عند تشغيل:
- Unit Tests
- Integration Tests
- Security Scan

في وقت واحد لتوفير الدقائق!

---

## مثال Pipeline متكامل أقرب للـ Production

\`\`\`text
Pull Request
      ↓
┌──────────────────────┐
│        CI            │
│                      │
│ Restore              │
│ Build                │
│ Unit Tests           │
│ Integration Tests    │
└──────────────────────┘
      ↓
Merge to Main
      ↓
Publish
      ↓
Artifact
      ↓
Deploy Staging
      ↓
Smoke Tests
      ↓
Approval
      ↓
Deploy Production
\`\`\`

---

## Environments و Protection Rules

تدعم GitHub Actions مفهوم الـ **Environments** (مثل Development, Staging, Production).

\`\`\`yaml
environment: production
\`\`\`

وهذا يتيح لك:
- تحديد **Required Reviewers (Manual Approval)** قبل بدء النشر على Production.
- عزل الـ Secrets بحيث لا تكون Secrets الإنتاج متاحة لمرحلة التطوير.

---

## إدارة الأسرار: Secrets & OIDC

بدلاً من كتابة كلمات المرور والـ Keys في الكود، نستخدم **GitHub Secrets**:

\`\`\`yaml
env:
  API_KEY: \${{ secrets.API_KEY }}
\`\`\`

### ولكن الأفضل أمنياً في السحابة: OpenID Connect (OIDC)

بدل استخدام Long-Lived Access Keys قد تُسرق، تدعم السحابات الحديثة (Azure, AWS, GCP) تقنية **OIDC**. الـ Workflow تطلب Identity Token مؤقتاً، والسحابة تمنحها تصريحاً قصير المدى بناءً على Trust Policy:

\`\`\`yaml
permissions:
  contents: read
  id-token: write
\`\`\`

### مبدأ الامتيازات الأقل (Principle of Least Privilege)

لا تعطي الـ Workflow صلاحيات أكبر مما تحتاجه:

\`\`\`yaml
permissions:
  contents: read
\`\`\`

---

## مثال عملي على خطوة النشر (Deployment)

\`\`\`yaml
deploy:
  needs: build-and-test
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  environment: production

  steps:
    - name: Deploy
      run: ./scripts/deploy.sh
\`\`\`

طريقة النشر تختلف حسب بيئتك (Azure App Service, Kubernetes, Docker, AWS, VM)، لكن المبدأ ثابت: **لا نشر إلا بعد اجتياز جميع المراحل السابقة بنجاح.**

---

## Matrix Strategy: اختبار بيئات وإصدارات متعددة بذكاء

لو كنت تبني مكتبة (Library) وتحتاج التأكد من عملها على إصدارات .NET متعددة:

\`\`\`yaml
strategy:
  matrix:
    dotnet:
      - '8.0.x'
      - '9.0.x'
      - '10.0.x'
    os:
      - ubuntu-latest
      - windows-latest

runs-on: \${{ matrix.os }}
steps:
  - uses: actions/setup-dotnet@v6
    with:
      dotnet-version: \${{ matrix.dotnet }}
\`\`\`

GitHub Actions ستقوم تلقائياً بتشغيل 6 Jobs متوازية تمثل كافة التباديل!

---

## Reusable Workflows

إذا كان لديك عشرات المشاريع داخل الشركة ولها نفس خطوات الفحص والبناء، لا تنسخ الـ YAML في كل مشروع. أنشئ **Reusable Workflow** (مثل \`shared-dotnet-ci.yml\`) واستدعِها في باقي المشاريع للحفاظ على المعايير الهندسية موحدة.

---

## التحكم بالتزامن (Concurrency)

لو قام مطور بعمل 5 Pushes سريعة على نفس الـ Pull Request، لست بحاجة لبقاء الـ 4 Builds القديمة قيد التشغيل واستهلاك الموارد:

\`\`\`yaml
concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true
\`\`\`

هذا يلغي تلقائياً أي Run قديمة فور بدء Run أحدث لنفس الفرع.

---

## Integration Tests وحاويات الخدمات

Unit Tests وحدها لا تكفي لاختبار الاتصال بقواعد البيانات أو الرسائل. يمكنك تشغيل Services داخل الـ Workflow:

- PostgreSQL
- SQL Server
- Redis
- RabbitMQ

الـ Runner يُشغّل الحاوية، يُنفّذ الاختبارات التكاملية ضدها، ثم يتخلص منها في بيئة نظيفة تماماً.

---

## أين تدخل Docker في المعادلة؟

النمط الشائع اليوم:

\`\`\`text
Code → Build → Test → Docker Build → Push to Container Registry → Deploy
\`\`\`

حيث يتم تحويل تطبيق ASP.NET Core إلى صورة Docker متوافقة، ونشرها على Kubernetes أو Azure Container Apps.

---

## أهم قاعدة في الـ Pipelines: Build Once, Deploy Many

> **إياك أن تعمل Build لـ Staging ثم تعمل Build منفصل لـ Production!**

استخدم نفس الـ Build Artifact لكل البيئات. لأن إعادة البناء تعني احتمالية وجود اختلاف في الاعتماديات أو البيئة، فلن تضمن بنسبة 100% أن ما نشرته هو بالضبط ما قمت باختباره.

---

## ماذا لو فشلت الـ Pipeline؟ (Fail Fast)

فشل الـ Pipeline ليس أمراً سيئاً… بل هو جوهر عملها!

الهدف هو: **أن تفشل مبكراً (Fail Early & Fast)**.

أن يفشل اختبارك بعد دقيقتين في الـ CI، أفضل بألف مرة من أن يكتشف العميل عطلاً بعد النشر على Production.

---

## ماذا عن Database Migrations؟

واحدة من أدق المراحل وأخطرها. تجنب تشغيل Destructive Migrations تكسر التطبيق الحالي قبل اكتمال النشر. اتبع استراتيجيات متقدمة مثل:
- **Expand / Contract Pattern**
- **Backward-Compatible Migrations**
- **Zero-Downtime Deployment**

---

## استراتيجيات النشر في الـ Production

النشر في الأنظمة الكبرى لا يكون بإطفاء النسخة القديمة فجأة:
- **Rolling Deployment**: استبدال الـ Instances تدريجياً واحدة تلو الأخرى.
- **Blue / Green Deployment**: تجهيز بيئة كاملة جديدة (Green) وفحصها، ثم تحويل حركة المرور (Traffic) إليها فوراً من البيئة الحالية (Blue).
- **Canary Deployment**: توجيه نسبة صغيرة جداً من المستخدمين (مثل 5%) للنسخة الجديدة، ومراقبة مقاييس الأداء، ثم التوسع تدريجياً.

---

## CI/CD و Observability

نجاح الـ Deployment تقنياً لا يعني بالضرورة نجاح الـ Release! قد تعلن الـ Pipeline نجاحها، لكن معدل الأخطاء (Error Rate) والـ Latency يرتفعان فجأة. لذا تحتاج الـ Pipeline للتكامل مع:
- Health Checks
- Tracing & Logs
- Prometheus / Grafana / Datadog
- Automated Rollbacks

---

## أخطاء شائعة في GitHub Actions تجنب الوقوع فيها

- ❌ **النشر المباشر من أي Branch**: حدد الفروع المحمية والـ Environments بصرامة.
- ❌ **تخزين الـ Secrets داخل الـ YAML**: استخدم دائماً GitHub Secrets المشفرة.
- ❌ **إعطاء صلاحيات مفرطة (Over-privileged Permissions)**: حدد أدنى الصلاحيات للـ Token.
- ❌ **إعادة بناء الكود للإنتاج**: التزم بقاعدة *Build Once, Deploy Many*.
- ❌ **غياب خطة التراجع (Rollback Plan)**: كن دائماً مستعداً للرجوع للإصدار السابق فور حدوث طارئ.
- ❌ **البطء المفرط**: استخدم التخزين المؤقت (Caching) والـ Parallel Jobs حتى لا تصبح الـ Pipeline عائقاً للمطورين.

---

## كيف تعمل GitHub Actions خلف الكواليس؟

\`\`\`text
Event (Trigger)
  ↓
Workflow (.yml)
  ↓
Jobs
  ↓
Runner (Machine)
  ↓
Steps
  ↓
Actions / Commands
\`\`\`

كل شيء يبدأ بحدث، يُطلق Workflow مقسمة لمهام تُنفّذ داخل بيئة معزولة عبر خطوات واضحة.

---

## الخلاصة 🚀

CI/CD ليست مجرد ملف YAML وليست مجرد سكريبت يعمل عند عمل Push.

- **CI**: تجيب على سؤال: *"هل هذا التغيير صالح وموثوق للاندماج مع بقية النظام؟"*
- **Continuous Delivery**: تجيب على سؤال: *"هل لدينا Artifact جاهزة ومختبرة للنشر في أي لحظة؟"*
- **Continuous Deployment**: تأخذ الخطوة الأخيرة: *"إذا اجتاز التغيير كل الفحوصات، انشره تلقائياً للمستخدمين."*

الهدف الحقيقي من CI/CD ليس فقط أن ننشر أسرع (Deploy Faster)…  
بل أن ننشر أسرع وبكل ثقة واطمئنان:

# Deploy Faster… with Confidence. 🚀`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '15 min read',
  image: cicdImage,
  featured: true,
};
