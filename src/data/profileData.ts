// Profile data based on Ahmed Ibrahim's resume

export const profileData = {
  name: "Ahmed Ibrahim Ahmed",
  title: "Full Stack (.NET Core & React) Developer",
  location: "Mit-Ghamr, Dakahlia, Egypt",
  phone: "01007691743",
  email: "ahmedeprahim.official@gmail.com",
  github: "https://github.com/AhmedIbrahim-tech",
  linkedin: "https://www.linkedin.com/in/ahmedeprahim",
  facebook: "https://www.facebook.com/ahmedeprahima/",
  whatsapp: "https://wa.me/201007691743",

  about: [
    "Full-stack developer with 3+ years of experience building scalable web applications and enterprise systems",
    "Specializing in .NET Core backend and React frontend architecture",
    "Currently working remotely with HUED, a Saudi-based software house"
  ],

  education: {
    institution: "Thebes Academy",
    degree: "Bachelor of Computer Science, 2016 - 2020",
    grade: "Very Good",
    project: "School Management System (Grade: Excellent)",
    projectDescription: "Web platform for schools, students, and parents to manage attendance, grades, and communication."
  },

  experience: [
    {
      title: "Full Stack Developer (.NET Core & React)",
      company: "HUED Company",
      location: "Remote - Riyadh, Saudi Arabia",
      period: "June 2025 - Present",
      responsibilities: [
        "Develop and deliver full-stack solutions for clients across healthcare, education, and agriculture sectors.",
        "Design and implement responsive React/TypeScript frontends with seamless .NET Core API integration.",
        "Participate in Agile ceremonies, conduct code reviews, and manage CI/CD deployment pipelines."
      ],
      technologies: ["React.js", "TypeScript", ".NET Core", "C#", "SQL Server", "Entity Framework Core", "Git", "Agile"]
    },
    {
      title: "ASP.NET Core Developer",
      company: "Halan Company",
      location: "Onsite - Mall of Arabia, 6th of October, Cairo",
      period: "October 2024 - June 2025",
      responsibilities: [
        "Architect and develop B2B/B2C order management and ERP modules for retail operations.",
        "Optimize inventory and logistics workflows through high-performance API development.",
        "Build scalable web applications leveraging .NET Core, Entity Framework Core, and SQL Server."
      ],
      technologies: [".NET Core", "C#", "ASP.NET Core API", "SQL Server", "Entity Framework Core", "LINQ"]
    },
    {
      title: "ASP.NET Core Developer",
      company: "Oasis Computer Systems Company",
      location: "Onsite - Nasr City, Cairo, Egypt",
      period: "April 2022 - October 2024",
      responsibilities: [
        "Develop comprehensive insurance, account management, and e-billing systems.",
        "Integrate secure third-party payment gateways into web-based platforms.",
        "Enhance client registration, customer services, sales leads, and user account management features.",
        "Optimize client, sales, and service modules using Dapper ORM with .NET Core."
      ],
      technologies: [".NET Core", "C#", "ASP.NET Core MVC", "SQL Server", "Dapper", "Payment Gateways"]
    },
    {
      title: "Web Designer",
      company: "Infosus Company",
      period: "May 2019 - September 2021",
      responsibilities: [
        "Design and develop user-centric, responsive websites for e-commerce and billing platforms.",
        "Manage UI/UX design, content updates, and front-end performance optimizations."
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Sass", "jQuery"]
    }
  ],

  technologies: {
    backEnd: [
      "C# Programming Language",
      "ASP.NET Core (MVC, API)",
      "Minimal APIs",
      "Razor Pages",
      "Microsoft SQL Server",
      "Entity Framework Core",
      "Dapper (Micro ORM)",
      "Language-Integrated Query (LINQ)"
    ],
    frontEnd: [
      "HTML5, CSS3",
      "Bootstrap Framework",
      "Sass/SCSS",
      "React.js",
      "Next.js",
      "Vite",
      "Redux State Management",
      "JavaScript and TypeScript",
      "jQuery Library",
      "Tailwind CSS",
      "Material UI / Ant Design"
    ],
    technicalKnowledge: [
      "Agile & Scrum Methodologies",
      "SignalR for Real-Time Communication",
      "Version Controls (GitHub, Azure)",
      "Repository Pattern with Unit of Work",
      "CQRS and Mediator Patterns",
      "SOLID Principles",
      "Clean Architecture",
      "Design Patterns",
      "Performance Optimization"
    ],
    familiarWith: [
      "Angular Framework",
      "Docker Basics for Development & Deployment",
      "Microservices Architecture",
      "Postman & API Testing",
      "Payment Gateway Integration"
    ],
    libraries: [
      "MediatR",
      "Serilog",
      "FluentValidation",
      "AutoMapper",
      "JWT Authentication",
      "Identity Framework",
      "Redis",
      "Hangfire"
    ]
  },

  projects: [
    {
      id: "E-Commerce-Platform",
      name: "E-Commerce Platform",
      description: "Modern, high-performance e-commerce application built with Next.js and ASP.NET Core.",
      features: [
        "Server-side rendering (SSR), real-time inventory tracking, Stripe payments, and advanced search."
      ],
      github: "https://github.com/AhmedIbrahim-tech/E-Commerce-Platform",
      role: "Lead Full Stack Developer",
      techStack: [".NET Core 8", "Next.js 14", "Tailwind CSS", "SQL Server", "Redis", "Stripe API"],
      architecture: [
        "Microservices-ready architecture with Next.js 14 App Router",
        "Repository and Unit of Work patterns for back-end data consistency",
        "CQRS pattern using MediatR for scalable service-to-service communication",
        "JWT-based security with high-performance Redis caching"
      ],
      challenges: [
        "Optimizing high-traffic inventory management using Redis caching to prevent race conditions during flash sales.",
        "Integrating multiple payment gateways (Stripe, PayPal) while maintaining a unified checkout experience.",
        "Implementing a complex filtering system across thousands of products with millisecond response times."
      ],
      outcome: "Successfully delivered a production-ready platform that handles 10k+ daily users with 99.9% uptime and significantly improved conversion rates.",
      team: [
        { name: "Ahmed Ibrahim", role: "Backend Architect" }
      ]
    },
    {
      id: "VitaGymPortalWeb",
      name: "Vita Gym Portal",
      description: "Enterprise-grade gym management ecosystem with real-time class scheduling and member analytics.",
      features: [
        "Dynamic Class Scheduling with capacity tracking",
        "Automated Membership Lifecycle management",
        "Integrated Billing and Payment history",
        "Responsive Admin Dashboard for resource allocation"
      ],
      github: "https://github.com/AhmedIbrahim-tech/VitaGymPortalWeb",
      techStack: ["ASP.NET Core MVC", "Entity Framework Core", "SQL Server", "Chart.js", "Bootstrap 5"],
      architecture: [
        "Monolithic MVC architecture designed for rapid deployment",
        "Repository pattern for clean data access abstraction",
        "Role-based Access Control (RBAC) for different administrative levels",
        "Client-side validation and server-side model binding for robust data integrity"
      ],
      challenges: [
        "Synchronizing real-time class availability across multiple concurrent user sessions.",
        "Designing a flexible membership system that handles various subscription models and renewal logic."
      ],
      outcome: "Delivered a centralized platform that reduced administrative overhead by 40% and improved member engagement through better visibility of classes and progress."
    },
    {
      id: "Bookify",
      name: "Bookify - Library Management",
      description: "A comprehensive digital library system for managing book inventory, rentals, and subscriber activities.",
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
