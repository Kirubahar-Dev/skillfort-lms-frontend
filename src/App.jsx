import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import StudentLayout from "./components/layout/StudentLayout";
import AdminLayout from "./components/layout/AdminLayout";
import PrivateRoute from "./components/layout/PrivateRoute";
import InstructorDashboardPage from "./pages/instructor/InstructorDashboardPage";
import InstructorCourseStudentsPage from "./pages/instructor/InstructorCourseStudentsPage";
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import CoursesPage from "./pages/public/CoursesPage";
import CourseDetailPage from "./pages/public/CourseDetailPage";
import InstructorDetailPage from "./pages/public/InstructorDetailPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import ResetPasswordPage from "./pages/public/ResetPasswordPage";
import CartPage from "./pages/public/CartPage";
import ContactPage from "./pages/public/ContactPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import InterviewLandingPage from "./pages/interview/InterviewLandingPage";
import InterviewQuestionsPage from "./pages/interview/InterviewQuestionsPage";
import InterviewQuestionDetailPage from "./pages/interview/InterviewQuestionDetailPage";
import InterviewTopicsIndexPage from "./pages/interview/InterviewTopicsIndexPage";
import InterviewTopicDetailPage from "./pages/interview/InterviewTopicDetailPage";
import InterviewCompaniesPage from "./pages/interview/InterviewCompaniesPage";
import InterviewCompilerPage from "./pages/interview/InterviewCompilerPage";
import MockInterviewPage from "./pages/interview/MockInterviewPage";
import StudyPlannerPage from "./pages/interview/StudyPlannerPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import MyCoursesPage from "./pages/student/MyCoursesPage";
import LearnPage from "./pages/student/LearnPage";
import CheckoutPage from "./pages/student/CheckoutPage";
import OrderSuccessPage from "./pages/student/OrderSuccessPage";
import MyOrdersPage from "./pages/student/MyOrdersPage";
import MyCertificatesPage from "./pages/student/MyCertificatesPage";
import MyReviewsPage from "./pages/student/MyReviewsPage";
import EditProfilePage from "./pages/student/EditProfilePage";
import MyInterviewPrepPage from "./pages/student/MyInterviewPrepPage";
import CertificatePage from "./pages/student/CertificatePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminInterviewPrepPage from "./pages/admin/AdminInterviewPrepPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminInstructorsPage from "./pages/admin/AdminInstructorsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminCouponsPage from "./pages/admin/AdminCouponsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminCertificatesPage from "./pages/admin/AdminCertificatesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import { getRoleHomePath, useAuth } from "./context/AuthContext";

function RoleAwareHome() {
  const { user } = useAuth();
  if (user?.role) return <Navigate to={getRoleHomePath(user.role)} replace />;
  return <HomePage />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RoleAwareHome />} />
        <Route path="/public-home" element={<HomePage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:slug" element={<CourseDetailPage />} />
        <Route path="/instructor/:id/:slug" element={<InstructorDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms-conditions" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/interview-prep" element={<InterviewLandingPage />} />
        <Route path="/interview-prep/questions" element={<InterviewQuestionsPage />} />
        <Route path="/interview-prep/questions/:id/:slug" element={<InterviewQuestionDetailPage />} />
        <Route path="/interview-prep/topics" element={<InterviewTopicsIndexPage />} />
        <Route path="/interview-prep/topics/:slug" element={<InterviewTopicDetailPage />} />
        <Route path="/interview-prep/companies" element={<InterviewCompaniesPage />} />
        <Route path="/interview-prep/compiler" element={<InterviewCompilerPage />} />
        <Route path="/interview-prep/mock-interview" element={<MockInterviewPage />} />
        <Route path="/interview-prep/planner" element={<StudyPlannerPage />} />
      </Route>

      <Route
        element={
          <PrivateRoute role={["student", "instructor"]}>
            <StudentLayout />
          </PrivateRoute>
        }
      >
        <Route path="/my-dashboard" element={<StudentDashboardPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        <Route path="/learn/:courseSlug" element={<LearnPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/my-certificates" element={<MyCertificatesPage />} />
        <Route path="/my-reviews" element={<MyReviewsPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/my-interview-prep" element={<MyInterviewPrepPage />} />
        <Route path="/certificate/:courseId" element={<CertificatePage />} />
        {/* Instructor-specific routes (instructor role only) */}
        <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
        <Route path="/instructor/courses/:courseId/students" element={<InstructorCourseStudentsPage />} />
      </Route>

      <Route
        element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/courses" element={<AdminCoursesPage />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
        <Route path="/admin/instructors" element={<AdminInstructorsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/coupons" element={<AdminCouponsPage />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/admin/certificates" element={<AdminCertificatesPage />} />
        <Route path="/admin/interview-prep/*" element={<AdminInterviewPrepPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
