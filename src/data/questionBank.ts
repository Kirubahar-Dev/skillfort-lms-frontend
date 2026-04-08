export type PlaygroundLanguage = "python" | "javascript" | "java" | "sql" | "bash" | "html";

export type QuestionSection = {
  title: string;
  questions: string[];
};

export type TechTrack = {
  slug: string;
  title: string;
  category: string;
  description: string;
  conceptNote: string;
  theory: QuestionSection[];
  coding: string[];
  playgroundLanguage: PlaygroundLanguage;
  starterCode: string;
};

const starterSnippets: Record<PlaygroundLanguage, string> = {
  python: `def palindrome(text: str) -> bool:\n    cleaned = ''.join(ch.lower() for ch in text if ch.isalnum())\n    return cleaned == cleaned[::-1]\n\nprint(palindrome("madam"))`,
  javascript: `function moveZeros(arr) {\n  const values = arr.filter((item) => item !== 0);\n  return values.concat(Array(arr.length - values.length).fill(0));\n}\nconsole.log(moveZeros([1,0,2,0,3]));`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("SkillFort Java Lab");\n  }\n}`,
  sql: `CREATE TABLE employees(id INTEGER PRIMARY KEY, name TEXT, salary INTEGER);\nINSERT INTO employees VALUES (1, 'Asha', 45000), (2, 'Rahul', 62000);\nSELECT * FROM employees ORDER BY salary DESC;`,
  bash: `#!/bin/bash\nfor item in apple banana cherry; do\n  echo $item\ndone`,
  html: `<section class=\"hero\">\n  <h1>SkillFort Frontend Lab</h1>\n  <p>Edit HTML, CSS, and JS to preview instantly.</p>\n</section>`,
};

const pythonTrack: TechTrack = {
  slug: "python",
  title: "Python",
  category: "Programming Languages",
  description: "Python interview bank with fundamentals, data structures, OOP, advanced topics, and coding practice.",
  conceptNote: "W3-style concept flow: Learn, practice, and run code instantly.",
  theory: [
    {
      title: "Python Fundamentals",
      questions: [
        "What is Python and why is it widely used?",
        "What are Python built-in data types?",
        "Difference between list, tuple, set, and dictionary?",
        "Difference between == and is?",
        "Why is indentation important in Python?",
      ],
    },
    {
      title: "Core Concepts",
      questions: [
        "What are functions and lambda functions?",
        "What are *args and **kwargs?",
        "Difference between iterators and generators?",
        "What is list comprehension and why is it useful?",
        "What is recursion and when should you use it?",
      ],
    },
    {
      title: "OOP, Advanced, and Internals",
      questions: [
        "Explain encapsulation, inheritance, polymorphism, and abstraction with an example.",
        "What is __init__ and what does super() do?",
        "What are decorators and closures?",
        "Difference between shallow copy and deep copy?",
        "What is GIL and how do multithreading and multiprocessing differ?",
      ],
    },
  ],
  coding: [
    "Check palindrome for number or string.",
    "Reverse a string without built-in reverse methods.",
    "Factorial and Fibonacci up to n terms.",
    "Check prime number.",
    "Count vowels and character frequency.",
    "Find second largest number and sort ascending/descending.",
    "Move all zeros to the end while keeping order.",
  ],
  playgroundLanguage: "python",
  starterCode: starterSnippets.python,
};

const djangoTrack: TechTrack = {
  slug: "django",
  title: "Django",
  category: "Backend Frameworks",
  description: "Django bank covering MVT, URLs, views, ORM, templates, middleware, auth, and performance.",
  conceptNote: "Read interview theory and jump into practical Django tasks.",
  theory: [
    {
      title: "Django Basics and Request Flow",
      questions: [
        "What is Django and what are its key features?",
        "How does MVT differ from MVC?",
        "What is the role of settings.py and manage.py?",
        "What are apps.py, wsgi.py, and asgi.py used for?",
        "Explain the request-response lifecycle in Django.",
      ],
    },
    {
      title: "Routing, Views, and ORM",
      questions: [
        "How do URLconf and path/re_path work?",
        "FBV vs CBV and when should you choose each?",
        "Difference between get() and filter() in ORM?",
        "Explain OneToOne, ForeignKey, and ManyToMany relationships.",
        "Difference between select_related() and prefetch_related()?",
      ],
    },
    {
      title: "Templates, Forms, and Security",
      questions: [
        "What is DTL and template inheritance?",
        "Difference between static files and media files?",
        "What is ModelForm and how does validation work?",
        "Authentication vs authorization in Django?",
        "How does Django protect against CSRF attacks?",
      ],
    },
  ],
  coding: [
    "Build a complete employee CRUD app.",
    "Model OneToOne, ForeignKey, and ManyToMany and run ORM operations.",
    "Create FBV and CBV with dynamic URL parameters.",
    "Build ModelForm with validation and saving.",
    "Implement search, filtering, and pagination.",
    "Implement authentication with protected routes.",
  ],
  playgroundLanguage: "python",
  starterCode: `from django.http import HttpResponse\n\ndef hello(request):\n    return HttpResponse("Hello from Django")`,
};

const fastapiTrack: TechTrack = {
  slug: "fastapi",
  title: "FastAPI",
  category: "Backend Frameworks",
  description: "FastAPI bank for routing, validation, middleware, auth, async performance, and scalable design.",
  conceptNote: "API-first learning with production-style coding assignments.",
  theory: [
    {
      title: "FastAPI Foundations",
      questions: [
        "What is FastAPI and why is it used?",
        "How do you create and run a basic FastAPI app?",
        "What is Uvicorn and why is it required?",
        "How do path and query parameters work?",
        "Difference between Query, Path, and Body?",
      ],
    },
    {
      title: "Validation, Security, and Performance",
      questions: [
        "How does Pydantic validation work in FastAPI?",
        "What is response_model and why is it useful?",
        "How do you implement middleware and global exception handling?",
        "How do you implement JWT authentication and protected routes?",
        "How does async/await improve FastAPI performance?",
      ],
    },
  ],
  coding: [
    "Build CRUD with Pydantic models and database integration.",
    "Implement request body validation and HTTPException handling.",
    "Integrate SQLAlchemy and perform CRUD operations.",
    "Implement filtering, sorting, pagination, and file upload.",
    "Implement JWT auth and protected routes.",
    "Build a WebSocket-based real-time endpoint.",
  ],
  playgroundLanguage: "python",
  starterCode: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/health")\ndef health():\n    return {"status": "ok"}`,
};

const flaskTrack: TechTrack = {
  slug: "flask",
  title: "Flask",
  category: "Backend Frameworks",
  description: "Flask bank covering architecture, routing, templates, forms, auth, API development, testing, and deployment.",
  conceptNote: "Learn Flask concepts then solve interview-style coding challenges.",
  theory: [
    {
      title: "Flask Basics and Architecture",
      questions: [
        "What is Flask and when would you choose it?",
        "What are Blueprints and application factory pattern?",
        "How does routing work in Flask?",
        "What is the difference between app context and request context?",
        "How do Jinja2 templates work with Flask routes?",
      ],
    },
    {
      title: "Security, APIs, and Deployment",
      questions: [
        "How do Flask-WTF forms support validation and CSRF protection?",
        "How are cookies, sessions, and flash() used in Flask?",
        "How do you build REST APIs and handle JSON in Flask?",
        "How do you secure Flask against XSS, SQL injection, and CSRF?",
        "How do you deploy Flask with Gunicorn/uWSGI or containers?",
      ],
    },
  ],
  coding: [
    "Create a Flask app with routing and Jinja2 templates.",
    "Build CRUD with Flask and SQLAlchemy.",
    "Create RESTful JSON APIs.",
    "Implement login/logout/sessions/authentication.",
    "Secure file upload with validation.",
    "Apply Blueprints and app factory pattern.",
  ],
  playgroundLanguage: "python",
  starterCode: `from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef index():\n    return "Hello from Flask"`,
};
type GenericTrackSeed = {
  slug: string;
  title: string;
  category: string;
  description: string;
  focusAreas: string[];
  codingProblems: string[];
  playgroundLanguage: PlaygroundLanguage;
};

function createGeneralTrack(seed: GenericTrackSeed): TechTrack {
  return {
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    description: seed.description,
    conceptNote: "W3-style concept flow: read, practice, test, and build in one workspace.",
    theory: [
      {
        title: `${seed.title} Fundamentals`,
        questions: [
          `What is ${seed.title} and where is it used?`,
          `What are the top features and advantages of ${seed.title}?`,
          `How do you structure ${seed.title} projects for maintainability?`,
          `How do you debug and test ${seed.title} solutions effectively?`,
        ],
      },
      {
        title: `${seed.title} Core Concepts`,
        questions: seed.focusAreas,
      },
    ],
    coding: seed.codingProblems,
    playgroundLanguage: seed.playgroundLanguage,
    starterCode: starterSnippets[seed.playgroundLanguage],
  };
}

const additionalTracks: TechTrack[] = [
  createGeneralTrack({
    slug: "java",
    title: "Java",
    category: "Programming Languages",
    description: "Core Java to enterprise backend preparation.",
    playgroundLanguage: "java",
    focusAreas: [
      "JVM, JRE, JDK, and memory model differences.",
      "Abstract class vs interface in real projects.",
      "Collections and streams performance trade-offs.",
      "Multithreading and synchronization patterns.",
    ],
    codingProblems: [
      "Build object-oriented employee management CLI.",
      "Implement custom sorting with Comparator.",
      "Create thread-safe counter using synchronized blocks.",
      "Use streams to produce grouped analytics.",
    ],
  }),
  createGeneralTrack({
    slug: "javascript",
    title: "JavaScript",
    category: "Programming Languages",
    description: "Modern JS from fundamentals to async runtime behavior.",
    playgroundLanguage: "javascript",
    focusAreas: [
      "var vs let vs const and temporal dead zone.",
      "Closures and lexical scope behavior.",
      "Event loop with microtasks and macrotasks.",
      "Promises, async/await, and error handling.",
    ],
    codingProblems: [
      "Implement debounce and throttle utilities.",
      "Write custom Promise.all polyfill.",
      "Build recursive deep clone without libraries.",
      "Create retry wrapper for async functions.",
    ],
  }),
  createGeneralTrack({
    slug: "sql",
    title: "SQL",
    category: "Databases",
    description: "SQL interview and analytics practice.",
    playgroundLanguage: "sql",
    focusAreas: [
      "Join types and when each is preferred.",
      "WHERE vs HAVING with grouped results.",
      "Window functions for analytics.",
      "Transactions and isolation levels.",
    ],
    codingProblems: [
      "Second highest salary per department.",
      "Rolling 7-day metrics with window functions.",
      "Retention cohort analysis query.",
      "Duplicate detection with latest record logic.",
    ],
  }),
  createGeneralTrack({
    slug: "oracle",
    title: "Oracle",
    category: "Databases",
    description: "Oracle SQL/PL-SQL interview and architecture prep.",
    playgroundLanguage: "sql",
    focusAreas: [
      "Oracle architecture and tablespaces.",
      "Stored procedures, triggers, and sequences.",
      "Indexing and execution plan tuning.",
      "Roles and privileges for secure access.",
    ],
    codingProblems: [
      "PL-SQL exception handling procedure.",
      "Audit trigger for update history.",
      "Top-N performance query optimization.",
      "Role-based access setup script.",
    ],
  }),
  createGeneralTrack({
    slug: "html",
    title: "HTML",
    category: "Frontend & Web",
    description: "Semantic and accessible markup practice.",
    playgroundLanguage: "html",
    focusAreas: [
      "Semantic tags and content hierarchy.",
      "Forms and accessibility labels.",
      "Metadata for SEO and previews.",
      "ARIA usage with semantic structure.",
    ],
    codingProblems: [
      "Build semantic landing page skeleton.",
      "Create accessible registration form.",
      "Design FAQ with details/summary.",
      "Build SEO-ready portfolio template.",
    ],
  }),
  createGeneralTrack({
    slug: "css",
    title: "CSS",
    category: "Frontend & Web",
    description: "Responsive layouts, variables, and motion.",
    playgroundLanguage: "html",
    focusAreas: [
      "Flexbox and Grid for layout systems.",
      "CSS variables for design tokens.",
      "Responsive breakpoints and fluid scales.",
      "Animation and transition best practices.",
    ],
    codingProblems: [
      "Responsive two-column layout.",
      "Animated navigation interactions.",
      "Theme switch with CSS variables.",
      "Fluid typography using clamp().",
    ],
  }),
  createGeneralTrack({
    slug: "react",
    title: "React",
    category: "Frontend Frameworks",
    description: "Component architecture and hooks-based development.",
    playgroundLanguage: "javascript",
    focusAreas: [
      "State, props, context, and composition.",
      "useEffect, useMemo, and useCallback usage.",
      "Performance optimization and rendering patterns.",
      "Reusable component and custom hook design.",
    ],
    codingProblems: [
      "Build reusable accordion component.",
      "Create custom hook for API lifecycle.",
      "Implement paginated searchable list.",
      "Build theme switcher with local persistence.",
    ],
  }),
  createGeneralTrack({
    slug: "angular",
    title: "Angular",
    category: "Frontend Frameworks",
    description: "Angular components, RxJS, DI, and routing.",
    playgroundLanguage: "javascript",
    focusAreas: [
      "Component/module/service architecture.",
      "Dependency injection in Angular.",
      "Reactive forms and validation.",
      "RxJS streams for async operations.",
    ],
    codingProblems: [
      "Build form module with validation.",
      "Create service-based shared state.",
      "Lazy load feature modules.",
      "Add interceptor for auth tokens.",
    ],
  }),
  createGeneralTrack({
    slug: "node",
    title: "Node.js",
    category: "Backend Runtime",
    description: "Node async runtime and API engineering.",
    playgroundLanguage: "javascript",
    focusAreas: [
      "Event loop internals and async flow.",
      "Streams and memory-efficient processing.",
      "Process lifecycle and graceful shutdown.",
      "Service architecture and observability.",
    ],
    codingProblems: [
      "Build stream-based file parser.",
      "Implement request rate limiter.",
      "Create health/readiness endpoints.",
      "Build retry-capable background worker.",
    ],
  }),
  createGeneralTrack({
    slug: "express",
    title: "Express",
    category: "Backend Frameworks",
    description: "Express routing, middleware, and secure API design.",
    playgroundLanguage: "javascript",
    focusAreas: [
      "Router-level modular architecture.",
      "Validation and sanitization pipeline.",
      "Error handling middleware strategy.",
      "Authentication and authorization patterns.",
    ],
    codingProblems: [
      "Build versioned CRUD API.",
      "Add auth middleware with RBAC.",
      "Implement query filtering and pagination.",
      "Create centralized error handler.",
    ],
  }),
  createGeneralTrack({
    slug: "mongodb",
    title: "MongoDB",
    category: "Databases",
    description: "Document modeling and aggregation practice.",
    playgroundLanguage: "sql",
    focusAreas: [
      "Embed vs reference data modeling.",
      "Indexes and read/write trade-offs.",
      "Aggregation pipeline stages.",
      "Replication and sharding basics.",
    ],
    codingProblems: [
      "Design e-commerce order schema.",
      "Build monthly aggregation summary.",
      "Plan index strategy for heavy queries.",
      "Implement paginated collection queries.",
    ],
  }),
  createGeneralTrack({
    slug: "shell-scripting",
    title: "Shell Scripting",
    category: "DevOps & Automation",
    description: "Automation workflows and operational scripting.",
    playgroundLanguage: "bash",
    focusAreas: [
      "Script parameters and environment variables.",
      "Control flow and reusable functions.",
      "Error handling and safe exits.",
      "Cron and CI integration patterns.",
    ],
    codingProblems: [
      "Automated backup script.",
      "Log parser for error extraction.",
      "System health checker script.",
      "Deployment script with rollback flag.",
    ],
  }),
  createGeneralTrack({
    slug: "data-analyst",
    title: "Data Analyst",
    category: "Data & BI",
    description: "Business analytics thinking, SQL, and reporting.",
    playgroundLanguage: "sql",
    focusAreas: [
      "Translate business questions into metrics.",
      "Descriptive vs diagnostic analytics.",
      "Data cleaning and validation workflow.",
      "Storytelling with dashboards.",
    ],
    codingProblems: [
      "Compute MAU and retention in SQL.",
      "Design KPI definitions for operations dashboard.",
      "Create customer segmentation analysis.",
      "Prepare A/B test result summary.",
    ],
  }),
  createGeneralTrack({
    slug: "powerbi",
    title: "Power BI",
    category: "Data & BI",
    description: "Power BI modeling, DAX thinking, and dashboard design.",
    playgroundLanguage: "sql",
    focusAreas: [
      "Star schema modeling for Power BI.",
      "Measures vs calculated columns.",
      "DAX context behavior in visuals.",
      "Performance tuning and refresh strategy.",
    ],
    codingProblems: [
      "Design executive dashboard layout.",
      "Plan row-level security model.",
      "Implement YoY growth formula logic.",
      "Prepare incremental refresh checklist.",
    ],
  }),
];

export const techTracks: TechTrack[] = [pythonTrack, djangoTrack, fastapiTrack, flaskTrack, ...additionalTracks];

export const techTrackMap: Record<string, TechTrack> = Object.fromEntries(
  techTracks.map((track) => [track.slug, track]),
) as Record<string, TechTrack>;
