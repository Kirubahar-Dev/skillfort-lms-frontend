import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { MainLayout } from "./components/common/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
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

            {/* Student Routes - Protected */}
            <Route path="/student/dashboard" element={<ProtectedRoute requiredRoles={["viewer"]} component={StudentDashboardPage} />} />
            <Route path="/student/enrolled-courses" element={<ProtectedRoute requiredRoles={["viewer"]} component={EnrolledCoursesPage} />} />
            <Route path="/student/progress" element={<ProtectedRoute requiredRoles={["viewer"]} component={ProgressSummaryPage} />} />
            <Route path="/student/recommendations" element={<ProtectedRoute requiredRoles={["viewer"]} component={RecommendationsPage} />} />
            <Route path="/student/my-courses" element={<ProtectedRoute requiredRoles={["viewer"]} component={MyCoursesPage} />} />
            <Route path="/student/wishlist" element={<ProtectedRoute requiredRoles={["viewer"]} component={WishlistPage} />} />
            <Route path="/student/certificates" element={<ProtectedRoute requiredRoles={["viewer"]} component={CertificatesPage} />} />
            <Route path="/student/profile-settings" element={<ProtectedRoute requiredRoles={["viewer"]} component={ProfileSettingsPage} />} />
            <Route path="/student/payments" element={<ProtectedRoute requiredRoles={["viewer"]} component={StudentPaymentsPage} />} />
            <Route path="/student/course-player/:slug" element={<ProtectedRoute requiredRoles={["viewer"]} component={CoursePlayerPage} />} />
            <Route path="/student/lesson/:slug/:lessonId" element={<ProtectedRoute requiredRoles={["viewer"]} component={LessonDetailPage} />} />
            <Route path="/student/resources/:slug" element={<ProtectedRoute requiredRoles={["viewer"]} component={DownloadResourcesPage} />} />
            <Route path="/student/quiz/:slug" element={<ProtectedRoute requiredRoles={["viewer"]} component={QuizPage} />} />
            <Route path="/student/quiz-result/:slug" element={<ProtectedRoute requiredRoles={["viewer"]} component={QuizResultPage} />} />
            <Route path="/student/assignment/:slug" element={<ProtectedRoute requiredRoles={["viewer"]} component={AssignmentSubmissionPage} />} />
            <Route path="/student/assignment-result/:slug" element={<ProtectedRoute requiredRoles={["viewer"]} component={AssignmentResultPage} />} />
            <Route path="/student/notifications" element={<ProtectedRoute requiredRoles={["viewer"]} component={NotificationsPage} />} />

            {/* Instructor/Trainer Routes - Protected */}
            <Route path="/instructor/dashboard" element={<ProtectedRoute requiredRoles={["manager"]} component={InstructorDashboardPage} />} />
            <Route path="/instructor/analytics" element={<ProtectedRoute requiredRoles={["manager"]} component={InstructorAnalyticsPage} />} />
            <Route path="/instructor/courses" element={<ProtectedRoute requiredRoles={["manager"]} component={InstructorCoursesPage} />} />
            <Route path="/instructor/courses/create" element={<ProtectedRoute requiredRoles={["manager"]} component={CreateCoursePage} />} />
            <Route path="/instructor/courses/:slug/edit" element={<ProtectedRoute requiredRoles={["manager"]} component={EditCoursePage} />} />
            <Route path="/instructor/course-builder/:slug" element={<ProtectedRoute requiredRoles={["manager"]} component={CourseBuilderPage} />} />
            <Route path="/instructor/assessments/create-quiz" element={<ProtectedRoute requiredRoles={["manager"]} component={CreateQuizPage} />} />
            <Route path="/instructor/assessments/add-questions" element={<ProtectedRoute requiredRoles={["manager"]} component={AddQuestionsPage} />} />
            <Route path="/instructor/assessments/create-assignment" element={<ProtectedRoute requiredRoles={["manager"]} component={AssignmentCreationPage} />} />
            <Route path="/instructor/assessments/evaluation" element={<ProtectedRoute requiredRoles={["manager"]} component={EvaluationPage} />} />
            <Route path="/instructor/students" element={<ProtectedRoute requiredRoles={["manager"]} component={InstructorStudentsPage} />} />
            <Route path="/instructor/students/:id/progress" element={<ProtectedRoute requiredRoles={["manager"]} component={InstructorStudentProgressPage} />} />
            <Route path="/instructor/earnings" element={<ProtectedRoute requiredRoles={["manager"]} component={EarningsPage} />} />
            <Route path="/instructor/payout-history" element={<ProtectedRoute requiredRoles={["manager"]} component={PayoutHistoryPage} />} />
            <Route path="/instructor/settings/profile" element={<ProtectedRoute requiredRoles={["manager"]} component={InstructorProfileSettingsPage} />} />
            <Route path="/instructor/settings/payment" element={<ProtectedRoute requiredRoles={["manager"]} component={InstructorPaymentDetailsPage} />} />

            {/* Admin Routes - Protected */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={AdminDashboardPage} />} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={UsersListPage} />} />
            <Route path="/admin/users/add" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={AddEditUserPage} />} />
            <Route path="/admin/roles" element={<ProtectedRoute requiredRoles={["super_admin"]} component={RoleManagementPage} />} />
            <Route path="/admin/courses" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={AdminCoursesPage} />} />
            <Route path="/admin/courses/review" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={CourseApprovalPage} />} />
            <Route path="/admin/categories" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={CategoriesTagsPage} />} />
            <Route path="/admin/payments" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={AdminPaymentsPage} />} />
            <Route path="/admin/refunds" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={RefundManagementPage} />} />
            <Route path="/admin/invoices" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={InvoiceManagementPage} />} />
            <Route path="/admin/certificates" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={CertificatesManagementPage} />} />
            <Route path="/admin/quiz-monitoring" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={QuizMonitoringPage} />} />
            <Route path="/admin/content/blogs" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={BlogManagementPage} />} />
            <Route path="/admin/content/homepage" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={HomepageControlPage} />} />
            <Route path="/admin/notifications/send" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={SendNotificationsPage} />} />
            <Route path="/admin/notifications/templates" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={NotificationTemplatesPage} />} />
            <Route path="/admin/settings/general" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={GeneralSettingsPage} />} />
            <Route path="/admin/settings/payment-gateways" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={PaymentGatewaySettingsPage} />} />
            <Route path="/admin/settings/email" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={EmailConfigPage} />} />
            <Route path="/admin/settings/seo" element={<ProtectedRoute requiredRoles={["admin", "super_admin"]} component={SeoSettingsPage} />} />

            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/notifications" element={<UtilityNotificationsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </LmsStoreProvider>
  );
}