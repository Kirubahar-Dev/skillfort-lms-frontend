import { BlogPost, Course, CouponInfo, NavItem, Order } from "../types";

export const publicNav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Placements", to: "/placements" },
  { label: "About", to: "/about-us" },
  { label: "Contact", to: "/contact-us" },
];

export const roleQuickLinks = {
  student: [
    { label: "Dashboard", to: "/student/dashboard" },
    { label: "My Courses", to: "/student/my-courses" },
    { label: "Payments", to: "/student/payments" },
  ],
  instructor: [
    { label: "Instructor", to: "/instructor/dashboard" },
    { label: "Builder", to: "/instructor/course-builder/python-full-stack" },
    { label: "Earnings", to: "/instructor/earnings" },
  ],
  admin: [
    { label: "Admin", to: "/admin/dashboard" },
    { label: "Payments", to: "/admin/payments" },
    { label: "Users", to: "/admin/users" },
  ],
};

export const coupons: CouponInfo[] = [
  { code: "SKILL10", type: "percent", value: 10 },
  { code: "SF500", type: "flat", value: 500 },
  { code: "WELCOME15", type: "percent", value: 15 },
];

export const courses: Course[] = [
  {
    id: "c-101",
    slug: "python-full-stack",
    title: "Python Full Stack Career Track",
    category: "Full Stack",
    level: "Beginner",
    duration: "16 weeks",
    instructor: "Arjun Prakash",
    rating: 4.9,
    students: 1240,
    price: 34999,
    oldPrice: 42999,
    thumbnail: "/skillfort-logo-full.jpg",
    summary: "Recorded + mentor sessions for Python, APIs, React, and deployment.",
    description:
      "A complete job-focused recorded learning track with coding sprints, capstone mentoring, and placement prep.",
    tags: ["Recorded Sessions", "Career Assistance", "Capstone"],
    modules: [
      {
        id: "m-py-1",
        title: "Python Foundations",
        lessons: [
          { id: "l-py-1", title: "Environment setup and tooling", duration: "24 min", kind: "Video", isPreview: true },
          { id: "l-py-2", title: "Core syntax and data structures", duration: "41 min", kind: "Video" },
          { id: "l-py-3", title: "Lab: mini automation script", duration: "35 min", kind: "Lab" },
        ],
      },
      {
        id: "m-py-2",
        title: "Backend API Sprint",
        lessons: [
          { id: "l-py-4", title: "REST API architecture", duration: "39 min", kind: "Video" },
          { id: "l-py-5", title: "Auth and role guards", duration: "28 min", kind: "Video" },
          { id: "l-py-6", title: "Module Quiz", duration: "18 min", kind: "Quiz" },
        ],
      },
      {
        id: "m-py-3",
        title: "Frontend and Deploy",
        lessons: [
          { id: "l-py-7", title: "React architecture basics", duration: "44 min", kind: "Video" },
          { id: "l-py-8", title: "Docker + cloud deploy", duration: "31 min", kind: "Reading" },
        ],
      },
    ],
  },
  {
    id: "c-102",
    slug: "java-full-stack",
    title: "Java Full Stack Professional",
    category: "Full Stack",
    level: "Intermediate",
    duration: "18 weeks",
    instructor: "Meena Raj",
    rating: 4.8,
    students: 980,
    price: 36999,
    oldPrice: 44999,
    thumbnail: "/skillfort-logo-full.jpg",
    summary: "Spring Boot + React recorded curriculum with enterprise patterns.",
    description: "Ideal for learners targeting backend-heavy product companies and Java ecosystem roles.",
    tags: ["Spring Boot", "React", "Interview Tracks"],
    modules: [
      {
        id: "m-jv-1",
        title: "Java and OOP Essentials",
        lessons: [
          { id: "l-jv-1", title: "OOP mindset and architecture", duration: "29 min", kind: "Video", isPreview: true },
          { id: "l-jv-2", title: "Collections and streams", duration: "37 min", kind: "Video" },
        ],
      },
      {
        id: "m-jv-2",
        title: "Spring Boot Services",
        lessons: [
          { id: "l-jv-3", title: "REST services and validations", duration: "40 min", kind: "Video" },
          { id: "l-jv-4", title: "JPA and SQL optimization", duration: "34 min", kind: "Lab" },
        ],
      },
    ],
  },
  {
    id: "c-103",
    slug: "data-analytics",
    title: "Data Analytics with SQL and Power BI",
    category: "Analytics",
    level: "Beginner",
    duration: "12 weeks",
    instructor: "Lakshmi Priya",
    rating: 4.7,
    students: 790,
    price: 24999,
    oldPrice: 31999,
    thumbnail: "/skillfort-logo-full.jpg",
    summary: "Recorded analytics track for SQL, Excel automation, and dashboard storytelling.",
    description: "A practical analytics route built around business case studies and visualization workshops.",
    tags: ["SQL", "Power BI", "Case Studies"],
    modules: [
      {
        id: "m-da-1",
        title: "Data Foundations",
        lessons: [
          { id: "l-da-1", title: "SQL joins and groupings", duration: "26 min", kind: "Video", isPreview: true },
          { id: "l-da-2", title: "Data cleaning workflow", duration: "31 min", kind: "Lab" },
        ],
      },
      {
        id: "m-da-2",
        title: "BI Dashboards",
        lessons: [
          { id: "l-da-3", title: "Power BI model design", duration: "38 min", kind: "Video" },
          { id: "l-da-4", title: "Visual storytelling", duration: "22 min", kind: "Reading" },
        ],
      },
    ],
  },
  {
    id: "c-104",
    slug: "software-testing",
    title: "Software Testing and Automation",
    category: "Testing",
    level: "Intermediate",
    duration: "14 weeks",
    instructor: "Sridhar T",
    rating: 4.6,
    students: 650,
    price: 22999,
    oldPrice: 28999,
    thumbnail: "/skillfort-logo-full.jpg",
    summary: "Manual + automation recorded path with Cypress and Playwright projects.",
    description: "Hands-on pathway for QA engineering roles with bug-tracking and CI-driven automation.",
    tags: ["Playwright", "Cypress", "QA Career"],
    modules: [
      {
        id: "m-ts-1",
        title: "Quality Engineering Basics",
        lessons: [
          { id: "l-ts-1", title: "Testing lifecycle essentials", duration: "30 min", kind: "Video", isPreview: true },
          { id: "l-ts-2", title: "Designing robust test cases", duration: "33 min", kind: "Lab" },
        ],
      },
      {
        id: "m-ts-2",
        title: "Automation Framework",
        lessons: [
          { id: "l-ts-3", title: "Playwright setup and patterns", duration: "37 min", kind: "Video" },
          { id: "l-ts-4", title: "End-to-end assignment", duration: "42 min", kind: "Lab" },
        ],
      },
    ],
  },
  {
    id: "c-105",
    slug: "oracle-database-admin",
    title: "Oracle Database Administration",
    category: "Database",
    level: "Advanced",
    duration: "10 weeks",
    instructor: "Dharani M",
    rating: 4.8,
    students: 420,
    price: 27999,
    oldPrice: 33999,
    thumbnail: "/skillfort-logo-full.jpg",
    summary: "Recorded DBA sessions covering backup, security, and high availability.",
    description: "Specialized program for DB admin tracks with production troubleshooting drills.",
    tags: ["Oracle", "DBA", "Enterprise"],
    modules: [
      {
        id: "m-or-1",
        title: "Oracle Setup and Tuning",
        lessons: [
          { id: "l-or-1", title: "Storage and schema strategy", duration: "33 min", kind: "Video" },
          { id: "l-or-2", title: "Query tuning workflows", duration: "28 min", kind: "Lab" },
        ],
      },
      {
        id: "m-or-2",
        title: "Reliability and Recovery",
        lessons: [
          { id: "l-or-3", title: "Backup and restore plan", duration: "36 min", kind: "Video", isPreview: true },
          { id: "l-or-4", title: "Disaster recovery simulation", duration: "40 min", kind: "Reading" },
        ],
      },
    ],
  },
];

export const placements = [
  "TCS",
  "Infosys",
  "Wipro",
  "Cognizant",
  "Capgemini",
  "IBM",
  "HCL",
  "Accenture",
  "Zoho",
  "Amazon",
  "Freshworks",
  "Tech Mahindra",
];

export const successStories = [
  { name: "Surya", role: "Python Developer", company: "TCS" },
  { name: "Chitra", role: "QA Engineer", company: "Infosys" },
  { name: "Kirubakar", role: "Data Analyst", company: "Cognizant" },
  { name: "Sridhar", role: "Java Backend Engineer", company: "Wipro" },
  { name: "Meena", role: "Cloud Support Engineer", company: "HCL" },
  { name: "Arun", role: "Full Stack Developer", company: "Capgemini" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b-1",
    title: "How to build a job-ready portfolio in 60 days",
    excerpt: "A practical roadmap used by Skillfort mentors to move learners from tutorials to hiring rounds.",
    author: "Skillfort Career Team",
    date: "March 12, 2026",
  },
  {
    id: "b-2",
    title: "Recorded vs live learning: what works for working professionals",
    excerpt: "Understand the blend strategy that keeps progress consistent while balancing full-time work.",
    author: "Academic Ops",
    date: "February 27, 2026",
  },
  {
    id: "b-3",
    title: "Interview prep framework for full stack freshers",
    excerpt: "Break down DSA, projects, system fundamentals, and communication into weekly outcomes.",
    author: "Placement Cell",
    date: "January 19, 2026",
  },
];

export const starterOrders: Order[] = [
  {
    id: "SF-240112",
    userId: "stu-1001",
    courses: [
      {
        courseId: "c-102",
        title: "Java Full Stack Professional",
        price: 36999,
        thumbnail: "/skillfort-logo-full.jpg",
        quantity: 1,
      },
    ],
    totalAmount: 36999,
    discount: 3700,
    finalAmount: 33299,
    couponCode: "SKILL10",
    paymentStatus: "SUCCESS",
    paymentMethod: "Razorpay",
    createdAt: "2026-03-28T09:35:00.000Z",
  },
  {
    id: "SF-240118",
    userId: "stu-1001",
    courses: [
      {
        courseId: "c-103",
        title: "Data Analytics with SQL and Power BI",
        price: 24999,
        thumbnail: "/skillfort-logo-full.jpg",
        quantity: 1,
      },
    ],
    totalAmount: 24999,
    discount: 500,
    finalAmount: 24499,
    couponCode: "SF500",
    paymentStatus: "FAILED",
    paymentMethod: "UPI",
    createdAt: "2026-03-30T11:15:00.000Z",
  },
];

export const studentNotifications = [
  "Assignment feedback uploaded for API Sprint task.",
  "New coupon WELCOME15 valid till Sunday.",
  "Placement mock interview batch starts Friday at 7:00 PM.",
  "Certificate generated for Java Full Stack Professional.",
];