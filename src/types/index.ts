export interface Lesson {
  id: string;
  title: string;
  duration: string;
  kind: "Video" | "Lab" | "Quiz" | "Reading";
  isPreview?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  oldPrice?: number;
  thumbnail: string;
  summary: string;
  description: string;
  modules: CourseModule[];
  tags: string[];
}

export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface CouponInfo {
  code: string;
  type: "percent" | "flat";
  value: number;
}

export interface BillingDetails {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  courses: CartItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  couponCode?: string;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  paymentMethod: "Razorpay" | "Stripe" | "UPI";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

export interface NavItem {
  label: string;
  to: string;
}