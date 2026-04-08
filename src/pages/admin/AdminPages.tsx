import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { AnimatedPage } from "../../components/common/AnimatedPage";
import { PageHero } from "../../components/common/PageHero";
import { StatusBadge } from "../../components/common/StatusBadge";
import { MetricPanel } from "../../components/dashboard/MetricPanel";
import { SectionBlock } from "../../components/ui/SectionBlock";
import { useLmsStore } from "../../context/LmsStore";
import { formatDateTime, formatInr } from "../../lib/format";

export function AdminDashboardPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Admin Dashboard"
        title="Skillfort platform control center"
        description="Monitor users, courses, payments, content, and LMS quality from a single admin layer."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricPanel label="Total Users" value="8,420" hint="Students + instructors + admins" />
        <MetricPanel label="Total Revenue" value={formatInr(14250000)} hint="Current financial year" />
        <MetricPanel label="Active Courses" value="96" hint="Published and purchasable" />
        <MetricPanel label="Pending Reviews" value="14" hint="Courses + refund requests" />
      </section>

      <SectionBlock title="Admin Sections">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["User Management", "/admin/users"],
            ["Course Management", "/admin/courses"],
            ["Payment Management", "/admin/payments"],
            ["LMS Control", "/admin/certificates"],
            ["Content Management", "/admin/content/blogs"],
            ["System Settings", "/admin/settings/general"],
          ].map(([label, to]) => (
            <Link key={to} to={to} className="rounded-xl border bg-white px-4 py-3 font-medium text-sf-muted hover:bg-sf-cream">
              {label}
            </Link>
          ))}
        </div>
      </SectionBlock>
    </AnimatedPage>
  );
}

export function UsersListPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="User Management"
        title="All users"
        description="View and manage platform users with role-level controls."
        actions={
          <Link to="/admin/users/add" className="btn-primary">
            Add User
          </Link>
        }
      />

      <section className="panel overflow-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-sf-cream text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {[
              ["Kirubakar M", "kirub@example.com", "Student", "Active"],
              ["Arjun Prakash", "arjun@example.com", "Instructor", "Active"],
              ["Ops Admin", "ops@example.com", "Admin", "Active"],
            ].map(([name, email, role, status]) => (
              <tr key={email as string}>
                <td className="px-3 py-2 font-medium">{name as string}</td>
                <td className="px-3 py-2 text-sf-muted">{email as string}</td>
                <td className="px-3 py-2">{role as string}</td>
                <td className="px-3 py-2 text-sf-muted">{status as string}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnimatedPage>
  );
}

export function AddEditUserPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="User Management"
        title="Add / Edit user"
        description="Create new users and assign roles for LMS access."
      />

      <section className="panel grid gap-3 md:grid-cols-2">
        <label className="label-base">
          Full Name
          <input className="input-base mt-1" />
        </label>
        <label className="label-base">
          Email
          <input className="input-base mt-1" type="email" />
        </label>
        <label className="label-base">
          Role
          <select className="input-base mt-1" defaultValue="Student">
            <option>Admin</option>
            <option>Instructor</option>
            <option>Student</option>
          </select>
        </label>
        <label className="label-base">
          Status
          <select className="input-base mt-1" defaultValue="Active">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <button type="button" className="btn-primary md:col-span-2">
          Save User
        </button>
      </section>
    </AnimatedPage>
  );
}

export function RoleManagementPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="User Management"
        title="Role management"
        description="Configure capabilities for Admin, Instructor, and Student roles."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Admin", "Platform controls, user and payment access."],
          ["Instructor", "Course builder, student insights, earnings view."],
          ["Student", "Course player, assessments, certificates."],
        ].map(([role, description]) => (
          <article key={role as string} className="panel">
            <h2 className="text-xl font-semibold">{role as string}</h2>
            <p className="mt-2 text-sm text-sf-muted">{description as string}</p>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function AdminCoursesPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Course Management"
        title="All courses"
        description="Review and manage course inventory, metadata, and lifecycle states."
      />
      <section className="panel text-sm text-sf-muted">
        Course listing table can include state filters, approval status, and instructor mapping.
      </section>
    </AnimatedPage>
  );
}

export function CourseApprovalPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Course Management"
        title="Approve / Reject courses"
        description="Moderate newly submitted courses before they go live."
      />
      <section className="panel space-y-2 text-sm">
        <article className="rounded-xl border bg-white p-3">
          Data Analytics Advanced - Submitted by Lakshmi - <button className="text-emerald-700 underline">Approve</button> |
          <button className="ml-1 text-rose-700 underline">Reject</button>
        </article>
        <article className="rounded-xl border bg-white p-3">
          QA Automation Sprint - Submitted by Sridhar - <button className="text-emerald-700 underline">Approve</button> |
          <button className="ml-1 text-rose-700 underline">Reject</button>
        </article>
      </section>
    </AnimatedPage>
  );
}

export function CategoriesTagsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Course Management"
        title="Categories and tags"
        description="Configure taxonomy used in catalog search and recommendation engine."
      />
      <section className="panel text-sm text-sf-muted">Manage categories like Full Stack, Analytics, Testing, Database and tags per skill cluster.</section>
    </AnimatedPage>
  );
}

export function AdminPaymentsPage() {
  const { orders } = useLmsStore();
  const [status, setStatus] = useState("All");
  const [userFilter, setUserFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [message, setMessage] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusMatch = status === "All" || order.paymentStatus === status;
      const userMatch = !userFilter.trim() || order.userId.toLowerCase().includes(userFilter.trim().toLowerCase());

      const orderDate = new Date(order.createdAt);
      const afterFrom = !fromDate || orderDate >= new Date(fromDate);
      const beforeTo = !toDate || orderDate <= new Date(`${toDate}T23:59:59`);

      return statusMatch && userMatch && afterFrom && beforeTo;
    });
  }, [fromDate, orders, status, toDate, userFilter]);

  const handleRefund = (orderId: string) => {
    setMessage(`Refund initiated for ${orderId}.`);
  };

  return (
    <AnimatedPage>
      <PageHero
        kicker="Payment Management"
        title="Admin transactions"
        description="Filter by date, status, user, initiate refunds, and open invoices."
      />

      <section className="panel grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="label-base">
          Status
          <select className="input-base mt-1" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>SUCCESS</option>
            <option>FAILED</option>
            <option>PENDING</option>
          </select>
        </label>
        <label className="label-base">
          User
          <input
            className="input-base mt-1"
            value={userFilter}
            onChange={(event) => setUserFilter(event.target.value)}
            placeholder="Search by user id"
          />
        </label>
        <label className="label-base">
          Date From
          <input className="input-base mt-1" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        </label>
        <label className="label-base">
          Date To
          <input className="input-base mt-1" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        </label>
      </section>

      <section className="panel overflow-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-sf-cream text-left">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-3 py-2 font-medium">{order.id}</td>
                <td className="px-3 py-2 text-sf-muted">{order.userId}</td>
                <td className="px-3 py-2 text-sf-muted">{formatDateTime(order.createdAt)}</td>
                <td className="px-3 py-2">{formatInr(order.finalAmount)}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Link className="btn-secondary" to={`/invoice/${order.id}`}>
                      Invoice
                    </Link>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={order.paymentStatus !== "SUCCESS"}
                      onClick={() => handleRefund(order.id)}
                    >
                      Refund
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      </section>
    </AnimatedPage>
  );
}

export function RefundManagementPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Payment Management"
        title="Refund management"
        description="Review and process refund requests from learners."
      />
      <section className="panel text-sm text-sf-muted">Refund queue and SLA tracking placeholders for backend integration.</section>
    </AnimatedPage>
  );
}

export function InvoiceManagementPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Payment Management"
        title="Invoice management"
        description="Audit invoices, tax details, and download history."
      />
      <section className="panel text-sm text-sf-muted">Invoice list with GST records and reconciliation actions.</section>
    </AnimatedPage>
  );
}

export function CertificatesManagementPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="LMS Control"
        title="Certificates management"
        description="Manage certificate templates and issuance rules."
      />
      <section className="panel text-sm text-sf-muted">Configure certificate templates, IDs, and completion criteria.</section>
    </AnimatedPage>
  );
}

export function QuizMonitoringPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="LMS Control"
        title="Quiz and assessment monitoring"
        description="Monitor pass rates, suspicious attempts, and assessment health."
      />
      <section className="panel text-sm text-sf-muted">Assessment quality dashboard placeholder with integrity metrics.</section>
    </AnimatedPage>
  );
}

export function BlogManagementPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Content Management"
        title="Blogs / pages management"
        description="Create and schedule public content for marketing site."
      />
      <section className="panel text-sm text-sf-muted">Content editor and publishing workflow placeholder.</section>
    </AnimatedPage>
  );
}

export function HomepageControlPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Content Management"
        title="Homepage section control"
        description="Manage hero copy, featured courses, and CTA sections."
      />
      <section className="panel text-sm text-sf-muted">Homepage builder controls placeholder for CMS integration.</section>
    </AnimatedPage>
  );
}

export function SendNotificationsPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AnimatedPage>
      <PageHero
        kicker="Notifications"
        title="Send notifications"
        description="Broadcast email/push alerts to targeted user segments."
      />
      <form className="panel space-y-3" onSubmit={handleSubmit}>
        <label className="label-base">
          Audience
          <select className="input-base mt-1">
            <option>All Students</option>
            <option>Instructors</option>
            <option>Admins</option>
          </select>
        </label>
        <label className="label-base">
          Message
          <textarea className="input-base mt-1 min-h-24" />
        </label>
        <button type="submit" className="btn-primary">
          Send Notification
        </button>
        {sent ? <p className="text-sm text-emerald-700">Notification queued for delivery.</p> : null}
      </form>
    </AnimatedPage>
  );
}

export function NotificationTemplatesPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Notifications"
        title="Template management"
        description="Manage reusable email and push templates."
      />
      <section className="panel text-sm text-sf-muted">Template list placeholder for communication workflows.</section>
    </AnimatedPage>
  );
}

export function GeneralSettingsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="System Settings"
        title="General settings"
        description="Configure platform name, locale, and default behavior."
      />
      <section className="panel text-sm text-sf-muted">General configuration controls placeholder.</section>
    </AnimatedPage>
  );
}

export function PaymentGatewaySettingsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="System Settings"
        title="Payment gateway settings"
        description="Configure Razorpay, Stripe, and UPI settings."
      />
      <section className="panel text-sm text-sf-muted">Payment provider keys and webhook setup placeholder.</section>
    </AnimatedPage>
  );
}

export function EmailConfigPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="System Settings"
        title="Email configuration"
        description="Set SMTP credentials and sender policies."
      />
      <section className="panel text-sm text-sf-muted">Email config form and health check placeholder.</section>
    </AnimatedPage>
  );
}

export function SeoSettingsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="System Settings"
        title="SEO settings"
        description="Manage metadata templates, sitemap, and robots controls."
      />
      <section className="panel text-sm text-sf-muted">SEO controls placeholder for marketing pages.</section>
    </AnimatedPage>
  );
}