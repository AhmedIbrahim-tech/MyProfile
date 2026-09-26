// Profile data based on Ahmed Ibrahim's resume

export const profileData = {
  name: "Ahmed Ibrahim Ahmed",
  title: "Full-Stack Developer (.NET & React)",
  location: "Mit Ghamr, Dakahlia, Egypt",
  phone: "+20 100 769 1743",
  email: "ahmedeprahim.official@gmail.com",
  github: "https://github.com/AhmedIbrahim-tech",
  linkedin: "https://www.linkedin.com/in/ahmedeprahim",
  facebook: "https://www.facebook.com/ahmedeprahima/",
  whatsapp: "https://wa.me/201007691743",

  about: [
    "Full-Stack Developer with 4+ years of professional software development experience building ASP.NET Core and React-based business applications.",
    "Strong backend background with hands-on experience in ERP systems, workflow-driven solutions, client-facing delivery, legacy modernization, bilingual applications, and end-to-end feature development.",
    "Currently working with HUED Company as a Full-Stack Developer (.NET Core & React), delivering multi-client enterprise platforms across various business sectors."
  ],

  education: {
    institution: "Thebes Academy",
    degree: "Bachelor of Computer Science, 2016 – 2020",
    grade: "Good",
    project: "School Management System (Grade: Excellent)",
    projectDescription: "Web platform for schools, students, and parents to manage attendance, grades, and communication."
  },

  languages: [
    { language: "Arabic", level: "Native" },
    { language: "English", level: "Intermediate" }
  ],

  experience: [
    {
      title: "Full-Stack Developer (ASP.NET Core & React)",
      company: "HUED Company",
      location: "Remote",
      period: "May 2025 – Present",
      responsibilities: [
        "Develop end-to-end full-stack applications across 3 client projects in a software-house environment using ASP.NET Core, React/Next.js, Entity Framework Core, and SQL Server.",
        "Implement multi-stage workflows with validations, status transitions, and business rules to manage user processes and business operations across different stages, while supporting bilingual Arabic/English applications with RTL/LTR layouts.",
        "Develop reporting features, business dashboards, and PDF/Excel exports, while integrating SignalR notifications and implementing Hangfire background jobs for automated processing."
      ],
      technologies: [
        "ASP.NET Core",
        "React.js",
        "Next.js",
        "C#",
        "Entity Framework Core",
        "SQL Server",
        "SignalR",
        "Hangfire",
        "TypeScript"
      ]
    },
    {
      title: ".NET Developer (ASP.NET Core)",
      company: "Halan Company",
      location: "Cairo, Egypt",
      period: "October 2024 – May 2025",
      responsibilities: [
        "Developed and enhanced ERP modules and RESTful APIs for Talabeyah’s B2B platform using ASP.NET Core, Entity Framework Core, and SQL Server, supporting thousands of users and handling millions of database records across order management, inventory, products, and merchant workflows.",
        "Implemented backend workflows and business rules across Inventory, Order Management, and Trips modules.",
        "Developed product-return logic to calculate return eligibility and quantity limits based on product classification, pricing, and value thresholds.",
        "Contributed to frontend development tasks using Angular and React to deliver end-to-end application features."
      ],
      technologies: [
        "ASP.NET Core",
        "C#",
        "Entity Framework Core",
        "SQL Server",
        "RESTful APIs",
        "Angular",
        "React.js",
        "LINQ"
      ]
    },
    {
      title: ".NET Developer (ASP.NET Core)",
      company: "Oasis Computer Systems Company",
      location: "Cairo, Egypt",
      period: "April 2022 – October 2024",
      responsibilities: [
        "Modernized a legacy Insurance Broker System by migrating backend functionality from VB.NET to ASP.NET Core Web API.",
        "Optimized the data-access layer using Dapper and SQL Server while preserving existing business rules and system behavior.",
        "Collaborated directly with clients to gather requirements, customize workflows, and deliver client-specific enhancements.",
        "Supported around 7 clients across Saudi Arabia, the UAE, and Oman through IIS/Windows Server deployments, data migration activities, UAT support, user training, troubleshooting, customization, and post-go-live support."
      ],
      technologies: [
        "ASP.NET Core Web API",
        "C#",
        "Dapper",
        "SQL Server",
        "VB.NET",
        "IIS",
        "Windows Server"
      ]
    }
  ],

  technologies: {
    backEnd: [
      "C#",
      "ASP.NET Core Web API",
      "REST APIs",
      "Minimal APIs",
      "ASP.NET Core MVC",
      "Razor Pages",
      "Entity Framework Core",
      "Dapper",
      "LINQ",
      "SignalR",
      "Hangfire",
      "FluentValidation",
      "AutoMapper"
    ],
    frontEnd: [
      "React.js",
      "Vite",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Redux Toolkit (RTK)",
      "React Query (TanStack Query)",
      "Bootstrap",
      "Sass",
      "Tailwind CSS",
      "Material UI",
      "Ant Design",
      "HTML5, CSS3"
    ],
    technicalKnowledge: [
      "Clean Architecture",
      "CQRS with MediatR",
      "Vertical Slice Architecture",
      "ABP Framework",
      "SOLID Principles",
      "Repository Pattern with Unit of Work",
      "Design Patterns",
      "Performance Optimization",
      "Agile Methodologies & Scrum"
    ],
    libraries: [
      "Microsoft SQL Server",
      "MongoDB",
      "RabbitMQ",
      "Redis",
      "Git & GitHub",
      "GitHub Actions (CI/CD)",
      "Azure DevOps",
      "Hangfire",
      "MediatR",
      "FluentValidation",
      "AutoMapper",
      "JWT Authentication"
    ],
    familiarWith: [
      "Docker",
      "Angular",
      "Microservices Architecture",
      "Postman & API Testing",
      "Payment Gateway Integration"
    ]
  },

  projects: [
    {
      id: "Sanad-Sales",
      name: "Sanad Sales – Mini ERP System",
      description: "A multi-branch commercial management and mini-ERP application built with ASP.NET Core MVC and .NET 10 to support core trading operations. It encompasses sales invoicing, supplier purchasing, multi-branch inventory tracking, customer and supplier payment settlements, a three-tier Chart of Accounts, payroll administration, and organizational branch hierarchies.",
      purpose: "Sanad Sales began as an independent personal project to study how real-world commercial trading systems operate beyond basic CRUD applications. Ahmed used the platform to explore how interconnected business operations—such as sales invoicing, vendor procurement, branch-level inventory, customer receivables, supplier payables, general ledger accounts, and employee payroll—relate to and influence one another within a unified domain model. The long-term direction is to continue refining these commercial workflows into a practical, adaptable platform that could eventually serve diverse trading and retail businesses. The system is an evolving personal product and has not yet been commercially sold or deployed to active paying clients.",
      portfolioTier: "flagship",
      category: "fullstack",
      role: "Sole Developer — Full-Stack Development, System Architecture & Database Design",
      contribution: "Ahmed independently architected, designed, and implemented the entire application from the ground up. His responsibilities spanned full-system layered architecture across four projects, relational database schema modeling in SQL Server with Entity Framework Core across 22 business entities, developing the ASP.NET Core MVC controllers and Razor presentation layer with the Velzon administrative dashboard, structuring multi-branch and company scoping, modeling the three-tier Chart of Accounts and transaction journals, establishing the dual Identity and audit user subsystems, and mapping core operational workflows across sales, purchasing, inventory, and payroll.",
      github: "https://github.com/AhmedIbrahim-tech/Sanad-Sales",
      liveDemo: "https://sanadsales.runasp.net/",
      techStack: [
        "ASP.NET Core MVC",
        ".NET 10",
        "C#",
        "MVC",
        "Entity Framework Core",
        "SQL Server",
        "ASP.NET Core Identity",
        "FluentValidation",
        "Bootstrap 5",
        "ApexCharts"
      ],
      architecture: [
        "N-Tier Layered Architecture: Structured across four physical projects—Core (domain models, ViewModels, validation contracts), Infrastructure (ApplicationDBContext, EF Core configurations, migrations, Unit of Work, repositories), Services (business services and file management), and Web (MVC controllers, Razor views, custom middleware, and static assets).",
        "Relational Data Modeling & Multi-Branch Scoping: Implements a single-database, multi-branch commercial model across 22 primary business entities. Every operational record—including stocks, invoices, payments, employee rosters, and financial journals—carries mandatory BranchId and CompanyId foreign keys, enabling branch-level operational scoping and consolidated company-level organization.",
        "Data Access & Transaction Patterns: Implements an ApplicationDBContext utilizing Entity Framework Core 10 with SQL Server. Core administration workflows employ a GenericRepository<T> and UnitOfWork coordinating database transactions (IDbContextTransaction), while high-throughput business modules utilize direct DbContext change tracking and LINQ projections.",
        "Dual Authentication & Audit Architecture: Integrates ASP.NET Core Identity (ApplicationUser, IdentityRole, RoleManager) for session authentication alongside a domain-level operator entity (TblUser and TblUserType). The operator's UserId is recorded across all operational records to establish traceability for transactions, invoices, and inventory modifications.",
        "Presentation Pipeline & Error Handling: Built with ASP.NET Core MVC and Razor Runtime Compilation, styled with the Themesbrand Velzon admin dashboard and bilingual Arabic/English layout support. Features a custom error-handling middleware (CustomErrorMiddleware) that intercepts unhandled runtime exceptions and routes requests to structured HTTP error endpoints.",
        "Connected Domain Schema: Structurally connects procurement, inventory, sales, receivables, payables, and payroll through shared relational keys. Rather than relying on rigid hidden background triggers, the schema explicitly binds supplier receipts and customer invoices to common stock records and fiscal transaction journals."
      ],
      features: [
        "Sales & Customer Management: Customer directory management, sales invoice creation with line items referencing inventory items, and customer payment tracking recording total amounts, paid installments, and remaining receivable balances.",
        "Purchases & Supplier Operations: Supplier credentials management, purchase invoice recording with itemized purchase quantities and cost unit prices (CPU), and accounts payable disbursement tracking with remaining vendor balances.",
        "Multi-Branch Inventory & Stock: Branch-scoped inventory tracking quantities on hand, sale unit prices, latest purchase acquisition costs, minimum threshold alert quantities (StockTreshHoldQuantity), product barcodes, and manufacturing/expiry dates.",
        "Finance & 3-Tier Chart of Accounts: Structured three-tier financial classification organizing accounts into Account Heads (Major Class), Account Controls (Group Level), and Account Sub-Controls (Subsidiary Accounts), linked to fiscal years (FinancialYear) and recording debit/credit journal entries (TblTransaction).",
        "Human Resources & Payroll: Staff profiles capturing personal identification, contact details, designations, and base monthly salaries, accompanied by monthly payroll disbursement vouchers tracking payment dates, salary periods, and payroll invoice numbers.",
        "Company & Branch Administration: Hierarchical organizational structure defining parent enterprises, operational branches, and facility classifications (Branch Types) that serve as the scoping boundary for all commercial data.",
        "System Administration & Security: ASP.NET Core Identity authentication with an active login gate, role management via RoleController, user profile picture uploads via FileService, and operator attribution across business tables.",
        "Administrative Dashboard & Operational Views: Provides an administrative dashboard with KPI-style cards, ApexCharts visualizations, and tabular operational views for navigating and reviewing business records across the system."
      ],
      challenges: [
        "Understanding the Business Domain: The primary challenge for Ahmed was not writing code, but understanding how commercial trading businesses operate in the real world beyond isolated screens. He had to learn the operational dynamics of sales workflows, vendor purchasing, inventory cost valuations, customer credit and supplier debit balances, hierarchical chart of accounts structures, payroll processing, and multi-branch rollups, figuring out how each operational event impacts the broader enterprise.",
        "Turning Complexity Into a Coherent System: Structuring a single application and relational data model that keeps these multifaceted business operations organized, understandable, and connected without unnecessary bloat. Designing the 22-entity schema so that branches, companies, invoices, stock lots, accounts, and users coexist coherently required continuous refinement, and the platform continues to evolve as Ahmed's understanding of the commercial domain deepens."
      ],
      outcome: "Sanad Sales currently provides a broad commercial-management foundation spanning sales, purchasing, inventory, customer and supplier balances, accounting structures, payroll, and branch administration. Developed independently as an exploratory personal product project to master complex business domains and evaluate future commercial productization, the platform is deployed live at sanadsales.runasp.net and continues to be refined as Ahmed expands his understanding of real-world commercial workflows. The system has not yet been commercially sold."
    },
    {
      id: "E-Commerce-Platform",
      name: "E-Commerce Platform",
      description: "A modular e-commerce platform and backend API built with ASP.NET Core Web API and .NET following Clean Architecture across five physical layers, utilizing CQRS with MediatR. It covers end-to-end retail operations including product catalog management, cached shopping carts, inventory validation, multi-step checkout, flexible delivery options, dynamic promotions, customer reviews, multi-channel payments, and transactional notifications.",
      purpose: "E-Commerce-Platform began as a personal learning project, but its focus quickly expanded beyond technology exploration into domain-driven development. Ahmed used the project to deeply understand how digital commerce operates as a business domain—mapping real-world operations across product catalogs, inventory validation, shopping carts, multi-step checkouts, delivery logistics, promotional discounts, and payment methods. The project was structured with the long-term perspective of evaluating whether it could evolve into a viable commercial product. It remains an active personal project for learning and domain exploration, and has not yet been commercially sold or deployed for active retailers.",
      portfolioTier: "flagship",
      category: "fullstack",
      role: "Sole Developer — Full-Stack Development, Architecture & Database Design",
      contribution: "Ahmed designed and developed the entire application independently. His responsibilities spanned full-system Clean Architecture design across five physical layers, building the RESTful ASP.NET Core Web API backend, configuring the companion Next.js frontend client, designing the relational database schema in SQL Server with EF Core, structuring application commands and queries using CQRS and MediatR, implementing JWT authentication with role-based policies and Google OAuth 2.0, establishing inventory validation and checkout workflows, and integrating external services including Paymob payment processing, MailKit email delivery, Azure Translation API, and SignalR notifications.",
      github: "https://github.com/AhmedIbrahim-tech/E-Commerce-Platform",
      techStack: [
        "ASP.NET Core Web API",
        ".NET",
        "C#",
        "Next.js",
        "Clean Architecture",
        "CQRS with MediatR",
        "SQL Server",
        "Entity Framework Core",
        "Memory Cache",
        "JWT & RBAC",
        "Google OAuth 2.0",
        "Paymob Gateway",
        "SignalR",
        "MailKit",
        "Azure Translation API",
        "Serilog"
      ],
      architecture: [
        "Five-Layer Clean Architecture: Structured into five physically separated layers—Presentation, Service, Core, Domain, and Infrastructure—enforcing strict inward dependency flow to decouple retail business rules from web frameworks and persistence mechanisms.",
        "Presentation & Service Layers: The Presentation layer hosts ASP.NET Core Web API controllers managing HTTP requests, request/response DTOs, and input validation via FluentValidation. The Service layer orchestrates application workflows, service interfaces, and cross-cutting application logic.",
        "Core Layer (CQRS with MediatR): Separates write mutations (Commands) from read data retrieval (Queries) using MediatR. Command handlers execute state-changing operations, while query handlers handle server-side filtering, sorting, and pagination with explicit manual mapping to DTOs.",
        "Domain Layer (Core Modeling): Contains business entities, aggregates, domain enums, and domain events. Encapsulates fundamental retail rules across Users (Admin, Customer, Employee), Products, Categories, CartItems, Orders, Delivery Types, and Promotions without external dependencies.",
        "Infrastructure Layer & Data Persistence: Implements Entity Framework Core with SQL Server using the Repository Pattern, in-memory caching (MemoryCache) for cart sessions, structured logging with Serilog, automated database seeding, and external integrations with MailKit and Azure Translation API.",
        "Payment Integration (Paymob Gateway): Encapsulates Paymob payment processing within the Infrastructure layer alongside Cash on Delivery and Cash at Branch options, connecting payment state directly into the checkout and order placement lifecycle."
      ],
      features: [
        "Product & Catalog Management: Complete CRUD operations for products, categories, and inventory tracking, featuring multi-criteria search with category filtering, price bounds, rating filters, and server-side pagination.",
        "Shopping Cart Management: Persistent cart operations supporting both guest visitors and authenticated users, leveraging in-memory caching for low-latency item additions and quantity updates.",
        "Inventory Validation: Pre-checkout stock validation ensuring item availability and inventory consistency before orders can proceed to placement.",
        "Checkout & Order Management: Multi-step checkout workflow managing shipping address entry, delivery method selection, order total calculation with promotions, and historical order tracking.",
        "Flexible Delivery Options: Built-in logistics support for five distinct fulfillment methods: Standard delivery, Express delivery, Same Day delivery, Scheduled delivery, and Pickup from Branch.",
        "Multi-Channel Payments: Payment processing supporting online digital payments through the Paymob gateway alongside offline options (Cash on Delivery and Cash at Branch).",
        "Promotions & Discounts: Dynamic promotional rules supporting percentage-based and fixed discounts applied dynamically to product pricing and checkout subtotals.",
        "Customer Reviews & Ratings: User feedback module enabling verified customers to submit product ratings and text reviews.",
        "Email & Real-Time Notifications: Automated transactional emails via MailKit for order confirmations, email verification, and password resets, paired with SignalR WebSockets broadcasting live notifications for order status changes and promotions.",
        "Authentication & Access Control: Stateless JWT token authentication, Google OAuth 2.0 social login, and Role-Based Access Control (RBAC) enforcing distinct permission policies for Admin, Employee, and Customer roles."
      ],
      challenges: [
        "Domain Discovery & Operational Flow: The primary product challenge was understanding how the retail commerce domain functions end-to-end rather than merely generating CRUD endpoints. Translating the interconnected lifecycle of product catalogs, live inventory validation, cart caching, promotional rules, multi-step checkout, and delivery logistics into a cohesive software architecture required extensive domain analysis and iterative workflow mapping.",
        "Payment Gateway Integration & Lifecycle Learning: The most significant technical learning hurdle was implementing Paymob and understanding online payment workflows. Having no prior practical experience with payment gateway integrations, Ahmed had to research digital payment mechanics from first principles—understanding how online checkout tokens and redirect flows operate, how digital payment methods integrate alongside offline options (Cash on Delivery / Branch Pickup), and how payment state transitions coordinate with order creation."
      ],
      outcome: "The platform currently delivers a complete technical and functional foundation for an e-commerce platform, encompassing catalog management, in-memory cart caching, multi-step checkout, inventory validation, five delivery methods, Paymob payment processing, promotions, customer reviews, role-based security, and external communication services. Developed independently for technical learning, business domain exploration, and evaluating future commercial productization, the system is actively maintained as a reference platform and has not yet been commercially sold or deployed for active retailers."
    },
    {
      id: "VitaGymPortalWeb",
      name: "Vita Gym Portal",
      description: "A web application built with ASP.NET Core MVC and .NET 10 to manage daily gym operations, subscriptions, and facility workflows. Developed as an independent personal product project, it is being iteratively refined against real-world gym requirements with the goal of evolving into a commercial product for fitness centers.",
      purpose: "VitaGymPortalWeb began as a personal product project with a commercial goal. Rather than an internal experiment or client commission, the project is being developed by studying day-to-day gym workflows and progressively incorporating practical operational requirements—including member management, trainer schedules, session bookings, attendance validation, and payment tracking. The ultimate objective is to evolve the application into a practical, marketable product suitable for gym businesses. The platform is currently being refined and has not yet been commercially sold or deployed in active client production.",
      portfolioTier: "flagship",
      category: "fullstack",
      role: "Sole Developer — Full-Stack Development, Architecture & Database Design",
      contribution: "Ahmed designed and built the entire application independently. His responsibilities spanned full-system architecture and database schema design in SQL Server, backend and presentation development in ASP.NET Core MVC 10, structuring business services across ten domain modules in Clean Architecture, implementing the custom permission-based authorization engine on Microsoft Identity, and crafting end-to-end operational workflows from member check-in to payment recording.",
      github: "https://github.com/AhmedIbrahim-tech/VitaGymPortalWeb",
      techStack: [
        "ASP.NET Core MVC 10",
        ".NET 10",
        "C#",
        "SQL Server",
        "Entity Framework Core 10",
        "Microsoft Identity",
        "FluentValidation",
        "Bogus",
        "NToastNotify",
        "Attachment Service",
        "Email Service"
      ],
      architecture: [
        "Clean Architecture Layering: Partitioned into Web, Core, and Infrastructure layers with inward dependency flow, keeping domain business rules decoupled from presentation and persistence technologies.",
        "Presentation & Pipeline (Web Layer): Implements ASP.NET Core MVC controllers with feature-organized Razor views, custom GlobalExceptionHandlingMiddleware for centralized error responses, encapsulated ViewComponents (UserInfo), and modular configuration extensions.",
        "Feature-Based Modular Core (Core Layer): Business logic is structured into ten distinct domain modules (Accounts, Analyticals, Attendances, Bookings, Members, Memberships, Payments, Plans, Sessions, Trainers, UserManagement) with dedicated ViewModels, FluentValidation validators, and custom EntityMappers extension methods.",
        "Data Access & Transaction Coordination (Infrastructure Layer): Utilizes Entity Framework Core 10 with SQL Server, separate entity configurations, a GenericRepository<T> complemented by entity-specific repositories (such as MemberRepository), and a UnitOfWork coordinating multi-repository transactions.",
        "Custom Permission-Based Authorization: Overlays Microsoft Identity role-based access (SuperAdmin, Admin, Trainer, Member) with a custom PermissionAuthorizationHandler and [RequirePermission] attributes, enforcing module-organized permission claims while protecting the SuperAdmin role.",
        "Domain Modeling & Synthetic Data Seeding: Defines domain entity groups (Users, Sessions, Membership, Attendances, HumanResources with TrainerPayroll/LeaveRequest) and integrates Bogus for structured test data seeding during development."
      ],
      features: [
        "Member Management: Full lifecycle CRUD with health record tracking for workout planning, indexed search by phone or name, and photo uploads handled by AttachmentService.",
        "Trainer Management & HR: Complete trainer profiles, specialty tracking, scheduling availability, and session assignments, backed by domain entities for trainer payroll and leave requests.",
        "Sessions & Booking: Scheduled workout sessions organized by category with capacity tracking, member booking reservation workflows, and trainer attendance marking.",
        "Memberships & Plans: Flexible membership plans with customizable durations and pricing tiers, plan activation toggles, subscription tracking, and renewal/cancellation handling.",
        "Attendance Management: Front-desk member check-in workflow with automated active membership verification before entry and individual member attendance logs.",
        "Payments & Invoicing: Member payment recording across cash, card, online, and bank transfer methods, automated lifetime payment calculations, and transaction histories.",
        "User & Role Administration: System user management with account status toggles (enable/disable), dynamic role creation with user counts, and granular permission assignment.",
        "Analytics & Reporting: Operational dashboard tracking active member statistics, session booking and attendance ratios, trainer utilization, and overall financial summaries."
      ],
      challenges: [
        "Domain Discovery & Operational Requirements: The primary challenge was deciphering the practical gym business domain rather than implementing code. The work involved identifying how gym staff operate day-to-day—such as handling expired memberships during check-in and managing session capacity—and translating those operational realities into cohesive software models.",
        "Workflow Clarity & Interface Usability: Translating complex multi-step gym processes (such as plan selection, subscription date calculations, and payment recording) into self-explanatory screens. The focus has been on minimizing necessary operator training by keeping workflows intuitive, avoiding feature bloat, and prioritizing practical daily utility over superfluous technical complexity."
      ],
      outcome: "The delivered system provides a complete functional foundation for gym operations across ten core modules—spanning member profiles, trainer scheduling, session bookings, subscription lifecycles, attendance check-in, multi-channel payment logging, custom permission security, and operational reporting. As a personal product project, it continues to be actively refined and aligned with gym business requirements with the goal of offering it to commercial fitness centers."
    },
    {
      id: "AppForge",
      name: "AppForge – Full-Stack Application Generator",
      description: "A developer-facing application generator and configuration studio for scaffolding structured .NET and frontend projects with selectable Clean Architecture, persistence (EF Core / Dapper), frontend (React / Angular), and state-management options without runtime lock-in.",
      purpose: "AppForge began as a personal developer-tool project aimed at reducing the repetitive setup involved in starting modern full-stack applications. Ahmed used the project not only to learn and experiment with different architectural stacks, but also to explore whether a configurable, manifest-driven application generator could become a practical product for developers. The project is actively maintained as an independent product exploration and has not yet been commercially sold or adopted in commercial production.",
      portfolioTier: "flagship",
      category: "fullstack",
      role: "Sole Developer — Product Design, Full-Stack Development & Generator Architecture",
      contribution: "Ahmed designed and built the entire application independently. His responsibilities spanned the core product concept, designing the generator architecture, building the interactive React 19 Stack Builder studio, modeling the manifest-driven configuration system (.fullstack-app.json), creating the architecture-aware scaffolding templates for .NET and frontend frameworks, and implementing the end-to-end vertical feature generation workflow (create-fullstack-feature).",
      github: "https://github.com/AhmedIbrahim-tech/AppForge",
      liveDemo: "https://appforgehub.vercel.app/",
      techStack: [
        "Studio: React 19",
        "Studio: TypeScript",
        "Studio: Vite",
        "Studio: Tailwind CSS",
        "Generated: .NET 10",
        "Generated: Clean Architecture",
        "Generated: CQRS with MediatR",
        "Generated: EF Core & Dapper",
        "Generated: PostgreSQL & SQL Server",
        "Generated: React & Angular",
        "Generated: Zustand & Redux Toolkit",
        "Manifest: .fullstack-app.json"
      ],
      architecture: [
        "Interactive Stack Builder Studio: A browser-based configuration studio built with React 19, TypeScript, and Vite. It allows developers to interactively select architectural profiles (Full Stack, Backend-Only, Frontend-Only) and inspect the generated directory tree, .fullstack-app.json manifest, and CLI execution commands in real time.",
        "Manifest-Driven Source of Truth (.fullstack-app.json): Implements a canonical JSON configuration manifest that records project architectural choices, runtime targets (.NET 10 / 9 / 8), ORM selection (EF Core / Dapper), database engine (PostgreSQL, SQL Server, SQLite), and client libraries for ongoing CLI scaffolding.",
        "Architecture-Aware Scaffolding: Dynamically adjusts emitted solution structures based on architectural choices. Emits Clean Architecture solutions with strict layer boundaries (Domain, Application, Infrastructure, API, Client), tailoring data access folders for EF Core or Dapper and frontend modules for React 19 or Angular.",
        "Vertical Feature Slice Generator (create-fullstack-feature): Provides an automated workflow to scaffold full-stack vertical feature slices on demand (Domain models/events, MediatR Commands/Queries in Application, EF Core/Dapper persistence in Infrastructure, REST API controllers, and frontend TypeScript services/pages).",
        "Zero Runtime Lock-In: Generates standard, idiomatic C# (.NET 10) and modern TypeScript codebases with standard package dependencies that developers own completely, without proprietary runtime frameworks or generator lock-in."
      ],
      features: [
        "Interactive Stack Builder: Browser-based visual configuration studio allowing developers to assemble application stacks with live previews of directory trees, manifest files, and CLI commands.",
        "Modular Project Profiles: Support for three distinct scaffolding modes—Full Stack applications, Backend-Only API services, or Frontend-Only single page applications.",
        "Configurable Backend Architecture: Scaffolding of Clean Architecture solutions supporting CQRS with MediatR or traditional Application Services across .NET 10, .NET 9, and .NET 8 runtimes.",
        "Persistence & Database Options: Configurable data access layers supporting Entity Framework Core or lightweight Dapper, with schema support for PostgreSQL, SQL Server, and SQLite.",
        "Frontend Framework Selection: Generation of modern client architectures supporting React 19 (with Vite or Next.js) or Angular CLI, paired with Tailwind CSS or Bootstrap.",
        "State Management Scaffolding: Tailored state management setups integrating Zustand, Redux Toolkit, or NgRx based on the selected frontend framework.",
        "Vertical Feature Slice Generator: CLI tool (create-fullstack-feature <FeatureName>) for generating end-to-end full-stack feature slices spanning Domain, Application, Infrastructure, API, and Frontend code.",
        "Manifest-Driven Workflow: Automated generation and maintenance of .fullstack-app.json configuration manifests ensuring ongoing project consistency during future code generation."
      ],
      challenges: [
        "Combinatorial Scaffolding Consistency: The primary architectural challenge was ensuring that generated code remains coherent and idiomatic across numerous permutations of backend runtimes (.NET 10/9/8), data-access layers (EF Core vs. Dapper), frontend frameworks (React 19 vs. Angular), and state-management libraries (Zustand vs. Redux). Coordinating template logic so that layer boundaries, namespace imports, and dependency injection registrations align properly without runtime lock-in required a rigorous manifest-driven design.",
        "Developer Experience vs. Configuration Complexity: From a product perspective, the key challenge was determining the right level of abstraction for developer tooling. Rather than exposing an overwhelming matrix of configuration flags that increases cognitive load, the studio was designed around cohesive profiles and an interactive visual builder to make modern Clean Architecture setups accessible and self-explanatory."
      ],
      outcome: "AppForge currently provides a functional developer-facing studio and scaffolding workflow that supports configurable project profiles, manifest-driven setup via .fullstack-app.json, selectable backend and frontend stacks, and on-demand vertical feature generation. Deployed and accessible as a live web studio at appforgehub.vercel.app, the platform remains an independent personal product project actively maintained for technical exploration and developer workflow refinement, and has not yet been commercially sold or adopted in commercial production."
    },
    {
      id: "Bookify",
      name: "Bookify - Library Management",
      description: "A comprehensive digital library system for managing book inventory, rentals, and subscriber activities.",
      portfolioTier: "selected",
      category: "backend",
      features: [
        "Advanced Catalog Search and filtering",
        "Subscription-based rental workflows",
        "Automated Late Fee calculation engine",
        "User Activity tracking and history"
      ],
      github: "https://github.com/AhmedIbrahim-tech/Bookify",
      techStack: ["ASP.NET Core MVC", "Entity Framework Core", "SQL Server", "jQuery UI", "AutoMapper"],
      architecture: [
        "Layered Architecture separating UI, Domain, and Data logic",
        "FluentValidation for complex business rules enforcement",
        "DTO mapping for secure data exposure across layers",
        "Automated Email notifications for rental reminders"
      ],
      challenges: [
        "Implementing a complex rental logic that handles varying subscription limits and return deadlines.",
        "Managing large book catalogs with efficient search indexing and pagination."
      ],
      outcome: "Streamlined library operations for small-to-medium institutions, resulting in a 25% increase in rental throughput and better inventory accuracy."
    },
    {
      id: "Filesharing",
      name: "Filesharing - Secure Storage",
      description: "High-security file management and sharing platform with end-to-end encryption and access controls.",
      portfolioTier: "selected",
      category: "backend",
      features: [
        "Encrypted File Storage and secure transfer",
        "Granular Access Permissions per file/folder",
        "Activity Logging and audit trails",
        "High-performance Upload/Download handling"
      ],
      github: "https://github.com/AhmedIbrahim-tech/Filesharing",
      techStack: ["ASP.NET Core MVC", "Azure Blob Storage", "SQL Server", "Identity Framework", "Cryptography.Net"],
      architecture: [
        "Hybrid storage solution leveraging Azure Blob Storage for binary data",
        "AES-256 Encryption for files at rest and in transit",
        "Multi-factor Authentication (MFA) integration support",
        "Background task processing for file virus scanning"
      ],
      challenges: [
        "Ensuring data privacy while maintaining high-speed performance for large file transfers.",
        "Building a reliable encryption key management system within the Identity framework."
      ],
      outcome: "Built a robust, secure sharing environment used for confidential document exchange with zero recorded security breaches."
    },
    {
      id: "Instagram-Platform",
      name: "SocialConnect (Instagram Clone)",
      description: "Full-stack social engagement platform featuring real-time interactions, media sharing, and relationship graphs.",
      portfolioTier: "selected",
      category: "fullstack",
      features: [
        "Real-time Feed generation and discovery",
        "Image Processing and optimization engine",
        "Instant Interactions (Likes, Comments, Follows)",
        "Dynamic User Profiles and relationship management"
      ],
      github: "https://github.com/AhmedIbrahim-tech/Instagram-Platform",
      techStack: ["ASP.NET Core MVC", "SignalR", "SQL Server", "EF Core", "Cloudinary API", "SASS"],
      architecture: [
        "Real-time event driven architecture using SignalR for notifications",
        "Optimized database schema for fast social graph traversals",
        "Media CDN integration for global content delivery",
        "Micro-services ready service layer for core social features"
      ],
      challenges: [
        "Optimizing the feed algorithm to handle social relationships efficiently as the user base scales.",
        "Handling high-volume concurrent media uploads with background processing."
      ],
      outcome: "Scalable social platform that simulates production environments, demonstrating mastery of real-time web and complex data relationships."
    },
    {
      id: "TopMovies",
      name: "TopMovies - Discovery Engine",
      description: "Data-driven movie discovery platform integrated with external media APIs and personalized collections.",
      portfolioTier: "selected",
      category: "frontend",
      features: [
        "Real-time Movie searching and detailed info extraction",
        "Personalized Watchlists and favorites",
        "Trending/Top Rated curation algorithms",
        "Responsive media-rich UI"
      ],
      github: "https://github.com/AhmedIbrahim-tech/TopMovies",
      techStack: ["ASP.NET Core MVC", "TMDB API", "SQL Server", "Memory Cache", "Bootstrap 5"],
      architecture: [
        "API-First design consuming TMDB external services",
        "Aggressive Memory Caching for high-performance API response times",
        "Clean ViewComponent architecture for reusable UI sections",
        "Responsive image optimization for media galleries"
      ],
      challenges: [
        "Managing API rate limits while providing real-time search across millions of records.",
        "Synchronizing local user preferences with dynamic remote data."
      ],
      outcome: "Fast, immersive movie browsing experience with sub-200ms page loads and highly engaged user interactions."
    }
  ]
};
