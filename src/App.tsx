import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { MainLayout } from "./components/common/MainLayout";
import { LmsStoreProvider } from "./context/LmsStore";
import {
  AdminCoursesPage,
  AdminDashboardPage,
  AddEditUserPage,
  AdminPaymentsPage,
  BlogManagementPage,
  CategoriesTagsPage,
  CertificatesManagementPage,
  CourseApprovalPage,
  EmailConfigPage,
  GeneralSettingsPage,
  HomepageControlPage,
  InvoiceManagementPage,
  NotificationTemplatesPage,
  PaymentGatewaySettingsPage,
  QuizMonitoringPage,
  RefundManagementPage,
  RoleManagementPage,
  SendNotificationsPage,
  SeoSettingsPage,
  UsersListPage,
} from "./pages/admin/AdminPages";
import {
  ForgotPasswordPage,
  LoginPage,
  OtpVerificationPage,
  SignupPage,
} from "./pages/auth/AuthPages";
import {
  CartPage,
  CheckoutPage,
  InvoicePage,
  PaymentFailedPage,
  PaymentSuccessPage,
  ProcessingPage,
} from "./pages/commerce/CommercePages";
import {
  AddQuestionsPage,
  AssignmentCreationPage,
  CourseBuilderPage,
  CreateCoursePage,
  CreateQuizPage,
  EditCoursePage,
  EarningsPage,
  EvaluationPage,
  InstructorAnalyticsPage,
  InstructorCoursesPage,
  InstructorDashboardPage,
  InstructorPaymentDetailsPage,
  InstructorProfileSettingsPage,
  InstructorStudentProgressPage,
  InstructorStudentsPage,
  PayoutHistoryPage,
} from "./pages/instructor/InstructorPages";
import {
  AboutPage,
  BlogPage,
  ContactPage,
  CourseDetailPage,
  CoursesPage,
  HomePage,
  PlacementsPage,
} from "./pages/public/PublicPages";
import {
  AssignmentResultPage,
  AssignmentSubmissionPage,
  CertificatesPage,
  CoursePlayerPage,
  DownloadResourcesPage,
  EnrolledCoursesPage,
  LessonDetailPage,
  MyCoursesPage,
  NotificationsPage,
  ProfileSettingsPage,
  ProgressSummaryPage,
  QuizPage,
  QuizResultPage,
  RecommendationsPage,
  StudentDashboardPage,
  StudentPaymentsPage,
  WishlistPage,
} from "./pages/student/StudentPages";
import { NotFoundPage, SearchResultsPage, UtilityNotificationsPage } from "./pages/utility/UtilityPages";

export function App() {
  const location = useLocation();

  return (
    <LmsStoreProvider>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course" element={<Navigate to="/courses" replace />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/course/:slug" element={<CourseDetailPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/placements" element={<PlacementsPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/otp-verification" element={<OtpVerificationPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="/invoice/:id" element={<InvoicePage />} />

            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/enrolled-courses" element={<EnrolledCoursesPage />} />
            <Route path="/student/progress" element={<ProgressSummaryPage />} />
            <Route path="/student/recommendations" element={<RecommendationsPage />} />
            <Route path="/student/my-courses" element={<MyCoursesPage />} />
            <Route path="/student/wishlist" element={<WishlistPage />} />
            <Route path="/student/certificates" element={<CertificatesPage />} />
            <Route path="/student/profile-settings" element={<ProfileSettingsPage />} />
            <Route path="/student/payments" element={<StudentPaymentsPage />} />
            <Route path="/student/course-player/:slug" element={<CoursePlayerPage />} />
            <Route path="/student/lesson/:slug/:lessonId" element={<LessonDetailPage />} />
            <Route path="/student/resources/:slug" element={<DownloadResourcesPage />} />
            <Route path="/student/quiz/:slug" element={<QuizPage />} />
            <Route path="/student/quiz-result/:slug" element={<QuizResultPage />} />
            <Route path="/student/assignment/:slug" element={<AssignmentSubmissionPage />} />
            <Route path="/student/assignment-result/:slug" element={<AssignmentResultPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />

            <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
            <Route path="/instructor/analytics" element={<InstructorAnalyticsPage />} />
            <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
            <Route path="/instructor/courses/create" element={<CreateCoursePage />} />
            <Route path="/instructor/courses/:slug/edit" element={<EditCoursePage />} />
            <Route path="/instructor/course-builder/:slug" element={<CourseBuilderPage />} />
            <Route path="/instructor/assessments/create-quiz" element={<CreateQuizPage />} />
            <Route path="/instructor/assessments/add-questions" element={<AddQuestionsPage />} />
            <Route path="/instructor/assessments/create-assignment" element={<AssignmentCreationPage />} />
            <Route path="/instructor/assessments/evaluation" element={<EvaluationPage />} />
            <Route path="/instructor/students" element={<InstructorStudentsPage />} />
            <Route path="/instructor/students/:id/progress" element={<InstructorStudentProgressPage />} />
            <Route path="/instructor/earnings" element={<EarningsPage />} />
            <Route path="/instructor/payout-history" element={<PayoutHistoryPage />} />
            <Route path="/instructor/settings/profile" element={<InstructorProfileSettingsPage />} />
            <Route path="/instructor/settings/payment" element={<InstructorPaymentDetailsPage />} />

            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UsersListPage />} />
            <Route path="/admin/users/add" element={<AddEditUserPage />} />
            <Route path="/admin/roles" element={<RoleManagementPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/courses/review" element={<CourseApprovalPage />} />
            <Route path="/admin/categories" element={<CategoriesTagsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/refunds" element={<RefundManagementPage />} />
            <Route path="/admin/invoices" element={<InvoiceManagementPage />} />
            <Route path="/admin/certificates" element={<CertificatesManagementPage />} />
            <Route path="/admin/quiz-monitoring" element={<QuizMonitoringPage />} />
            <Route path="/admin/content/blogs" element={<BlogManagementPage />} />
            <Route path="/admin/content/homepage" element={<HomepageControlPage />} />
            <Route path="/admin/notifications/send" element={<SendNotificationsPage />} />
            <Route path="/admin/notifications/templates" element={<NotificationTemplatesPage />} />
            <Route path="/admin/settings/general" element={<GeneralSettingsPage />} />
            <Route path="/admin/settings/payment-gateways" element={<PaymentGatewaySettingsPage />} />
            <Route path="/admin/settings/email" element={<EmailConfigPage />} />
            <Route path="/admin/settings/seo" element={<SeoSettingsPage />} />

            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/notifications" element={<UtilityNotificationsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </LmsStoreProvider>
  );
}