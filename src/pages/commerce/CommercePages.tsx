import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { AnimatedPage } from "../../components/common/AnimatedPage";
import { PageHero } from "../../components/common/PageHero";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useLmsStore } from "../../context/LmsStore";
import { formatDateTime, formatInr } from "../../lib/format";
import { BillingDetails, Order } from "../../types";

export function CartPage() {
  const {
    cart,
    subtotal,
    discountAmount,
    finalAmount,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    couponState,
    clearCoupon,
  } = useLmsStore();
  const [couponInput, setCouponInput] = useState("");

  const onApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  return (
    <AnimatedPage>
      <PageHero
        kicker="Cart"
        title="Review your selected courses"
        description="Update quantity, apply coupon code, and proceed to checkout."
        actions={
          <Link to="/courses" className="btn-secondary">
            Continue browsing courses
          </Link>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="panel space-y-3">
          {cart.length ? (
            cart.map((item) => (
              <article key={item.courseId} className="flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:items-center">
                <img src={item.thumbnail} alt={item.title} className="h-24 w-full rounded-lg object-cover sm:w-32" />
                <div className="flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-sf-muted">{formatInr(item.price)} per course</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn-secondary h-9 w-9 p-0"
                    onClick={() => updateQuantity(item.courseId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    className="btn-secondary h-9 w-9 p-0"
                    onClick={() => updateQuantity(item.courseId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button type="button" className="text-sm font-semibold text-rose-600" onClick={() => removeFromCart(item.courseId)}>
                  Remove
                </button>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed bg-white p-6 text-center text-sm text-sf-muted">
              No courses in cart yet.
            </div>
          )}

          <div className="rounded-xl border bg-sf-cream p-4">
            <p className="text-sm font-semibold">Apply coupon</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                className="input-base"
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="Try SKILL10 or SF500"
              />
              <button type="button" className="btn-primary" onClick={onApplyCoupon}>
                Apply
              </button>
              <button type="button" className="btn-secondary" onClick={clearCoupon}>
                Clear
              </button>
            </div>
            {couponState.message ? (
              <p className={`mt-2 text-sm ${couponState.isError ? "text-rose-700" : "text-emerald-700"}`}>
                {couponState.message}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="panel sticky top-24">
          <h2 className="section-title">Price Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-sf-muted">Subtotal</span>
              <span>{formatInr(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sf-muted">Discount</span>
              <span>- {formatInr(discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatInr(finalAmount)}</span>
            </div>
          </div>

          <Link to="/checkout" className={`btn-primary mt-5 w-full ${!cart.length ? "pointer-events-none opacity-60" : ""}`}>
            Proceed to Checkout
          </Link>
        </aside>
      </section>
    </AnimatedPage>
  );
}

export function CheckoutPage() {
  const {
    cart,
    subtotal,
    discountAmount,
    finalAmount,
    applyCoupon,
    couponState,
    createOrder,
  } = useLmsStore();
  const [couponInput, setCouponInput] = useState("");
  const [billing, setBilling] = useState<BillingDetails>({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("Razorpay");
  const navigate = useNavigate();

  const canPay =
    cart.length > 0 && billing.name.trim().length > 2 && billing.email.includes("@") && billing.phone.trim().length >= 10;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canPay) {
      return;
    }

    const order = createOrder(billing, paymentMethod);
    if (!order) {
      return;
    }

    navigate(`/processing?orderId=${order.id}&method=${paymentMethod}`);
  };

  return (
    <AnimatedPage>
      <PageHero
        kicker="Checkout"
        title="Billing and payment"
        description="Enter billing details, validate coupon, choose payment mode, and complete enrollment purchase."
      />

      <form className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start" onSubmit={onSubmit}>
        <section className="space-y-4">
          <article className="panel space-y-3">
            <h2 className="section-title">Billing Details</h2>
            <label className="label-base">
              Name
              <input
                className="input-base mt-1"
                value={billing.name}
                onChange={(event) => setBilling((state) => ({ ...state, name: event.target.value }))}
                placeholder="Full name"
                required
              />
            </label>
            <label className="label-base">
              Email
              <input
                className="input-base mt-1"
                value={billing.email}
                onChange={(event) => setBilling((state) => ({ ...state, email: event.target.value }))}
                placeholder="you@example.com"
                type="email"
                required
              />
            </label>
            <label className="label-base">
              Phone
              <input
                className="input-base mt-1"
                value={billing.phone}
                onChange={(event) => setBilling((state) => ({ ...state, phone: event.target.value }))}
                placeholder="+91"
                required
              />
            </label>
          </article>

          <article className="panel">
            <h2 className="section-title">Coupon</h2>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                className="input-base"
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="Apply coupon code"
              />
              <button type="button" className="btn-secondary" onClick={() => applyCoupon(couponInput)}>
                Apply
              </button>
            </div>
            {couponState.message ? (
              <p className={`mt-2 text-sm ${couponState.isError ? "text-rose-700" : "text-emerald-700"}`}>
                {couponState.message}
              </p>
            ) : null}
          </article>

          <article className="panel">
            <h2 className="section-title">Payment Method</h2>
            <div className="mt-3 grid gap-2">
              {(["Razorpay", "Stripe", "UPI"] as Order["paymentMethod"][]).map((method) => (
                <label key={method} className="flex cursor-pointer items-center justify-between rounded-xl border bg-white px-3 py-3">
                  <span className="font-medium">{method}</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                </label>
              ))}
            </div>
          </article>
        </section>

        <aside className="panel sticky top-24">
          <h2 className="section-title">Order Summary</h2>
          <div className="mt-3 space-y-2">
            {cart.map((item) => (
              <div key={item.courseId} className="flex items-center justify-between text-sm">
                <span className="max-w-48 text-sf-muted">{item.title}</span>
                <span>{formatInr(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-sf-muted">Subtotal</span>
              <span>{formatInr(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sf-muted">Discount</span>
              <span>- {formatInr(discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatInr(finalAmount)}</span>
            </div>
          </div>
          <button type="submit" disabled={!canPay} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">
            Pay Now
          </button>
        </aside>
      </form>
    </AnimatedPage>
  );
}

export function ProcessingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setOrderStatus } = useLmsStore();

  const orderId = params.get("orderId") ?? "";
  const paymentMethod = params.get("method") ?? "Razorpay";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const success = paymentMethod !== "UPI" || Math.random() > 0.35;
      setOrderStatus(orderId, success ? "SUCCESS" : "FAILED");
      navigate(success ? `/payment-success?orderId=${orderId}` : `/payment-failed?orderId=${orderId}`, { replace: true });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [navigate, orderId, paymentMethod, setOrderStatus]);

  return (
    <AnimatedPage>
      <section className="panel mx-auto max-w-2xl text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sf-gold/40 border-t-sf-goldStrong" />
        <h1 className="mt-5 text-2xl font-semibold">Processing your payment...</h1>
        <p className="mt-2 text-sm text-sf-muted">Please wait while we confirm transaction and enrollment access.</p>
      </section>
    </AnimatedPage>
  );
}

export function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const { getOrderById } = useLmsStore();
  const orderId = params.get("orderId") ?? "";
  const order = getOrderById(orderId);

  return (
    <AnimatedPage>
      <section className="panel mx-auto max-w-3xl text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ?
        </div>
        <h1 className="mt-4 text-3xl font-semibold">Payment Successful</h1>
        <p className="mt-2 text-sm text-sf-muted">Your order is confirmed and course enrollment is now active.</p>

        {order ? (
          <div className="mx-auto mt-5 max-w-xl rounded-xl border bg-white p-4 text-left">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Order {order.id}</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="mt-2 text-sm text-sf-muted">Amount paid: {formatInr(order.finalAmount)}</p>
            <p className="text-sm text-sf-muted">Payment mode: {order.paymentMethod}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link className="btn-primary" to="/student/my-courses">
            Go to My Courses
          </Link>
          {order ? (
            <Link className="btn-secondary" to={`/invoice/${order.id}`}>
              View Invoice
            </Link>
          ) : null}
        </div>
      </section>
    </AnimatedPage>
  );
}

export function PaymentFailedPage() {
  const [params] = useSearchParams();
  const { getOrderById } = useLmsStore();
  const orderId = params.get("orderId") ?? "";
  const order = getOrderById(orderId);

  return (
    <AnimatedPage>
      <section className="panel mx-auto max-w-3xl text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-2xl text-rose-700">
          !
        </div>
        <h1 className="mt-4 text-3xl font-semibold">Payment Failed</h1>
        <p className="mt-2 text-sm text-sf-muted">The transaction did not complete. You can retry safely.</p>

        {order ? (
          <div className="mx-auto mt-5 max-w-xl rounded-xl border bg-white p-4 text-left">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Order {order.id}</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="mt-2 text-sm text-sf-muted">Attempted amount: {formatInr(order.finalAmount)}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link className="btn-primary" to="/checkout">
            Retry Payment
          </Link>
          <Link className="btn-secondary" to="/contact-us">
            Contact Support
          </Link>
        </div>
      </section>
    </AnimatedPage>
  );
}

export function InvoicePage() {
  const { id } = useParams();
  const { getOrderById } = useLmsStore();
  const order = id ? getOrderById(id) : undefined;

  const breakdown = useMemo(() => {
    if (!order) {
      return { taxable: 0, gst: 0, cgst: 0, sgst: 0 };
    }

    const taxable = Math.round(order.finalAmount / 1.18);
    const gst = order.finalAmount - taxable;
    return { taxable, gst, cgst: Math.round(gst / 2), sgst: Math.round(gst / 2) };
  }, [order]);

  if (!order) {
    return (
      <AnimatedPage>
        <PageHero
          kicker="Invoice"
          title="Invoice not found"
          description="The requested invoice could not be located."
          actions={
            <Link to="/student/payments" className="btn-primary">
              Back to payments
            </Link>
          }
        />
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <section className="panel mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="kicker">Tax Invoice</p>
            <h1 className="mt-2 text-3xl font-semibold">Invoice #{order.id}</h1>
            <p className="mt-1 text-sm text-sf-muted">Generated on {formatDateTime(order.createdAt)}</p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => window.print()}>
            Download PDF
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border bg-white p-4">
            <p className="text-sm font-semibold">Billed To</p>
            <p className="mt-2 text-sm text-sf-muted">Student ID: {order.userId}</p>
            <p className="text-sm text-sf-muted">Order Status: {order.paymentStatus}</p>
          </article>
          <article className="rounded-xl border bg-white p-4">
            <p className="text-sm font-semibold">Skillfort Institute</p>
            <p className="mt-2 text-sm text-sf-muted">GSTIN: 33AAICSF2026L1Z2</p>
            <p className="text-sm text-sf-muted">Navalur, Chennai, Tamil Nadu</p>
          </article>
        </div>

        <div className="mt-5 overflow-auto rounded-xl border">
          <table className="min-w-full divide-y text-sm">
            <thead className="bg-sf-cream text-left">
              <tr>
                <th className="px-3 py-2">Course</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Rate</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {order.courses.map((item) => (
                <tr key={item.courseId}>
                  <td className="px-3 py-2">{item.title}</td>
                  <td className="px-3 py-2">{item.quantity}</td>
                  <td className="px-3 py-2">{formatInr(item.price)}</td>
                  <td className="px-3 py-2 text-right">{formatInr(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 ml-auto w-full max-w-sm space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-sf-muted">Taxable Value</span>
            <span>{formatInr(breakdown.taxable)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sf-muted">CGST (9%)</span>
            <span>{formatInr(breakdown.cgst)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sf-muted">SGST (9%)</span>
            <span>{formatInr(breakdown.sgst)}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatInr(order.finalAmount)}</span>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}