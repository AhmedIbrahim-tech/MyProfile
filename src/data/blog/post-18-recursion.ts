import type { BlogPost } from '@/modules/blog/types';
import recursionImage from '@/assets/blog/recursion-csharp.jpg';

export const post: BlogPost = {
  id: 18,
  title: 'Recursion في C# — عندما تستدعي الـ Function نفسها',
  excerpt:
    'Recursion مش مجرد Function تنادي نفسها. هي طريقة تقسّم المشكلة لنسخة أصغر من نفسها — بشرط يكون عندك Base Case، وتفهم الـ Call Stack.',
  content: `# Recursion في C# — عندما تستدعي الـ Function نفسها

من أكثر المفاهيم التي تسبب ارتباكًا للمطورين في البداية: **Recursion**.

البعض يسمع عنها ويظن أنها مجرد "Function تنادي نفسها". وهذا صحيح… لكن ليس كافيًا لفهمها.

الـ Recursion هي طريقة تفكير لحل المشاكل التي يمكن تقسيمها إلى **نسخة أصغر من نفس المشكلة.** Same problem. Smaller input. Same solution.

---

## ما هي Recursion؟

ببساطة: هي أن تقوم الـ Function باستدعاء نفسها أثناء التنفيذ.

\`\`\`csharp
void CountDown(int n)
{
    if (n == 0) return; // Base case

    Console.WriteLine(n);
    CountDown(n - 1);   // Recursive case
}
\`\`\`

لو استدعينا \`CountDown(5)\` سيكون الناتج: 5 ثم 4 ثم 3 ثم 2 ثم 1.

كل Recursive Function محتاجة اتنين: **Base Case** يوقف الاستدعاء، و**Recursive Case** ينادي نفسها بمدخل أصغر.

---

## كيف تعمل Recursion؟

كل Function Call يتم تخزينه في **Call Stack**. عندما ننفذ \`CountDown(3)\`:

\`\`\`text
CountDown(3)
    ↓
CountDown(2)
    ↓
CountDown(1)
    ↓
CountDown(0)  ← Base Case (stop)
\`\`\`

كل استدعاء ينتظر انتهاء الاستدعاء الذي بداخله. عند الوصول للـ Base Case نبدأ الرجوع للخلف. وهذا يسمى **Stack Unwinding**.

لو نسيت الـ Base Case:

\`\`\`csharp
void Infinite()
{
    Infinite();
}
\`\`\`

ستحصل على \`StackOverflowException\` لأن الـ Stack امتلأ بالاستدعاءات.

---

## مثال مشهور: Factorial

\`5! = 5 × 4 × 3 × 2 × 1 = 120\`

رياضيًا: \`n! = n × (n-1)!\` — المشكلة تحولت إلى نسخة أصغر من نفسها.

\`\`\`csharp
int Factorial(int n)
{
    if (n <= 1) return 1;

    return n * Factorial(n - 1);
}
\`\`\`

عند \`Factorial(4)\`:

\`\`\`text
4 * Factorial(3)
3 * Factorial(2)
2 * Factorial(1)
        ↓
2 * 1 = 2
3 * 2 = 6
4 * 6 = 24
\`\`\`

\`0! = 1\`، لذلك الـ Base Case \`n <= 1\` أأمن من \`n == 1\` لوحدها.

---

## مثال: Reverse String

حل نسخة أصغر: اعكس باقي الـ string، ثم حط أول حرف في الآخر.

\`\`\`csharp
string Reverse(string text)
{
    if (text.Length <= 1)
        return text;

    return Reverse(text[1..]) + text[0];
}
\`\`\`

هذا المثال تعليمي فقط. في C# الحقيقي \`StringBuilder\` غالبًا أفضل للأداء.

---

## البحث داخل Folder Structure

من أشهر استخدامات Recursion. لا تعرف عدد المجلدات الداخلية، وكل Folder يحتوي Folder آخر — إذن Folder = نسخة أصغر من نفس المشكلة.

\`\`\`csharp
void PrintFiles(string path)
{
    foreach (var file in Directory.GetFiles(path))
        Console.WriteLine(file);

    foreach (var folder in Directory.GetDirectories(path))
        PrintFiles(folder);
}
\`\`\`

\`\`\`text
Project
 ├── Images
 │    ├── a.png
 │    └── Users
 │          └── b.png
 └── Files
      └── c.txt
\`\`\`

---

## Recursion مع Trees

الـ Trees هي أكثر مكان تظهر فيه Recursion. كل Node يحتوي Tree أصغر: Value وLeft Child وRight Child.

\`\`\`text
        10
       /  \\
      5    20
     / \\
    3   7
\`\`\`

InOrder Traversal:

\`\`\`csharp
void Traverse(Node node)
{
    if (node == null) return;

    Traverse(node.Left);
    Console.WriteLine(node.Value);
    Traverse(node.Right);
}
\`\`\`

الناتج: \`3  5  7  10  20\`

---

## Recursion في الـ Algorithms

- **Binary Search:** تقسيم البحث إلى نصفين.
- **Merge Sort / Quick Sort:** Divide and conquer.
- **Backtracking:** Sudoku وMaze وPermutations.

لو المشكلة معرّفة recursive أصلًا — زي Factorial أو Tree — Recursion بتبقى طبيعية.

---

## Recursion vs Loop

الاتنين يحلّوا نفس المشاكل أحيانًا. كل واحد له مكانه.

**Loop (Iteration):** أداء أفضل في معظم الحالات، ذاكرة ثابتة، أبسط للمشاكل الخطية. أصعب في الهياكل الهرمية، وأقل وضوحًا للـ recursive structures.

**Recursion:** أوضح وأنيق للمشاكل المعقدة، طبيعي مع Trees وGraphs، بيعكس التعريف الرياضي. بتستهلك Stack أكتر، ممكن تعمل StackOverflow، وأحيانًا أبطأ.

حساب مجموع أرقام من 1 لـ 5: Loop يكفي، ومش محتاج Recursion.

Tree Traversal: الـ Recursion أوضح.

القاعدة: استخدم Recursion لما المشكلة تتكسّر طبيعيًا لمشاكل أصغر. استخدم Loop لما الأداء أو الذاكرة مهمة.

---

## مشكلة كبيرة: Stack Overflow

كل Recursive Call يحتاج Memory في الـ Stack. \`Calculate(100000)\` قد يؤدي إلى \`StackOverflowException\`.

اسأل: هل العمق المتوقع كبير؟ إذا نعم، قد تحتاج Loop أو Iterative Solution أو Explicit Stack.

---

## Tail Recursion

نوع من Recursion يكون فيه الاستدعاء الأخير هو نفسه:

\`\`\`csharp
int Sum(int n, int result)
{
    if (n == 0) return result;

    return Sum(n - 1, result + n); // Tail call
}
\`\`\`

في بعض اللغات يتم تحسينه. لكن **C# لا يضمن Tail Call Optimization.** الاستدعاء العميق ممكن يعمل Stack Overflow برضه.

---

## Memoization

بعض المشاكل Recursive تكون بطيئة جدًا بسبب تكرار الحساب. Fibonacci: \`F(n) = F(n-1) + F(n-2)\` — بدون تخزين نفس القيم تتحسب مرات كثيرة.

الحل: Cache النتائج.

\`\`\`csharp
Dictionary<int, int> cache = new();

int Fib(int n)
{
    if (n <= 1) return n;

    if (cache.ContainsKey(n))
        return cache[n];

    cache[n] = Fib(n - 1) + Fib(n - 2);
    return cache[n];
}
\`\`\`

---

## أخطاء شائعة

- نسيان Base Case → Infinite recursion → \`StackOverflowException\`.
- عدم تقليل حجم المشكلة: \`Function(n)\` تنادي \`Function(n)\` من غير تغيير.
- استخدام Recursion لمجرد إنها موجودة، وLoop كان أبسط.
- تجاهل تكلفة الذاكرة.
- افتراض إن C# بيعمل Tail Call Optimization. مش بيضمنه.

---

## كيف تعرف أن المشكلة مناسبة للـ Recursion؟

اسأل:

1. هل فيها نفس الشكل المتكرر؟ Folder داخل Folder، Node داخل Tree.
2. هل تقدر تقسمها لنسخة أصغر؟ Factorial، Divide and conquer.
3. هل فيه Base Case واضح؟

إذا نعم، غالبًا Recursion مناسبة.

---

## الخلاصة

Recursion ليست مجرد "Function تنادي نفسها." هي طريقة لحل المشاكل عن طريق تقسيم المشكلة الكبيرة إلى مشاكل أصغر من نفس النوع.

أي Recursive Solution يحتاج: **Base Case** و**Recursive Case** وفهم للـ Call Stack.

استخدمها عندما تجعل الحل أوضح. لأن الهدف ليس كتابة أقل عدد من السطور… الهدف هو كتابة حل يعكس طبيعة المشكلة التي نحاول حلها.

Recursion turns complex problems into simpler ones.`,
  author: 'Ahmed Ibrahim',
  date: '2026-09-21',
  category: 'Backend',
  readTime: '11 min read',
  image: recursionImage,
};
