export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface CourseData {
  slug: string;
  title: string;
  category: string;
  heroTitle: string;
  tagline: string;
  shortDescription: string;
  detailDescription: string;
  objectives: string[];
  careerScope: string[];
  syllabus: string[];
  projects: string[];
  whoCanJoin: string[];
  prerequisites: string[];
  jobRoles: string[];
  duration: string;
  level: CourseLevel;
  mode: string;
  price: string;
}

export interface NavItem {
  label: string;
  to: string;
}

export interface LmsRoleFeature {
  role: "Admin" | "Instructor" | "Student" | "Content Manager";
  description: string;
  capabilities: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface LessonItem {
  id: string;
  title: string;
  type: "Video" | "PDF" | "HTML" | "Quiz" | "Assignment";
  duration: string;
  isFreePreview: boolean;
}

export const primaryNavigation: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/course" },
  { label: "About Us", to: "/about-us" },
  { label: "Success Stories", to: "/success-stories" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact-us" },
];

export const lmsNavigation: NavItem[] = [
  { label: "LMS Overview", to: "/lms" },
  { label: "Student", to: "/lms/student" },
  { label: "Lesson Player", to: "/lms/student/course/python-full-stack" },
  { label: "Quiz", to: "/lms/student/quiz/python-full-stack" },
  { label: "Instructor", to: "/lms/instructor" },
  { label: "Course Builder", to: "/lms/instructor/builder" },
  { label: "Admin", to: "/lms/admin" },
];

export const contactInfo = {
  location: "1st floor, 3/110, Rajiv Gandhi Salai, Navalur, Chennai, Tamil Nadu 600130",
  phone: "+91 93449 93939",
  email: "info@skillfortinstitute.com",
  workingHours: "Mon - Sat: 10:00 to 06:30 | Sunday: Closed",
  instagram: "https://www.instagram.com/skillfort_institute/?hl=en",
};

export const placementPartners = [
  "Cognizant",
  "Infosys",
  "TCS",
  "Wipro",
  "HCLTech",
  "Accenture",
  "Capgemini",
  "Zoho",
  "Freshworks",
  "Tech Mahindra",
];

export const testimonials = [
  {
    name: "Surya",
    quote:
      "I recently completed the Python Full Stack Developer course at SkillFort. The training was well-structured and focused on real-time projects.",
  },
  {
    name: "Sridhar T",
    quote:
      "Great place to learn with supportive trainers. Concepts were explained clearly from basics to advanced topics.",
  },
  {
    name: "Kirubakar M",
    quote: "Placement support was consistent and practical. The team guided me through interviews end to end.",
  },
  {
    name: "Chitra Sumithra",
    quote:
      "A very friendly environment and supportive trainers. They helped me become confident in technical and interview skills.",
  },
];

export const courses: CourseData[] = [
  {
    slug: "data-science",
    title: "Data Science",
    category: "Analytics",
    heroTitle: "Data Science Course in Chennai",
    tagline: "Online and Classroom Training Modes",
    shortDescription: "Learn to analyze and visualize data using Excel, SQL, Python, and Power BI.",
    detailDescription:
      "Accelerate your career with our Data Science training in Chennai. Gain in-depth knowledge of data analysis, machine learning, statistical modeling, and data-driven decision-making through real-time projects and practical assignments.",
    objectives: [
      "Master data analysis techniques for structured and unstructured datasets.",
      "Build a solid understanding of machine learning model development and evaluation.",
      "Work with big data processing platforms and modern analytics tools.",
      "Create stakeholder-ready dashboards using Tableau, Power BI, and Matplotlib.",
      "Apply data science concepts to real business problems through capstone projects.",
      "Become career-ready with skills from data wrangling to model deployment.",
    ],
    careerScope: [
      "High hiring demand across BFSI, healthcare, retail, and technology.",
      "Career pathways from Data Analyst to Machine Learning Engineer.",
      "Strong salary growth with experience and project depth.",
      "Global opportunities including remote and international teams.",
      "Future-proof profile aligned with AI and ML adoption.",
    ],
    syllabus: [
      "Data Science foundation and workflow",
      "Programming with Python and R basics",
      "Statistics for data-driven decision making",
      "Data wrangling and feature engineering",
      "Machine learning algorithms and model evaluation",
      "Deep learning fundamentals",
      "Data visualization and storytelling",
      "Deployment concepts and portfolio preparation",
    ],
    projects: [
      "Stock Market Trend Prediction",
      "Financial Fraud Detection",
      "Deep Learning Image Recognition",
      "Customer Churn Forecasting",
    ],
    whoCanJoin: [
      "College students and fresh graduates",
      "Working professionals transitioning to analytics",
      "Beginners interested in AI and ML careers",
    ],
    prerequisites: [
      "No mandatory prerequisites",
      "Basic comfort with mathematics and logical thinking helps",
    ],
    jobRoles: [
      "Data Scientist",
      "Data Analyst",
      "Machine Learning Engineer",
      "Data Engineer",
      "Business Intelligence Analyst",
    ],
    duration: "6 Months",
    level: "Intermediate",
    mode: "Offline + Live Online",
    price: "INR 45,000",
  },
  {
    slug: "java-full-stack",
    title: "Java Full Stack",
    category: "Full Stack",
    heroTitle: "Java Full Stack Training with Placement",
    tagline: "Enterprise-ready web development with Java ecosystem",
    shortDescription:
      "Develop scalable applications using Java, Spring Boot, and modern front-end technologies.",
    detailDescription:
      "Our Java Full Stack program helps learners master front-end and back-end development with Java, Spring Boot, REST APIs, SQL, and deployment workflows with real-time project implementation.",
    objectives: [
      "Master HTML, CSS, JavaScript, and React or Angular for frontend.",
      "Build strong Core Java skills including OOPs, Collections, and Java 8 features.",
      "Develop enterprise services with Spring, Spring Boot, and REST APIs.",
      "Integrate relational databases with JDBC and Hibernate/JPA.",
      "Use Git, Maven, JUnit, and JWT-based security workflows.",
      "Create end-to-end deployable full stack projects.",
    ],
    careerScope: [
      "High enterprise demand in banking, insurance, telecom, and SaaS.",
      "Roles available across startup, product, and service organizations.",
      "Strong compensation due to full stack ownership skills.",
      "Global opportunities for onsite and remote projects.",
      "Long-term growth with microservices and cloud-native development.",
    ],
    syllabus: [
      "HTML5, CSS3, JavaScript, Bootstrap",
      "Core Java and advanced Java",
      "Spring Framework and Spring Boot",
      "RESTful web services and microservice basics",
      "MySQL/PostgreSQL and Hibernate",
      "React or Angular integration",
      "Authentication and authorization with JWT",
      "Testing, build pipelines, and deployment",
    ],
    projects: [
      "Employee Management Portal",
      "E-commerce Order Management Platform",
      "Learning Portal with Role-based Access",
    ],
    whoCanJoin: [
      "Freshers preparing for full stack developer roles",
      "Developers upgrading to Java enterprise stack",
      "Graduates from CSE, IT, ECE, and related streams",
    ],
    prerequisites: ["Basic programming understanding is recommended"],
    jobRoles: [
      "Java Full Stack Developer",
      "Backend Java Developer",
      "Spring Boot Developer",
      "Software Engineer",
    ],
    duration: "6 Months",
    level: "Intermediate",
    mode: "Offline + Live Online",
    price: "INR 42,000",
  },
  {
    slug: "python-full-stack",
    title: "Python Full Stack",
    category: "Full Stack",
    heroTitle: "Python Full Stack Training with Placement",
    tagline: "From frontend to backend with production-ready deployment",
    shortDescription:
      "Master full stack development using Python, Django, Flask, SQL, and modern UI frameworks.",
    detailDescription:
      "This course builds strong expertise in front-end and back-end development, helping learners build complete web applications from scratch with Django and Flask plus practical deployment workflows.",
    objectives: [
      "Master frontend technologies: HTML, CSS, JavaScript, Bootstrap, and React.",
      "Learn Python fundamentals, OOPs, scripting, Django, and Flask.",
      "Build SQL and ORM integration using MySQL and PostgreSQL.",
      "Create real-time end-to-end projects with secure APIs.",
      "Work with Git, Docker, and cloud deployment basics.",
      "Build a portfolio aligned with hiring expectations.",
    ],
    careerScope: [
      "Demand across IT services, fintech, healthcare, and e-commerce.",
      "Multiple opportunities in product and startup ecosystems.",
      "Strong salary outcomes for developers who handle end-to-end delivery.",
      "Global role eligibility for remote and international companies.",
      "Continuous growth with modern Python ecosystems and frameworks.",
    ],
    syllabus: [
      "HTML5, CSS3, Bootstrap 5",
      "JavaScript and React fundamentals",
      "Python programming and advanced topics",
      "Django framework and REST integration",
      "Flask microservices and API development",
      "Databases, authentication, and session management",
      "Docker basics and deployment workflows",
      "Interview preparation and resume grooming",
    ],
    projects: [
      "Online Course Enrollment Portal",
      "Inventory and Billing Application",
      "Blog and Content Management Platform",
    ],
    whoCanJoin: [
      "Students, freshers, and career-switch professionals",
      "Developers moving into Python-based web development",
    ],
    prerequisites: ["No strict prerequisite, beginner-friendly from basics"],
    jobRoles: [
      "Python Full Stack Developer",
      "Django Developer",
      "Backend Developer",
      "Web Application Engineer",
    ],
    duration: "6 Months",
    level: "Beginner",
    mode: "Offline + Live Online",
    price: "INR 40,000",
  },
  {
    slug: "oracle",
    title: "Oracle",
    category: "Database",
    heroTitle: "Oracle Training with Placement",
    tagline: "SQL, PL/SQL, and Oracle DBA skill track",
    shortDescription:
      "Master SQL, PL/SQL, and database administration for Oracle Developer and DBA roles.",
    detailDescription:
      "Our Oracle program equips learners with strong SQL, PL/SQL, and administration skills needed in enterprise environments through case-based assignments and practical database workflows.",
    objectives: [
      "Master SQL fundamentals including joins, subqueries, and DML operations.",
      "Build advanced PL/SQL logic with procedures, functions, and triggers.",
      "Develop DBA skills in backup, recovery, and performance tuning.",
      "Practice enterprise-style database administration tasks.",
      "Prepare for Oracle SQL Developer and Oracle DBA roles.",
    ],
    careerScope: [
      "Strong demand in banking, telecom, insurance, and government IT.",
      "High-value roles in mission-critical database management.",
      "Global relevance for enterprise Oracle deployments.",
      "Stable long-term career due to continued Oracle usage.",
    ],
    syllabus: [
      "Relational database concepts",
      "SQL queries, joins, and optimization",
      "PL/SQL programming and exception handling",
      "Stored procedures, functions, packages, and triggers",
      "Oracle architecture and DBA fundamentals",
      "Backup, recovery, and user management",
      "Performance tuning and monitoring",
    ],
    projects: [
      "University Information System",
      "Banking Transaction Reporting",
      "Sales Performance Oracle Dashboard",
    ],
    whoCanJoin: [
      "Graduates interested in database careers",
      "Developers who want deeper SQL and data management skills",
    ],
    prerequisites: ["Basic computer and programming knowledge"],
    jobRoles: ["Oracle SQL Developer", "PL/SQL Developer", "Oracle DBA", "Database Support Engineer"],
    duration: "5 Months",
    level: "Intermediate",
    mode: "Offline + Live Online",
    price: "INR 36,000",
  },
  {
    slug: "testing",
    title: "Testing",
    category: "Quality Assurance",
    heroTitle: "Software Testing Training with Placement",
    tagline: "Manual and Automation testing with Selenium, Playwright, and Python",
    shortDescription:
      "Learn Manual and Automation Testing using Selenium, Playwright, and real project QA workflows.",
    detailDescription:
      "Our software testing program is designed for job readiness in QA, automation, and SDET roles with practical frameworks, API testing exposure, interview preparation, and dedicated placement support.",
    objectives: [
      "Build strong manual testing foundations and defect lifecycle understanding.",
      "Master Selenium automation with Java and framework patterns.",
      "Learn Playwright for modern cross-browser automation.",
      "Automate test flows with Python, PyTest, and API validation.",
      "Integrate QA workflows with CI/CD tools and reporting.",
    ],
    careerScope: [
      "Fast-growing demand for QA and automation engineers.",
      "Roles spanning manual QA, automation, performance, and SDET.",
      "Stable demand across product and service companies.",
      "Strong transition path for non-coding backgrounds with guided training.",
    ],
    syllabus: [
      "Software testing fundamentals and SDLC/STLC",
      "Manual testing techniques and test case design",
      "Selenium WebDriver with Java",
      "Playwright automation fundamentals",
      "Python automation with PyTest",
      "API testing and validation basics",
      "Framework design, reporting, and CI integration",
    ],
    projects: [
      "E-commerce Checkout Test Automation",
      "Banking Web Regression Suite",
      "API Test Automation Pack",
    ],
    whoCanJoin: ["Freshers", "Career switchers", "Developers moving into QA automation"],
    prerequisites: ["No coding background required, basics covered from start"],
    jobRoles: ["QA Analyst", "Automation Test Engineer", "SDET", "Software Test Engineer"],
    duration: "4 Months",
    level: "Beginner",
    mode: "Offline + Live Online",
    price: "INR 32,000",
  },
];

export const placementHighlights = [
  "150+ students trained and placed since launch",
  "100% placement support process",
  "Real-time projects and interview preparation",
  "Resume grooming and mock interviews",
];

export const quickEnquiryFields = [
  "Your Name",
  "Your Email",
  "Phone Number",
  "Course Interested In",
  "Year of Passout",
  "Preferred Time to Call",
];

export const careersOpenings = [
  "Telecallers",
  "Python Fullstack Trainers",
  "Data Engineer Trainer",
  "Junior Trainer - Fresher with any programming language exposure",
];

export const lmsRoleFeatures: LmsRoleFeature[] = [
  {
    role: "Admin",
    description: "Manages platform governance, compliance, payouts, and global configuration.",
    capabilities: [
      "User and role management",
      "Course approval and publishing oversight",
      "Revenue, engagement, and completion analytics",
      "Payout and invoice workflow controls",
    ],
  },
  {
    role: "Instructor",
    description: "Creates and manages course content, quizzes, assignments, and live sessions.",
    capabilities: [
      "Course lifecycle: Draft -> Review -> Publish -> Archive",
      "WYSIWYG course builder with lesson sequencing",
      "Assessment authoring and grading",
      "Learner progress and class performance dashboards",
    ],
  },
  {
    role: "Student",
    description: "Consumes lessons, tracks progress, participates in assessments, and receives certificates.",
    capabilities: [
      "Continue-learning dashboard with resume playback",
      "Bookmarks, notes, and attendance tracking",
      "Quiz attempts and assignment submissions",
      "Certificate download with QR verification state",
    ],
  },
  {
    role: "Content Manager",
    description: "Curates catalog quality, metadata, and discovery assets.",
    capabilities: [
      "Category and tag management",
      "Course content review queue",
      "Search optimization and featured recommendations",
      "Notification campaign scheduling",
    ],
  },
];

export const lmsMetrics = [
  { label: "Concurrent Users Capacity", value: "10,000+" },
  { label: "Target Page Load", value: "< 3 sec" },
  { label: "Availability Target", value: "99.9%" },
  { label: "Certificates Issued", value: "2,450" },
];

export const studentCourses = [
  { slug: "python-full-stack", title: "Python Full Stack", progress: 68, lastLesson: "Building REST APIs with Django" },
  { slug: "testing", title: "Software Testing", progress: 41, lastLesson: "Selenium Locators and Waits" },
  { slug: "data-science", title: "Data Science", progress: 23, lastLesson: "Feature Engineering Fundamentals" },
];

export const lessonPlaylist: LessonItem[] = [
  { id: "ls-1", title: "Welcome and Program Roadmap", type: "Video", duration: "08:30", isFreePreview: true },
  { id: "ls-2", title: "Frontend Sprint: React Routing", type: "Video", duration: "16:20", isFreePreview: false },
  { id: "ls-3", title: "Backend Sprint: Django REST API", type: "Video", duration: "22:10", isFreePreview: false },
  { id: "ls-4", title: "Deployment Checklist", type: "PDF", duration: "12 pages", isFreePreview: false },
  { id: "ls-5", title: "Sprint Quiz", type: "Quiz", duration: "15 min", isFreePreview: false },
  { id: "ls-6", title: "Portfolio Assignment", type: "Assignment", duration: "2 days", isFreePreview: false },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q-1",
    question: "Which Django component is best suited for creating REST APIs?",
    options: ["Django Forms", "Django REST Framework", "Django Admin", "Django Templates"],
    correctOption: 1,
  },
  {
    id: "q-2",
    question: "What is the primary purpose of JWT in LMS authentication?",
    options: [
      "Rendering server-side templates",
      "Storing media files",
      "Securing stateless API access and authorization",
      "Generating PDFs",
    ],
    correctOption: 2,
  },
  {
    id: "q-3",
    question: "Which metric best indicates learner completion quality?",
    options: ["Total enrollments", "Course completion rate", "Video upload size", "Theme color usage"],
    correctOption: 1,
  },
  {
    id: "q-4",
    question: "In course lifecycle management, what should happen before publish?",
    options: ["Automatic deletion", "Review and approval", "Certificate generation", "Payment refund"],
    correctOption: 1,
  },
];

export const instructorCourses = [
  { title: "Python Full Stack", status: "Published", students: 420, revenue: "INR 9.4L" },
  { title: "Data Science", status: "Review", students: 265, revenue: "INR 6.1L" },
  { title: "Oracle SQL and PL/SQL", status: "Draft", students: 124, revenue: "INR 2.8L" },
];

export const adminPanels = [
  { title: "Course Review Queue", value: "14 Pending", trend: "+4 today" },
  { title: "Live Sessions Scheduled", value: "22", trend: "Next: 7:00 PM" },
  { title: "Monthly Revenue", value: "INR 18.2L", trend: "+11.4% vs last month" },
  { title: "Certificate Verifications", value: "386", trend: "99.2% success rate" },
];

export const lmsPurpose =
  "Provide an online LMS where instructors publish courses and learners enroll, learn via videos/docs, complete quizzes and assignments, and receive certificates.";

export const lmsScopeSummary =
  "Web application with optional mobile apps supporting Admin, Instructor, Student, and Content Manager workflows.";

export const lmsIntegrations = [
  "Payments: Stripe and Razorpay",
  "Video delivery: S3 and CloudFront",
  "Live classes: Zoom and Google Meet",
  "Email: Amazon SES and SendGrid",
];

export const lmsFunctionalRequirements = [
  "Authentication with email/password, Google OAuth, and OTP mobile",
  "RBAC for Admin, Instructor, Student, and Content Manager",
  "Course lifecycle: Draft -> Review -> Publish -> Archive",
  "Course structure: Course -> Module -> Lesson -> Quiz/Assignment",
  "Enrollment: free/paid flows, coupon codes, invoices",
  "Learning UX: resume playback, progress tracking, bookmarks",
  "Assessments: MCQ/TF/short answer/file submissions with auto + manual grading",
  "Certificates: auto-generated PDF with QR verification",
  "Analytics: engagement, revenue, completion rates",
  "Notifications: email, in-app, push",
  "Live sessions: scheduling, join links, attendance",
  "Admin controls: users, approvals, payouts, global settings",
  "Search and discovery: categories, tags, filters, recommendations",
];

export const lmsNonFunctionalRequirements = [
  "Performance: support 10k concurrent users and < 3s load target",
  "Security: HTTPS, JWT access + refresh tokens, OWASP controls, input validation",
  "Scalability: stateless backend, autoscaling, managed DB, CDN",
  "Availability: 99.9% uptime with daily backups",
  "Compliance: GDPR-friendly controls and GST invoice support",
  "Maintainability: modular API-first architecture with CI/CD pipelines",
];

export const lmsErRelationships = [
  "User (1) -> Course (M) as instructor",
  "Course (1) -> Module (M)",
  "Module (1) -> Lesson (M)",
  "Lesson (1) -> Resource (M)",
  "Course (1) -> Quiz (M)",
  "Quiz (1) -> Question (M)",
  "User (1) -> Enrollment (M) -> Course (1)",
  "User (1) -> Attempt (M) -> Quiz (1)",
  "User (1) -> Submission (M) -> Assignment (1)",
  "Course (M) -> Tag (M) via course_tags",
  "Course (M) -> Category (1)",
];

export const lmsKeyTableSchemas = [
  {
    table: "users",
    fields: [
      "id (uuid, PK)",
      "email (varchar, unique)",
      "password_hash (varchar)",
      "name (varchar)",
      "role_id (fk roles.id)",
      "profile_pic_url, phone, bio",
      "created_at, updated_at",
    ],
  },
  {
    table: "courses",
    fields: [
      "id (uuid, PK)",
      "title, slug (unique)",
      "short_description, long_description",
      "price, currency",
      "instructor_id (fk users.id)",
      "category_id (fk categories.id)",
      "level enum",
      "status enum: draft/pending/review/published/archived",
      "created_at, updated_at",
    ],
  },
  {
    table: "lessons",
    fields: [
      "id (uuid, PK)",
      "module_id (fk modules.id)",
      "title",
      "content_type enum: video/pdf/html/quiz/assignment",
      "content_url",
      "duration_seconds",
      "position",
      "is_free_preview",
    ],
  },
  {
    table: "enrollments and payments",
    fields: [
      "enrollments: user_id, course_id, status, progress_percent, last_accessed_at",
      "payments: enrollment_id, user_id, amount, currency, gateway, gateway_payment_id, status, paid_at",
    ],
  },
  {
    table: "quizzes and attempts",
    fields: [
      "quizzes: course_id, pass_mark_pct, time_limit_sec",
      "questions: quiz_id, text, type, options(json)",
      "attempts: user_id, quiz_id, score, started_at, completed_at",
      "answers: attempt_id, question_id, response(json), is_correct",
    ],
  },
  {
    table: "assignments and certificates",
    fields: [
      "assignments: lesson_id, title, description, due_date, max_marks",
      "submissions: assignment_id, user_id, file_url, marks_given, feedback",
      "certificates: user_id, course_id, issued_at, certificate_url, cert_hash",
    ],
  },
];
